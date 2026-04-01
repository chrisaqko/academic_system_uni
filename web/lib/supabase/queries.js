import { supabase } from "./client";

// ──────── Users ────────

export async function getUsers() {
  const { data, error } = await supabase.from("user").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id_user", id)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertUser(user) {
  const { data, error } = await supabase
    .from("user")
    .upsert(user)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ──────── Courses ────────

export async function getCourses() {
  const { data, error } = await supabase.from("course").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function upsertCourse(course) {
  const { data, error } = await supabase
    .from("course")
    .upsert(course)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ──────── Classrooms ────────

export async function getClassrooms() {
  const { data, error } = await supabase.from("classrom").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function upsertClassroom(room) {
  const { data, error } = await supabase
    .from("classrom")
    .upsert(room)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ──────── Schedules (full join) ────────

export async function getSchedules() {
  const { data, error } = await supabase
    .from("course_classrom")
    .select("*, schedule(*), course(*), classrom(*)");
  if (error) throw error;
  return data ?? [];
}

/**
 * Synchronous — kept for backward compat with components that call it at
 * render time. Returns an empty array now that mock data is removed;
 * use getSchedules() for real data.
 */
export function buildScheduleGrid() {
  return [];
}

// ──────── Teacher schedule ────────

export async function getTeacherSchedule(profileId) {
  const { data, error } = await supabase
    .from("teacher_allocation")
    .select("*, schedule(*), course(*)")
    .eq("id_profile", profileId);
  if (error) throw error;
  return data ?? [];
}

/**
 * Synchronous — kept for backward compat with TeacherDashboard which calls
 * this at render time. Returns an empty array; replace callers with the
 * async getTeacherSchedule() for real data.
 */
export function buildTeacherSchedule(_profileId) {
  return [];
}

// ──────── Student enrollments ────────

export async function getStudentEnrollments(profileId) {
  const { data, error } = await supabase
    .from("enrolled_schedule")
    .select("*, course(*), schedule(*)")
    .eq("id_profile", profileId);
  if (error) throw error;
  return data ?? [];
}

/**
 * Synchronous — kept for backward compat. Returns an empty array;
 * use the async getStudentEnrollments() for real data.
 */
export function buildStudentEnrollments(_profileId) {
  return [];
}

// ──────── Student academic history ────────

export async function getStudentHistory(profileId) {
  const { data, error } = await supabase
    .from("academic_history")
    .select("*, course(*)")
    .eq("id_profile", profileId);
  if (error) throw error;
  return data ?? [];
}

// ──────── Study programs ────────

export async function getStudyPrograms() {
  const { data, error } = await supabase
    .from("courses_program")
    .select("*");
  if (error) throw error;
  return data ?? [];
}

// ──────── Dashboard metrics ────────

export async function getDashboardMetrics() {
  const [usersRes, coursesRes, classroomsRes] = await Promise.all([
    supabase.from("user").select("id_user",   { count: "exact", head: true }),
    supabase.from("course").select("id_course", { count: "exact", head: true }),
    supabase.from("classrom").select("id_classrom", { count: "exact", head: true }),
  ]);

  return {
    totalStudents:    usersRes.count      ?? 0,
    totalCourses:     coursesRes.count    ?? 0,
    activeClassrooms: classroomsRes.count ?? 0,
    // Fields below have no dedicated table yet — return safe defaults
    classroomOccupancy: null,
    systemHealth:       "99.9%",
    departments:        null,
    staffingInsights:   [],
    recentActivity:     [],
  };
}
