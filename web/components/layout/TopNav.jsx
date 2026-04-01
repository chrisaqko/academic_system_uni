"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth/AuthContext";

export default function TopNav({ title, subtitle, actions }) {
  const { profile } = useAuth();   // ← from context, no useEffect

  const roleLabel = {
    admin: "Administrator",
    teacher: "Faculty",
    student: "Student",
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-20">
      {/* Left: page title */}
      <div className="flex items-center gap-4 min-w-0">
        {title && (
          <div className="min-w-0">
            {subtitle && (
              <p className="sc-label leading-none mb-0.5">{subtitle}</p>
            )}
            <h1 className="text-base font-bold text-slate-900 leading-tight truncate">
              {title}
            </h1>
          </div>
        )}
      </div>

      {/* Center: search */}
      <div className="hidden md:flex flex-1 max-w-xs mx-8">
        <div className="relative w-full">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Search curated data…"
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-2 shrink-0">
        {actions}
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <HelpCircle size={16} />
        </button>
        {profile && (
          <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-slate-200">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-700">
                {profile.name} {profile.surname}
              </span>
              <span className="text-[10px] text-slate-400">
                {roleLabel[profile.user_type]}
              </span>
            </div>
            <Avatar
              name={profile.name}
              surname={profile.surname}
              size="sm"
              online
            />
          </div>
        )}
      </div>
    </header>
  );
}
