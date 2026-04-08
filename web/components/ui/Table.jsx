"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyState,
  onRowClick,
  className = "",
  rowsPerPage = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the data set changes (search/filter applied)
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className={cn(
          "w-full rounded-xl border border-slate-200 overflow-hidden",
          className,
        )}
      >
        <div className="min-w-full divide-y divide-slate-100">
          {[...Array(rowsPerPage)].map((_, i) => (
            <div key={i} className="flex gap-4 px-5 py-3.5 animate-pulse">
              <div className="w-8 h-8 bg-slate-200 rounded-full" />
              <div className="flex-1 space-y-1.5 py-1">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="h-5 bg-slate-200 rounded-full w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!data.length && emptyState) {
    return (
      <div
        className={cn(
          "w-full rounded-xl border border-slate-200 py-16 text-center",
          className,
        )}
      >
        <p className="text-slate-400 text-sm">{emptyState}</p>
      </div>
    );
  }

  // ── Pagination calculations ──────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageData = data.slice(startIdx, startIdx + rowsPerPage);

  const goTo = (page) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const showPagination = data.length > rowsPerPage;

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-slate-200 overflow-hidden",
        className,
      )}
    >
      {/* Desktop table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-left sc-label"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {pageData.map((row, ri) => (
              <tr
                key={ri}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "group transition-colors duration-100",
                  onRowClick && "cursor-pointer hover:bg-slate-50",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-5 py-3.5 text-sm text-slate-700 align-middle"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card stack */}
      <div className="md:hidden divide-y divide-slate-100 bg-white">
        {pageData.map((row, ri) => (
          <div key={ri} className="px-4 py-4" onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex justify-between items-center py-0.5"
              >
                <span className="text-xs text-slate-400 font-medium">
                  {col.header}
                </span>
                <span className="text-sm text-slate-700">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination footer — hidden when all rows fit on one page */}
      {showPagination && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-white">
          {/* Row count hint */}
          <p className="text-xs text-slate-400 hidden sm:block">
            {startIdx + 1}–{Math.min(startIdx + rowsPerPage, data.length)} of{" "}
            {data.length}
          </p>

          {/* Controls */}
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
