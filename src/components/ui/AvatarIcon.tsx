/**
 * AvatarIcon — coloured circle with a person silhouette SVG.
 * Used everywhere instead of a plain initial letter.
 */
export function AvatarIcon({
  color,
  size = 36,
  className = '',
}: {
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm ${className}`}
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {/* Person silhouette */}
      <svg
        width={size * 0.65}
        height={size * 0.65}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)" />
        {/* Body / shoulders */}
        <path
          d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
          fill="rgba(255,255,255,0.9)"
        />
      </svg>
    </div>
  );
}
