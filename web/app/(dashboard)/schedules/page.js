"use client";

/**
 * SchedulesPage — Faculty Allocations dashboard.
 *
 * SOLID refactoring applied:
 *   SRP  → Data logic extracted to useFacultyAllocations hook.
 *          FacultyDetailModal extracted to its own component file.
 *   OCP  → Filter options pulled from centralised config/constants.
 *   ISP  → FacultyDetailModal receives lean props, not a monolithic object.
 *   DIP  → Allocation mutations go through AllocationService, not raw queries.
 */

import { useState, useCallback } from "react";
import {
  UserCheck,
  Search,
  BookOpen,
  Calendar,
  MapPin,
  Eye,
  Plus,
  Trash2,
  Filter,
  Users,
  ChevronRight,
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import GridView from "@/components/ui/GridView";
import ViewToggle from "@/components/ui/ViewToggle";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import AssignFacultyModal from "@/components/modules/AssignFacultyModal";
import FacultyDetailModal from "@/components/modules/FacultyDetailModal";
import { useAuth } from "@/lib/auth/AuthContext";
import { useFacultyAllocations } from "@/lib/hooks/useFacultyAllocations";
import { ALLOCATION_STATUS_FILTERS } from "@/lib/config/constants";

// ── Table columns definition ───────────────────────────────────────────────────
function buildColumns(onViewDetails, onAddSchedule) {
  return [
    {
      key: "teacher_name",
      header: "Faculty Member",
      width: "60%",
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
            <p className="text-xs text-slate-400 truncate">
              {row.teacher_email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "allocation_count",
      header: "Assignments",
      width: "20%",
      render: (row) => (
        <Badge variant="neutral">{row.allocations?.length || 0} Modules</Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "20%",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(row);
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSchedule(row);
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
            title="Assign Module"
          >
            <Plus size={14} />
          </button>
        </div>
      ),
    },
  ];
}

// ── Stat card icon mapping ──────────────────────────────────────────────────────
const STAT_CONFIG = [
  {
    key: "totalProfessors",
    label: "Total Professors",
    color: "text-primary-600",
    bg: "bg-primary-50",
    icon: Users,
  },
  {
    key: "activeModules",
    label: "Active Modules",
    color: "text-violet-600",
    bg: "bg-violet-50",
    icon: BookOpen,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: UserCheck,
  },
];

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SchedulesPage() {
  const { profile } = useAuth();
  const isAdmin = !profile || profile.user_type === "admin";

  // UI-only state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Data via custom hook (SRP) ────────────────────────────────────────────
  const {
    loading,
    filtered,
    stats,
    fetchAllocations,
    removeAllocation,
  } = useFacultyAllocations(profile, search, statusFilter);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeAllocation(deleteTarget.id_allocation);
      // Also update the selected faculty's view if the detail modal is open
      if (selectedFaculty) {
        setSelectedFaculty((prev) => ({
          ...prev,
          allocations: prev.allocations.filter(
            (a) => a.id_allocation !== deleteTarget.id_allocation,
          ),
        }));
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("[SchedulesPage] delete error:", err);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, selectedFaculty, removeAllocation]);

  const onViewDetails = (fac) => {
    setSelectedFaculty(fac);
    setDetailOpen(true);
  };
  const onAddSchedule = (fac) => {
    setSelectedFaculty(fac);
    setModalOpen(true);
  };

  const columns = buildColumns(onViewDetails, onAddSchedule);

  // ── Stat cards driven by config ───────────────────────────────────────────
  const statCards = STAT_CONFIG.map((s) => ({
    ...s,
    value: stats[s.key],
  }));

  const renderCard = (fac) => (
    <div
      className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-soft hover:shadow-card hover:border-primary-200 transition-all cursor-pointer"
      onClick={() => onViewDetails(fac)}
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar
          name={fac.teacher_name?.split(" ")[0] ?? ""}
          surname={fac.teacher_name?.split(" ").slice(1).join(" ") ?? ""}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            {fac.teacher_name}
          </p>
          <p className="text-xs text-slate-400 truncate mb-2">
            {fac.teacher_email}
          </p>
          <Badge variant="neutral">{fac.allocations.length} Modules</Badge>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          View Details
        </span>
        <ChevronRight
          size={14}
          className="text-slate-300 group-hover:translate-x-0.5 transition-transform"
        />
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddSchedule(fac);
          }}
          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <TopNav
        title="Faculty Allocations"
        subtitle="Manage professor schedules and course assignments"
        actions={
          isAdmin && (
            <Button
              size="sm"
              onClick={() => {
                setSelectedFaculty(null);
                setModalOpen(true);
              }}
            >
              <UserCheck size={14} />
              Assign Faculty
            </Button>
          )
        }
      />

      <main className="flex-1 overflow-y-auto p-6 animate-fade-in space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}
              >
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters — OCP: filter options from centralised config */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 min-w-[300px]">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by faculty name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sc-input pl-9 w-full h-10"
              />
            </div>
            <div className="relative">
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="sc-input pl-8 h-10 min-w-[140px]"
              >
                {ALLOCATION_STATUS_FILTERS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
            <Table
              columns={columns}
              data={filtered}
              loading={loading}
              emptyMessage="No faculty assignments found."
              rowsPerPage={10}
              onRowClick={onViewDetails}
            />
          </div>
        ) : (
          <GridView
            data={filtered}
            renderCard={renderCard}
            loading={loading}
            emptyMessage="No faculty assignments found."
          />
        )}
      </main>

      {/* ISP: lean props instead of monolithic faculty object */}
      <FacultyDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        teacherName={selectedFaculty?.teacher_name}
        teacherEmail={selectedFaculty?.teacher_email}
        allocations={selectedFaculty?.allocations ?? []}
        onDeleteAllocation={(alloc) => setDeleteTarget(alloc)}
        onAddSchedule={() => {
          setDetailOpen(false);
          onAddSchedule(selectedFaculty);
        }}
      />

      <AssignFacultyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialFacultyId={selectedFaculty?.id_profile}
        onSaved={fetchAllocations}
      />

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-8 animate-scale-in">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Remove Assignment
              </h3>
              <p className="text-sm text-slate-500 mt-3">
                Do you want to remove{" "}
                <span className="font-bold text-slate-700">
                  {deleteTarget.course_name}
                </span>{" "}
                from this schedule?
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all shadow-lg shadow-red-200"
              >
                {deleting ? "Removing…" : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
