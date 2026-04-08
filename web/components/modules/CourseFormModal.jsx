"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function CourseFormModal({
  isOpen,
  onClose,
  course = null,
  onSave,
  programs = [],
  courses = [],
  selectedPrograms = [],
  selectedRelatedCourses = [],
  initialMode = "create",
}) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: course?.name || "",
    credits: course?.credits ?? 3,
    quota: course?.quota ?? 30,
    id_status: parseInt(course?.id_status) || 1,
  });
  const [programSelection, setProgramSelection] = useState(selectedPrograms);
  const [relatedSelection, setRelatedSelection] = useState(
    selectedRelatedCourses,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [newReq, setNewReq] = useState({ course: "", relation: "requisite" });
  const [newReqError, setNewReqError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setForm({
        name: course?.name || "",
        credits: course?.credits ?? 3,
        quota: course?.quota ?? 30,
        id_status: course?.id_status === 2 ? 2 : 1,
      });
      setProgramSelection(selectedPrograms || []);
      setRelatedSelection(selectedRelatedCourses || []);
      setErrors({});
      setNewReq({ course: "", relation: "requisite" });
      setNewReqError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, course, initialMode, selectedPrograms, selectedRelatedCourses]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Course name is required";
    if (form.credits < 0 || form.credits > 12)
      e.credits = "Credits must be 0-12";
    if (form.quota < 1) e.quota = "Quota must be at least 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave?.(
      { ...form, credits: Number(form.credits), quota: Number(form.quota) },
      programSelection,
      relatedSelection,
    );
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "view"
          ? "Course Details"
          : mode === "edit"
            ? "Edit Course"
            : "Add New Course"
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Course Name"
          id="courseName"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
          placeholder="e.g. Advanced Architecture"
          disabled={mode === "view"}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Credits"
            id="credits"
            type="number"
            min="0"
            max="12"
            value={form.credits}
            onChange={(e) => update("credits", e.target.value)}
            error={errors.credits}
            disabled={mode === "view"}
          />
          <Input
            label="Quota (max students)"
            id="quota"
            type="number"
            min="1"
            value={form.quota}
            onChange={(e) => update("quota", e.target.value)}
            error={errors.quota}
            disabled={mode === "view"}
          />
        </div>
        <Select
          label="Status"
          id="courseStatus"
          value={form.id_status}
          onChange={(e) => update("id_status", Number(e.target.value))}
          options={[
            { value: 1, label: "Active" },
            { value: 2, label: "Inactive" },
          ]}
          disabled={mode === "view"}
        />

        {(programs || []).length > 0 && (
          <div className="flex flex-col gap-1" ref={dropdownRef}>
            <label className="text-xs font-medium text-slate-600">
              Programs
            </label>
            <div className="relative">
              <div
                className={`sc-input bg-white min-h-[42px] cursor-pointer flex flex-wrap items-center gap-1.5 py-1.5 pr-8 ${mode === "view" ? "opacity-70 pointer-events-none bg-slate-50" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {(programSelection || []).length > 0 ? (
                  (programSelection || []).map((id) => {
                    const prog = (programs || []).find(
                      (p) => p.id_program === id,
                    );
                    if (!prog) return null;
                    return (
                      <span
                        key={id}
                        className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        {prog.career_name}
                        {mode !== "view" && (
                          <span
                            className="hover:text-primary-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProgramSelection((prev) =>
                                (prev || []).filter((pid) => pid !== id),
                              );
                            }}
                          >
                            <X size={12} />
                          </span>
                        )}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-slate-400 text-sm ml-1 py-0.5">
                    Select programs...
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>

              {dropdownOpen && mode !== "view" && (
                <div className="absolute z-10 top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-card max-h-60 overflow-y-auto py-1">
                  {(programs || []).map((p) => {
                    const isSelected = (programSelection || []).includes(
                      p.id_program,
                    );
                    return (
                      <div
                        key={p.id_program}
                        onClick={() => {
                          if (isSelected) {
                            setProgramSelection((prev) =>
                              (prev || []).filter((id) => id !== p.id_program),
                            );
                          } else {
                            setProgramSelection((prev) => [
                              ...(prev || []),
                              p.id_program,
                            ]);
                          }
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${isSelected ? "text-primary-600 bg-primary-50 hover:bg-primary-50" : "text-slate-700"}`}
                      >
                        <span className="font-medium">{p.career_name}</span>
                        <input
                          type="checkbox"
                          className="sc-checkbox pointer-events-none"
                          checked={isSelected}
                          readOnly
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requirements Section */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
          <label className="text-xs font-medium text-slate-600">
            Requisites & Correquisites
          </label>
          {relatedSelection.length > 0 ? (
            <div className="flex flex-col gap-2">
              {relatedSelection.map((rel, idx) => {
                const reqCourse = courses.find(
                  (c) => c.id_course === rel.id_required_course,
                );
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">
                        {reqCourse ? reqCourse.name : "Unknown Course"}
                      </span>
                      <span className="text-xs text-slate-500 capitalize">
                        {rel.relation}
                      </span>
                    </div>
                    {mode !== "view" && (
                      <button
                        type="button"
                        onClick={() =>
                          setRelatedSelection((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic mb-1">
              No requirements added.
            </p>
          )}

          {mode !== "view" && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex gap-2 items-start">
                <Select
                  value={newReq.course}
                  onChange={(e) => {
                    setNewReq((prev) => ({ ...prev, course: e.target.value }));
                    if (newReqError) setNewReqError("");
                  }}
                  containerClassName="flex-1"
                  options={[
                    { value: "", label: "Select course..." },
                    ...courses
                      .filter(
                        (c) =>
                          c.id_course !== course?.id_course &&
                          !relatedSelection.find(
                            (r) => r.id_required_course === c.id_course,
                          ),
                      )
                      .map((c) => ({ value: c.id_course, label: c.name })),
                  ]}
                  error={newReqError}
                />
                <Select
                  value={newReq.relation}
                  onChange={(e) =>
                    setNewReq((prev) => ({ ...prev, relation: e.target.value }))
                  }
                  options={[
                    { value: "requisite", label: "Requisite" },
                    { value: "correquisite", label: "Correquisite" },
                  ]}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className={newReqError ? "mt-0" : ""} // Align adjustments if error shows
                  onClick={() => {
                    if (!newReq.course) {
                      setNewReqError("Please select a course");
                      return;
                    }
                    setRelatedSelection((prev) => [
                      ...prev,
                      {
                        id_required_course: parseInt(newReq.course),
                        relation: newReq.relation,
                        id_status: 1,
                      },
                    ]);
                    setNewReq({ course: "", relation: "requisite" });
                    setNewReqError("");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            {mode === "view" ? "Close" : "Cancel"}
          </Button>
          {mode === "view" ? (
            <Button type="button" onClick={() => setMode("edit")}>
              Edit Info
            </Button>
          ) : (
            <Button type="submit" loading={saving}>
              {mode === "edit" ? "Save Changes" : "Create Course"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
