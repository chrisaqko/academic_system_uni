"use client";

/**
 * useFacultyAllocations — Custom hook for allocation data management.
 *
 * SOLID (SRP): Extracts data-fetching, grouping, filtering, and mutation
 * logic out of the SchedulesPage component. The page now only handles
 * rendering and UI state.
 */
import { useEffect, useState, useCallback, useMemo } from "react";
import { AllocationService } from "@/lib/services/AllocationService";

/**
 * @param {Object|null} profile — the logged-in user's profile (from useAuth)
 * @param {string} search — current search string
 * @param {string} statusFilter — "all" | "1" | "2"
 */
export function useFacultyAllocations(profile, search = "", statusFilter = "all") {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAllocations = useCallback(async () => {
    setLoading(true);
    try {
      const filters =
        profile?.user_type === "teacher"
          ? { id_profile: profile.id_profile }
          : {};
      const data = await AllocationService.getAll(filters);
      setAllocations(data);
    } catch (err) {
      console.error("[useFacultyAllocations] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  // ── Grouping — one row per teacher ─────────────────────────────────────────
  const grouped = useMemo(() => {
    const map = new Map();
    allocations.forEach((row) => {
      const id = row.id_profile;
      if (!map.has(id)) {
        map.set(id, {
          id_profile: id,
          teacher_name: row.teacher_name,
          teacher_email: row.teacher_email,
          allocations: [],
        });
      }
      map.get(id).allocations.push(row);
    });
    return Array.from(map.values());
  }, [allocations]);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return grouped.filter((fac) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        fac.teacher_name?.toLowerCase().includes(q) ||
        fac.teacher_email?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" ||
        fac.allocations.some(
          (a) => String(a.allocation_status) === statusFilter,
        );
      return matchSearch && matchStatus;
    });
  }, [grouped, search, statusFilter]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      totalProfessors: grouped.length,
      activeModules: allocations.length,
      confirmed: allocations.filter((a) => a.allocation_status === 1).length,
    }),
    [grouped, allocations],
  );

  // ── Mutation: delete an allocation (optimistic update) ─────────────────────
  const removeAllocation = useCallback(
    async (id_allocation) => {
      await AllocationService.delete(id_allocation);
      setAllocations((prev) =>
        prev.filter((r) => r.id_allocation !== id_allocation),
      );
    },
    [],
  );

  return {
    allocations,
    loading,
    grouped,
    filtered,
    stats,
    fetchAllocations,
    removeAllocation,
  };
}
