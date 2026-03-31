'use client';

import { useEffect, useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import ScheduleGrid from '@/components/dashboard/ScheduleGrid';
import { buildScheduleGrid, buildTeacherSchedule, buildStudentEnrollments } from '@/lib/supabase/queries';
import { getMockSession } from '@/lib/auth/mockAuth';
import { mockCourseClassroom, mockClassrooms } from '@/lib/data/mockData';

export default function SchedulesPage() {
  const [entries, setEntries] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const s = getMockSession();
    setSession(s);
    if (!s) return;

    if (s.user_type === 'admin') {
      setEntries(buildScheduleGrid());
    } else if (s.user_type === 'teacher') {
      setEntries(buildTeacherSchedule(s.id_user));
    } else {
      // Student: enrich with classroom data
      const enrollments = buildStudentEnrollments(s.id_user);
      const withClassrooms = enrollments.map(e => {
        const cc = mockCourseClassroom.find(
          c => c.id_course === e.id_course && c.id_schedule === e.id_schedule
        );
        return {
          ...e,
          classrom: cc ? mockClassrooms.find(r => r.id_classrom === cc.id_classrom) : null,
        };
      });
      setEntries(withClassrooms);
    }
  }, []);

  const titles = {
    admin:   'All Schedules',
    teacher: 'My Teaching Schedule',
    student: 'My Schedule',
  };

  return (
    <>
      <TopNav title="Schedule Management" subtitle="Academic Calendar" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <ScheduleGrid entries={entries} title={titles[session?.user_type] || 'Schedule'} />
      </main>
    </>
  );
}
