import { cn } from "@/lib/utils";

/**
 * Skeleton loader — always slate on the white background.
 * No isDark needed since the app is always light-mode.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-100", className)}
      {...props}
    />
  );
}

export { Skeleton };
