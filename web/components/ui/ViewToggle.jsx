"use client";

import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ViewToggle — a compact List / Grid switcher button group.
 *
 * Props:
 *   value    – "list" | "grid"
 *   onChange – (value) => void
 */
export default function ViewToggle({ value, onChange }) {
  return (
    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0">
      <button
        onClick={() => onChange("list")}
        className={cn(
          "p-2 transition-colors",
          value === "list"
            ? "bg-primary-50 text-primary-600"
            : "text-slate-400 hover:bg-slate-50",
        )}
        title="List view"
        aria-label="List view"
      >
        <List size={14} />
      </button>
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "p-2 transition-colors",
          value === "grid"
            ? "bg-primary-50 text-primary-600"
            : "text-slate-400 hover:bg-slate-50",
        )}
        title="Grid view"
        aria-label="Grid view"
      >
        <LayoutGrid size={14} />
      </button>
    </div>
  );
}
