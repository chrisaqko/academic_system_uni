"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  Eye,
  Edit2,
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CourseFormModal from "@/components/modules/CourseFormModal";
import {
  getCourses,
  getProgramOptions,
  getCoursesByProgram,
  upsertCourse,
  updateCoursePrograms,
  getRelatedCourses,
  updateRelatedCourses,
} from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import { statusLabel } from "@/lib/utils";

const EMPTY_ARRAY = [];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editCourse, setEditCourse] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [courseProgramsMap, setCourseProgramsMap] = useState({});
  const [relatedCoursesMap, setRelatedCoursesMap] = useState({});

  useEffect(() => {
    Promise.all([
      getCourses(),
      getProgramOptions(),
      getCoursesByProgram(),
      getRelatedCourses(),
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
    const matchSearch = (c.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "inactive" ? c.id_status === 2 : c.id_status === 1);

    const matchProgram =
      programFilter === "all" ||
      (courseProgramsMap[c.id_course] &&
        courseProgramsMap[c.id_course].includes(parseInt(programFilter)));
    return matchSearch && matchStatus && matchProgram;
  });

  const toggleCourseStatus = async (course) => {
    const newStatus = course.id_status === 1 ? 2 : 1;
    setLoading(true);
    try {
      const updated = await upsertCourse({ ...course, id_status: newStatus });
      setCourses((prev) =>
        prev.map((p) => (p.id_course === updated.id_course ? updated : p)),
      );
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

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
        <Badge variant={row.id_status === 1 ? "active" : "inactive"}>
          {statusLabel(row.id_status === 1)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "160px",
      render: (row) => (
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditCourse(row);
              setModalMode("view");
              setModalOpen(true);
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditCourse(row);
              setModalMode("edit");
              setModalOpen(true);
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit Course"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCourseStatus(row);
            }}
            className="text-xs ml-1 px-2 py-1 text-slate-500 font-medium hover:text-primary-600 hover:bg-slate-100 rounded transition-colors"
          >
            {Number(row.id_status) === 1 ? "Disable" : "Enable"}
          </button>
        </div>
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
            <div className="relative">
              <Filter
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
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

        {viewMode === "table" ? (
          <Table
            columns={columns}
            data={filtered}
            loading={loading}
            emptyState="No courses found."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c, index) => (
              <div
                key={c?.id_course || `course-temp-${index}`}
                className="bg-white border border-slate-200 rounded-xl shadow-soft p-5 hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  setEditCourse(c);
                  setModalMode("view");
                  setModalOpen(true);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="sc-label mb-0.5">
                      COURSE-{String(c.id_course || 0).padStart(3, "0")}
                    </p>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {c.name || "Untitled Course"}
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
              updatedCourse = await upsertCourse(payload);

              setCourses((prev) =>
                prev.map((p) =>
                  p.id_course === editCourse.id_course ? updatedCourse : p,
                ),
              );
            } else {
              updatedCourse = await upsertCourse(c);
              setCourses((prev) => [...prev, updatedCourse]);
            }

            await updateCoursePrograms(
              updatedCourse.id_course,
              selectedProgramIds,
            );
            await updateRelatedCourses(
              updatedCourse.id_course,
              relatedSelection
            );

            // Re-fetch courses limits maps and related courses map
            const cp = await getCoursesByProgram();
            const cpMap = {};
            cp.forEach((link) => {
              if (!cpMap[link.id_course]) cpMap[link.id_course] = [];
              cpMap[link.id_course].push(link.id_program);
            });
            setCourseProgramsMap(cpMap);
            
            const rc = await getRelatedCourses();
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
