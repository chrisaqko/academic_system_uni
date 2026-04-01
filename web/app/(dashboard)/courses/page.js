"use client";

import { useEffect, useState } from "react";
import { Plus, Search, LayoutGrid, List, Filter } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CourseFormModal from "@/components/modules/CourseFormModal";
import { getCourses } from "@/lib/supabase/queries";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    getCourses().then((d) => {
      setCourses(d);
      setLoading(false);
    });
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? c.id_status === 1 : c.id_status === 2);
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      key: "name",
      header: "Course",
      width: "40%",
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">
            COURSE-{String(row.id_course).padStart(3, "0")}
          </p>
        </div>
      ),
    },
    {
      key: "credits",
      header: "Credits",
      render: (row) => (
        <span className="text-sm font-medium text-slate-700">
          {row.credits}
        </span>
      ),
    },
    {
      key: "quota",
      header: "Quota",
      render: (row) => (
        <span className="text-sm text-slate-600">{row.quota} students</span>
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
      header: "",
      width: "80px",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditCourse(row);
            setModalOpen(true);
          }}
          className="text-xs text-primary-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <>
      <TopNav title="Course Catalog" subtitle="Academic Management" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search courses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sc-input pl-9"
              />
            </div>
            <div className="relative">
              <Filter
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="sc-input pl-8 pr-8 appearance-none bg-white min-w-[110px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {/* View toggle */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 ${viewMode === "table" ? "bg-primary-50 text-primary-600" : "text-slate-400 hover:bg-slate-50"} transition-colors`}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary-50 text-primary-600" : "text-slate-400 hover:bg-slate-50"} transition-colors`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditCourse(null);
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> Add Course
          </Button>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          {filtered.length} course{filtered.length !== 1 ? "s" : ""}
        </p>

        {viewMode === "table" ? (
          <Table
            columns={columns}
            data={filtered}
            loading={loading}
            emptyState="No courses found."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div
                key={c.id_course}
                className="bg-white border border-slate-200 rounded-xl shadow-soft p-5 hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setEditCourse(c);
                  setModalOpen(true);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="sc-label mb-0.5">
                      COURSE-{String(c.id_course).padStart(3, "0")}
                    </p>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {c.name}
                    </h4>
                  </div>
                  <Badge
                    variant={c.id_status === 1 ? "active" : "inactive"}
                    dot
                  >
                    {statusLabel(c.id_status === 1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>
                    <strong className="text-slate-700">{c.credits}</strong>{" "}
                    credits
                  </span>
                  <span>
                    <strong className="text-slate-700">{c.quota}</strong> quota
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <CourseFormModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditCourse(null);
          }}
          course={editCourse}
          onSave={(c) => {
            if (editCourse) {
              setCourses((prev) =>
                prev.map((p) =>
                  p.id_course === editCourse.id_course ? { ...p, ...c } : p,
                ),
              );
            } else {
              setCourses((prev) => [...prev, { ...c, id_course: Date.now() }]);
            }
          }}
        />
      </main>
    </>
  );
}
