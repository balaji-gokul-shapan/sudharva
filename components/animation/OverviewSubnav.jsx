"use client";

import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight02Icon } from "@animateicons/react/huge";

import { OVERVIEW_SUBNAV } from "@/app/datas/homepage/data";

/* ------------------------------------------------------------------ */
/*  OverviewSubnav — dropdown for the "Event Overview" nav link.      */
/*  Every entry points at a real section anchor on the landing page.  */
/* ------------------------------------------------------------------ */

export function OverviewSubnav({ link, leaveTimeoutRef, setOpenSubnav }) {
  const panelRef = useRef(null);

  /* GSAP: staggered entrance for each overview card */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".overview-subnav-card",
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "power3.out",
        }
      );
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
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
      className="absolute left-1/2 top-full z-50 mt-2 w-[min(92vw,560px)] -translate-x-1/2 rounded-2xl border border-border bg-surface p-3 shadow-2xl"
      role="menu"
      aria-label={link?.label ?? "Event Overview"}
    >
      {/* Decorative top glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-px left-8 h-1 w-24 rounded-full bg-gradient-to-r from-accent/70 via-accent to-transparent"
      />

      {/* Header */}
      <div className="border-b border-border/70 px-3 pb-3 pt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Event Overview
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          Explore the marathon — cause, health add-ons, categories and partners.
        </p>
      </div>

      {/* Cards */}
      <ul className="mt-2 grid gap-1">
        {OVERVIEW_SUBNAV.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              <motion.a
                href={item.href}
                role="menuitem"
                className={cn(
                  "overview-subnav-card group flex items-start gap-3 rounded-xl px-3 py-2.5",
                  "transition-colors duration-200 hover:bg-muted/60 focus-visible:bg-muted/60",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                  <Icon size={20} aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    {item.label}
                    <ArrowRight02Icon
                      size={14}
                      className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-70"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-ink-soft">
                    {item.description}
                  </span>
                </span>
              </motion.a>
            </li>
          );
        })}
      </ul>

      {/* Footer CTA */}
      <div className="mt-2 border-t border-border/70 px-3 pb-1 pt-3">
        <Link
          href="/register"
          onClick={() => setOpenSubnav(null)}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:text-primary"
        >
          Register now
          <ArrowRight02Icon
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.div>
  );
}
