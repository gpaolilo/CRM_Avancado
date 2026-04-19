"use client";

import React from "react";

// Mock Data
const METRICS = {
  contractedRevenue: 450000,
  collectedRevenue: 320000,
  pipelineValue: 850000,
  dso: 42, // Days Sales Outstanding
  activeProjects: 14,
  delayedProjects: 3,
};

export default function ExecutiveDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
      <p className="text-gray-500">Quarterly summary and high-level company metrics (Q3 2026).</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Contracted Revenue</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">${METRICS.contractedRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">↑ 12% vs last quarter</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Collected Revenue</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">${METRICS.collectedRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">DSO: {METRICS.dso} days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Pipeline Value</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">${METRICS.pipelineValue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Win Rate: 34%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Project Health</h2>
          <div className="mt-2 flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900">{METRICS.activeProjects}</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
          <p className="text-sm text-red-500 mt-1">{METRICS.delayedProjects} Projects Delayed</p>
        </div>

      </div>

      {/* Charts / Visual Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80 flex flex-col items-center justify-center text-gray-400">
          {/* Typically this would render a Recharts Bar Chart mapping RevenueSchedules VS Actual Invoices */}
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <p>Cashflow Projection Chart (Recharts integration)</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80 flex flex-col items-center justify-center text-gray-400">
          {/* Typically this would render Pipeline stages */}
           <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          <p>Pipeline Value by Stage (Donut Chart)</p>
        </div>
      </div>

    </div>
  );
}
