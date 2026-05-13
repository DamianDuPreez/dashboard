import { cn } from '@/lib/utils';

/**
 * Solid professional card — replaces the old GlassCard.
 * White background, subtle border, soft shadow.
 * Theme accent colours are applied via children (charts, badges etc.)
 * not via the card shell itself.
 */
export function GlassCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-slate-200 shadow-sm transition-shadow hover:shadow-md',
        'text-slate-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
