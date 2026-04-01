"use client";

import Image from "next/image";
import { Download, AlertTriangle, Mail, Users } from "lucide-react";
import ScheduleGrid from "@/components/dashboard/ScheduleGrid";
import { buildTeacherSchedule } from "@/lib/supabase/queries";

const TEACHER_COURSES = [
  { id: 1, name: "History of Modernism",       level: "Undergraduate", students: 45, img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
  { id: 8, name: "Senior Design Studio II",    level: "Postgraduate",  students: 12, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop" },
  { id: 9, name: "Sustainable Materials Lab",  level: "Professional",  students: 18, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
];

const levelColors = {
  Undergraduate: "bg-primary-700/80",
  Postgraduate:  "bg-violet-800/80",
  Professional:  "bg-slate-700/80",
};

export default function TeacherDashboard({ profile }) {
  // buildTeacherSchedule is synchronous — compute at render time
  const scheduleEntries = buildTeacherSchedule(profile?.id_profile ?? null);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Faculty Overview
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Academic Quarter: Fall 2024 • Week 08
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-soft transition-colors">
          <Download size={13} />
          Download Roster
        </button>
      </div>

      {/* Main layout: schedule + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Schedule grid */}
        <div className="lg:col-span-2">
          <ScheduleGrid
            entries={scheduleEntries}
            title="Weekly Teaching Schedule"
          />
        </div>

        {/* Current class panel */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Current Class
            </h3>
            <p className="text-xs text-primary-600 font-semibold mb-4">
              ARCH 101 - Lecture Theatre 02
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-slate-400" />
                <span className="text-2xl font-bold text-slate-900">
                  42 / 45
                </span>
              </div>
              <p className="text-xs text-slate-400">Students Present</p>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Session Time Remaining
              </span>
              <span className="text-sm font-bold text-slate-900">14:00</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="sc-label mb-3">Quick Insights</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={13} className="text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">
                      3 Unmarked Assignments
                    </span>
                  </div>
                  <span className="text-slate-300 text-xs">›</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-500" />
                    <span className="text-xs font-medium text-slate-700">
                      12 New Messages
                    </span>
                  </div>
                  <span className="text-slate-300 text-xs">›</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">
            Active Courses & Enrollment
          </h3>
          <button className="text-xs text-primary-600 font-medium hover:underline">
            View All Programs
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEACHER_COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-xl shadow-soft overflow-hidden hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer"
            >
              <div className="relative h-36">
                <Image
                  src={course.img}
                  alt={course.name}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold text-white rounded uppercase tracking-wider ${levelColors[course.level] || "bg-slate-700/80"}`}
                >
                  {course.level}
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                  {course.name}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {["#6366f1", "#10b981", "#f59e0b"].map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold"
                        style={{ backgroundColor: c }}
                      >
                        {["A", "B", "C"][i]}
                      </div>
                    ))}
                    {course.students > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] text-slate-600 font-bold">
                        +{course.students - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {course.students} Students
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
