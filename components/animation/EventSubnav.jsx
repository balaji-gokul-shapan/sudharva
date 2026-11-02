"use client";

import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { EVENT_SUBNAV, eventPrizesData } from "@/app/datas/homepage/data";

/* ------------------------------------------------------------------ */
/*  EventSubnav — creative dropdown (Motion entrance + GSAP prize     */
/*  stagger + hover lifts)                                            */
/* ------------------------------------------------------------------ */

export function EventSubnav({ link, leaveTimeoutRef, setOpenSubnav }) {
  const subItems = EVENT_SUBNAV;
  const panelRef = useRef(null);

  /* GSAP: staggered elastic entrance for prize cards on mount */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        "#events-subnav-title",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      )
        .fromTo(
          ".subnav-event",
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            stagger: 0.06,
            ease: "back.out(1.4)",
          },
          "<0.1"
        )
        .fromTo(
          ".subnav-prize",
          { scale: 0.6, y: 14, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
          "<0.15"
        );
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseEnter={() => {
        if (leaveTimeoutRef.current) {
          clearTimeout(leaveTimeoutRef.current);
          leaveTimeoutRef.current = null;
        }
      }}
      onMouseLeave={() => {
        leaveTimeoutRef.current = setTimeout(() => setOpenSubnav(null), 150);
      }}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[420px] rounded-xl border border-border bg-surface shadow-2xl p-4 z-50"
      role="menu"
      aria-label="Event categories"
    >
      {/* Decorative top glow */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-accent/60 via-accent to-transparent rounded-full pointer-events-none" />

      {/* Events title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="mb-4 relative"
      >
        <h3 className="text-xl font-bold text-ink tracking-tight" id="events-subnav-title">
          Events
        </h3>
        <p className="mt-1 text-xs text-ink-soft uppercase tracking-wider">
          Sudharva Marathon — choose your distance
        </p>
      </motion.div>

      {/* Event details list */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-4 space-y-2"
      >
        {subItems.map((item) => {
          const Icon = item.icon;
          const isInternal = item.href.startsWith("/");
          const className =
            "subnav-event flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer group transition-colors duration-200 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

          const inner = (
            <>
              <span className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{item.label}</span>
                  <span className="block text-xs text-ink-soft">{item.distance}</span>
                </span>
              </span>
              <span className="text-xs font-bold text-accent whitespace-nowrap">{item.Amount}</span>
            </>
          );

          return isInternal ? (
            <Link
              key={item.id}
              href={item.href}
              role="menuitem"
              className={className}
              onClick={() => setOpenSubnav(null)}
            >
              {inner}
            </Link>
          ) : (
            <motion.a
              key={item.id}
              href={item.href}
              role="menuitem"
              className={className}
              whileHover={{ y: -2, backgroundColor: "rgba(0,0,0,0.03)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {inner}
            </motion.a>
          );
        })}
      </motion.div>

      {/* Prizes */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="border-t border-border pt-4 relative"
      >
        <h4 className="mb-2 text-xs font-bold text-ink-soft uppercase tracking-wider">
          Prizes for every finisher
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {eventPrizesData.map((prize) => (
            <motion.div
              key={prize.number}
              className="subnav-prize flex flex-col items-center gap-1 px-2 py-2 rounded-lg border border-border/50 bg-surface/50 group"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <prize.icon
                size={16}
                className={cn(prize.textColor, "shrink-0 group-hover:scale-125 transition-transform duration-300")}
                aria-hidden="true"
              />
              <span className="text-[10px] font-semibold text-ink leading-none">{prize.title}</span>
              <span className="text-[9px] text-ink-soft leading-none">{prize.description}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
