"use client";

/**
 * FacultyDetailModal — Displays a professor's assigned course modules.
 *
 * SOLID (SRP): Extracted from schedules/page.js so the page component
 * only handles page-level layout and routing, while this modal owns
 * its own presentation logic.
 *
 * SOLID (ISP): Accepts lean, specific props instead of a monolithic
 * "faculty" object. Callers only pass what this component needs.
 */
import { BookOpen, Calendar, MapPin, Trash2, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

export default function FacultyDetailModal({
  teacherName,
  teacherEmail,
  allocations = [],
  isOpen,
  onClose,
  onDeleteAllocation,
  onAddSchedule,
}) {
  if (!teacherName && !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Faculty Schedule Details"
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <Avatar
              name={teacherName?.split(" ")[0] ?? ""}
              surname={
                teacherName?.split(" ").slice(1).join(" ") ?? ""
              }
              size="lg"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {teacherName}
              </h2>
              <p className="text-sm text-slate-500">{teacherEmail}</p>
            </div>
          </div>
          <Button size="sm" onClick={onAddSchedule}>
            <Plus size={14} />
            Assign Module
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 px-1">
            Active Course Modules
          </h3>

          <div className="grid gap-3">
            {allocations.map((alloc) => (
              <div
                key={alloc.id_allocation}
                className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-primary-200 transition-all hover:shadow-soft"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {alloc.course_name}
                      </p>
                      <Badge
                        variant={
                          alloc.allocation_status === 1 ? "active" : "pending"
                        }
                        dot
                      >
                        {alloc.allocation_status_label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 uppercase font-bold text-[10px] text-slate-400">
                        <Calendar size={10} /> {alloc.week_day} · {alloc.shift}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> {alloc.room_name}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteAllocation(alloc)}
                  className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove allocation"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {allocations.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400">
                  No active assignments for this professor.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
