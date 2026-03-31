'use client';

import { cn } from '@/lib/utils';

export default function Table({ columns = [], data = [], loading = false, emptyState, onRowClick, className = '' }) {
  if (loading) {
    return (
      <div className={cn('w-full rounded-xl border border-slate-200 overflow-hidden', className)}>
        <div className="min-w-full divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
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

  if (!data.length && emptyState) {
    return (
      <div className={cn('w-full rounded-xl border border-slate-200 py-16 text-center', className)}>
        <p className="text-slate-400 text-sm">{emptyState}</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full rounded-xl border border-slate-200 overflow-hidden', className)}>
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
            {data.map((row, ri) => (
              <tr
                key={ri}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'group transition-colors duration-100',
                  onRowClick && 'cursor-pointer hover:bg-slate-50'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-sm text-slate-700 align-middle">
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
        {data.map((row, ri) => (
          <div key={ri} className="px-4 py-4" onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-center py-0.5">
                <span className="text-xs text-slate-400 font-medium">{col.header}</span>
                <span className="text-sm text-slate-700">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
