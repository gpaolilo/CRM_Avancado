"use client";

import React from "react";

// Mock Data
const STAGES = [
  "Prospecting",
  "Qualification",
  "Proposal Sent",
  "Negotiation",
  "Closed Won"
];

const OPPORTUNITIES = [
  { id: 1, name: "Acme Corp Alpha", client: "Acme Corp", value: 15000, stage: "Prospecting", days: 4 },
  { id: 2, name: "Globex Redesign", client: "Globex", value: 45000, stage: "Qualification", days: 12 },
  { id: 3, name: "Initech Cloud Sync", client: "Initech", value: 25000, stage: "Qualification", days: 5 },
  { id: 4, name: "Soylent Corp CRM", client: "Soylent", value: 80000, stage: "Proposal Sent", days: 2 },
  { id: 5, name: "Umbrella Security Infrastructure", client: "Umbrella", value: 120000, stage: "Negotiation", days: 8 },
];

export default function CRMPipeline() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Pipeline</h1>
          <p className="text-gray-500 text-sm">Manage opportunities across your sales lifecycle.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
          + New Opportunity
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex flex-grow space-x-4 overflow-x-auto pb-4 pt-4">
        
        {STAGES.map((stage) => (
          <div key={stage} className="min-w-[320px] bg-slate-100 rounded-md flex flex-col p-3 border border-slate-200">
            {/* Stage Header */}
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-semibold text-gray-700">{stage}</h3>
              <span className="text-sm bg-white border border-gray-300 text-gray-500 rounded-full px-2 py-0.5">
                {OPPORTUNITIES.filter(o => o.stage === stage).length}
              </span>
            </div>

            {/* Stage Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {OPPORTUNITIES.filter(opp => opp.stage === stage).map(opp => (
                <div key={opp.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{opp.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{opp.client}</p>
                  <div className="flex justify-between font-mono text-sm border-t border-gray-100 pt-2">
                    <span className="text-green-700 font-medium">${opp.value.toLocaleString()}</span>
                    <span className="text-gray-400">{opp.days} days</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add at bottom of stage */}
            <div className="mt-3">
               <button className="w-full py-2 text-sm text-gray-500 hover:bg-slate-200 rounded text-left px-2">
                 + Add Card
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
