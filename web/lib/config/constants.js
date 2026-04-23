/**
 * Shared configuration constants for the academic system.
 *
 * SOLID (OCP): Centralising option lists here means new statuses or
 * relation types can be added in one place without modifying any
 * component that consumes them.
 */

/** Status options for courses, allocations, etc. */
export const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 2, label: "Inactive" },
];

/** Relationship types for course requisites / correquisites. */
export const RELATION_OPTIONS = [
  { value: "requisite", label: "Requisite" },
  { value: "correquisite", label: "Correquisite" },
];

/** Allocation status filter options for the schedule dashboard. */
export const ALLOCATION_STATUS_FILTERS = [
  { value: "all", label: "Any Status" },
  { value: "1", label: "Confirmed" },
  { value: "2", label: "Tentative" },
];
