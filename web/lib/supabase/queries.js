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
  const { data, error } = await supabase.from("course").select(`
      *,
      courses_program (
        id_program
      )
    `);

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

export async function updateCoursePrograms(id_course, programIds) {
  const { error: deleteError } = await supabase
    .from("courses_program")
    .delete()
    .eq("id_course", id_course);
  if (deleteError) throw deleteError;

  if (programIds && programIds.length > 0) {
    const inserts = programIds.map((pid) => ({
      id_course,
      id_program: pid,
      id_status: 1,
    }));
    const { error: insertError } = await supabase
      .from("courses_program")
      .insert(inserts);
    if (insertError) throw insertError;
  }
}

export async function upsertCourse(course) {
  // Prevent PostgREST from treating nested relation arrays as columns
  const payload = { ...course };
  delete payload.courses_program;

  const { data, error } = await supabase
    .from("course")
    .upsert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ──────── Classrooms ────────

export async function getRelatedCourses() {
  const { data, error } = await supabase
    .from("related_course")
    .select("*");
  if (error) throw error;
  return data ?? [];
}

export async function updateRelatedCourses(id_course, relatedCourses) {
  const { error: deleteError } = await supabase
    .from("related_course")
    .delete()
    .eq("id_course", id_course);
  if (deleteError) throw deleteError;

  if (relatedCourses && relatedCourses.length > 0) {
    const inserts = relatedCourses.map((rc) => ({
      id_course,
      id_required_course: rc.id_required_course,
      relation: rc.relation,
      id_status: rc.id_status ?? 1,
    }));
    const { error: insertError } = await supabase
      .from("related_course")
      .insert(inserts);
    if (insertError) throw insertError;
  }
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
  // course_classrom has NO direct FK to schedule.
  // The correct traversal is: schedule_course → schedule / course / course_classrom → classrom
  const { data, error } = await supabase
    .from("schedule_course")
    .select(`
      id_schedule_course,
      schedule ( id_schedule, week_day, shift ),
      course   ( id_course, name, credits ),
      course_classrom (
        id_course_classrom,
        classrom ( id_classrom, n_classrom, capacity )
      )
    `);
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
  // teacher_allocation has NO direct FK to schedule or course.
  // The correct path is: teacher_allocation → schedule_course → schedule / course.
  const { data, error } = await supabase
    .from("teacher_allocation")
    .select(`
      id_allocation,
      id_status,
      schedule_course (
        id_schedule_course,
        schedule ( id_schedule, week_day, shift ),
        course   ( id_course, name, credits ),
        course_classrom (
          classrom ( id_classrom, n_classrom )
        )
      )
    `)
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
  // enrolled_schedule → schedule_course → schedule / course
  const { data, error } = await supabase
    .from("enrolled_schedule")
    .select(`
      id_enrolled,
      id_status,
      schedule_course (
        id_schedule_course,
        schedule ( id_schedule, week_day, shift ),
        course   ( id_course, name, credits )
      )
    `)
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

// ──────── Faculty Allocations ────────

/**
 * Fetch the full flat allocation list from the REST route.
 * Supports optional filters: id_profile, id_course, id_classrom, status.
 * @param {Object} filters
 * @returns {Promise<AllocationRow[]>}
 */
export async function getAllocations(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "all") params.set(k, v);
  });
  const qs = params.toString();
  const res = await fetch(`/api/allocations${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `GET /api/allocations failed (${res.status})`);
  }
  const { data } = await res.json();
  return data ?? [];
}

/**
 * Assign a faculty member to a course/schedule/classroom.
 * The API handles the 3-step transaction and conflict checks.
 *
 * @param {{ id_profile, id_course, id_schedule, id_classrom, id_status? }} payload
 * @returns {Promise<{ id_allocation, id_schedule_course }>}
 */
export async function createAllocation(payload) {
  const res = await fetch("/api/allocations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body;
  try {
    body = await res.json();
  } catch {
    body = { error: "Unknown", message: "Failed to parse error response" };
  }

  if (!res.ok) {
    const err = new Error(body.message ?? body.error ?? "Allocation failed");
    err.code = body.error; // e.g. "CONFLICT_CLASSROOM"
    err.details = body.details; // Postgres hint/detail if available
    throw err;
  }
  return body;
}

/**
 * Remove a single teacher_allocation record.
 * @param {number} id_allocation
 */
export async function deleteAllocation(id_allocation) {
  const res = await fetch(`/api/allocations?id_allocation=${id_allocation}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error ?? `DELETE /api/allocations failed (${res.status})`,
    );
  }
}

/**
 * Fetch all schedule slots for use in the assignment modal dropdown.
 * Returns each slot with a human-readable label.
 * @returns {Promise<ScheduleOption[]>}
 */
export async function getScheduleOptions() {
  const { data, error } = await supabase
    .from("schedule")
    .select("id_schedule, week_day, shift");
  if (error) {
    console.error("[getScheduleOptions] Supabase error:", error);
    throw error;
  }
  const rows = data ?? [];
  // Sort client-side as a fallback in case the table has no index on these columns
  rows.sort((a, b) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const da = dayOrder.indexOf(a.week_day);
    const db = dayOrder.indexOf(b.week_day);
    if (da !== db) return da - db;
    return String(a.shift).localeCompare(String(b.shift));
  });
  return rows.map((s) => ({
    ...s,
    label: `${s.week_day} • ${s.shift}`,
  }));
}

/**
 * Fetch active faculty members for the assignment modal dropdown.
 * @returns {Promise<FacultyOption[]>}
 */
export async function getFacultyOptions() {
  const { data, error } = await supabase
    .from("profile")
    .select("id_profile, name, surname, email")
    .eq("user_type", "teacher")
    .eq("id_status", 1)
    .order("surname");
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    label: `${p.name} ${p.surname}`.trim(),
  }));
}

// ── private helper: "HH:MM:SS" → "10:00 AM" ─────────────────────────────────
function _fmtTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${suffix}`;
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

/**
 * Returns Active/Inactive options for dropdowns.
 * 1 = Active, 2 = Inactive
 */
export async function getStatusOptions() {
  return [
    { value: 1, label: "Active" },
    { value: 2, label: "Inactive" },
  ];
}
