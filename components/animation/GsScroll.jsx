"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

let registered = false;

function ensureRegistered() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/* ------------------------------------------------------------------ */
/*  GsParallax — GSAP scroll-driven parallax wrapper                   */
/*                                                                     */
/*  Moves its child at a fraction of scroll speed. Use for hero        */
/*  backgrounds, floating shapes, oversized type.                      */
/*                                                                     */
/*  <GsParallax speed={0.25}>…</GsParallax>                              */
/* ------------------------------------------------------------------ */

export function GsParallax({
  children,
  speed = 0.25,
  direction = "down",
  className,
  ...props
}) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const sign = direction === "up" ? -1 : 1;
    gsap.set(el, { yPercent: 0 });

    const tween = gsap.to(el, {
      yPercent: sign * speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") ?? el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, direction]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GsRevealGroup — GSAP batch reveal for `[data-gs-reveal]` children  */
/*                                                                     */
/*  Declarative: children opt in with the data attribute instead of    */
/*  wiring one hook per element.                                       */
/*                                                                     */
/*  <GsRevealGroup stagger={0.1} y={36}>                                */
/*    <h1 data-gs-reveal>…</h1>                                         */
/*    <p data-gs-reveal>…</p>                                           */
/*  </GsRevealGroup>                                                     */
/* ------------------------------------------------------------------ */

export function GsRevealGroup({
  children,
  stagger = 0.1,
  y = 36,
  duration = 0.9,
  className,
  ...props
}) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    ensureRegistered();
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = root.querySelectorAll("[data-gs-reveal]");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [stagger, y, duration]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GsScaleIn — GSAP scroll-scrubbed scale + fade for badges / art     */
/* ------------------------------------------------------------------ */

export function GsScaleIn({
  children,
  from = 0.85,
  className,
  ...props
}) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, scale: from },
      {
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") ?? el,
          start: "top bottom",
          end: "top 35%",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [from]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
