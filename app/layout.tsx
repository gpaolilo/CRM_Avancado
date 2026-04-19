import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RevenueOps Platform",
  description: "Unified SaaS platform for CRM, Proposals, Projects, and Financials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-slate-800">
            RevenueOps
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <a href="/overview" className="block px-3 py-2 rounded-md hover:bg-slate-800">Dashboard</a>
            <a href="/crm" className="block px-3 py-2 rounded-md hover:bg-slate-800">CRM Pipeline</a>
            <a href="/proposals" className="block px-3 py-2 rounded-md hover:bg-slate-800">Proposals</a>
            <a href="/projects" className="block px-3 py-2 rounded-md hover:bg-slate-800 bg-slate-800">Projects</a>
            <a href="/finance" className="block px-3 py-2 rounded-md hover:bg-slate-800">Financials</a>
            <a href="/qbr" className="block px-3 py-2 rounded-md hover:bg-slate-800">QBR & Reports</a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
             <div className="text-gray-500 font-semibold">Project Management</div>
             <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Logged in as: admin@revenueops.com</span>
                <div className="w-8 h-8 rounded-full bg-blue-500"></div>
             </div>
          </header>
          
          {/* Main View */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
