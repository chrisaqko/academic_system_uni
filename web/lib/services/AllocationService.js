/**
 * AllocationService — Abstraction layer for allocation data operations.
 *
 * SOLID (DIP): High-level modules (pages, hooks, modals) depend on this
 * service interface instead of importing concrete Supabase query functions
 * directly. Swapping the data source (e.g. REST API, mock) only requires
 * changing this file.
 */
import {
  getAllocations as _getAllocations,
  deleteAllocation as _deleteAllocation,
  createAllocation as _createAllocation,
} from "@/lib/supabase/queries";

export const AllocationService = {
  /**
   * Fetch the full flat allocation list.
   * @param {Object} filters — optional: { id_profile, id_course, id_classrom, status }
   * @returns {Promise<AllocationRow[]>}
   */
  getAll: (filters = {}) => _getAllocations(filters),

  /**
   * Remove a single teacher_allocation record.
   * @param {number} id_allocation
   */
  delete: (id_allocation) => _deleteAllocation(id_allocation),

  /**
   * Assign a faculty member to a course/schedule/classroom.
   * @param {{ id_profile, id_course, id_schedule, id_classrom, id_status? }} payload
   * @returns {Promise<{ id_allocation, id_schedule_course }>}
   */
  create: (payload) => _createAllocation(payload),
};
