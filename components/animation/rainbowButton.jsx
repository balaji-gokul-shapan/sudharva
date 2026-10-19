"use client";

import React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const rainbowButtonVariants = cva(
  [
    "relative isolate inline-flex cursor-pointer items-center justify-center gap-2 shrink-0",
    "whitespace-nowrap rounded-md text-sm font-bold uppercase tracking-wider",
    "outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    // keep inner content above the blurred glow layer (rainbow variants)
    "[&>*]:relative [&>*]:z-10",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "animate-rainbow border-0 bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-primary-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:bg-[length:200%] before:content-[''] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
        outline:
          "animate-rainbow border border-input border-b-transparent bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#ffffff_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-accent-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:bg-[length:200%] before:content-[''] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#0a0a0a,#0a0a0a),linear-gradient(#0a0a0a_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
        // Rainbow border + glow, but solid brand-accent fill.
        accent:
          "animate-rainbow border-0 bg-[linear-gradient(var(--accent),var(--accent)),linear-gradient(var(--accent)_50%,color-mix(in_srgb,var(--accent)_60%,transparent)_80%,transparent),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-accent-foreground shadow-md [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:bg-[length:200%] before:content-[''] before:[filter:blur(0.75rem)] hover:shadow-lg hover:[filter:brightness(1.06)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const RainbowButton = React.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(rainbowButtonVariants({ variant, size, className }));

    // Render the styles onto the child (e.g. Next.js <Link>) without
    // needing @radix-ui/react-slot (not installed in this project).
    if (asChild && React.isValidElement(children)) {
      const child = React.Children.only(children);
      return React.cloneElement(child, {
        ...props,
        ref,
        className: cn(classes, child.props?.className),
      });
    }

    return (
      <button data-slot="button" className={classes} ref={ref} {...props}>
        <span className="inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  },
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton, rainbowButtonVariants };
