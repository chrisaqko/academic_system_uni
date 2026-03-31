'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, BookOpen, UserCircle } from 'lucide-react';
import { setMockSession, MOCK_USERS } from '@/lib/auth/mockAuth';

const roles = [
  {
    key: 'admin',
    label: 'Administrator',
    desc: 'Full system access — manage users, courses, schedules',
    icon: Shield,
    color: 'bg-primary-600 hover:bg-primary-700',
    iconBg: 'bg-primary-100 text-primary-700',
  },
  {
    key: 'teacher',
    label: 'Faculty',
    desc: 'Teaching schedule, course roster, student performance',
    icon: BookOpen,
    color: 'bg-violet-600 hover:bg-violet-700',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  {
    key: 'student',
    label: 'Student',
    desc: 'Enrolled courses, academic history, grades',
    icon: UserCircle,
    color: 'bg-teal-600 hover:bg-teal-700',
    iconBg: 'bg-teal-100 text-teal-700',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  const handleLogin = async (role) => {
    setLoading(role);
    setMockSession(role);
    // Small delay for feel
    await new Promise(r => setTimeout(r, 400));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-primary-50/30 flex flex-col">
      {/* Minimal nav */}
      <header className="px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-900">Scholastic Curator</span>
      </header>

      {/* Login */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="sc-label mb-2">Academic Portal</p>
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Sign in to your account</h1>
            <p className="text-sm text-slate-500">Select your role to explore the dashboard</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6 space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isLoading = loading === role.key;
              return (
                <button
                  key={role.key}
                  onClick={() => handleLogin(role.key)}
                  disabled={loading !== null}
                  className={`w-full flex items-center gap-4 px-4 py-4 ${role.color} text-white rounded-xl transition-all duration-200 group shadow-soft disabled:opacity-50`}
                >
                  <div className={`p-2 rounded-lg ${role.iconBg} group-hover:scale-105 transition-transform`}>
                    <Icon size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">Login as {role.label}</p>
                    <p className="text-[11px] text-white/70">{role.desc}</p>
                  </div>
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Demo mode — no credentials required
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-300">
              {Object.values(MOCK_USERS).map(u => (
                <span key={u.email}>{u.email}</span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-300">
        © 2024 The Scholastic Curator. All institutional rights reserved.
      </footer>
    </div>
  );
}
