"use client";

import React, { useState } from "react";

// Mock Data
const PROJECT = {
  id: "proj_123",
  name: "Acme Corp Web Platform",
  status: "EXECUTION",
  healthScore: "HEALTHY",
  saleValue: 50000,
  clientContact: "John Doe (Acme Corp)",
  startDate: "2026-05-01",
  endDate: "2026-08-01",
};

const MOCK_EXPENSES = [
  { id: 1, description: "AWS Servers", amount: 1500, date: "2026-06-01" },
  { id: 2, description: "Design Contractor", amount: 4500, date: "2026-06-15" },
  { id: 3, description: "Software Licenses", amount: 200, date: "2026-06-20" },
];

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  const totalExpenses = MOCK_EXPENSES.reduce((acc, curr) => acc + curr.amount, 0);
  const totalProfit = PROJECT.saleValue - totalExpenses;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{PROJECT.name}</h1>
          <p className="text-gray-500 mt-1">Client Contact: {PROJECT.clientContact}</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {PROJECT.healthScore} Health
          </div>
          <p className="text-sm font-mono text-gray-500 mt-2">Sale Value: ${PROJECT.saleValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        {['overview', 'tasks', 'budget', 'expenses', 'risks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm capitalize ${
              activeTab === tab 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-semibold text-gray-800">Project Expenses</h2>
             <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
               + Add Expense
             </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                  <th className="pb-3 fw-bold">Description</th>
                  <th className="pb-3 fw-bold">Date</th>
                  <th className="pb-3 fw-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EXPENSES.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100">
                    <td className="py-4">{expense.description}</td>
                    <td className="py-4 text-gray-500">{expense.date}</td>
                    <td className="py-4 text-right font-medium text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8 flex justify-end">
             <div className="w-64 space-y-3">
                 <div className="flex justify-between text-gray-600">
                    <span>Project Sale Value:</span>
                    <span>${PROJECT.saleValue.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-600 border-b border-gray-300 pb-3">
                    <span>Total Expenses:</span>
                    <span className="text-red-500">-${totalExpenses.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
                    <span>Total Profit:</span>
                    <span className="text-green-600">${totalProfit.toLocaleString()}</span>
                 </div>
             </div>
          </div>
        </div>
      )}
      
      {/* Tab Content: Overview Placeholder */}
      {activeTab !== 'expenses' && (
        <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view placeholder... Navigate to Expenses to see the new feature.
        </div>
      )}
    </div>
  );
}
