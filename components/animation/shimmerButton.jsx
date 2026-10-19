
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const ShimmerButton = React.forwardRef(
  (
    {
      shimmerColor = "var(--shimmer-button-color)",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "var(--shimmer-button-background)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={{
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        }}
        className={cn(
          "group relative isolate flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-[color:var(--shimmer-button-border)] px-6 py-3 text-[color:var(--shimmer-button-foreground)] [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Spark container */}
        <div
          className={cn(
            "z-0 blur-[2px]",
            "@container-[size] absolute inset-0 overflow-visible"
          )}
        >
          {/* Spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            {/* Spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        <span className="relative z-30 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Highlight */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-20 size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium [box-shadow:inset_0_-8px_10px_var(--shimmer-button-highlight)]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:[box-shadow:inset_0_-6px_10px_var(--shimmer-button-highlight-hover)]",
            "group-active:[box-shadow:inset_0_-10px_10px_var(--shimmer-button-highlight-active)]"
          )}
        />

        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-(--cut) z-10 [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
