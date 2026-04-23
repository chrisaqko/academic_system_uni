/**
 * ScheduleService — Abstraction layer for schedule & faculty option data.
 *
 * SOLID (DIP): Modals depend on this service interface instead of
 * importing concrete Supabase query functions directly.
 */
import {
  getFacultyOptions as _getFacultyOptions,
  getScheduleOptions as _getScheduleOptions,
  getClassrooms as _getClassrooms,
  getStatusOptions as _getStatusOptions,
  getCourses as _getCourses,
} from "@/lib/supabase/queries";

export const ScheduleService = {
  /** Fetch active faculty members for dropdowns. */
  getFacultyOptions: () => _getFacultyOptions(),

  /** Fetch all schedule slots for dropdowns. */
  getScheduleOptions: () => _getScheduleOptions(),

  /** Fetch all classrooms. */
  getClassrooms: () => _getClassrooms(),

  /** Fetch status options (Active / Inactive). */
  getStatusOptions: () => _getStatusOptions(),

  /** Fetch all courses (used as options in the assignment modal). */
  getCourses: () => _getCourses(),
};
