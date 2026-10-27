import { cn } from '@/lib/utils';

/**
 * Base panel used across the overview — white surface on the warm canvas,
 * hairline border and a very soft lift. Theme accents come from children.
 */
export function GlassCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[22px] bg-white border border-line shadow-[0_1px_2px_rgba(20,21,26,0.04),0_8px_24px_-12px_rgba(20,21,26,0.08)]',
        'text-ink',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Small section heading used inside panels */
export function PanelTitle({ title, hint, children }: { title: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
        {hint && <p className="text-[12px] text-stone-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
