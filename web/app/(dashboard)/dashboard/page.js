"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import TopNav from "@/components/layout/TopNav";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default function DashboardPage() {
  const { profile, loading } = useAuth(); // ← from context, no useEffect

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayName =
    [profile.name, profile.surname, profile.second_surname]
      .filter(Boolean)
      .join(" ") || profile.email;

  const titles = {
    admin:   { title: "Executive Dashboard", subtitle: "Institutional Overview" },
    teacher: { title: "Faculty Overview",    subtitle: `Welcome, ${displayName}` },
    student: { title: "My Dashboard",        subtitle: `Welcome back, ${displayName}` },
  };

  const DashboardComponent = {
    admin:   AdminDashboard,
    teacher: TeacherDashboard,
    student: StudentDashboard,
  }[profile.user_type] || StudentDashboard;

  return (
    <>
      <TopNav {...(titles[profile.user_type] || titles.student)} />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <DashboardComponent profile={profile} />
      </main>
    </>
  );
}
