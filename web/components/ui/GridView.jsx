"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GridView — a paginated, responsive card grid that mirrors the Table API.
 *
 * Props:
 *   data          – array of row objects
 *   renderCard    – (row) => ReactNode  — caller-defined card markup
 *   loading       – boolean
 *   emptyState    – string shown when data is empty
 *   className     – extra classes on wrapper
 *   rowsPerPage   – cards per page (default 12)
 *   cols          – responsive col config class (default 3 columns on lg)
 */
export default function GridView({
  data = [],
  renderCard,
  loading = false,
  emptyState,
  className = "",
  rowsPerPage = 12,
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={cn(`grid gap-4 ${cols}`, className)}>
        {[...Array(rowsPerPage > 6 ? 6 : rowsPerPage)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-2.5 bg-slate-100 rounded w-1/3" />
              </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded w-full" />
            <div className="h-5 bg-slate-200 rounded-full w-16" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!data.length && emptyState) {
    return (
      <div className="w-full rounded-xl border border-slate-200 py-16 text-center">
        <p className="text-slate-400 text-sm">{emptyState}</p>
      </div>
    );
  }

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageData = data.slice(startIdx, startIdx + rowsPerPage);
  const goTo = (page) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const showPagination = data.length > rowsPerPage;

  return (
    <div className="space-y-4">
      <div className={cn(`grid gap-4 ${cols}`, className)}>
        {pageData.map((row, i) => (
          <div key={i}>{renderCard(row)}</div>
        ))}
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-1 py-2">
          <p className="text-xs text-slate-400 hidden sm:block">
            {startIdx + 1}–{Math.min(startIdx + rowsPerPage, data.length)} of{" "}
            {data.length}
          </p>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 1}
              className={cn(
                "p-1.5 rounded-lg border transition-colors",
                safePage === 1
                  ? "border-slate-100 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300",
              )}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs font-medium text-slate-600 px-1 tabular-nums">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => goTo(safePage + 1)}
              disabled={safePage === totalPages}
              className={cn(
                "p-1.5 rounded-lg border transition-colors",
                safePage === totalPages
                  ? "border-slate-100 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300",
              )}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
