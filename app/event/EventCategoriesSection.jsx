"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { ArrowRight02Icon, SparklesIcon } from "@animateicons/react/huge";
import { cn } from "@/lib/utils";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { DiaTextReveal } from "@/components/animation/diaText";
import { Reveal } from "@/components/animation/Reveal";
import { GsRevealGroup } from "@/components/animation/GsScroll";
import { eventCategoriesData } from "@/app/datas/homepage/data";
import { EventSpotlightDialog } from "./EventSpotlightDialog";
import { LineShadowText } from "@/components/animation/line-shadow-text";
import { SparkleIcon } from "@phosphor-icons/react";

/* ------------------------------------------------------------------ */
/*  Lane color map — one accent color per category (CSS variables)    */
/* ------------------------------------------------------------------ */
const LANE_COLORS = {
  volunteer: {
    color: "var(--brand-volunteer)",
    tint: "var(--brand-volunteer-tint)",
  },
  health: {
    color: "var(--brand-health)",
    tint: "var(--brand-health-tint)",
  },
  environment: {
    color: "var(--brand-environment)",
    tint: "var(--brand-environment-tint)",
  },
  education: {
    color: "var(--brand-education)",
    tint: "var(--brand-education-tint)",
  },
};

const laneFor = (key) => LANE_COLORS[key] ?? LANE_COLORS.volunteer;

export default function EventCategoriesSection() {
  const [openCategory, setOpenCategory] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="event-categories"
      aria-labelledby="event-categories-heading"
      className="relative overflow-hidden bg-surface text-ink py-20 sm:py-28"
    >
      {/* Decorative category glows behind the lanes */}
      {eventCategoriesData.map((category, index) => {
        const color = laneFor(category.key).color;
        return (
          <div
            key={category.key}
            className="pointer-events-none absolute z-0 size-80 rounded-full blur-3xl"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              left: `${(index * 29) % 85}%`,
              top: `${10 + index * 19}%`,
            }}
            aria-hidden="true"
          />
        );
      })}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--color-primary)/10,transparent)]"
        aria-hidden="true"
      />

      <div className="container-page relative z-10">
        <header className="mx-auto max-w-3xl text-center sm:text-left mb-16 sm:mb-24">
          <Reveal
            preset="fade-up"
            delay={0}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-soft)] shadow-sm sm:justify-start"
          >
            <span
              className="size-1.5 animate-pulse rounded-full bg-accent"
              aria-hidden="true"
            />
            Choose Your Distance
          </Reveal>

          <Reveal preset="blur" delay={0.08} className="mt-5 block">
            <h2
              id="event-categories-heading"
              className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl"
            >
              Event Categories
            </h2>
          </Reveal>

          <Reveal preset="fade-up" delay={0.16} className="mt-4 block">
            <p className="text-sm leading-6 opacity-85 sm:text-base">
              Pick the distance that moves you. Every stride supports
              Sudharva&rsquo;s mission for a diabetes-free community.
            </p>
          </Reveal>

          {/* Stats band */}
          {/* <Reveal preset="fade-up" delay={0.24} className="mt-10">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: "4", label: "Distances" },
                { value: "₹ 499", label: "Starting at" },
                { value: "21.1K", label: "Longest" },
                { value: "100%", label: "For charity" },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <span className="block text-2xl font-bold text-primary tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal> */}
        </header>

        {/* Race Track Lanes — no cards, just themed lanes on a track line */}
        <GsRevealGroup
          stagger={0.12}
          y={30}
          duration={0.85}
          className="space-y-6 sm:space-y-8"
        >
          {eventCategoriesData.map((category, index) => {
            const lane = laneFor(category.key);
            const isActive = openCategory === category.key;
            return (
              <motion.div
                key={category.key}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border px-8 py-9",
                  "transition-[border-color,box-shadow,transform,background] duration-500 sm:px-10 sm:py-11",
                  isActive && "-translate-y-0.5",
                )}
                style={{
                  "--lane-color": lane.color,
                  "--lane-tint": lane.tint,
                  borderColor: isActive
                    ? "var(--lane-color)"
                    : "color-mix(in srgb, var(--lane-color) 28%, var(--color-border, currentColor))",
                  background: `url(${category.bannerImg}) center / cover no-repeat`,
                  filter: `saturate(${isActive ? 1.35 : 0.8}) brightness(${isActive ? 0.9 : 0.7})`,
                  // background: category.bannerImg
                  //   ? `linear-gradient(120deg, color-mix(in srgb, var(--lane-tint)  ${isActive ? 9 : 5}%, transparent), transparent ${isActive ? 5 : 8}%), linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%), url(${category.bannerImg}) center / cover no-repeat`
                  //   : isActive
                  //     ? "linear-gradient(120deg, color-mix(in srgb, var(--lane-tint) 60%, transparent), transparent 70%)"
                  //     : "linear-gradient(120deg, color-mix(in srgb, var(--lane-tint) 40%, transparent), transparent 62%)",
                  boxShadow: isActive
                    ? "0 18px 44px -25px var(--lane-color)"
                    : "0 10px 30px -28px color-mix(in srgb, var(--lane-color) 65%, transparent)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-70 bg-[var(--lane-color)] transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full border-[18px] border-[color:var(--lane-color)] opacity-10 transition-transform duration-700 group-hover:scale-125"
                  aria-hidden="true"
                />

                {/* Track line — thin vertical rule at the lane start */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--lane-color)]"
                  aria-hidden="true"
                >
                  <div className="h-full w-full origin-top scale-y-50 bg-foreground/20 transition-transform duration-500 group-hover:scale-y-100" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-9">
                  {/* ---- Lane start: bib number + distance tag ---- */}
                  <div className="flex flex-col items-center gap-3 z-10">
                    <div
                      className="relative z-10 flex size-15 aspect-square shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--lane-color)] bg-[var(--color-surface)] text-xs font-bold uppercase tracking-wider text-[var(--lane-color)] shadow-sm transition-colors duration-300"
                      style={{
                        "--lane-color": lane.color,
                        backgroundColor: isActive
                          ? "color-mix(in srgb, var(--lane-tint) 72%, transparent)"
                          : undefined,
                      }}
                    >
                      {`0${index + 1}`}
                    </div>
                    <div
                      className="absolute -top-2 -right-2 size-2 rounded-full shadow-[0_0_10px_var(--lane-color)]"
                      style={{ backgroundColor: `var(--lane-color)` }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                      {category.tag}
                    </span>
                  </div>

                  {/* ---- Lane body: category info ---- */}
                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <DiaTextReveal
                        text={category.label}
                        colors={[
                          "var(--brand-volunteer)",
                          "var(--brand-health)",
                          "var(--brand-environment)",
                          "var(--brand-education)",
                        ]}
                        duration={1.2}
                        startOnView
                        once
                        textColor={`var(--lane-color)` ?? "var(--primary)"}
                        className="text-xl font-bold tracking-tight text-primary sm:text-2xl lg:text-3xl"
                      />
                    </div>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        isActive
                          ? "bg-[var(--lane-color)] text-[var(--color-ink)] border-[var(--lane-color)]"
                          : "border-border/50 bg-bg text-[var(--color-ink-soft)]",
                      )}
                      style={{ "--lane-color": lane.color }}
                    >
                      {category.tag}
                    </span>

                    <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
                      {category.description}
                    </p>

                    {/* Price + benefits row */}
                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                          Entry Fee
                        </span>
                        {/* <LineShadowText className="text-4xl font-bold text-[var(--lane-color)]">
                          {category.Amount}
                        </LineShadowText> */}
                        {/* <span className="text-4xl font-bold text-[var(--lane-color)]">{category.Amount}</span> */}
                        <span className="text-4xl font-bold text-[var(--lane-color)]">
                          <LineShadowText
                            className="italic"
                            shadowColor="hsl(0 0% 100%)"
                          >
                            {category.Amount}
                          </LineShadowText>
                        </span>
                        <span className="text-xs text-[var(--color-ink-soft)]">
                          per runner
                        </span>
                      </div>

                      <ul className="flex flex-wrap gap-2">
                        {category.benefits.slice(0, 3).map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-1.5 rounded-full border border-border/50 bg-bg px-2.5 py-1 text-[9px] font-medium text-[var(--color-ink-soft)]"
                          >
                            <span className="flex size-2.5 shrink-0 items-center justify-center rounded-full bg-[var(--lane-color)] text-[8px] font-bold text-[var(--color-ink)]">
                              <SparklesIcon
                                className="relative z-10 shrink-0 size-1 sm:size-1 lg:size-2"
                                color="white"
                              />
                            </span>
                            {benefit}
                          </li>
                        ))}
                        {category.benefits.length > 3 && (
                          <li className="rounded-full border border-border/50 bg-bg px-2.5 py-1 text-[9px] font-medium text-[var(--color-ink-soft)]">
                            +{category.benefits.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* ---- Lane finish: CTA ---- */}
                  <div className="flex flex-col items-center sm:items-end gap-2 z-10">
                    <RainbowButton
                      asChild
                      variant="accent"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm font-bold uppercase tracking-wider"
                    >
                      <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2"
                      >
                        {category.ButtonText}
                        <ArrowRight02Icon
                          size={13}
                          duration={1}
                          className="shrink-0"
                        />
                      </Link>
                    </RainbowButton>
                    <button
                      type="button"
                      onClick={() => setOpenCategory(category.key)}
                      className="mt-1 inline-flex items-center justify-center gap-1 rounded-full border border-border/50 bg-bg px-3 py-1 text-[9px] font-medium text-[var(--color-ink)] transition-all hover:border-[color:var(--lane-color)] hover:bg-[var(--lane-color)] hover:text-[var(--color-ink)]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </GsRevealGroup>

        {/* Quick-nav strip — lane selectors */}
        <div className="mt-14 sm:mt-20">
          <div className="events-category-track flex flex-wrap justify-center gap-2 sm:gap-3">
            {eventCategoriesData.map((category) => {
              const lane = laneFor(category.key);
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setOpenCategory(category.key)}
                  className={cn(
                    "event-category-pill shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300",
                    openCategory === category.key
                      ? "border-[color:var(--lane-color)] bg-[var(--lane-tint)] font-bold text-[var(--lane-color)]"
                      : "border-border/50 bg-bg text-[var(--color-ink)] hover:border-[color:var(--lane-color)] hover:text-[var(--lane-color)]",
                  )}
                  style={{
                    "--lane-color": lane.color,
                    "--lane-tint": lane.tint,
                    ...(openCategory === category.key && {
                      boxShadow: `0 0 20px ${lane.color}40`,
                    }),
                  }}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <EventSpotlightDialog
        open={openCategory !== null}
        onOpenChange={setOpenCategory}
        category={
          eventCategoriesData.find((c) => c.key === openCategory) ?? null
        }
      />
    </section>
  );
}
