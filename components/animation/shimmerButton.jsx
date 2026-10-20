"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * ShimmerButton — reusable shimmer-glow button.
 *
 * Colors are controlled by props (any CSS color / var()):
 *   background / foreground / shimmerColor / borderColor
 * and fall back to the theme vars in globals.css
 * (--shimmer-button-background, --shimmer-button-foreground, ...).
 *
 * `asChild` renders the shimmer styles onto its single child element
 * (e.g. a Next.js <Link>) instead of a <button> — this avoids the invalid
 * <button><a/></button> nesting and lets the link keep href behaviour.
 */

export const ShimmerButton = React.forwardRef(
  (
    {
      shimmerColor = "var(--shimmer-button-color)",
      shimmerSize = "0.15em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "var(--shimmer-button-background)",
      foreground = "var(--shimmer-button-foreground)",
      borderColor = "var(--shimmer-button-border)",
      asChild = false,
      size = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const styleVars = {
      "--spread": "90deg",
      "--shimmer-color": shimmerColor,
      "--radius": borderRadius,
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background,
      "--fg": foreground,
      "--shimmer-border": borderColor,
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      default: "px-6 py-3 text-sm",
      lg: "px-8 py-3.5 text-sm",
      icon: "p-3",
    };

    const classes = cn(
      "group relative isolate flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border text-[color:var(--fg)] [background:var(--bg)] [border-radius:var(--radius)]",
      "border-[color:var(--shimmer-border)] [box-shadow:inset_0_0_0_1px_var(--shimmer-border)]",
      sizes[size] || sizes.default,
      "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
      className
    );

    /* Decorative layers shared by both button & asChild rendering */
    const layers = (
      <React.Fragment>
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
      </React.Fragment>
    );

    if (asChild && React.isValidElement(children)) {
      const child = React.Children.only(children);
      return React.cloneElement(child, {
        ...props,
        ref,
        style: { ...styleVars, ...(child.props?.style || {}) },
        className: cn(classes, child.props?.className),
        children: (
          <React.Fragment>
            {layers}
            <span className="relative z-30 flex items-center justify-center gap-2">
              {child.props?.children}
            </span>
          </React.Fragment>
        ),
      });
    }

    return (
      <button style={styleVars} className={classes} ref={ref} {...props}>
        {layers}

        <span className="relative z-30 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";