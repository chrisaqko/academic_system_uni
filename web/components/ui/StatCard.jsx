import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  sub,
  trend,
  trendPositive = true,
  icon: Icon,
  accentColor = "blue",
  highlight = false,
}) {
  const accents = {
    blue: "text-primary-600 bg-primary-50",
    violet: "text-violet-600 bg-violet-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    green: "text-green-600 bg-green-50",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5 shadow-soft flex flex-col gap-3",
        highlight
          ? "border border-slate-200 border-l-4 border-l-emerald-400"
          : "border border-slate-200",
      )}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        {Icon && (
          <div className={cn("p-2 rounded-lg", accents[accentColor])}>
            <Icon size={18} />
          </div>
        )}
        {/* Trend badge */}
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trend === "STABLE"
                ? "bg-slate-100 text-slate-500"
                : trendPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600",
            )}
          >
            {trend}
          </span>
        )}
        {highlight && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1" />
        )}
      </div>

      <div>
        <p className="sc-label mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
