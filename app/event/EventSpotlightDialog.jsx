"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { ArrowRight02Icon } from "@animateicons/react/huge";
import { HeartIcon, SparkleIcon, TrophyIcon, ActivityIcon } from "@animateicons/react/huge";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { DiaTextReveal } from "@/components/animation/diaText";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  HeartIcon,
  SparkleIcon,
  TrophyIcon,
  ActivityIcon,
};

const CATEGORY_META = {
  volunteer: { icon: "HeartIcon", glow: "var(--brand-volunteer)" },
  health: { icon: "HeartIcon", glow: "var(--brand-health)" },
  environment: { icon: "ActivityIcon", glow: "var(--brand-environment)" },
  education: { icon: "TrophyIcon", glow: "var(--brand-education)" },
};

function NumberCounter({ value, label }) {
  const [count, setCount] = useState(0);
  const played = useRef(false);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Split "₹ 499" → prefix "₹ " + end 499
  const prefix = value.replace(/[0-9,]+.*$/, "");         // e.g. "₹ "
  const end    = parseInt(value.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    if (played.current || prefersReducedMotion) {
      setCount(end);
      return;
    }
    played.current = true;
    const duration = 1200;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, prefersReducedMotion]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="group relative p-3 rounded-xl border border-border/60 bg-[var(--color-surface)]/40 backdrop-blur-sm"
    >
      <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] opacity-70 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
      <span className="mt-1 flex items-baseline gap-0.5 text-xl font-bold text-[var(--color-ink)]">
        {prefix && (
          <span className="text-base leading-none">{prefix.trim()} {count.toLocaleString()}</span>
        )}
        <span></span>
      </span>
    </motion.div>
  );
}

export function EventSpotlightDialog({ open, onOpenChange, category }) {
  const [isHovered, setIsHovered] = useState(false);
  console.log(category,"category");
  
  if (!category) return null;

  const meta      = CATEGORY_META[category.key] ?? CATEGORY_META.volunteer;
  const laneColor = `var(--brand-${category.key})`;

  /* Parent holds a key string or null — always pass null to close */
  const handleClose = () => onOpenChange(null);

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }} modal>
      <Dialog.Portal>
        {/* ── Backdrop ─────────────────────────────── */}
        <Dialog.Backdrop className="dialog-backdrop event-spotlight-backdrop fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

        {/* ── Viewport: scrollable centering wrapper ── */}
        <Dialog.Viewport className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <AnimatePresence>
              {open && (
                <motion.div
                  key="event-spotlight-popup"
                  initial={{ opacity: 0, scale: 0.93, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: 24 }}
                  transition={{ type: "spring", damping: 24, stiffness: 300 }}
                  className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-border/70 shadow-2xl"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-border), transparent 30%)",
                  }}
                >
                  {/* ── Close button ─────────────────────── */}
                  <Dialog.Close
                    aria-label="Close event details"
                    className="absolute top-4 right-4 z-30"
                  >
                    <motion.span
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "flex w-9 h-9 rounded-full border border-border/60 bg-[var(--color-surface)]/90 backdrop-blur-sm",
                        "items-center justify-center text-[var(--color-ink)] transition-all",
                        "hover:bg-[var(--color-surface)] hover:text-accent hover:border-accent/50"
                      )}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <XIcon size={18} className={cn("shrink-0 transition-transform duration-300", isHovered && "rotate-90")} />
                    </motion.span>
                  </Dialog.Close>

                  {/* ── Two-column layout: image | content ── */}
                  <div className="flex flex-col lg:flex-row">

                    {/* ── LEFT: Hero Image ─────────────────── */}
                    <div className="relative w-full lg:w-[42%] shrink-0 h-56 sm:h-72 lg:h-auto lg:min-h-[520px] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
                      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-transparent to-surface/30 z-10" />

                      <Image
                        src={category.detailImg}
                        alt={`${category.label} hero`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        priority
                        style={{
                          filter: "saturate(110%) contrast(105%)",
                          transition: "transform 0.6s ease, filter 0.6s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.filter = "saturate(120%) contrast(110%) brightness(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.filter = "saturate(110%) contrast(105%)";
                        }}
                      />

                      {/* Category badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <DiaTextReveal
                          text={category.label}
                          colors={[laneColor, "var(--color-accent)", "var(--brand-ink-soft)"]}
                          textColor="var(--color-ink)"
                          duration={1.4}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-[var(--color-surface)]/60 backdrop-blur-md text-xs font-bold uppercase tracking-wider"
                          startOnView={false}
                          once={false}
                          repeat={false}
                        />
                        <span
                          className="absolute -top-1 -left-1 size-2 rounded-full animate-pulse shadow-lg"
                          style={{ backgroundColor: laneColor }}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Location pill */}
                      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-[var(--color-surface)]/80 backdrop-blur-sm shadow-lg">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] opacity-70">Location</span>
                          <span className="text-sm font-semibold text-[var(--color-ink)] leading-tight">Chennai, Tamil Nadu</span>
                        </div>
                        <ArrowRight02Icon size={14} duration={1} className="shrink-0 text-[var(--color-ink-soft)] rotate-45 ml-1" />
                      </div>
                    </div>

                    {/* ── RIGHT: Content ───────────────────── */}
                    <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[70vh] lg:max-h-[600px]">

                      {/* Title */}
                      <div className="space-y-1 pr-10 lg:pr-0">
                        <Dialog.Title className="event-spotlight-title">
                          <span className="block text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: laneColor }}>
                            {category.label}
                          </span>
                          <span className="block text-sm font-medium text-[var(--color-ink-soft)] mt-0.5">
                            {category.number} · {category.tag}
                          </span>
                        </Dialog.Title>
                        <p className="event-spotlight-tagline text-base text-[var(--color-ink-soft)] leading-relaxed italic pt-1">
                          {category.message}
                        </p>
                        <p className="event-spotlight-description text-sm leading-6 text-[var(--color-ink-soft)]">
                          {category.description}
                        </p>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <NumberCounter value={category.Amount} label="Entry Fee" />
                        <div className="p-3 rounded-xl border border-border/60 bg-[var(--color-surface)]/40 backdrop-blur-sm">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] opacity-70">Category</span>
                          <span className="block mt-1 text-sm font-semibold text-[var(--color-ink)]">{category.tag}</span>
                        </div>
                        <div className="p-3 rounded-xl border border-border/60 bg-[var(--color-surface)]/40 backdrop-blur-sm">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] opacity-70">Distance</span>
                          <span className="block mt-1 text-sm font-semibold text-[var(--color-ink)]">{category.label.split("(")[0].trim()}</span>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">What You Get</h4>
                          <span className="text-[10px] font-bold tracking-wider text-[var(--color-ink-soft)] opacity-50">
                            {category.benefits.length} inclusions
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {category.benefits.map((benefit, i) => {
                            const BenefitIcon = ICON_MAP[meta.icon] ?? SparkleIcon;
                            return (
                              <motion.div
                                key={i}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className={cn(
                                  "p-3 rounded-xl border border-border/60 bg-[var(--color-surface)]/40 backdrop-blur-sm flex flex-col items-center gap-2 transition-all",
                                  i % 2 === 0 && "border-t-2 border-t-accent/40"
                                )}
                              >
                                <BenefitIcon size={14} className="shrink-0 text-accent" />
                                <span className="text-xs text-[var(--color-ink)] leading-tight text-center font-medium">
                                  {benefit}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* CTA buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <RainbowButton
                          asChild
                          variant="accent"
                          size="lg"
                          className="w-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all"
                        >
                          <Link
                            href="/register"
                            className="inline-flex w-full items-center justify-center gap-2"
                            onClick={handleClose}
                          >
                            <ArrowRight02Icon size={18} duration={1} className="shrink-0" />
                            Register Now
                          </Link>
                        </RainbowButton>
                        <button
                          type="button"
                          className={cn(
                            "w-full text-sm font-bold uppercase tracking-wider py-2.5",
                            "rounded-xl border border-border/60 bg-[var(--color-surface)]/60 backdrop-blur-sm text-[var(--color-ink)] transition-all",
                            "hover:border-accent/50 hover:bg-accent/5 hover:-translate-y-1 hover:shadow-md"
                          )}
                          onClick={handleClose}
                        >
                          Browse All Events
                        </button>
                      </div>

                      {/* Footer strip */}
                      <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                        <span className="text-sm text-[var(--color-ink-soft)]">
                          All events ·{" "}
                          <span className="text-accent font-bold cursor-pointer hover:underline" onClick={handleClose}>
                            View Schedule
                          </span>
                        </span>
                        <motion.div
                          whileHover={{ rotate: 45 }}
                          className="w-6 h-6 border border-border/60 rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--color-ink-soft)] shrink-0"
                        >
                          ↻
                        </motion.div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}