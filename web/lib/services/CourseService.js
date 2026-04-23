/**
 * CourseService — Abstraction layer for course-related data operations.
 *
 * SOLID (DIP): Pages and modals depend on this service interface
 * instead of importing Supabase query functions directly.
 */
import {
  getCourses as _getCourses,
  upsertCourse as _upsertCourse,
  getCoursesByProgram as _getCoursesByProgram,
  updateCoursePrograms as _updateCoursePrograms,
  getRelatedCourses as _getRelatedCourses,
  updateRelatedCourses as _updateRelatedCourses,
  getProgramOptions as _getProgramOptions,
} from "@/lib/supabase/queries";

export const CourseService = {
  /** Fetch all courses with their program relationships. */
  getAll: () => _getCourses(),

  /** Create or update a course record. */
  upsert: (course) => _upsertCourse(course),

  /** Fetch all course-program join rows. */
  getCoursesByProgram: () => _getCoursesByProgram(),

  /** Replace all program associations for a course. */
  updatePrograms: (id_course, programIds) =>
    _updateCoursePrograms(id_course, programIds),

  /** Fetch all related/prerequisite course records. */
  getRelatedCourses: () => _getRelatedCourses(),

  /** Replace all related course associations for a course. */
  updateRelatedCourses: (id_course, relatedCourses) =>
    _updateRelatedCourses(id_course, relatedCourses),

  /** Fetch lean program options for dropdowns. */
  getProgramOptions: () => _getProgramOptions(),
};
