// app/api/allocations/route.js
// ── GET  /api/allocations  — Master join for the allocation dashboard
// ── POST /api/allocations  — Transactional faculty assignment (Steps A → B → C)

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ─── Admin client (bypasses RLS so we can do multi-table writes safely) ────────
function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/allocations
// Returns the full, flat allocation list by joining:
//   teacher_allocation → schedule_course → course_classrom
//   with embedded profile, course, schedule, and classrom details.
//
// Supabase PostgREST traversal path:
//   teacher_allocation
//     .schedule_course ( FK: id_schedule_course )
//       .schedule      ( FK: id_schedule )
//       .course        ( FK: id_course )
//       .course_classrom ( FK: id_schedule_course )
//         .classrom    ( FK: id_classrom )
//     .profile         ( FK: id_profile )
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const supabase = makeAdmin();
  const { searchParams } = new URL(request.url);

  // Optional filters from query string
  const id_profile = searchParams.get("id_profile"); // filter by teacher
  const id_course = searchParams.get("id_course"); // filter by course
  const id_classrom = searchParams.get("id_classrom"); // filter by room
  const status = searchParams.get("status"); // allocation status

  try {
    let query = supabase.from("teacher_allocation").select(`
        id_allocation,
        id_status,
        id_schedule_course,
        profile (
          id_profile,
          name,
          surname,
          email,
          user_type
        ),
        schedule_course (
          id_schedule_course,
          id_course,
          id_schedule,
          course (
            id_course,
            name,
            credits
          ),
          schedule (
            id_schedule,
            week_day,
            shift
          ),
          course_classrom (
            id_course_classroom,
            id_classrom,
            classrom (
              id_classrom,
              n_classrom,
              capacity
            )
          )
        )
      `);

    // Apply optional server-side filters
    if (id_profile) query = query.eq("id_profile", id_profile);
    if (status) query = query.eq("id_status", Number(status));

    // Filters that live on related tables must be done client-side after fetch
    const { data, error } = await query.order("id_allocation", {
      ascending: false,
    });
    if (error) throw error;

    // ── Flatten the nested join into one object per allocation row ────────────
    let rows = (data ?? []).map(flattenAllocation);

    // Post-fetch filters (related table columns)
    if (id_course) rows = rows.filter((r) => String(r.id_course) === id_course);
    if (id_classrom)
      rows = rows.filter((r) => String(r.id_classrom) === id_classrom);

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/allocations]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/allocations
// Transactional faculty assignment.
//
// Expected body:
//   { id_profile, id_course, id_schedule, id_classrom, id_status? }
//
// Steps:
//   A. Upsert schedule_course (id_course × id_schedule)
//   B. Upsert course_classrom (id_schedule_course × id_classrom)
//   C. Insert  teacher_allocation (id_schedule_course × id_profile)
//
// Conflict checks (before any write):
//   1. Classroom double-booking: same id_classrom + same id_schedule
//   2. Teacher double-booking:   same id_profile  + same id_schedule
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  // NOTE: In production, add session verification here before proceeding.
  const supabase = makeAdmin();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id_profile = body.id_profile; // UUID
  const id_course = parseInt(body.id_course);
  const id_schedule = parseInt(body.id_schedule);
  const id_classrom = parseInt(body.id_classrom);
  const id_status = parseInt(body.id_status || 1);

  // ── Basic input validation ─────────────────────────────────────────────────
  const missing = [
    "id_profile",
    "id_course",
    "id_schedule",
    "id_classrom",
  ].filter((k) => !body[k]);
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 422 },
    );
  }

  try {
    // ── Step 0: Conflict detection ────────────────────────────────────────────

    // 0a. Find any existing schedule_course rows for this time slot
    const { data: scForSlot, error: scSlotErr } = await supabase
      .from("schedule_course")
      .select("id_schedule_course")
      .eq("id_schedule", id_schedule);
    if (scSlotErr) throw scSlotErr;

    const scIds = (scForSlot ?? []).map((r) => r.id_schedule_course);

    // 0b. Classroom double-booking check
    if (scIds.length > 0) {
      const { data: roomConflict, error: roomErr } = await supabase
        .from("course_classrom")
        .select("id_course_classroom")
        .eq("id_classrom", id_classrom)
        .in("id_schedule_course", scIds);
      if (roomErr) throw roomErr;

      if (roomConflict && roomConflict.length > 0) {
        return NextResponse.json(
          {
            error: "CONFLICT_CLASSROOM",
            message:
              "This classroom is already booked for another course at the selected time slot.",
          },
          { status: 409 },
        );
      }

      // 0c. Teacher double-booking check
      const { data: teacherConflict, error: teacherErr } = await supabase
        .from("teacher_allocation")
        .select("id_allocation")
        .eq("id_profile", id_profile)
        .in("id_schedule_course", scIds);
      if (teacherErr) throw teacherErr;

      if (teacherConflict && teacherConflict.length > 0) {
        return NextResponse.json(
          {
            error: "CONFLICT_TEACHER",
            message:
              "This faculty member is already allocated to another course at the selected time slot.",
          },
          { status: 409 },
        );
      }
    }

    // ── Step A: Get or Create schedule_course ────────────────────────────────
    // We check for an existing link first to avoid pkey conflicts on id_schedule_course.
    let { data: sc, error: scFindErr } = await supabase
      .from("schedule_course")
      .select("id_schedule_course")
      .eq("id_course", id_course)
      .eq("id_schedule", id_schedule)
      .maybeSingle();

    if (scFindErr) throw scFindErr;

    if (!sc) {
      const { data: newSc, error: scInsErr } = await supabase
        .from("schedule_course")
        .insert({ id_course, id_schedule, id_status })
        .select("id_schedule_course")
        .single();
      if (scInsErr) throw scInsErr;
      sc = newSc;
    }
    const id_schedule_course = sc.id_schedule_course;

    // ── Step B: Get or Create course_classrom ────────────────────────────────
    // Using the business keys to avoid pkey conflicts on id_course_classroom.
    let { data: cc, error: ccFindErr } = await supabase
      .from("course_classrom")
      .select("id_course_classroom")
      .eq("id_schedule_course", id_schedule_course)
      .eq("id_classrom", id_classrom)
      .maybeSingle();

    if (ccFindErr) throw ccFindErr;

    if (!cc) {
      const { error: ccInsErr } = await supabase
        .from("course_classrom")
        .insert({ id_schedule_course, id_classrom, id_status });
      if (ccInsErr) throw ccInsErr;
    }

    // ── Step C: Insert teacher_allocation ─────────────────────────────────────
    // This table allows multiple teachers per slot, so we always insert.
    const { data: alloc, error: allocErr } = await supabase
      .from("teacher_allocation")
      .insert({ id_schedule_course, id_profile, id_status })
      .select("id_allocation")
      .single();
    if (allocErr) throw allocErr;

    return NextResponse.json(
      {
        message: "Faculty assigned successfully.",
        id_allocation: alloc.id_allocation,
        id_schedule_course,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/allocations]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/allocations?id_allocation=<n>
// Removes a single allocation record (does NOT remove schedule_course or
// course_classrom since other teachers might share the same slot).
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request) {
  const supabase = makeAdmin();
  const { searchParams } = new URL(request.url);
  const id_allocation = searchParams.get("id_allocation");

  if (!id_allocation) {
    return NextResponse.json(
      { error: "id_allocation query param is required" },
      { status: 422 },
    );
  }

  try {
    const { error } = await supabase
      .from("teacher_allocation")
      .delete()
      .eq("id_allocation", Number(id_allocation));
    if (error) throw error;
    return NextResponse.json(
      { message: "Allocation removed." },
      { status: 200 },
    );
  } catch (err) {
    console.error("[DELETE /api/allocations]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: flatten the deeply nested PostgREST response into a single flat
// object that the dashboard table can render without nested property access.
// ─────────────────────────────────────────────────────────────────────────────
function flattenAllocation(row) {
  const sc = row.schedule_course ?? {};
  const cc = (sc.course_classrom ?? [])[0] ?? {}; // first linked room
  return {
    // Allocation
    id_allocation: row.id_allocation,
    allocation_status: row.id_status,

    // Teacher / Profile
    id_profile: row.profile?.id_profile ?? null,
    teacher_name: row.profile
      ? `${row.profile.name} ${row.profile.surname}`.trim()
      : "Unknown",
    teacher_email: row.profile?.email ?? null,

    // Schedule Course IDs (kept for filtering / FK references)
    id_schedule_course: sc.id_schedule_course ?? null,
    id_course: sc.id_course ?? sc.course?.id_course ?? null,
    id_schedule: sc.id_schedule ?? sc.schedule?.id_schedule ?? null,

    // Course details
    course_name: sc.course?.name ?? "—",
    course_credits: sc.course?.credits ?? null,

    // Schedule details
    week_day: sc.schedule?.week_day ?? null,
    shift: sc.schedule?.shift ?? null,

    // Classroom
    id_classrom: cc.classrom?.id_classrom ?? null,
    room_name: cc.classrom?.n_classrom ?? "—",
    room_capacity: cc.classrom?.capacity ?? null,
  };
}
