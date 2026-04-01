"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { cn, slotColor } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ALL_SHIFTS = [
  "08:00 - 09:30",
  "10:00 - 11:30",
  "11:30 - 13:00",
  "14:00 - 15:30",
  "16:00 - 17:30",
];

const SLOT_CLASSES = {
  blue:    "schedule-slot schedule-slot-blue",
  violet:  "schedule-slot schedule-slot-violet",
  emerald: "schedule-slot schedule-slot-emerald",
  amber:   "schedule-slot schedule-slot-amber",
  rose:    "schedule-slot schedule-slot-rose",
};

// ── Skeleton cell ──────────────────────────────────────────────────────────
function SkeletonCell() {
  return (
    <div className="animate-pulse bg-slate-100 rounded-md h-12 w-full" />
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ScheduleGrid({
  entries = [],
  title = "Academic Schedule",
  loading = false,
}) {
  const { profile } = useAuth();

  // ── Build lookup: { [shift]: { [day]: entry[] } } ──────────────────────
  const grid = {};
  ALL_SHIFTS.forEach((shift) => {
    grid[shift] = {};
    DAYS.forEach((day) => { grid[shift][day] = []; });
  });

  entries.forEach((e, idx) => {
    const shift = e.schedule?.shift;
    const day   = e.schedule?.week_day;
    if (shift && day && grid[shift]?.[day] !== undefined) {
      grid[shift][day].push({ ...e, _idx: idx });
    }
  });

  // ── Color mapping per course ───────────────────────────────────────────
  const courseColorMap = {};
  let colorIdx = 0;
  entries.forEach((e) => {
    if (e.id_course && !courseColorMap[e.id_course]) {
      courseColorMap[e.id_course] = slotColor(colorIdx++);
    }
  });

  // ── Viewer label (role-aware) ──────────────────────────────────────────
  const roleLabel = {
    admin:   "Administrator view",
    teacher: "Faculty view",
    student: "Student view",
  };
  const viewerLabel = profile
    ? `${[profile.name, profile.surname].filter(Boolean).join(" ")} · ${roleLabel[profile.user_type] ?? profile.user_type}`
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-soft overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {viewerLabel && (
            <p className="text-[11px] text-slate-400 mt-0.5">{viewerLabel}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!loading && entries.length > 0 && (
            <span className="text-xs text-slate-400">
              {entries.length} slot{entries.length !== 1 ? "s" : ""}
            </span>
          )}
          {loading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-3 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin" />
              Loading…
            </span>
          )}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-20 px-4 py-3 text-left sc-label">Time</th>
              {DAYS.map((d) => (
                <th key={d} className="px-3 py-3 text-left sc-label">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_SHIFTS.map((shift, si) => (
              <tr
                key={shift}
                className={cn(
                  "border-b border-slate-50",
                  si % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                )}
              >
                {/* Time label */}
                <td className="px-4 py-3 align-top">
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {shift.split(" - ")[0]}
                  </span>
                </td>

                {DAYS.map((day) => {
                  const cellEntries = grid[shift][day];
                  return (
                    <td key={day} className="px-2 py-2 align-top min-w-[140px]">
                      {loading ? (
                        // Skeleton: only show in first 2 shifts to avoid huge layout
                        si < 2 ? <SkeletonCell /> : null
                      ) : cellEntries.length === 0 ? (
                        <span className="block text-[10px] text-slate-200 text-center py-1">—</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {cellEntries.map((e, i) => {
                            const color     = courseColorMap[e.id_course] || "blue";
                            const courseName = e.course?.name || "Course";
                            const roomName   = e.classrom?.n_classrom || "";
                            const teacher    = e.teacher
                              ? `${e.teacher.name ?? ""} ${e.teacher.surname ?? ""}`.trim()
                              : e.profile
                                ? `${e.profile.name ?? ""} ${e.profile.surname ?? ""}`.trim()
                                : "";
                            const shortName  =
                              courseName.length > 22
                                ? courseName.slice(0, 20) + "…"
                                : courseName;

                            return (
                              <div key={i} className={SLOT_CLASSES[color]}>
                                <p className="font-semibold leading-tight text-[11px]">{shortName}</p>
                                {roomName && (
                                  <p className="text-[10px] opacity-70 mt-0.5">{roomName}</p>
                                )}
                                {teacher && (
                                  <p className="text-[10px] opacity-60 mt-0.5 truncate">{teacher}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {!loading && entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-semibold text-slate-400">No schedule data</p>
          <p className="text-xs text-slate-300 mt-1">Classes will appear here once assigned</p>
        </div>
      )}
    </div>
  );
}
