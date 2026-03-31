import { supabase, isSupabaseConfigured } from './client';
import {
  mockUsers, mockCourses, mockClassrooms, mockSchedules,
  mockCourseClassroom, mockTeacherAllocation, mockEnrolledSchedule,
  mockAcademicHistory, mockStudyPrograms, mockDashboardMetrics,
} from '../data/mockData';

// ──────── helpers ────────
const withMockFallback = (supabaseQuery, mockData) => {
  if (!isSupabaseConfigured()) return Promise.resolve(mockData);
  return supabaseQuery();
};

// ──────── Users ────────
export async function getUsers() {
  return withMockFallback(async () => {
    const { data, error } = await supabase.from('user').select('*, status(*), teaching_specialization(*)');
    if (error) throw error;
    return data;
  }, mockUsers);
}

export async function getUserById(id) {
  return withMockFallback(async () => {
    const { data, error } = await supabase.from('user').select('*').eq('id_user', id).single();
    if (error) throw error;
    return data;
  }, mockUsers.find(u => u.id_user === id));
}

export async function upsertUser(user) {
  if (!isSupabaseConfigured()) return user;
  const { data, error } = await supabase.from('user').upsert(user).select().single();
  if (error) throw error;
  return data;
}

// ──────── Courses ────────
export async function getCourses() {
  return withMockFallback(async () => {
    const { data, error } = await supabase.from('course').select('*, status(*)');
    if (error) throw error;
    return data;
  }, mockCourses);
}

export async function upsertCourse(course) {
  if (!isSupabaseConfigured()) return course;
  const { data, error } = await supabase.from('course').upsert(course).select().single();
  if (error) throw error;
  return data;
}

// ──────── Classrooms ────────
export async function getClassrooms() {
  return withMockFallback(async () => {
    const { data, error } = await supabase.from('classrom').select('*, status(*)');
    if (error) throw error;
    return data;
  }, mockClassrooms);
}

export async function upsertClassroom(room) {
  if (!isSupabaseConfigured()) return room;
  const { data, error } = await supabase.from('classrom').upsert(room).select().single();
  if (error) throw error;
  return data;
}

// ──────── Schedules (full join) ────────
export async function getSchedules() {
  return withMockFallback(async () => {
    const { data, error } = await supabase
      .from('course_classrom')
      .select('*, schedule(*), course(*), classrom(*), status(*)');
    if (error) throw error;
    return data;
  }, buildScheduleGrid());
}

// Build enriched schedule grid from mock data
export function buildScheduleGrid() {
  return mockCourseClassroom.map(cc => ({
    ...cc,
    schedule:  mockSchedules.find(s => s.id_schedule === cc.id_schedule),
    course:    mockCourses.find(c => c.id_course === cc.id_course),
    classrom:  mockClassrooms.find(r => r.id_classrom === cc.id_classrom),
  }));
}

// ──────── Teacher schedule ────────
export async function getTeacherSchedule(userId) {
  return withMockFallback(async () => {
    const { data, error } = await supabase
      .from('teacher_allocation')
      .select('*, schedule(*), course(*)')
      .eq('id_user', userId);
    if (error) throw error;
    return data;
  }, buildTeacherSchedule(userId));
}

export function buildTeacherSchedule(userId) {
  return mockTeacherAllocation
    .filter(ta => ta.id_user === userId)
    .map(ta => ({
      ...ta,
      schedule: mockSchedules.find(s => s.id_schedule === ta.id_schedule),
      course:   mockCourses.find(c => c.id_course === ta.id_course),
      classrom: (() => {
        const cc = mockCourseClassroom.find(
          c => c.id_course === ta.id_course && c.id_schedule === ta.id_schedule
        );
        return cc ? mockClassrooms.find(r => r.id_classrom === cc.id_classrom) : null;
      })(),
    }));
}

// ──────── Student enrollments ────────
export async function getStudentEnrollments(userId) {
  return withMockFallback(async () => {
    const { data, error } = await supabase
      .from('enrolled_schedule')
      .select('*, course(*), schedule(*)')
      .eq('id_user', userId);
    if (error) throw error;
    return data;
  }, buildStudentEnrollments(userId));
}

export function buildStudentEnrollments(userId) {
  return mockEnrolledSchedule
    .filter(e => e.id_user === userId)
    .map(e => ({
      ...e,
      course:   mockCourses.find(c => c.id_course === e.id_course),
      schedule: mockSchedules.find(s => s.id_schedule === e.id_schedule),
      teacher:  (() => {
        const alloc = mockTeacherAllocation.find(
          ta => ta.id_course === e.id_course && ta.id_schedule === e.id_schedule
        );
        return alloc ? mockUsers.find(u => u.id_user === alloc.id_user) : null;
      })(),
    }));
}

// ──────── Student academic history ────────
export async function getStudentHistory(userId) {
  return withMockFallback(async () => {
    const { data, error } = await supabase
      .from('academic_history')
      .select('*, course(*)')
      .eq('id_user', userId);
    if (error) throw error;
    return data;
  }, mockAcademicHistory
    .filter(h => h.id_user === userId)
    .map(h => ({ ...h, course: mockCourses.find(c => c.id_course === h.id_course) }))
  );
}

// ──────── Study programs ────────
export async function getStudyPrograms() {
  return withMockFallback(async () => {
    const { data, error } = await supabase.from('study_program').select('*, status(*)');
    if (error) throw error;
    return data;
  }, mockStudyPrograms);
}

// ──────── Dashboard metrics ────────
export async function getDashboardMetrics() {
  if (!isSupabaseConfigured()) return mockDashboardMetrics;
  const [usersRes, coursesRes, classroomsRes] = await Promise.all([
    supabase.from('user').select('id_user', { count: 'exact', head: true }),
    supabase.from('course').select('id_course', { count: 'exact', head: true }),
    supabase.from('classrom').select('id_classrom', { count: 'exact', head: true }),
  ]);
  return {
    totalStudents:    usersRes.count ?? mockDashboardMetrics.totalStudents,
    totalCourses:     coursesRes.count ?? mockDashboardMetrics.totalCourses,
    activeClassrooms: classroomsRes.count ?? mockDashboardMetrics.activeClassrooms,
    classroomOccupancy: mockDashboardMetrics.classroomOccupancy,
    systemHealth:     mockDashboardMetrics.systemHealth,
    departments:      mockDashboardMetrics.departments,
    staffingInsights: mockDashboardMetrics.staffingInsights,
    recentActivity:   mockDashboardMetrics.recentActivity,
  };
}
