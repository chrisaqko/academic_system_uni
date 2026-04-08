"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  DoorOpen,
  Power,
  PowerOff,
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import GridView from "@/components/ui/GridView";
import ViewToggle from "@/components/ui/ViewToggle";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ClassroomFormModal from "@/components/modules/ClassroomFormModal";
import { getClassrooms, upsertClassroom } from "@/lib/supabase/queries";
import { statusLabel } from "@/lib/utils";

export default function ClassroomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [initialMode, setInitialMode] = useState("create");

  useEffect(() => {
    getClassrooms().then((d) => {
      setRooms(d);
      setLoading(false);
    });
  }, []);

  const filtered = rooms.filter((r) => {
    const matchSearch = r.n_classrom
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? r.id_status === 1 : r.id_status !== 1);
    return matchSearch && matchStatus;
  });

  const openEdit = (row, e) => {
    e?.stopPropagation();
    setEditRoom(row);
    setInitialMode("edit");
    setModalOpen(true);
  };

  const openView = (row) => {
    setEditRoom(row);
    setInitialMode("view");
    setModalOpen(true);
  };

  const toggleStatus = async (row, e) => {
    e?.stopPropagation();
    const newStatus = row.id_status === 1 ? 2 : 1;
    try {
      const saved = await upsertClassroom({ ...row, id_status: newStatus });
      setRooms((prev) =>
        prev.map((p) => (p.id_classrom === saved.id_classrom ? saved : p)),
      );
    } catch (err) {
      console.error("Error toggling classroom status:", err);
    }
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: "n_classrom",
      header: "Room",
      width: "35%",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
            <DoorOpen size={16} />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {row.n_classrom}
          </p>
        </div>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (row) => (
        <div>
          <span className="text-sm font-medium text-slate-700">
            {row.capacity}
          </span>
          <span className="text-xs text-slate-400 ml-1">seats</span>
        </div>
      ),
    },
    {
      key: "id_status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.id_status === 1 ? "active" : "inactive"} dot>
          {statusLabel(row.id_status === 1)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "100px",
      render: (row) => {
        const isActive = row.id_status === 1;
        return (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => openEdit(row, e)}
              className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Edit Classroom"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={(e) => toggleStatus(row, e)}
              className={`p-1.5 rounded-md transition-colors ${
                isActive
                  ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              title={isActive ? "Deactivate" : "Activate"}
            >
              {isActive ? <PowerOff size={13} /> : <Power size={13} />}
            </button>
          </div>
        );
      },
    },
  ];

  // ── Grid card renderer ────────────────────────────────────────────────────
  const renderCard = (row) => {
    const isActive = row.id_status === 1;
    return (
      <div 
        className="group relative bg-white border border-slate-200 rounded-xl shadow-soft p-5 hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer"
        onClick={() => openView(row)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
              <DoorOpen size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {row.n_classrom}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Room #{row.id_classrom}
              </p>
            </div>
          </div>
          <Badge variant={isActive ? "active" : "inactive"} dot>
            {statusLabel(isActive)}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{row.capacity}</span>{" "}
            seats
          </span>
        </div>

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={(e) => openEdit(row, e)}
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 shadow-sm transition-colors"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={(e) => toggleStatus(row, e)}
            className={`p-1.5 rounded-md bg-white border shadow-sm transition-colors ${
              isActive
                ? "border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                : "border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
            }`}
            title={isActive ? "Deactivate" : "Activate"}
          >
            {isActive ? <PowerOff size={13} /> : <Power size={13} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <TopNav title="Classroom Directory" subtitle="Facilities" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="classrooms-search"
                name="classrooms-search"
                type="text"
                autoComplete="off"
                placeholder="Search rooms…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sc-input pl-9"
              />
            </div>
            {/* Status filter */}
            <div className="relative">
              <Filter
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                id="classrooms-status-filter"
                name="classrooms-status-filter"
                autoComplete="off"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="sc-input pl-8 pr-8 appearance-none bg-white min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {/* View toggle */}
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
          <Button
            onClick={() => {
              setEditRoom(null);
              setInitialMode("create");
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> Add Classroom
          </Button>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          {filtered.length} classroom{filtered.length !== 1 ? "s" : ""}
        </p>

        {viewMode === "list" ? (
          <Table
            columns={columns}
            data={filtered}
            loading={loading}
            emptyState="No classrooms found."
            onRowClick={(row) => openView(row)}
          />
        ) : (
          <GridView
            data={filtered}
            renderCard={renderCard}
            loading={loading}
            emptyState="No classrooms found."
          />
        )}
      </main>

      <ClassroomFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditRoom(null);
        }}
        classroom={editRoom}
        initialMode={initialMode}
        onSave={async (r) => {
          setLoading(true);
          try {
            const payload = editRoom ? { ...editRoom, ...r } : r;
            const saved = await upsertClassroom(payload);
            if (editRoom) {
              setRooms((prev) =>
                prev.map((p) =>
                  p.id_classrom === saved.id_classrom ? saved : p,
                ),
              );
            } else {
              setRooms((prev) => [...prev, saved]);
            }
          } catch (e) {
            console.error("Error saving classroom:", e);
          }
          setLoading(false);
        }}
      />
    </>
  );
}
