'use client';

import { cn, slotColor } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ALL_SHIFTS = [
  '08:00 - 09:30',
  '10:00 - 11:30',
  '11:30 - 13:00',
  '14:00 - 15:30',
  '16:00 - 17:30',
];

const slotClasses = {
  blue:    'schedule-slot schedule-slot-blue',
  violet:  'schedule-slot schedule-slot-violet',
  emerald: 'schedule-slot schedule-slot-emerald',
  amber:   'schedule-slot schedule-slot-amber',
  rose:    'schedule-slot schedule-slot-rose',
};

export default function ScheduleGrid({ entries = [], title = 'Academic Schedule' }) {
  // Build lookup: { [shift]: { [day]: [entries] } }
  const grid = {};
  ALL_SHIFTS.forEach(shift => {
    grid[shift] = {};
    DAYS.forEach(day => { grid[shift][day] = []; });
  });

  entries.forEach((e, idx) => {
    const shift = e.schedule?.shift;
    const day   = e.schedule?.week_day;
    if (shift && day && grid[shift] && grid[shift][day] !== undefined) {
      grid[shift][day].push({ ...e, _idx: idx });
    }
  });

  // Unique courses for color mapping
  const courseColorMap = {};
  let colorIdx = 0;
  entries.forEach(e => {
    const id = e.id_course;
    if (id && !courseColorMap[id]) {
      courseColorMap[id] = slotColor(colorIdx++);
    }
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-20 px-4 py-3 text-left sc-label">Time</th>
              {DAYS.map(d => (
                <th key={d} className="px-3 py-3 text-left sc-label">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_SHIFTS.map((shift, si) => (
              <tr key={shift} className={cn('border-b border-slate-50', si % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')}>
                {/* Time label */}
                <td className="px-4 py-3 align-top">
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {shift.split(' - ')[0]}
                  </span>
                </td>
                {DAYS.map(day => {
                  const cellEntries = grid[shift][day];
                  return (
                    <td key={day} className="px-2 py-2 align-top min-w-[130px]">
                      {cellEntries.length === 0 ? (
                        <span className="block text-[10px] text-slate-200 text-center py-1">—</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {cellEntries.map((e, i) => {
                            const color = courseColorMap[e.id_course] || 'blue';
                            const courseName = e.course?.name || 'Course';
                            const roomName   = e.classrom?.n_classrom || '';
                            const shortName  = courseName.length > 22 ? courseName.slice(0, 20) + '…' : courseName;
                            return (
                              <div key={i} className={slotClasses[color]}>
                                <p className="font-semibold leading-tight text-[11px]">{shortName}</p>
                                {roomName && (
                                  <p className="text-[10px] opacity-70 mt-0.5">{roomName}</p>
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
    </div>
  );
}
