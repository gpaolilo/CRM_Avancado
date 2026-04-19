"use server";

import { createClient } from "@supabase/supabase-js";

// Mock initialization for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Event: ProposalApproved
 * Action: Update Opportunity to WON, Auto-Create Project
 */
export async function approveProposal(proposalId: string) {
  try {
    // 1. Mark proposal as approved
    const { error: proposalError } = await supabase
      .from("proposals")
      .update({ status: "APPROVED" })
      .eq("id", proposalId);

    if (proposalError) throw new Error(proposalError.message);

    // Fetch the active proposal details and associated opportunity
    const { data: activeVersion, error: versionError } = await supabase
      .from("proposal_versions")
      .select("total_value, proposals(opportunity_id, opportunities(name))")
      .eq("proposal_id", proposalId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    if (versionError || !activeVersion) {
      throw new Error(versionError?.message || "No proposal versions found");
    }

    const opportunityId = activeVersion.proposals.opportunity_id;
    const opportunityName = activeVersion.proposals.opportunities.name;

    // 2. Update Opportunity to WON
    const { error: oppError } = await supabase
      .from("opportunities")
      .update({ status: "WON" })
      .eq("id", opportunityId);

    if (oppError) throw new Error(oppError.message);

    // 3. Find a default Delivery Owner
    const { data: deliveryUser, error: _userError } = await supabase
      .from("users")
      .select("id")
      .eq("role", "DELIVERY")
      .limit(1)
      .single();

    // 4. Auto-create Project based on won opportunity
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        opportunity_id: opportunityId,
        name: `Project: ${opportunityName}`,
        owner_id: deliveryUser?.id || "d59d1dfc-7be3-4e4b-bca6-53d9e80cfa34", // fallback for demo
        status: "PLANNING",
        sale_value: activeVersion.total_value,
        health_score: "HEALTHY",
      })
      .select()
      .single();

    if (projectError) throw new Error(projectError.message);

    return { success: true, project };
  } catch (error) {
    console.error("Failed to approve proposal and create project:", error);
    return { success: false, error: (error as Error).message };
  }
}
