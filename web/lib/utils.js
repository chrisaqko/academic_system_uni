// Simple utility for conditional class merging
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Get initials from name string
export function getInitials(name, surname) {
  const n = name ? name[0].toUpperCase() : "";
  const s = surname ? surname[0].toUpperCase() : "";
  return `${n}${s}`;
}

// User type → display label
export function userTypeLabel(type) {
  const map = {
    admin: "Administrator",
    teacher: "Faculty",
    student: "Student",
  };
  return map[type] || type;
}

// Schedule color by course index
const SLOT_COLORS = ["blue", "violet", "emerald", "amber", "rose"];
export function slotColor(index) {
  return SLOT_COLORS[index % SLOT_COLORS.length];
}

// Truncate text
export function truncate(str, n = 40) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

// Grade → color
export function gradeColor(grade) {
  if (!grade) return "text-slate-500";
  if (grade.startsWith("A")) return "text-emerald-600";
  if (grade.startsWith("B")) return "text-amber-600";
  return "text-red-500";
}

// Course/record status → display label
export function statusLabel(isActive) {
  return isActive ? "Active" : "Inactive";
}
