"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ArrowRight02Icon } from "@animateicons/react/huge";

/* ------------------------------------------------------------------ */
/*  LinksSubnav — simple anchor-list dropdown (e.g. "Contact").        */
/* ------------------------------------------------------------------ */

export function LinksSubnav({ link, leaveTimeoutRef, setOpenSubnav }) {
  return (
    <motion.div
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
      className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-border bg-surface p-2 shadow-2xl"
      role="menu"
      aria-label={link?.label ?? "Links"}
    >
      <ul className="flex flex-col">
        {link.subnav.map((item) => (
          <li key={item.href}>
            <motion.a
              href={item.href}
              role="menuitem"
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-ink",
                "transition-colors duration-200 hover:bg-muted/60 focus-visible:bg-muted/60",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              )}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              {item.label}
              <ArrowRight02Icon
                size={14}
                className="shrink-0 text-ink-soft opacity-0 transition-opacity duration-200 group-hover:opacity-80"
                aria-hidden="true"
              />
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
