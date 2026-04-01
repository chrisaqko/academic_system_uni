import DashboardShell from "@/components/layout/DashboardShell";

/**
 * Keep this as a Server Component (no 'use client').
 * All client-side context and layout is handled by DashboardShell.
 */
export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
