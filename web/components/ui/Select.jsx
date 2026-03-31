import { cn } from '@/lib/utils';

export default function Select({ label, id, error, options = [], containerClassName = '', className = '', ...props }) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-600">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'sc-input appearance-none bg-white',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
