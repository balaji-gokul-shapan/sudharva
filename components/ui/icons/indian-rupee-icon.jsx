"use client";;
import { cn } from "@/lib/utils";
import {
 LazyMotion,
 domMin,
 m,
 useAnimation,
 useReducedMotion,
} from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const IndianRupeeIcon = forwardRef((
 {
  onMouseEnter,
  onMouseLeave,
  className,
  size = 24,
  duration = 1,
  isAnimated = true,
  color,
  ...props
 },
 ref,
) => {
 const controls = useAnimation();
 const reduced = useReducedMotion();
 const isControlled = useRef(false);

 useImperativeHandle(ref, () => {
  isControlled.current = true;
  return {
   startAnimation: () =>
    reduced ? controls.start("normal") : controls.start("animate"),
   stopAnimation: () => controls.start("normal"),
  };
 });

 const handleEnter = useCallback(
  (e) => {
   if (!isAnimated || reduced) return;
   if (!isControlled.current) controls.start("animate");
   else onMouseEnter?.(e);
  },
  [controls, reduced, isAnimated, onMouseEnter],
 );

 const handleLeave = useCallback(
  (e) => {
   if (!isControlled.current) controls.start("normal");
   else onMouseLeave?.(e);
  },
  [controls, onMouseLeave],
 );

 const topVariants = {
  normal: { y: 0 },
  animate: {
   y: [0, -1.5, 0.6, 0],
   transition: {
    duration: 0.6 * duration,
    ease: "easeInOut",
    times: [0, 0.35, 0.7, 1],
   },
  },
 };

 const midVariants = {
  normal: { y: 0 },
  animate: {
   y: [0, -1.2, 0.6, 0],
   transition: {
    duration: 0.6 * duration,
    ease: "easeInOut",
    times: [0, 0.35, 0.7, 1],
    delay: 0.08 * duration,
   },
  },
 };

 return (
  <LazyMotion features={domMin} strict>
   <m.div
    className={cn("inline-flex items-center justify-center", className)}
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
    {...props}
    style={{ color, ...props.style }}
   >
    <m.svg
     xmlns="http://www.w3.org/2000/svg"
     width={size}
     height={size}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     animate={controls}
     initial="normal"
    >
     <m.path d="M6 3h12" variants={topVariants} />
     <m.path d="M6 8h12" variants={midVariants} />
     <path d="m6 13 8.5 8" />
     <path d="M6 13h3" />
     <path d="M9 13c6.667 0 6.667-10 0-10" />
    </m.svg>
   </m.div>
  </LazyMotion>
 );
});

IndianRupeeIcon.displayName = "IndianRupeeIcon";
export { IndianRupeeIcon };
