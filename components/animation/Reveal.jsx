"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared transition presets                                          */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1];

const PRESETS = {
  fade: { opacity: [0, 1], y: [0, 0] },
  "fade-up": { opacity: [0, 1], y: [28, 0] },
  "fade-down": { opacity: [0, 1], y: [-28, 0] },
  "fade-left": { opacity: [0, 1], x: [32, 0] },
  "fade-right": { opacity: [0, 1], x: [-32, 0] },
  "zoom-in": { opacity: [0, 1], scale: [0.92, 1] },
  blur: { opacity: [0, 1], y: [20, 0], filter: ["blur(8px)", "blur(0px)"] },
};

/* ------------------------------------------------------------------ */
/*  Reveal — animate once when scrolled into view                      */
/*                                                                     */
/*  <Reveal preset="fade-up" delay={0.1}>…</Reveal>                      */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  preset = "fade-up",
  delay = 0,
  duration = 0.7,
  y,
  className,
  once = true,
  amount = 0.4,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const frames = PRESETS[preset] ?? PRESETS["fade-up"];

  if (reduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const { opacity, x, y: presetY, scale, filter } = frames;

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={{
        opacity: opacity[0],
        ...(x ? { x: x[0] } : null),
        y: y ?? presetY?.[0] ?? 0,
        ...(scale ? { scale: scale[0] } : null),
        ...(filter ? { filter: filter[0] } : null),
      }}
      whileInView={{
        opacity: opacity[1],
        ...(x ? { x: x[1] } : null),
        y: 0,
        ...(scale ? { scale: scale[1] } : null),
        ...(filter ? { filter: filter[1] } : null),
      }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stagger — orchestrate children with staggerChildren                */
/*                                                                     */
/*  <Stagger delay={0.1} gap={0.09}>                                     */
/*    <StaggerItem>…</StaggerItem>                                       */
/*  </Stagger>                                                           */
/* ------------------------------------------------------------------ */

export function Stagger({
  children,
  delay = 0,
  gap = 0.09,
  className,
  once = true,
  amount = 0.3,
  ...props
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  preset = "fade-up",
  className,
  ...props
}) {
  const frames = PRESETS[preset] ?? PRESETS["fade-up"];

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      variants={{
        hidden: {
          opacity: frames.opacity[0],
          ...(frames.x ? { x: frames.x[0] } : null),
          y: frames.y?.[0] ?? 0,
          ...(frames.scale ? { scale: frames.scale[0] } : null),
          ...(frames.filter ? { filter: frames.filter[0] } : null),
        },
        show: {
          opacity: frames.opacity[1],
          ...(frames.x ? { x: frames.x[1] } : null),
          y: 0,
          ...(frames.scale ? { scale: frames.scale[1] } : null),
          ...(frames.filter ? { filter: frames.filter[1] } : null),
          transition: { duration: 0.65, ease: EASE },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Float — gentle infinite y bob (badges, icons)                      */
/* ------------------------------------------------------------------ */

export function Float({
  children,
  distance = 8,
  duration = 3,
  delay = 0,
  className,
  ...props
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
