import { useId } from "react";
import { cn } from "@/lib/utils";

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}) {
  const id = useId();
  const patternId = `${id}-pattern`;
  const gradientId = `${id}-gradient`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className
      )}
      {...props}
    >
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <pattern
          id={patternId}
          width={width}
          height={height}
          x={x}
          y={y}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={cx}
            cy={cy}
            r={cr}
            fill={glow ? `url(#${gradientId})` : "currentColor"}
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        className={glow ? "dot-pattern-glow" : undefined}
      />
    </svg>
  );
}
