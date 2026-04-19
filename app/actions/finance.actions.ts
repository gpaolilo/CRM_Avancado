"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Event: Milestone Completed / Generate Invoice
 */
export async function generateInvoice(projectId: string, amount: number) {
  try {
    const dueTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        project_id: projectId,
        amount,
        issue_date: new Date().toISOString(),
        due_date: dueTime,
        status: "SENT",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, invoice };
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Event: Payment Received
 * Action: Update Invoice to PAID and record payment
 */
export async function recordPayment(invoiceId: string, amount: number) {
  try {
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        invoice_id: invoiceId,
        amount,
        date: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) throw new Error(paymentError.message);

    // Update invoice status depending on full payment
    const { data: invoicePayments, error: historyError } = await supabase
      .from("payments")
      .select("amount, invoices(amount)")
      .eq("invoice_id", invoiceId);

    if (historyError || !invoicePayments || invoicePayments.length === 0) {
      throw new Error(historyError?.message || "Failed to fetch invoice history");
    }

    const totalPaid = invoicePayments.reduce((acc, p) => acc + Number(p.amount), 0);
    const invoiceTotal = Number(invoicePayments[0].invoices.amount);

    if (totalPaid >= invoiceTotal) {
      await supabase
        .from("invoices")
        .update({ status: "PAID" })
        .eq("id", invoiceId);
    }

    return { success: true, payment };
  } catch (error) {
    console.error("Failed to record payment:", error);
    return { success: false, error: (error as Error).message };
  }
}
