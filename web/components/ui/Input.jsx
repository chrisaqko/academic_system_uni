import { cn } from '@/lib/utils';

export default function Input({
  label, id, error, helper, className = '', containerClassName = '',
  prefix, ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-600">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={cn(
            'sc-input',
            prefix && 'pl-8',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
  );
}
