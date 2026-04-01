"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Plus, GraduationCap, BookOpen, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import {
  getStudentEnrollments,
  getStudentHistory,
} from "@/lib/supabase/queries";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { gradeColor } from "@/lib/utils";

const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
];

const RESEARCH = {
  title: "Quantifying Scholastic Growth in Hybrid Learning Models",
  summary:
    "Recent study published by the University Research Group explores the efficacy of curated digital curricula.",
  img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=100&fit=crop",
};

// ── Skeleton loaders ──────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
  );
}

// ── Main component ────────────────────────────────────────────────

export default function StudentDashboard({ profile }) {
  const [enrollments, setEnrollments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!profile?.id_profile) return;

    async function fetchData() {
      setLoadingData(true);
      try {
        const [enr, hist] = await Promise.all([
          getStudentEnrollments(profile.id_profile),
          getStudentHistory(profile.id_profile),
        ]);
        setEnrollments(enr ?? []);
        setHistory(hist ?? []);
      } catch (err) {
        console.error("StudentDashboard data error:", err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [profile?.id_profile]);

  // Derived display values
  const displayName =
    [profile?.name, profile?.surname].filter(Boolean).join(" ") ||
    profile?.email ||
    "Student";
  const userEmail = profile?.email ?? "—";
  const initials = (profile?.name?.[0] ?? "") + (profile?.surname?.[0] ?? "");

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ── Profile banner ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-primary-700 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
          {initials || <GraduationCap size={22} />}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">
            {displayName}
          </h1>
          <p className="text-sm text-slate-400 truncate">{userEmail}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
            <GraduationCap size={12} /> Student
          </span>
          {profile?.country_code && profile?.phone_number && (
            <span className="text-xs text-slate-400">
              {profile.country_code} {profile.phone_number}
            </span>
          )}
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<BookOpen size={18} className="text-primary-600" />}
          label="Enrolled Courses"
          value={loadingData ? "—" : enrollments.length}
          loading={loadingData}
        />
        <StatCard
          icon={<Clock size={18} className="text-violet-600" />}
          label="Grades on Record"
          value={loadingData ? "—" : history.length}
          loading={loadingData}
        />
        <StatCard
          icon={<GraduationCap size={18} className="text-teal-600" />}
          label="Account Type"
          value="Student"
          loading={false}
        />
      </div>

      {/* ── Enrolled courses ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Enrolled Courses
            </h3>
            <p className="text-xs text-slate-400">Current semester</p>
          </div>
        </div>

        {loadingData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                <SkeletonBlock className="h-28 rounded-none" />
                <div className="p-3 space-y-2">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 py-12">
            <BookOpen size={28} className="text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">
              No enrollments yet
            </p>
            <p className="text-xs text-slate-400">
              Your courses will appear here once you&apos;re enrolled
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {enrollments.slice(0, 3).map((e, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl shadow-soft overflow-hidden hover:shadow-card transition-all duration-200 cursor-pointer"
              >
                <div className="relative h-28">
                  <Image
                    src={COURSE_IMAGES[i % 3]}
                    alt={e.course?.name ?? "Course"}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {e.course?.credits || 3} CREDITS
                  </span>
                </div>
                <div className="p-3">
                  <p className="sc-label mb-0.5">
                    {`COURSE-${(e.id_course || "").toString().padStart(3, "0")}`}
                  </p>
                  <p className="text-xs font-semibold text-slate-900 mb-2 leading-snug">
                    {e.course?.name ?? "Unnamed Course"}
                  </p>
                  <div className="flex items-center gap-2">
                    {e.teacher && (
                      <Avatar
                        name={e.teacher.name}
                        surname={e.teacher.surname}
                        size="xs"
                      />
                    )}
                    <span className="text-[11px] text-slate-500 truncate">
                      {e.teacher
                        ? `${e.teacher.name} ${e.teacher.surname}`
                        : "—"}
                    </span>
                    <Badge variant="active" className="ml-auto">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {/* Add course CTA */}
            <div className="bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Plus size={18} className="text-slate-400" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Add New Course
              </p>
              <p className="text-[10px] text-slate-400">Electives Open</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Research */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Research &amp; Grants
          </h3>
          <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-200 rounded uppercase tracking-wider mb-2">
                Featured Publication
              </span>
              <h4 className="text-sm font-bold text-primary-800 leading-snug mb-2">
                {RESEARCH.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {RESEARCH.summary}
              </p>
              <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline">
                Read More <ArrowRight size={11} />
              </button>
            </div>
            <div className="shrink-0">
              <Image
                src={RESEARCH.img}
                alt="Research"
                width={120}
                height={100}
                className="w-24 h-20 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Recent grades */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Grades
            </h3>
            <button className="sc-label hover:text-primary-600 cursor-pointer">
              History
            </button>
          </div>
          <div className="space-y-3">
            {loadingData ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <SkeletonBlock className="w-2 h-2 rounded-full" />
                  <SkeletonBlock className="h-3 flex-1" />
                  <SkeletonBlock className="h-4 w-8" />
                </div>
              ))
            ) : history.length > 0 ? (
              history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: h.grade?.startsWith("A")
                        ? "#10b981"
                        : h.grade?.startsWith("B")
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {h.course?.name ?? "Unknown Course"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Assignment: Final Project
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${gradeColor(h.grade)}`}>
                    {h.grade}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No grade history yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────

function StatCard({ icon, label, value, loading }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-soft p-4 flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
          {label}
        </p>
        {loading ? (
          <div className="animate-pulse h-5 w-8 bg-slate-100 rounded mt-0.5" />
        ) : (
          <p className="text-lg font-bold text-slate-900">{value}</p>
        )}
      </div>
    </div>
  );
}
