import { cn } from '@/lib/utils';

const badgeVariants = {
  active:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  inactive:  'bg-slate-100 text-slate-500 border border-slate-200',
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  admin:     'bg-primary-50 text-primary-700 border border-primary-200',
  teacher:   'bg-violet-50 text-violet-700 border border-violet-200',
  student:   'bg-teal-50 text-teal-700 border border-teal-200',
  warning:   'bg-red-50 text-red-600 border border-red-200',
  blue:      'bg-primary-50 text-primary-700 border border-primary-200',
  green:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  neutral:   'bg-slate-100 text-slate-600 border border-slate-200',
};

export default function Badge({ children, variant = 'active', className = '', dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full',
        badgeVariants[variant] ?? badgeVariants.neutral,
        className
      )}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'active'   ? 'bg-emerald-500' :
          variant === 'inactive' ? 'bg-slate-400' :
          variant === 'pending'  ? 'bg-amber-500' : 'bg-primary-500'
        )} />
      )}
      {children}
    </span>
  );
}
