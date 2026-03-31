'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMockSession } from '@/lib/auth/mockAuth';
import TopNav from '@/components/layout/TopNav';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

export default function DashboardPage() {
  const router  = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getMockSession();
    if (!s) { router.replace('/login'); return; }
    setSession(s);
    setLoading(false);
  }, [router]);

  if (loading || !session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const titles = {
    admin:   { title: 'Executive Dashboard', subtitle: 'Institutional Overview' },
    teacher: { title: 'Faculty Overview',     subtitle: `Welcome, ${session.name}` },
    student: { title: 'My Dashboard',         subtitle: `Welcome back, ${session.name}` },
  };

  const DashboardComponent = {
    admin:   AdminDashboard,
    teacher: TeacherDashboard,
    student: StudentDashboard,
  }[session.user_type] || StudentDashboard;

  return (
    <>
      <TopNav {...(titles[session.user_type] || titles.student)} />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <DashboardComponent />
      </main>
    </>
  );
}
