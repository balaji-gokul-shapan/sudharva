"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  EventCategoryFeature,
  EventsCardGrid,
} from "./EventCategoriesAnimations";

/* ------------------------------------------------------------------ */
/*  useMediaQuery: SSR-safe media query subscription                   */
/* ------------------------------------------------------------------ */

function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/*  EventsResponsiveGrid                                               */
/*                                                                     */
/*  Desktop (lg+): regular grid.                                       */
/*  Below lg: a full-screen "stage" is pinned (CSS sticky) while the   */
/*  card row is scrubbed sideways by scroll.                           */
/*                                                                     */
/*  Why it is in sync now:                                             */
/*   - the stage is sticky at `topOffset` and exactly                  */
/*     (100svh - topOffset) tall, so it always fits the screen         */
/*   - ScrollTrigger starts at "top top+=topOffset", the very same     */
/*     moment sticky engages, and runs for exactly `distance` px       */
/*   - the rail's height = stage height + distance, so the stage       */
/*     un-pins the moment the last card is fully in view               */
/*                                                                     */
/*  topOffset = height of your fixed navbar (px).                      */
/* ------------------------------------------------------------------ */

export function EventsResponsiveGrid({ items, topOffset = 50 }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const railRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const [railHeight, setRailHeight] = useState(null);

  useIsoLayoutEffect(() => {
    if (isDesktop || reduceMotion) {
      setRailHeight(null);
      return undefined;
    }

    const rail = railRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!rail || !viewport || !track) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    // Mobile address bar show/hide must not re-trigger a refresh.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const getDistance = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    let raf = 0;
    const measure = () => {
      const distance = getDistance();
      setRailHeight(distance > 0 ? viewport.offsetHeight + distance : null);
      // Rail height changed -> ScrollTrigger must re-read its positions.
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    measure();

    const context = gsap.context(() => {
      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: rail,
          start: `top top+=${topOffset}`, // same line where sticky engages
          end: () => `+=${getDistance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    }, rail);

    // Re-measure when the stage resizes (rotation, keyboard, fonts) or
    // the cards change size (images, wrapped text).
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      context.revert();
      if (bar) bar.style.transform = "scaleX(0)";
    };
  }, [isDesktop, reduceMotion, items, topOffset]);

  // Desktop keeps the regular responsive grid.
  if (isDesktop) {
    return <EventsCardGrid items={items} />;
  }

  return (
    <div
      ref={railRef}
      className="events-rail-scroll-section relative mt-12"
      style={railHeight ? { height: railHeight } : undefined}
    >
      <div
        ref={viewportRef}
        aria-label="Event categories"
        style={{ "--rail-top": `${topOffset}px`, top: topOffset }}
        className={
          reduceMotion
            ? "events-rail-viewport relative overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
            : // full-screen stage: fits the visible area under the navbar,
              // cards are centred vertically inside it
              "events-rail-viewport is-pinned sticky flex items-center overflow-hidden " +
              "h-[calc(100vh-var(--rail-top))] supports-[height:100svh]:h-[calc(100svh-var(--rail-top))]"
        }
      >
        <div
          ref={trackRef}
          className="events-rail-track flex w-max items-stretch gap-5 px-4 py-6 will-change-transform sm:gap-8 sm:px-6"
        >
          {items.map((item, index) => (
            <div
              key={item.key}
              id={item.anchorId}
              className="events-rail-item w-[calc(100vw-3rem)] max-w-[320px] shrink-0 snap-start scroll-mt-28 sm:w-[44vw] sm:max-w-[400px]"
            >
              <EventCategoryFeature item={item} index={index} reveal={false} />
            </div>
          ))}
        </div>

        {/* scroll progress */}
        {!reduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 bottom-5 h-1 overflow-hidden rounded-full bg-border/40"
          >
            <div
              ref={barRef}
              className="h-full origin-left rounded-full bg-primary"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}