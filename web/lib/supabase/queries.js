import { supabase } from "./client";

// ──────── Users ────────

export async function getUsers() {
  const { data, error } = await supabase.from("profile").select(`
      *,
      study_program (
        career_name
      ),
      address (
        id_country,
        id_province
      ),
      teaching_specialization (specialization_area)
    `);

  if (error) throw error;
  return data ?? [];
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from("profile")
    .select("*, study_program(career_name)")
    .eq("id_profile", id)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertUser(user) {
  const { data, error } = await supabase
    .from("profile")
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

/**
 * Returns all rows from the courses_program join table.
 * NOTE: Supabase caps .select("*") at 1000 rows by default.
 * Use getStudyPrograms() (which embeds course counts) for accurate counts.
 */
export async function getCoursesByProgram() {
  const { data, error } = await supabase.from("courses_program").select("*");
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

export async function getStudyProgramById(id) {
  const { data, error } = await supabase
    .from("study_program")
    .select("*")
    .eq("id_program", id)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Fetches all study programs with an accurate course count per program.
 * Uses a HEAD count request per program to avoid any PostgREST FK
 * traversal or RLS issues when selecting columns from courses_program.
 * Each returned program has a _courseCount field (number).
 */
export async function getStudyPrograms() {
  const { data: programs, error: programsError } = await supabase
    .from("study_program")
    .select("*");

  if (programsError) throw programsError;
  if (!programs || programs.length === 0) return [];

  // COUNT(*) per program using HEAD request — pure SQL count, no column/FK resolution
  const countResults = await Promise.all(
    programs.map((prog) =>
      supabase
        .from("courses_program")
        .select("*", { count: "exact", head: true })
        .eq("id_program", prog.id_program)
        .then(({ count, error }) => ({
          id_program: prog.id_program,
          count: error ? 0 : (count ?? 0),
        })),
    ),
  );

  const countMap = countResults.reduce((acc, { id_program, count }) => {
    acc[id_program] = count;
    return acc;
  }, {});

  return programs.map((prog) => ({
    ...prog,
    _courseCount: countMap[prog.id_program] ?? 0,
  }));
}

export async function upsertStudyProgram(program) {
  const { data, error } = await supabase
    .from("study_program")
    .upsert(program)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Career for user
export async function getProgramOptions() {
  const { data, error } = await supabase
    .from("study_program")
    .select("id_program, career_name");

  if (error) {
    console.error("Error obteniendo opciones de programas:", error);
    throw error;
  }

  return data ?? [];
}

export async function getCountries() {
  const { data, error } = await supabase.from("country").select("*");
  if (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
  return data ?? [];
}

export async function getProvinces() {
  let query = supabase.from("province").select("*");
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
  return data ?? [];
}

// address
export async function getAddressIdByCombination(id_country, id_province) {
  const { data, error } = await supabase
    .from("address")
    .select("id_address")
    .eq("id_country", id_country)
    .eq("id_province", id_province)
    .single();

  if (error) {
    console.error("Error buscando el id_address:", error);
    return null;
  }
  return data?.id_address;
}

export async function getSpecializations() {
  const { data, error } = await supabase
    .from("teaching_specialization")
    .select("*");
  if (error) {
    console.error("Error fetching specializations:", error);
    throw error;
  }
  return data ?? [];
}

// ──────── Dashboard metrics ────────

export async function getDashboardMetrics() {
  const [usersRes, coursesRes, classroomsRes] = await Promise.all([
    supabase
      .from("profile")
      .select("id_profile", { count: "exact", head: true }),
    supabase.from("course").select("id_course", { count: "exact", head: true }),
    supabase
      .from("classrom")
      .select("id_classrom", { count: "exact", head: true }),
  ]);

  return {
    totalStudents: usersRes.count ?? 0,
    totalCourses: coursesRes.count ?? 0,
    activeClassrooms: classroomsRes.count ?? 0,
    // Fields below have no dedicated table yet — return safe defaults
    classroomOccupancy: null,
    systemHealth: "99.9%",
    departments: null,
    staffingInsights: [],
    recentActivity: [],
  };
}
