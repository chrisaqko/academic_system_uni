"use client";

import { useEffect, useState, useMemo } from "react";
import ScheduleGrid from "@/components/ui/ScheduleGrid";
import { AllocationService } from "@/lib/services/AllocationService";
import { Users, BookOpen, Clock, CheckSquare } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function TeacherDashboard({ profile }) {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id_profile) return;

    async function loadAllocations() {
      setLoading(true);
      try {
        const data = await AllocationService.getAll({ id_profile: profile.id_profile });
        setAllocations(data || []);
      } catch (err) {
        console.error("Failed to load teacher allocations:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAllocations();
  }, [profile?.id_profile]);

  // Map to the format required by the new ScheduleGrid
  const scheduleData = useMemo(() => {
    return allocations.map(alloc => ({
      week_day: alloc.week_day,
      shift: alloc.shift,
      course_name: alloc.course_name,
      room: alloc.room_name,
      professor: alloc.teacher_name,
      status: alloc.allocation_status === 1 ? 'active' : 'inactive',
      is_lab: alloc.course_name?.toLowerCase().includes("lab")
    }));
  }, [allocations]);

  // Group unique courses for the Assigned Courses view
  const uniqueCourses = useMemo(() => {
    const courses = new Map();
    allocations.forEach(alloc => {
      if (!alloc.id_course) return;
      if (!courses.has(alloc.id_course)) {
        courses.set(alloc.id_course, {
          id_course: alloc.id_course,
          course_name: alloc.course_name,
          course_credits: alloc.course_credits,
          sessions: [],
          status: alloc.allocation_status === 1 ? 'active' : 'inactive'
        });
      }
      courses.get(alloc.id_course).sessions.push(alloc);
    });
    return Array.from(courses.values());
  }, [allocations]);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Faculty Overview
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {profile?.name} {profile?.surname} · Faculty view
          </p>
        </div>
      </div>

      {/* Schedule Grid Section */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Weekly Teaching Schedule</h2>
        <div className="bg-white rounded-2xl shadow-soft">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading schedule...</div>
          ) : (
            <ScheduleGrid schedules={scheduleData} />
          )}
        </div>
      </section>

      {/* Assigned Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Assigned Courses</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading courses...</div>
        ) : uniqueCourses.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 py-12">
            <BookOpen size={28} className="text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">No courses assigned</p>
            <p className="text-xs text-slate-400">You will see your active courses here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueCourses.map((course) => (
              <div
                key={course.id_course}
                className="bg-white border border-slate-200 rounded-xl shadow-soft overflow-hidden hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col"
              >
                <div className="p-5 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={course.status === "active" ? "active" : "neutral"} dot>
                      {course.status === "active" ? "Active" : "Pending"}
                    </Badge>
                    {course.course_credits && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        {course.course_credits} CR
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {course.course_name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                    <Users size={12} className="text-slate-400" /> 
                    {/* Placeholder for actual student count since it's not in the allocation query yet */}
                    Estimated 30 Students
                  </p>
                </div>
                
                <div className="p-4 bg-slate-50 flex-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Weekly Sessions
                  </h4>
                  <div className="space-y-2">
                    {course.sessions.map((session, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Clock size={12} className="text-primary-500" />
                          {session.week_day}
                        </span>
                        <span className="text-slate-500">
                          {session.shift} · {session.room_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 mt-auto bg-white">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center justify-center gap-1.5"
                    onClick={() => alert("Grade entry system coming soon!")}
                  >
                    <CheckSquare size={14} />
                    Manage Grades
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
