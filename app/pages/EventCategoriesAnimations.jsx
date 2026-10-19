"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/animation/magicCard";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { DiaTextReveal } from "@/components/animation/diaText";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/Reveal";
import { GsParallax } from "@/components/animation/GsScroll";

/* ------------------------------------------------------------------ */
/*  EventsHeader — pill + title + copy (Motion stagger)                */
/* ------------------------------------------------------------------ */

export function EventsHeader() {
  return (
    <Stagger
      delay={0}
      gap={0.1}
      className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-left"
    >
      <StaggerItem preset="fade-down">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft shadow-sm">
          <span
            className="size-1.5 animate-pulse rounded-full bg-accent"
            aria-hidden="true"
          />
          What&rsquo;s on at Sudharva
        </span>
      </StaggerItem>

      <StaggerItem preset="blur">
        <span
          id="event-categories-heading"
          className="mt-5 block text-3xl font-bold text-primary sm:text-4xl"
        >
          Event Categories
        </span>
      </StaggerItem>

      <StaggerItem preset="fade-up">
        <span className="mt-4 block text-sm leading-6 text-accent sm:text-base">
          Explore the various categories of events we organize to support our
          cause.
        </span>
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
/*  EventsCardGrid — staggered MagicCards (Motion + GSAP drift)        */
/* ------------------------------------------------------------------ */

export function EventsCardGrid({ items }) {
  return (
    <Stagger
      gap={0.12}
      amount={0.15}
      className="mt-10 grid grid-cols-1 gap-5 text-left xs:grid-cols-2 sm:mt-14 lg:grid-cols-4"
    >
      {items.map(
        ({
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
        }) => (
          <StaggerItem key={key} preset="fade-up" className="h-full">
            <MagicCard
              className="relative h-full rounded-xl shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              gradientColor="rgb(0 93 170 / 0.14)"
              gradientFrom="#005daa"
              gradientTo="#ed174f"
              gradientOpacity={0.7}
            >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[inherit] p-6">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute -right-10 -top-10 size-36 rounded-full opacity-45 blur-3xl transition-opacity duration-300 group-hover:opacity-80",
                      glow
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-5 top-2 text-6xl font-black leading-none text-ink opacity-[0.06] transition-opacity duration-300 group-hover:opacity-10"
                  >
                    {number}
                  </span>

                  <span
                    className={cn(
                      "relative flex size-14 shrink-0 items-center justify-center rounded-2xl",
                      iconBg
                    )}
                  >
                    <Icon
                      size={28}
                      className={cn(
                        textColor,
                        "transition-transform duration-300 group-hover:scale-110"
                      )}
                      aria-hidden="true"
                    />
                  </span>

                  <h3 className="relative mt-5 min-h-14 text-xl font-bold text-foreground">
                    <DiaTextReveal
                      text={label}
                      colors={["#c679c4", "#fa3d1d", "#ffb005", "#0358f7"]}
                      duration={1.5}
                      startOnView
                      once
                    />
                  </h3>
                  <p className="relative mt-3 text-3xl font-bold text-primary">
                    {Amount}
                  </p>
                  <p className="relative mt-2 min-h-12 text-sm leading-6 text-ink-soft">
                    {description}
                  </p>
                  {benefits && benefits.length > 0 && (
                    <ul className="relative mt-4 list-none space-y-2 text-sm font-medium text-ink-soft">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ListingIcon
                            size={18}
                            className={cn(
                              textColor,
                              "shrink-0 transition-transform duration-300 group-hover:scale-110"
                            )}
                            aria-hidden="true"
                          />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="relative mt-auto flex flex-col gap-3 pt-6">
                    <span
                      className={cn(
                        "inline-flex w-fit self-start rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                        iconBg,
                        textColor
                      )}
                    >
                      {tag}
                    </span>
                    {ButtonText && (
                      <RainbowButton
                        asChild
                        variant="accent"
                        size="lg"
                        className="my-3 w-full text-sm"
                      >
                        <Link
                          href="/register"
                          className="inline-flex w-full items-center justify-center"
                        >
                          {ButtonText}
                        </Link>
                      </RainbowButton>
                    )}
                  </div>
                </article>
              </MagicCard>
          </StaggerItem>
        )
      )}
    </Stagger>
  );
}

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
