"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/animation/magicCard";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { DiaTextReveal } from "@/components/animation/diaText";
import { AuroraText } from "@/components/animation/AuroraText";
import { SpinningText } from "@/components/animation/spinning-text";
import { Reveal, Stagger, StaggerItem } from "@/components/animation/Reveal";
import { GsParallax } from "@/components/animation/GsScroll";
import { NumberTicker } from "@/components/animation/NumberTicker";
import { Loading02Icon } from "@animateicons/react/huge";
import { ShineBorder } from "@/components/animation/shine-border";

const CATEGORY_META = {
  volunteer: {
    color: "text-volunteer",
    tint: "bg-volunteer/20",
    deep: "#004780",
  },
  health: { color: "text-health", tint: "bg-health/20", deep: "#16794b" },
  environment: {
    color: "text-environment",
    tint: "bg-environment/20",
    deep: "#4b7b3e",
  },
  education: {
    color: "text-education",
    tint: "bg-education/20",
    deep: "#b8722a",
  },
};

/* ------------------------------------------------------------------ */
/*  EventsHeroHeader — hero-style title block                           */
/* ------------------------------------------------------------------ */

export function EventsHeroHeader() {
  return (
    <Stagger
      delay={0}
      gap={0.12}
      className="mx-auto max-w-4xl text-center sm:mx-0 sm:text-left"
    >
      <StaggerItem preset="blur">
        <div className="flex w-full flex-row items-start justify-between gap-4">
          {/* Title and description on the left */}
          <div className="flex min-w-0 flex-1 flex-col">
            <h2
              id="event-categories-heading"
              className="mt-2 block font-serif text-3xl font-bold leading-[1.1] tracking-tight text-accent sm:text-4xl lg:text-5xl"
            >
              Event Categories
            </h2>

            <StaggerItem preset="fade-up">
              <span className="mt-4 block text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base lg:text-lg">
                Pick the distance that moves you. Each category supports
                Sudharva&rsquo;s mission to bring diabetes awareness and
                healthier living to our community.
              </span>
            </StaggerItem>
          </div>

          {/* Spinning text on the right */}
          <div className="mb-2 ml-auto flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36">
            <SpinningText
              radius={12}
              className="relative size-full font-bold text-[9px] leading-none text-ink-soft sm:text-[10px]"
            >
              choose your challenge • run for a cause • every stride counts •
            </SpinningText>
          </div>
        </div>
      </StaggerItem>

      {/* <StaggerItem preset="fade-up">
        <span className="mt-4 block text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base line-clamp-2 overflow-hidden lg:text-lg">
          Pick the distance that moves you. Each category supports
          Sudharva&rsquo;s mission to bring diabetes awareness and healthier
          living to our community.
        </span>
      </StaggerItem> */}

      {/* Stats band — hero-style ticker row */}
      <StaggerItem preset="fade-up">
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border/50 pt-8 sm:grid-cols-4 sm:gap-8">
          {[
            { value: "3", label: "Distances" },
            { value: "₹ 500", label: "Starting at" },
            { value: "4", label: "Categories" },
            { value: "100%", label: "For charity" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left"
            >
              <NumberTicker
                value={stat.value}
                className="text-2xl font-extrabold text-primary sm:text-4xl  leading-none whitespace-nowrap"
              />

              <span className="text-xs sm:text-lg text-[var(--color-ink-soft)] whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </StaggerItem>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
/*  EventsStrip — interactive pill nav (stateful client island)        */
/* ------------------------------------------------------------------ */

export function EventsStrip({ items, defaultKey }) {
  const [activeKey, setActiveKey] = useState(defaultKey ?? items[0]?.key);

  const activeCategory =
    items.find((category) => category.key === activeKey) ?? items[0];

  return (
    <Reveal preset="fade-up" delay={0.1} className="mt-10 sm:mt-14">
      <div className="events-category-strip">
        <div className="events-category-track">
          {items.map(({ number, key, label }) => {
            const isActive = key === activeKey;

            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveKey(key)}
                className={cn("event-category", key, isActive && "active")}
              >
                <span className="event-category-number">{number}</span>
                <span className="event-category-label">{label}</span>
                <span className="event-category-dot" />
              </button>
            );
          })}

          <span className="event-category-message" aria-live="polite">
            <span className="event-message-line" aria-hidden="true" />
            <span className="event-category-message-text">
              {activeCategory.message}
            </span>
          </span>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  EventCategoryFeature — creative category pass (hero-style card)    */
/* ------------------------------------------------------------------ */

export function EventCategoryFeature({ item, index, reveal = true }) {
  const {
    number,
    key,
    label,
    description,
    tag,
    icon: Icon,
    iconBg,
    textColor,
    glow,
    benefits,
    ButtonText,
    Amount,
    listingIcon: ListingIcon,
  } = item;

  const meta = CATEGORY_META[key] ?? CATEGORY_META.volunteer;

  const card = (
    <MagicCard
      className={cn(
        "relative h-full flex flex-col rounded-2xl border border-border/60 bg-card transition-all duration-500 ease-out",
        "group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary/50",
        "dark:group-hover:border-[var(--color-surface)]/20",
      )}
      gradientColor={meta.deep}
      gradientFrom="#005daa"
      gradientTo="#ed174f"
      gradientOpacity={0.35}
    >
      {/* Top number badge */}
      <div className="absolute top-5 right-5 z-10">
        <span className="inline-flex items-center justify-center size-8 rounded-full bg-primary text-white text-[10px] font-bold shadow-lg shadow-primary/25">
          {number}
        </span>
      </div>

      {/* Glow layer */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-[calc(var(--radius)+4px)] opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          glow,
        )}
      />
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

      <article className="relative z-10 flex flex-col h-full overflow-hidden rounded-[inherit] p-6 sm:p-8 flex-1">
        {/* Icon pill */}
        <div className="mb-5 inline-flex w-fit shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background/50 p-2.5 transition-transform duration-300 group-hover:scale-105">
          <span
            className={cn(
              "relative flex size-10 shrink-0 items-center justify-center rounded-2xl",
              iconBg,
            )}
          >
            <Icon
              size={32}
              className={cn(
                textColor,
                "transition-transform duration-300 group-hover:rotate-6",
              )}
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Category label — reserved height keeps every card's rows aligned */}
        <h3 className="min-h-[3rem] text-base font-bold leading-tight text-foreground sm:min-h-[3.25rem] sm:text-xl">
          <DiaTextReveal
            text={label}
            colors={["#c679c4", "#fa3d1d", "#ffb005", "#0358f7"]}
            duration={1.2}
            startOnView
            once
            className="block text-base font-bold leading-tight text-foreground sm:text-xl"
          />
        </h3>

        {/* Description — clamped to two lines with a reserved height */}
        <p className="mt-2  min-h-[3rem] text-sm leading-6 text-[var(--color-ink-soft)] sm:text-xs">
          {description}
        </p>

        {/* Tag */}
        <span className="mt-4 inline-flex w-fit shrink-0 items-center rounded-full border border-accent/50 bg-background/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary group-hover:bg-primary group-hover:text-white">
          {tag}
        </span>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          {/* Benefits mini-list */}
          <ul className="list-none space-y-1.5">
            {benefits?.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="shrink-0 size-3.5 rounded-full border border-accent/40 bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center">
                  <Loading02Icon
                    color="currentColor"
                    size={10}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-xs text-[var(--color-ink-soft)] leading-5">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          {/* Amount + CTA */}
          <div className="mt-3 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col min-w-0 items-baseline gap-1.5">
              <span className="text-2xl font-bold leading-none whitespace-nowrap text-primary sm:text-3xl">
                {Amount}
              </span>
              <span className="text-xs whitespace-nowrap text-[var(--color-ink-soft)]">
                per runner
              </span>
            </div>
          </div>
          <RainbowButton
            asChild
            variant="accent"
            size="sm"
            className="w-full shrink-0 justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider sm:ml-auto sm:w-auto"
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {ButtonText ?? "Register"}
              <span className="text-[10px]">→</span>
            </Link>
          </RainbowButton>
        </div>
      </article>
    </MagicCard>
  );

  if (!reveal) {
    return <div className="group relative h-full">{card}</div>;
  }

  return (
    <StaggerItem
      key={key}
      preset="fade-up"
      className="group relative h-full scroll-mt-28"
      id={item.anchorId}
    >
      {card}
    </StaggerItem>
  );
}
/* ------------------------------------------------------------------ */
/*  EventsFeatureGrid — responsive creative grid (replaces cards)      */
/*   Desktop (lg+): 3-col featured grid                                */
/*   Tablet: 2-col                                                     */
/*   Mobile: 1-col                                                     */
/* ------------------------------------------------------------------ */

export function EventsFeatureGrid({ items }) {
  return (
    <Stagger
      gap={0.14}
      amount={0.15}
      className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4"
    >
      {items.map((item, index) => (
        <EventCategoryFeature key={item.key} item={item} index={index} />
      ))}
    </Stagger>
  );
}

/* Keep the old name as an alias so existing callers still work */
export const EventsCardGrid = EventsFeatureGrid;

/* ------------------------------------------------------------------ */
/*  EventsBackground — GSAP-drifted glow layer                         */
/* ------------------------------------------------------------------ */

export function EventsBackground() {
  return (
    <GsParallax
      speed={0.12}
      className="events-glow pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <span className="block h-full w-full" />
    </GsParallax>
  );
}
