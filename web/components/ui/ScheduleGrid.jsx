import React, { useMemo } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Base 2-hour time slots starting from 07:00 AM as requested, plus the 12:00 PM break.
const TIME_SLOTS = [
  { id: "07:00-09:00", time: "07:00", period: "AM" },
  { id: "09:00-11:00", time: "09:00", period: "AM" },
  { id: "11:00-13:00", time: "11:00", period: "AM" },
  { id: "break", time: "12:00", period: "PM", isBreak: true },
  { id: "13:00-15:00", time: "01:00", period: "PM" },
  { id: "15:00-17:00", time: "03:00", period: "PM" },
  { id: "17:00-19:00", time: "05:00", period: "PM" },
  { id: "19:00-21:00", time: "07:00", period: "PM" },
];

/**
 * Utility to normalize string day from DB to match our DAYS array.
 */
const normalizeDay = (dayStr) => {
  if (!dayStr) return "";
  const lower = dayStr.toLowerCase().trim();
  const matchedDay = DAYS.find((d) => d.toLowerCase() === lower);
  return matchedDay || dayStr;
};

/**
 * Determine the visual style of the card based on course type/name.
 */
const getCardStyle = (item) => {
  const name = (item.course_name || "").toLowerCase();
  const type = (item.type || "").toLowerCase();

  // If it's a lab, use the purple styling
  if (name.includes("lab") || type === "lab" || item.is_lab) {
    return {
      wrapper: "border-l-2 border-l-purple-500 bg-purple-50",
      title: "text-purple-800",
      subtitle: "text-purple-600",
      badge: "text-purple-700 bg-purple-100",
    };
  }

  // Default light blue styling for active classes
  return {
    wrapper: "border-l-2 border-l-primary-500 bg-primary-50",
    title: "text-primary-800",
    subtitle: "text-primary-600",
    badge: "text-primary-700 bg-primary-100",
  };
};

export default function ScheduleGrid({ schedules = [] }) {
  // Build the matrix: matrix[timeSlotId][dayName] = scheduleItem
  const matrix = useMemo(() => {
    const mat = {};
    TIME_SLOTS.forEach((slot) => {
      mat[slot.id] = {};
      DAYS.forEach((day) => {
        mat[slot.id][day] = null; // Initialize with empty slots
      });
    });

    schedules.forEach((item) => {
      const day = normalizeDay(item.week_day);
      const shift = item.shift; // e.g. "07:00-09:00"

      if (mat[shift] !== undefined && mat[shift][day] !== undefined) {
        mat[shift][day] = item;
      }
    });

    return mat;
  }, [schedules]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-soft overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="grid grid-cols-6 border-b border-slate-100">
          <div className="py-4 px-4 flex items-center justify-center border-r border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Time
            </span>
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-4 px-4 flex items-center justify-center border-r border-slate-50 last:border-0"
            >
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Time Slots Rows */}
        <div className="flex flex-col">
          {TIME_SLOTS.map((slot, index) => {
            const isLastRow = index === TIME_SLOTS.length - 1;
            
            // Render Break Row
            if (slot.isBreak) {
              return (
                <div
                  key={slot.id}
                  className={`grid grid-cols-6 bg-slate-50/50 ${
                    !isLastRow ? "border-b border-slate-50" : ""
                  }`}
                >
                  <div className="py-6 flex flex-col items-center justify-center border-r border-slate-50">
                    <span className="text-sm font-black text-slate-500">
                      {slot.time}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {slot.period}
                    </span>
                  </div>
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="py-6 flex items-center justify-center border-r border-slate-50 last:border-0"
                    >
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        Break
                      </span>
                    </div>
                  ))}
                </div>
              );
            }

            // Render Standard Class Row
            return (
              <div
                key={slot.id}
                className={`grid grid-cols-6 ${
                  !isLastRow ? "border-b border-slate-50" : ""
                }`}
              >
                {/* Time Column */}
                <div className="py-6 flex flex-col items-center justify-center border-r border-slate-50">
                  <span className="text-sm font-black text-slate-500">
                    {slot.time}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {slot.period}
                  </span>
                </div>

                {/* Days Columns */}
                {DAYS.map((day) => {
                  const item = matrix[slot.id][day];

                  return (
                    <div
                      key={day}
                      className="p-2 border-r border-slate-50 last:border-0 min-h-[120px]"
                    >
                      {item ? (
                        <div
                          className={`h-full rounded-md p-3 flex flex-col justify-between ${
                            getCardStyle(item).wrapper
                          }`}
                        >
                          <div>
                            <p
                              className={`text-[11px] font-black uppercase tracking-wider mb-1 line-clamp-2 ${
                                getCardStyle(item).title
                              }`}
                            >
                              {item.course_name || "Untitled Course"}
                            </p>
                            <p
                              className={`text-[10px] font-medium ${
                                getCardStyle(item).subtitle
                              }`}
                            >
                              {item.room || "TBA"} | {item.professor || "TBA"}
                            </p>
                          </div>
                          
                          {item.status === "active" && (
                            <div className="mt-2">
                              <span
                                className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                                  getCardStyle(item).badge
                                }`}
                              >
                                Active
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full w-full rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 flex items-center justify-center">
                          {/* Empty slot placeholder (optional hover effect) */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
