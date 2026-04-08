"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  BookOpen,
  Calendar,
  MapPin,
  AlertCircle,
  Loader2,
  Power,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  getFacultyOptions,
  getCourses,
  getScheduleOptions,
  getClassrooms,
  getStatusOptions,
  createAllocation,
} from "@/lib/supabase/queries";

const EMPTY = {
  id_profile: "",
  id_course: "",
  id_schedule: "",
  id_classrom: "",
  id_status: 1,
};

export default function AssignFacultyModal({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  // Dropdown option lists
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [optsLoading, setOptsLoading] = useState(false);

  // ── Load dropdown data once when the modal opens ────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setForm(EMPTY);
    setError(null);
    setOptsLoading(true);

    Promise.all([
      getFacultyOptions(),
      getCourses(),
      getScheduleOptions(),
      getClassrooms(),
      getStatusOptions(),
    ])
      .then(([f, c, s, r, st]) => {
        setFaculty(f);
        setCourses(c);
        setSlots(s);
        setClassrooms(r);
        setStatus(st);
      })
      .catch((err) => setError(err.message))
      .finally(() => setOptsLoading(false));
  }, [isOpen]);

  // ── Availability hint: triggers whenever faculty + schedule both set ─────────
  useEffect(() => {
    if (!form.id_profile || !form.id_schedule) {
      setChecking(false);
      return;
    }
    setChecking(true);
    const timer = setTimeout(() => setChecking(false), 600); // simulated debounce
    return () => clearTimeout(timer);
  }, [form.id_profile, form.id_schedule]);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = Object.entries(form)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length) {
      setError("Please fill in all fields before assigning.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createAllocation({
        id_profile: form.id_profile,
        id_course: form.id_course,
        id_schedule: form.id_schedule,
        id_classrom: form.id_classrom,
        id_status: form.id_status,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      // Log properties explicitly so they are visible in the console
      console.error("[AssignFacultyModal] Assignment error details:", {
        message: err.message,
        code: err.code,
        details: err.details,
      });
      console.error(err); // Full error for stack trace

      const friendly =
        err.code === "CONFLICT_CLASSROOM"
          ? "That classroom is already booked for this time slot."
          : err.code === "CONFLICT_TEACHER"
            ? "This faculty member already has a class at this time."
            : `System Error: ${err.message}. Please try again later.`;
      setError(friendly);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Faculty" size="md">
      <p className="text-xs text-slate-500 -mt-2 mb-5">
        Allocate a curated expert to a specific course module.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Faculty Member ───────────────────────────────────────────────── */}
        <div>
          <label className="sc-label flex items-center gap-1.5 mb-1.5">
            <UserCheck size={12} />
            Faculty Member
          </label>
          <div className="relative">
            <UserCheck
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              id="assign-faculty-member"
              name="assign-faculty-member"
              autoComplete="off"
              value={form.id_profile}
              onChange={set("id_profile")}
              disabled={optsLoading}
              className="sc-input pl-8 pr-8 appearance-none bg-white w-full"
            >
              <option value="">
                {optsLoading ? "Loading faculty…" : "Select a faculty member…"}
              </option>
              {faculty.map((f) => (
                <option key={f.id_profile} value={f.id_profile}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability hint */}
          {checking && form.id_profile && form.id_schedule && (
            <p className="mt-1.5 text-[11px] text-amber-600 flex items-center gap-1">
              <Loader2 size={10} className="animate-spin" />
              Checking faculty availability for the selected time slot…
            </p>
          )}
        </div>

        {/* ── Course + Schedule ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="sc-label flex items-center gap-1.5 mb-1.5">
              <BookOpen size={12} />
              Course Module
            </label>
            <div className="relative">
              <BookOpen
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                id="assign-course"
                name="assign-course"
                autoComplete="off"
                value={form.id_course}
                onChange={set("id_course")}
                disabled={optsLoading}
                className="sc-input pl-8 pr-8 appearance-none bg-white w-full"
              >
                <option value="">
                  {optsLoading ? "Loading…" : "Select course…"}
                </option>
                {courses.map((c) => (
                  <option key={c.id_course} value={c.id_course}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="sc-label flex items-center gap-1.5 mb-1.5">
              <Calendar size={12} />
              Schedule Slot
            </label>
            <div className="relative">
              <select
                id="assign-schedule"
                name="assign-schedule"
                autoComplete="off"
                value={form.id_schedule}
                onChange={set("id_schedule")}
                disabled={optsLoading}
                className="sc-input pl-8 pr-8 appearance-none bg-white w-full"
              >
                <option value="">
                  {optsLoading ? "Loading…" : "Select slot…"}
                </option>
                {slots.map((s) => (
                  <option key={s.id_schedule} value={s.id_schedule}>
                    {s.week_day} - {s.shift}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Location ─────────────────────────────────────────────────────── */}
        <div>
          <label className="sc-label flex items-center gap-1.5 mb-1.5">
            <MapPin size={12} />
            Location / Room
          </label>
          <div className="relative">
            <MapPin
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              id="assign-classroom"
              name="assign-classroom"
              autoComplete="off"
              value={form.id_classrom}
              onChange={set("id_classrom")}
              disabled={optsLoading}
              className="sc-input pl-8 pr-8 appearance-none bg-white w-full"
            >
              <option value="">
                {optsLoading ? "Loading…" : "Select room…"}
              </option>
              {classrooms.map((r) => (
                <option key={r.id_classrom} value={r.id_classrom}>
                  {r.n_classrom}
                  {r.capacity ? ` (cap. ${r.capacity})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Status ────────────────────────────────────────────────────────── */}
        <div>
          <label className="sc-label flex items-center gap-1.5 mb-1.5">
            <Power size={12} />
            Allocation Status
          </label>
          <div className="relative">
            <Power
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              id="assign-status"
              name="assign-status"
              autoComplete="off"
              value={form.id_status}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  id_status: parseInt(e.target.value),
                }));
                setError(null);
              }}
              disabled={optsLoading}
              className="sc-input pl-8 pr-8 appearance-none bg-white w-full"
            >
              {status.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Conflict / error banner ───────────────────────────────────────── */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-700">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            loading={saving}
            disabled={saving || optsLoading}
          >
            {saving ? "Assigning…" : "Assign Faculty"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
