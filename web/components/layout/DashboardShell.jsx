"use client";

import { AuthProvider } from "@/lib/auth/AuthContext";
import Sidebar from "@/components/layout/Sidebar";

/**
 * Client component shell that owns:
 * - AuthProvider (so Sidebar and all dashboard pages share the same context)
 * - Sidebar layout
 *
 * Must be a 'use client' component so that React context propagates
 * correctly across the entire dashboard subtree.
 */
export default function DashboardShell({ children }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
