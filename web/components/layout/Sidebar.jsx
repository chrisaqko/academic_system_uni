'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Building2, Calendar, BookMarked,
  Settings, LogOut, Plus, History, CreditCard, Library, GraduationCap,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import { getMockSession, clearMockSession } from '@/lib/auth/mockAuth';

const navByRole = {
  admin: [
    { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
    { label: 'Users',       href: '/users',        icon: Users },
    { label: 'Courses',     href: '/courses',      icon: BookOpen },
    { label: 'Classrooms',  href: '/classrooms',   icon: Building2 },
    { label: 'Schedules',   href: '/schedules',    icon: Calendar },
    { label: 'Programs',    href: '/programs',     icon: BookMarked },
    { label: 'Settings',    href: '/settings',     icon: Settings, bottom: true },
  ],
  teacher: [
    { label: 'Dashboard',      href: '/dashboard',  icon: LayoutDashboard },
    { label: 'My Schedule',    href: '/schedules',  icon: Calendar },
    { label: 'My Courses',     href: '/courses',    icon: BookOpen },
    { label: 'Student Roster', href: '/users',      icon: Users },
    { label: 'Settings',       href: '/settings',   icon: Settings, bottom: true },
  ],
  student: [
    { label: 'Dashboard',        href: '/dashboard',  icon: LayoutDashboard },
    { label: 'My Courses',       href: '/courses',    icon: BookOpen },
    { label: 'Schedules',        href: '/schedules',  icon: Calendar },
    { label: 'Academic History', href: '/history',    icon: History },
    { label: 'Financials',       href: '/financials', icon: CreditCard },
    { label: 'Library',          href: '/library',    icon: Library },
    { label: 'Settings',         href: '/settings',   icon: Settings, bottom: true },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [session, setSession] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const s = getMockSession();
    if (!s) { router.replace('/login'); return; }
    setSession(s);
  }, [router]);

  const handleLogout = () => {
    clearMockSession();
    router.push('/login');
  };

  const role    = session?.user_type || 'student';
  const navItems = navByRole[role] || navByRole.student;
  const mainNav = navItems.filter(i => !i.bottom);
  const bottomNav = navItems.filter(i => i.bottom);

  const roleBadge = {
    admin:   { label: 'Admin Portal',  cls: 'text-primary-400' },
    teacher: { label: 'Faculty Portal', cls: 'text-violet-400' },
    student: { label: `Student • ID: ${20240900 + (session?.id_user || 12)}`, cls: 'text-teal-400' },
  };

  return (
    <aside className={cn(
      'relative flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-60',
      'min-h-screen flex-shrink-0 border-r border-slate-800'
    )}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-none tracking-tight truncate">Scholastic Curator</p>
              <p className={cn('text-[10px] font-medium mt-0.5 truncate', roleBadge[role]?.cls)}>
                {roleBadge[role]?.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-soft text-slate-500 hover:text-slate-700 z-10 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 pt-4 pb-2 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* User profile */}
          {session && !collapsed && (
            <div className="mx-3 mb-4 p-3 bg-slate-800 rounded-xl flex items-center gap-3">
              <Avatar name={session.name} surname={session.surname} size="sm" online />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{session.name} {session.surname}</p>
                <p className="text-[10px] text-slate-400 capitalize truncate">{session.user_type}</p>
              </div>
            </div>
          )}

          <ul className="space-y-0.5 px-2">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      collapsed && 'justify-center px-2',
                      active
                        ? 'bg-primary-600 text-white shadow-soft'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    )}
                  >
                    <item.icon size={17} className="flex-shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom items */}
        <div className="px-2 pb-2">
          {/* New Registration CTA (admin only) */}
          {role === 'admin' && !collapsed && (
            <Link
              href="/users"
              className="mx-1 mb-3 flex items-center justify-center gap-2 px-3 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-soft"
            >
              <Plus size={14} />
              New Registration
            </Link>
          )}

          <ul className="space-y-0.5">
            {bottomNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon size={17} className="flex-shrink-0" />
                  {!collapsed && item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all',
                  collapsed && 'justify-center px-2'
                )}
              >
                <LogOut size={17} className="flex-shrink-0" />
                {!collapsed && 'Sign Out'}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
