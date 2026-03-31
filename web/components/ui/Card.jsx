import { cn } from '@/lib/utils';

export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div className={cn(
      'bg-white border border-slate-200 rounded-xl shadow-soft',
      padding && 'p-5',
      hover && 'hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer',
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', actions }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2 ml-3">{actions}</div>}
    </div>
  );
}

export function CardTitle({ children, label, className = '' }) {
  return (
    <div className={className}>
      {label && <p className="sc-label mb-0.5">{label}</p>}
      <h3 className="text-base font-semibold text-slate-900">{children}</h3>
    </div>
  );
}
