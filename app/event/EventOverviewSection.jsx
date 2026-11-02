"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SparkleIcon,
  ArrowDownRight01Icon,
  HeartIcon,
  UserGroupIcon,
  Building01Icon,
  Globe02Icon,
  TelegramIcon,
  SparklesIcon,
  Target01Icon,
  ChartLineIcon,
  ShieldCheckIcon,
  HeartCheckIcon,
} from "@animateicons/react/huge";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/animation/NumberTicker";
import { highlights, objectives, overviewStats } from "../datas/events/data";
import Stack from "@/components/animation/Stack";

gsap.registerPlugin(ScrollTrigger);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

function SectionLabel({ children, light = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
        light
          ? "border-white/20 bg-white/10 text-white"
          : "border-primary/20 bg-primary/5 text-primary"
      }`}
    >
      <span className="size-2 animate-pulse rounded-full bg-accent" />
      {children}
    </span>
  );
}

export default function EventOverviewSection() {
  const sectionRef = useRef(null);
  const objectiveRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".objective-item",
        { autoAlpha: 0, y: 45 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: objectiveRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".objective-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: objectiveRef.current,
            start: "top 70%",
            end: "bottom 65%",
            scrub: 0.7,
          },
        },
      );

      gsap.fromTo(
        ".overview-stat",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".overview-stats",
            start: "top 88%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={sectionRef}
      className="overflow-hidden bg-background text-foreground"
    >
      {/* 01 — EVENT OVERVIEW */}
      <section
        id="event-Overview"
        aria-labelledby="event-overview-heading"
        className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 top-10 -z-10 size-96 rounded-full bg-accent/10 blur-[100px]"
        />

        <div className="container-page">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel>More than a marathon</SectionLabel>
            </motion.div>

            <motion.h2
              id="event-overview-heading"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-7 text-4xl font-black leading-[1.05] tracking-[-0.055em] text-primary sm:text-6xl lg:text-7xl"
            >
              Run for health.
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-health bg-clip-text text-transparent">
                Run for humanity.
              </span>
            </motion.h2>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-7 max-w-3xl text-sm leading-7 text-ink-soft sm:text-base sm:leading-8"
            >
              The Sudharva 2027 is a community-focused marathon organized by
              Appa Charitable Trust to promote health, fitness, social
              responsibility, and community development. Bringing together
              runners, families, students, corporate teams, healthcare
              institutions, and sponsors, the event transforms every step into
              an opportunity to make a meaningful difference.
            </motion.p>
          </div>

          {/* Editorial stats strip */}
          <div className="overview-stats mt-14 grid grid-cols-2 border-y border-border py-7 sm:mt-20 sm:grid-cols-4 sm:py-9">
            {overviewStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`overview-stat px-4 py-4 text-center sm:px-6 ${
                  index !== 0 ? "sm:border-l sm:border-border" : ""
                } ${
                  index % 2 !== 0 ? "border-l border-border sm:border-l" : ""
                } ${index > 1 ? "border-t border-border sm:border-t-0" : ""}`}
              >
                <NumberTicker
                  value={stat.value}
                  className="block text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl"
                />
                <span className="mt-2 block text-[9px] font-bold uppercase tracking-[0.15em] text-ink-soft sm:text-[10px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — EVENT OBJECTIVES */}
      <section
        id="event-objectives"
        aria-labelledby="objectives-heading"
        className="relative isolate overflow-hidden border-y border-border bg-muted/40 py-20 text-foreground sm:py-28 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-40 -z-10 size-96 rounded-full bg-health/10 blur-[100px]"
        />

        <div className="container-page relative">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            {/* Sticky editorial heading */}
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <SectionLabel>Our mission</SectionLabel>

                <h2
                  id="objectives-heading"
                  className="mt-7 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl"
                >
                  Five goals.
                  <br />
                  <span className="text-accent">One purpose.</span>
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-ink-soft sm:text-base sm:leading-8">
                  Every stride starts with a purpose. Our objectives bring
                  health, community, compassion, and collaboration together to
                  create change that lasts beyond race day.
                </p>

                <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Target01Icon size={23} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-card-foreground">
                      Purpose in every step
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Health. People. Positive change.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Animated objectives timeline */}
            <div ref={objectiveRef} className="relative">
              <div
                aria-hidden="true"
                className="absolute bottom-6 left-[23px] top-6 w-px bg-border"
              />

              <div
                aria-hidden="true"
                className="objective-progress absolute left-[23px] top-6 h-[calc(100%-48px)] w-px origin-top bg-gradient-to-b from-accent via-primary to-health"
              />

              <div className="space-y-5">
                {objectives.map((objective) => {
                  const Icon = objective.icon;

                  return (
                    <article
                      key={objective.number}
                      className="objective-item group relative pl-14"
                    >
                      <div className="absolute left-0 top-6 z-10 flex size-[47px] items-center justify-center rounded-full border border-border bg-card text-xs font-black text-primary shadow-sm transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                        {objective.number}
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-accent sm:text-[10px]">
                              {objective.tag}
                            </span>

                            <h3 className="mt-3 text-lg font-extrabold leading-snug tracking-tight text-card-foreground sm:text-2xl">
                              {objective.title}
                            </h3>
                          </div>

                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:rotate-[-6deg] group-hover:bg-accent/10 group-hover:text-accent sm:size-12">
                            <Icon size={22} />
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-ink-soft">
                          {objective.description}
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                          <span className="h-px w-6 bg-accent" />
                          Our commitment
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — EVENT HIGHLIGHTS */}
      <section
        id="event-highlights"
        aria-labelledby="highlights-heading"
        className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      >
        <div className="container-page">
          <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <SectionLabel>The race at a glance</SectionLabel>
              </motion.div>

              <motion.h2
                id="highlights-heading"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 max-w-2xl text-4xl font-black tracking-[-0.05em] text-primary sm:text-5xl lg:text-6xl"
              >
                Big energy.
                <br />
                <span className="text-accent">Bigger impact.</span>
              </motion.h2>
            </div>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-sm text-sm leading-7 text-ink-soft sm:text-base"
            >
              More than miles and finish lines. Discover the people,
              partnerships, and opportunities that make this event special.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="hidden auto-rows-auto gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 "
          >
            {highlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <motion.article
                  key={highlight.id}
                  variants={itemVariants}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -5, transition: { duration: 0.25 } }
                  }
                  className={`group relative isolate min-h-[210px] overflow-hidden rounded-3xl p-6 transition-shadow duration-300 hover:shadow-lg sm:p-8 ${highlight.className} ${
                    highlight.large ? "lg:p-10" : ""
                  }`}
                >
                  {highlight.large && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-10 -z-10 size-64 rounded-full border border-primary-foreground/10"
                    >
                      <div className="absolute inset-7 rounded-full border border-primary-foreground/10" />
                      <div className="absolute inset-14 rounded-full border border-primary-foreground/10" />
                    </div>
                  )}

                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={cn(
                          "flex size-11 items-center justify-center rounded-xl border",
                          highlight.countClassName,
                          highlight.large
                            ? "bg-primary-foreground/10 border-current/40"
                            : "bg-background/90 border-current/30",
                        )}
                      >
                        <Icon size={22} />
                      </div>

                      <ArrowDownRight01Icon
                        size={22}
                        className="opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100"
                      />
                    </div>

                    <div className="mt-7">
                      <p
                        className={cn(
                          highlight.countClassName,
                          "font-extrabold leading-none tracking-[-0.06em]",
                          highlight.large
                            ? "text-5xl sm:text-6xl lg:text-7xl"
                            : "text-3xl sm:text-4xl",
                        )}
                      >
                        {highlight.number}
                      </p>
                      <h3
                        className={` ${cn(highlight.titleClassName, "mt-3 font-extrabold sm:text-lg")}`}
                      >
                        {highlight.title}
                      </h3>

                      <p
                        className={`mt-2 max-w-sm text-xs leading-6 sm:text-sm ${
                          highlight.large
                            ? "text-primary-foreground/75"
                            : "text-card-foreground/75"
                        }`}
                      >
                        {highlight.description}
                      </p>
                    </div>

                    {highlight.large && (
                      <div className="mt-auto flex items-center gap-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/80">
                        <SparklesIcon size={14} />
                        Every runner makes a difference
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
          {/* Mobile: Stack with highlight content */}
          <div className="flex justify-center overflow-hidden py-8 sm:hidden">
            <div className="h-[300px] w-full max-w-[250px]">
              <Stack
                layout="fan"
                sendToBackOnClick={false}
                cards={highlights.map((highlight) => {
                  const Icon = highlight.icon;

                  return (
                    <article
                      key={highlight.id}
                      className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border p-5 shadow-lg ${highlight.className}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-current/20 bg-background/20">
                          <Icon size={22} />
                        </div>

                        <ArrowDownRight01Icon
                          size={20}
                          className="opacity-60"
                        />
                      </div>

                      <div className="mt-6">
                        <p
                          className={cn(
                            "text-3xl font-extrabold leading-tight tracking-tight",
                            highlight.countClassName,
                          )}
                        >
                          {highlight.number}
                        </p>

                        <h3
                          className={cn(
                            "mt-2 text-lg font-bold",
                            highlight.titleClassName,
                          )}
                        >
                          {highlight.title}
                        </h3>

                        <p className="mt-2 text-sm leading-5 opacity-80">
                          {highlight.description}
                        </p>
                      </div>

                      {highlight.large && (
                        <div className="mt-auto flex items-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-wider opacity-80">
                          <SparklesIcon size={14} />
                          Every runner makes a difference
                        </div>
                      )}
                    </article>
                  );
                })}
                visible={3}
                spread={0.35}
                depth={0.5}
                radius={16}
                frame={0}
                shadow
                tilt={20}
                threshold={90}
                speed={1}
                autoplay={false}
                pauseOnHover={false}
              />
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-ink-soft">
            *Participant, corporate-team, and digital-reach figures are event
            targets, not confirmed attendance or measured results.
          </p>
        </div>
      </section>

      {/* 04 — SPONSOR CALL TO ACTION */}
      <section
        id="event-partnerships"
        aria-labelledby="partnership-heading"
        className="px-4 pb-20 sm:px-6 sm:pb-28"
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75 }}
          className="container-page relative isolate overflow-hidden rounded-[2rem] bg-donate-night px-6 py-12 text-white shadow-lg sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-40 -z-10 size-[420px] rounded-full bg-accent/25 blur-[90px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 size-80 rounded-full bg-primary/30 blur-[90px]"
          />

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <SectionLabel light>
                <HeartCheckIcon size={13} />
                Partner with purpose
              </SectionLabel>

              <h2
                id="partnership-heading"
                className="mt-7 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl"
              >
                Your brand.
                <br />
                <span className="text-accent">A healthier tomorrow.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                Join the Sudharva 2027 as a sponsor or corporate partner.
                Connect your organization with a community committed to health,
                social responsibility, and meaningful impact.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-white/80">
                <span className="flex items-center gap-2">
                  <ShieldCheckIcon size={16} className="text-accent" />
                  Purpose-led partnerships
                </span>
                <span className="flex items-center gap-2">
                  <ChartLineIcon size={16} className="text-accent" />
                  Brand visibility
                </span>
                <span className="flex items-center gap-2">
                  <HeartCheckIcon size={16} className="text-accent" />
                  Community wellness
                </span>
              </div>
            </div>

            <Link
              href="/contact"
              className="group inline-flex min-h-14 items-center justify-center gap-3 self-center rounded-full bg-accent px-7 py-4 text-sm font-bold text-accent-foreground shadow-md transition-all duration-300 hover:-translate-y-1 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-donate-night"
            >
              Become a partner
              <SparkleIcon
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-3 border-t border-white/15 pt-6">
            <SparkleIcon size={17} className="text-accent" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-xs">
              Together, we move communities forward.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
