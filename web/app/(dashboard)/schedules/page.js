"use client";

import { useEffect, useState, useCallback } from "react";
import {
  UserCheck,
  Search,
  BookOpen,
  Calendar,
  MapPin,
  MoreHorizontal,
  Trash2,
  Filter,
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import AssignFacultyModal from "@/components/modules/AssignFacultyModal";
import { getAllocations, deleteAllocation } from "@/lib/supabase/queries";
import { useAuth } from "@/lib/auth/AuthContext";

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  1: { label: "Confirmed", variant: "active" },
  2: { label: "Tentative", variant: "pending" },
  3: { label: "Conflict",  variant: "warning" },
};

function statusInfo(id) {
  return STATUS_MAP[id] ?? { label: "Unknown", variant: "neutral" };
}

// ── Table columns definition ───────────────────────────────────────────────────
function buildColumns(onDelete) {
  return [
    {
      key: "teacher_name",
      header: "Faculty Member",
      width: "24%",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={row.teacher_name?.split(" ")[0] ?? ""}
            surname={row.teacher_name?.split(" ").slice(1).join(" ") ?? ""}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {row.teacher_name}
            </p>
            <p className="text-xs text-slate-400 truncate">{row.teacher_email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "course_name",
      header: "Course",
      width: "22%",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600 shrink-0">
            <BookOpen size={13} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {row.course_name}
            </p>
            {row.course_credits && (
              <p className="text-xs text-slate-400">{row.course_credits} cr.</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "schedule",
      header: "Schedule Slot",
      width: "18%",
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar size={13} className="text-slate-400 shrink-0" />
          <div>
            <p className="text-sm font-medium">{row.week_day ?? "—"}</p>
            <p className="text-xs text-slate-400">{row.shift ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "room_name",
      header: "Location",
      width: "15%",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <div>
            <p className="text-sm">{row.room_name}</p>
            {row.room_capacity && (
              <p className="text-xs text-slate-400">cap. {row.room_capacity}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "allocation_status",
      header: "Status",
      width: "12%",
      render: (row) => {
        const { label, variant } = statusInfo(row.allocation_status);
        return (
          <Badge variant={variant} dot>
            {label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "9%",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            title="Remove allocation"
            onClick={(e) => { e.stopPropagation(); onDelete(row); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <button
            title="More options"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      ),
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SchedulesPage() {
  const { profile } = useAuth();

  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  // ── Load allocations ────────────────────────────────────────────────────────
  const loadAllocations = useCallback(async () => {
    setLoading(true);
    try {
      // If teacher, filter to their own records only
      const filters =
        profile?.user_type === "teacher"
          ? { id_profile: profile.id_profile }
          : {};
      const data = await getAllocations(filters);
      setAllocations(data);
    } catch (err) {
      console.error("[SchedulesPage] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadAllocations();
  }, [loadAllocations]);

  // ── Filters ─────────────────────────────────────────────────────────────────
  const filtered = allocations.filter((row) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      row.teacher_name?.toLowerCase().includes(q) ||
      row.course_name?.toLowerCase().includes(q) ||
      row.room_name?.toLowerCase().includes(q) ||
      row.week_day?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" || String(row.allocation_status) === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Delete handler ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAllocation(deleteTarget.id_allocation);
      setAllocations((prev) =>
        prev.filter((r) => r.id_allocation !== deleteTarget.id_allocation),
      );
      setDeleteTarget(null);
    } catch (err) {
      console.error("[SchedulesPage] delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  const isAdmin = !profile || profile.user_type === "admin";

  const columns = buildColumns((row) => setDeleteTarget(row));

  // ── Stats cards ──────────────────────────────────────────────────────────────
  const confirmed = allocations.filter((r) => r.allocation_status === 1).length;
  const tentative = allocations.filter((r) => r.allocation_status === 2).length;
  const conflicts = allocations.filter((r) => r.allocation_status === 3).length;

  return (
    <>
      <TopNav
        title="Schedule Management"
        subtitle="Faculty Allocation"
        actions={
          isAdmin && (
            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
            >
              <UserCheck size={14} />
              Assign Faculty
            </Button>
          )
        }
      />

      <main className="flex-1 overflow-y-auto p-6 animate-fade-in space-y-5">

        {/* ── Stats strip ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Allocations", value: allocations.length, color: "text-primary-600", bg: "bg-primary-50" },
            { label: "Confirmed",          value: confirmed,          color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Conflicts",          value: conflicts,          color: "text-red-600",     bg: "bg-red-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-soft px-5 py-4 flex items-center gap-4">
              <div className={`${bg} ${color} rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg`}>
                {value}
              </div>
              <div>
                <p className="sc-label">{label}</p>
                <p className="text-xl font-bold text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters bar ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="schedules-search"
              name="schedules-search"
              type="text"
              autoComplete="off"
              placeholder="Search faculty, course, or room…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sc-input pl-9 w-full"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              id="schedules-status-filter"
              name="schedules-status-filter"
              autoComplete="off"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sc-input pl-8 pr-8 appearance-none bg-white min-w-[140px]"
            >
              <option value="all">All Statuses</option>
              <option value="1">Confirmed</option>
              <option value="2">Tentative</option>
              <option value="3">Conflict</option>
            </select>
          </div>

          {/* Results count */}
          <p className="text-xs text-slate-400 ml-auto">
            {loading ? "Loading…" : `${filtered.length} allocation${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* ── Main table ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
          <Table
            columns={columns}
            data={filtered}
            loading={loading}
            emptyMessage="No allocations found. Use 'Assign Faculty' to create one."
            rowsPerPage={8}
          />
        </div>

      </main>

      {/* ── Assign Faculty Modal ─────────────────────────────────────────────── */}
      <AssignFacultyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={loadAllocations}
      />

      {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => { if (!deleting) setDeleteTarget(null); }}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-modal border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-fade-in">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-1">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Remove Allocation
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Remove{" "}
                <span className="font-medium text-slate-700">
                  {deleteTarget.teacher_name}
                </span>{" "}
                from{" "}
                <span className="font-medium text-slate-700">
                  {deleteTarget.course_name}
                </span>
                ? This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
