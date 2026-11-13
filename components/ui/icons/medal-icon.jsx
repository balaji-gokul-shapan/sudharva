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

const MedalIcon = forwardRef((
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

 const swingVariants = {
  normal: { rotate: 0 },
  animate: {
   rotate: [0, 20, -14, 7, 0],
   transition: { duration: 0.9 * duration, ease: "easeInOut" },
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
     <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
     <path d="M11 12 5.12 2.2" />
     <path d="m13 12 5.88-9.8" />
     <path d="M8 7h8" />
     <m.g
      variants={swingVariants}
      style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
     >
      <circle cx="12" cy="17" r="5" />
      <path d="M12 18v-2h-.5" />
     </m.g>
    </m.svg>
   </m.div>
  </LazyMotion>
 );
});

MedalIcon.displayName = "MedalIcon";
export { MedalIcon };
