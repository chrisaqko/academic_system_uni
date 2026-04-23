"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  BookOpen,
  Power,
  PowerOff,
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import GridView from "@/components/ui/GridView";
import ViewToggle from "@/components/ui/ViewToggle";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CourseFormModal from "@/components/modules/CourseFormModal";
import { CourseService } from "@/lib/services/CourseService";
import { statusLabel } from "@/lib/utils";

const EMPTY_ARRAY = [];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editCourse, setEditCourse] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [courseProgramsMap, setCourseProgramsMap] = useState({});
  const [relatedCoursesMap, setRelatedCoursesMap] = useState({});

  useEffect(() => {
    Promise.all([
      CourseService.getAll(),
      CourseService.getProgramOptions(),
      CourseService.getCoursesByProgram(),
      CourseService.getRelatedCourses(),
    ]).then(([coursesData, programsData, coursesProgramData, relatedCoursesData]) => {
      setCourses(coursesData);
      setPrograms(programsData);

      const cpMap = {};
      coursesProgramData.forEach((cp) => {
        if (!cpMap[cp.id_course]) cpMap[cp.id_course] = [];
        cpMap[cp.id_course].push(cp.id_program);
      });
      setCourseProgramsMap(cpMap);

      const rcMap = {};
      relatedCoursesData.forEach((rc) => {
        if (!rcMap[rc.id_course]) rcMap[rc.id_course] = [];
        rcMap[rc.id_course].push(rc);
      });
      setRelatedCoursesMap(rcMap);

      setLoading(false);
    });
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch = (c.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "inactive" ? c.id_status === 2 : c.id_status === 1);
    const matchProgram =
      programFilter === "all" ||
      (courseProgramsMap[c.id_course] &&
        courseProgramsMap[c.id_course].includes(parseInt(programFilter)));
    return matchSearch && matchStatus && matchProgram;
  });

  const toggleCourseStatus = async (course, e) => {
    e?.stopPropagation();
    const newStatus = course.id_status === 1 ? 2 : 1;
    setLoading(true);
    try {
      const updated = await CourseService.upsert({ ...course, id_status: newStatus });
      setCourses((prev) =>
        prev.map((p) => (p.id_course === updated.id_course ? updated : p)),
      );
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const openEdit = (row, e) => {
    e?.stopPropagation();
    setEditCourse(row);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (row, e) => {
    e?.stopPropagation();
    setEditCourse(row);
    setModalMode("view");
    setModalOpen(true);
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: "name",
      header: "Course",
      width: "40%",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600 shrink-0">
            <BookOpen size={15} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-400">
              COURSE-{String(row.id_course).padStart(3, "0")}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "credits",
      header: "Credits",
      render: (row) => (
        <span className="text-sm font-medium text-slate-700">{row.credits}</span>
      ),
    },
    {
      key: "quota",
      header: "Quota",
      render: (row) => (
        <div>
          <span className="text-sm font-medium text-slate-700">{row.quota}</span>
          <span className="text-xs text-slate-400 ml-1">students</span>
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
      width: "130px",
      render: (row) => {
        const isActive = row.id_status === 1;
        return (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => openView(row, e)}
              className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="View Details"
            >
              <Eye size={13} />
            </button>
            <button
              onClick={(e) => openEdit(row, e)}
              className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Edit Course"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={(e) => toggleCourseStatus(row, e)}
              className={`p-1.5 rounded-md transition-colors ${
                isActive
                  ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              title={isActive ? "Disable" : "Enable"}
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
    const linkedPrograms = courseProgramsMap[row.id_course];
    return (
      <div
        className="group relative bg-white border border-slate-200 rounded-xl shadow-soft p-5 hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer"
        onClick={() => openView(row)}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600 shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {row.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              COURSE-{String(row.id_course).padStart(3, "0")}
            </p>
          </div>
          <Badge variant={isActive ? "active" : "inactive"} dot>
            {statusLabel(isActive)}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>
            <span className="font-semibold text-slate-700">{row.credits}</span> credits
          </span>
          <span>
            <span className="font-semibold text-slate-700">{row.quota}</span> quota
          </span>
          {linkedPrograms?.length > 0 && (
            <span className="ml-auto text-xs text-slate-400">
              {linkedPrograms.length} program{linkedPrograms.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Hover action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={(e) => openView(row, e)}
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm transition-colors"
            title="View Details"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={(e) => openEdit(row, e)}
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 shadow-sm transition-colors"
            title="Edit Course"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={(e) => toggleCourseStatus(row, e)}
            className={`p-1.5 rounded-md bg-white border shadow-sm transition-colors ${
              isActive
                ? "border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                : "border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
            }`}
            title={isActive ? "Disable" : "Enable"}
          >
            {isActive ? <PowerOff size={13} /> : <Power size={13} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <TopNav title="Course Catalog" subtitle="Academic Management" />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto flex-wrap">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="courses-search"
                name="courses-search"
                type="text"
                autoComplete="off"
                placeholder="Search courses…"
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
                id="courses-status-filter"
                name="courses-status-filter"
                autoComplete="off"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="sc-input pl-8 pr-8 appearance-none bg-white min-w-[110px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {/* Program filter */}
            <div className="relative">
              <Filter
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                id="courses-program-filter"
                name="courses-program-filter"
                autoComplete="off"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="sc-input pl-8 pr-8 appearance-none bg-white min-w-[130px] max-w-[200px] truncate"
              >
                <option value="all">All Programs</option>
                {programs.map((p) => (
                  <option key={p.id_program} value={p.id_program}>
                    {p.career_name}
                  </option>
                ))}
              </select>
            </div>
            {/* View toggle */}
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
          <Button
            onClick={() => {
              setEditCourse(null);
              setModalMode("create");
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> Add Course
          </Button>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          {filtered.length} course{filtered.length !== 1 ? "s" : ""}
        </p>

        {viewMode === "list" ? (
          <Table
            columns={columns}
            data={filtered}
            loading={loading}
            emptyState="No courses found."
          />
        ) : (
          <GridView
            data={filtered}
            renderCard={renderCard}
            loading={loading}
            emptyState="No courses found."
          />
        )}
      </main>

      <CourseFormModal
        isOpen={modalOpen}
        initialMode={modalMode}
        onClose={() => {
          setModalOpen(false);
          setEditCourse(null);
        }}
        course={editCourse}
        programs={programs}
        courses={courses}
        selectedPrograms={
          editCourse && courseProgramsMap[editCourse.id_course]
            ? courseProgramsMap[editCourse.id_course]
            : EMPTY_ARRAY
        }
        selectedRelatedCourses={
          editCourse && relatedCoursesMap[editCourse.id_course]
            ? relatedCoursesMap[editCourse.id_course]
            : EMPTY_ARRAY
        }
        onSave={async (c, selectedProgramIds, relatedSelection) => {
          setLoading(true);
          try {
            let updatedCourse;
            if (editCourse) {
              const payload = { ...editCourse, ...c };
              delete payload.courses_program;
              updatedCourse = await CourseService.upsert(payload);
              setCourses((prev) =>
                prev.map((p) =>
                  p.id_course === editCourse.id_course ? updatedCourse : p,
                ),
              );
            } else {
              updatedCourse = await CourseService.upsert(c);
              setCourses((prev) => [...prev, updatedCourse]);
            }

            await CourseService.updatePrograms(updatedCourse.id_course, selectedProgramIds);
            await CourseService.updateRelatedCourses(updatedCourse.id_course, relatedSelection);

            const cp = await CourseService.getCoursesByProgram();
            const cpMap = {};
            cp.forEach((link) => {
              if (!cpMap[link.id_course]) cpMap[link.id_course] = [];
              cpMap[link.id_course].push(link.id_program);
            });
            setCourseProgramsMap(cpMap);

            const rc = await CourseService.getRelatedCourses();
            const rcMap = {};
            rc.forEach((relation) => {
              if (!rcMap[relation.id_course]) rcMap[relation.id_course] = [];
              rcMap[relation.id_course].push(relation);
            });
            setRelatedCoursesMap(rcMap);
          } catch (e) {
            console.error(e);
          }
          setLoading(false);
        }}
      />
    </>
  );
}
