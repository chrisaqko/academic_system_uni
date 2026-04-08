import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
const colors = [
  "bg-primary-100 text-primary-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function pickColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export default function Avatar({
  name = "",
  surname = "",
  size = "md",
  online = false,
  className = "",
  src,
}) {
  const initials = getInitials(name, surname);
  const colorClass = pickColor(name + surname);

  const sizes = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
    xl: "w-14 h-14 text-lg",
  };

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <Image
          src={src}
          alt={`${name} ${surname}`}
          className={cn(
            "rounded-full object-cover ring-2 ring-white",
            sizes[size],
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-semibold ring-2 ring-white",
            colorClass,
            sizes[size],
          )}
        >
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}
