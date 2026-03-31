'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { getMockSession } from '@/lib/auth/mockAuth';
import { buildStudentEnrollments, getStudentHistory } from '@/lib/supabase/queries';
import { mockStudentData } from '@/lib/data/mockData';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { gradeColor } from '@/lib/utils';

const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
];

const RESEARCH = {
  title: 'Quantifying Scholastic Growth in Hybrid Learning Models',
  summary: 'Recent study published by the University Research Group explores the efficacy of curated digital curricula.',
  img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=100&fit=crop',
};

export default function StudentDashboard() {
  const [session,     setSession]     = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [history,     setHistory]     = useState([]);

  useEffect(() => {
    const s = getMockSession();
    setSession(s);
    if (s) {
      setEnrollments(buildStudentEnrollments(s.id_user));
      getStudentHistory(s.id_user).then(setHistory);
    }
  }, []);

  const data = mockStudentData;
  const id   = session ? `ID: ${20240900 + session.id_user}` : '';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Fall Semester 2024</p>
        </div>
      </div>

      {/* Top row: standing + schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Academic standing */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="sc-label mb-1">Academic Standing</p>
              <h2 className="text-xl font-bold text-slate-900">{data.standing}</h2>
            </div>
            <div className="text-right">
              <p className="sc-label mb-1">Current GPA</p>
              <p className="text-3xl font-bold text-primary-700">{data.gpa}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
            <div>
              <p className="sc-label mb-0.5">Total Credits</p>
              <p className="text-xl font-bold text-slate-900">{data.totalCredits} <span className="text-sm font-normal text-slate-400">/ {data.totalRequired}</span></p>
            </div>
            <div>
              <p className="sc-label mb-0.5">Degree Progress</p>
              <p className="text-xl font-bold text-slate-900">{data.degreeProgress}%</p>
              <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: `${data.degreeProgress}%` }} />
              </div>
            </div>
            <div>
              <p className="sc-label mb-0.5">Rank</p>
              <p className="text-xl font-bold text-slate-900">{data.rank}</p>
            </div>
          </div>
        </div>

        {/* Upcoming schedule */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Schedule</h3>
            <span className="sc-label">Sept 2024</span>
          </div>
          <div className="space-y-3">
            {enrollments.slice(0, 2).map((e, i) => {
              const days  = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
              const dates = [12, 14, 17, 19, 21];
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 text-center w-8">
                    <p className="text-[10px] font-semibold text-primary-600">{days[i % 5]}</p>
                    <p className="text-lg font-bold text-slate-900 leading-none">{dates[i % 5]}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{e.course?.name}</p>
                    <p className="text-[11px] text-slate-400">{e.schedule?.shift}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-3 w-full text-xs text-primary-600 font-medium hover:underline flex items-center justify-center gap-1 pt-2 border-t border-slate-100">
            View Full Planner <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Enrolled courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Enrolled Courses</h3>
            <p className="text-xs text-slate-400">Fall Semester 2024</p>
          </div>
          <button className="text-xs text-primary-600 font-medium hover:underline">Manage Registration</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {enrollments.slice(0, 3).map((e, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl shadow-soft overflow-hidden hover:shadow-card transition-all duration-200 cursor-pointer">
              <div className="relative h-28">
                <img src={COURSE_IMAGES[i % 3]} alt={e.course?.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {e.course?.credits || 3} CREDITS
                </span>
              </div>
              <div className="p-3">
                <p className="sc-label mb-0.5">
                  {`COURSE-${(e.id_course || '').toString().padStart(3,'0')}`}
                </p>
                <p className="text-xs font-semibold text-slate-900 mb-2 leading-snug">{e.course?.name}</p>
                <div className="flex items-center gap-2">
                  {e.teacher && <Avatar name={e.teacher.name} surname={e.teacher.surname} size="xs" />}
                  <span className="text-[11px] text-slate-500 truncate">{e.teacher ? `${e.teacher.name} ${e.teacher.surname}` : '—'}</span>
                  <Badge variant="active" className="ml-auto">Active</Badge>
                </div>
              </div>
            </div>
          ))}

          {/* Add course CTA */}
          <div className="bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <Plus size={18} className="text-slate-400" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Add New Course</p>
            <p className="text-[10px] text-slate-400">Electives Open</p>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Research */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Research & Grants</h3>
          <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-200 rounded uppercase tracking-wider mb-2">Featured Publication</span>
              <h4 className="text-sm font-bold text-primary-800 leading-snug mb-2">{RESEARCH.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{RESEARCH.summary}</p>
              <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline">
                Read More <ArrowRight size={11} />
              </button>
            </div>
            <div className="flex-shrink-0">
              <img src={RESEARCH.img} alt="Research" className="w-24 h-20 object-cover rounded-lg" />
            </div>
          </div>
        </div>

        {/* Recent grades */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Grades</h3>
            <button className="sc-label hover:text-primary-600 cursor-pointer">History</button>
          </div>
          <div className="space-y-3">
            {history.length > 0 ? history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  backgroundColor: h.grade?.startsWith('A') ? '#10b981' : h.grade?.startsWith('B') ? '#f59e0b' : '#ef4444'
                }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{h.course?.name}</p>
                  <p className="text-[11px] text-slate-400">Assignment: Final Project</p>
                </div>
                <span className={`text-sm font-bold ${gradeColor(h.grade)}`}>{h.grade}</span>
              </div>
            )) : (
              <p className="text-xs text-slate-400">No grade history yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
