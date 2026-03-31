'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen, Building2, GraduationCap, Activity,
  Edit3, UserPlus, AlertTriangle, Calendar,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import ScheduleGrid from '@/components/dashboard/ScheduleGrid';
import { getDashboardMetrics } from '@/lib/supabase/queries';
import { buildScheduleGrid } from '@/lib/supabase/queries';

const activityIcons = {
  edit: Edit3, 'user-plus': UserPlus, 'alert-triangle': AlertTriangle, calendar: Calendar,
};

export default function AdminDashboard() {
  const [metrics, setMetrics]     = useState(null);
  const [scheduleEntries, setSE]  = useState([]);

  useEffect(() => {
    getDashboardMetrics().then(setMetrics);
    setSE(buildScheduleGrid());
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="sc-label mb-0.5">Institutional Overview</p>
          <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-soft transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Report
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-primary-700 text-white hover:bg-primary-800 shadow-soft transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            Sync Data
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Courses"
          value={metrics ? metrics.totalCourses.toLocaleString() : '…'}
          sub={`Across ${metrics?.departments || 14} departments`}
          trend="+12%"
          trendPositive
          icon={BookOpen}
          accentColor="blue"
        />
        <StatCard
          label="Active Classrooms"
          value={metrics ? metrics.activeClassrooms.toLocaleString() : '…'}
          sub={`${metrics?.classroomOccupancy || '94%'} occupancy rate`}
          trend="STABLE"
          icon={Building2}
          accentColor="violet"
        />
        <StatCard
          label="Total Students"
          value={metrics ? metrics.totalStudents.toLocaleString() : '…'}
          sub="Fall Semester 2024"
          trend="+342"
          trendPositive
          icon={GraduationCap}
          accentColor="emerald"
        />
        <StatCard
          label="System Health"
          value={metrics?.systemHealth || '99.9%'}
          sub="All nodes operational"
          icon={Activity}
          accentColor="green"
          highlight
        />
      </div>

      {/* Schedule grid */}
      <ScheduleGrid entries={scheduleEntries} title="Academic Schedule" />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent curations */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Curations</h3>
            <button className="text-xs text-primary-600 font-medium hover:underline">View All Logs</button>
          </div>
          <div className="space-y-3">
            {(metrics?.recentActivity || []).map((item, i) => {
              const Icon = activityIcons[item.icon] || Edit3;
              const iconColors = {
                edit: 'bg-primary-50 text-primary-600',
                'user-plus': 'bg-emerald-50 text-emerald-600',
                'alert-triangle': 'bg-amber-50 text-amber-600',
                calendar: 'bg-violet-50 text-violet-600',
              };
              return (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${iconColors[item.icon] || 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{item.description}</p>
                  </div>
                  <span className="text-[11px] text-slate-300 whitespace-nowrap flex-shrink-0">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staffing insights */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Staffing Insights</h3>
          <div className="space-y-4">
            {(metrics?.staffingInsights || []).map((dept, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="sc-label">{dept.department}</span>
                  <span className={`text-xs font-bold ${dept.fill >= 80 ? 'text-primary-700' : dept.fill >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                    {dept.fill}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      dept.fill >= 80 ? 'bg-primary-600' : dept.fill >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dept.fill}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 bg-primary-50 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl">
            <p className="sc-label mb-1">Strategic Recommendation</p>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Increase humanities staffing by 12% to meet projected spring enrollment surge."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
