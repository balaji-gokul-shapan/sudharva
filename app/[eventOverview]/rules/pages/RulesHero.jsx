"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  ShieldCheckIcon,
  Clock01Icon,
  ActivityIcon,
  Target01Icon,
  UserGroupIcon,
  ArrowRight02Icon,
  CheckListIcon,
} from "@animateicons/react/huge";

import { Reveal } from "@/components/animation/Reveal";
import { RainbowButton } from "@/components/animation/rainbowButton";
import ScrollStack from "@/components/animation/ScrollStack";
import { Particles } from "@/components/animation/particles";
import { RULE_SECTIONS } from "@/components/registration/datas/data";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------
   Rule Card
------------------------------------------------------- */

const quickStats = [
  { icon: UserGroupIcon, label: "Open to ages 16+" },
  { icon: Clock01Icon, label: "Chip timed" },
  {
    icon: ShieldCheckIcon,
    label: "Medical support on route",
  },
  { icon: Target01Icon, label: "4 race categories" },
];

function RuleCard({ section, index }) {
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.08,
        ease: "easeOut",
      }}
      className="group relative isolate overflow-hidden rounded-[28px] border bg-[var(--color-surface)]/70 p-0 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        borderColor: `color-mix(in srgb, ${section.color} 25%, var(--color-border, transparent))`,
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--color-surface, #fff) 86%, white) 0%, color-mix(in srgb, var(--color-surface, #fff) 74%, #f8fafc) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl transition-transform duration-700 group-hover:scale-125"
        style={{ background: section.color }}
        aria-hidden="true"
      />

      {/* Top strip */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${section.color} 0%, color-mix(in srgb, ${section.color} 35%, white) 55%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Number badge */}
      <div
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border text-[11px] font-black tracking-widest"
        style={{
          color: section.color,
          borderColor: `color-mix(in srgb, ${section.color} 40%, white)`,
          background: `radial-gradient(circle at 35% 35%, white 0%, color-mix(in srgb, ${section.tint} 70%, white) 80%)`,
          boxShadow: `inset 0 0 0 3px color-mix(in srgb, ${section.color} 10%, white)`,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="relative grid min-h-75 grid-cols-[10px_1fr]">
        {/* Timeline rail */}
        <div className="relative">
          <div
            className="absolute inset-y-5 left-1/2 w-0.5 -translate-x-1/2 rounded-full"
            style={{
              background: `color-mix(in srgb, ${section.color} 30%, transparent)`,
            }}
          />

          <div
            className="absolute left-1/2 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 bg-[var(--color-surface)]"
            style={{ borderColor: section.color }}
          />
        </div>

        <div className="px-5 pb-6 pt-6 sm:px-6 sm:pb-7 sm:pt-7">
          {/* Header */}
          <div className="mb-5 flex items-start gap-3 pr-12">
            <div
              className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border"
              style={{
                borderColor: `color-mix(in srgb, ${section.color} 35%, transparent)`,
                background: `linear-gradient(145deg, color-mix(in srgb, ${section.tint} 65%, white) 0%, color-mix(in srgb, ${section.color} 10%, white) 100%)`,
              }}
            >
              <div
                className="absolute -right-4 -top-4 h-8 w-8 rounded-full opacity-30"
                style={{ background: section.color }}
                aria-hidden="true"
              />

              <Icon
                size={18}
                className="relative z-10 shrink-0"
                style={{ color: section.color }}
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-extrabold tracking-tight text-ink">
                {section.title}
              </h3>

              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft/80">
                Race Day Compliance
              </p>
            </div>
          </div>

          {/* Rules list */}
          <ul className="space-y-2.5">
            {section.rules.map((rule, i) => (
              <li
                key={i}
                className="group/item relative overflow-hidden rounded-xl border px-3 py-2.5 text-sm leading-relaxed text-ink-soft transition-colors duration-300"
                style={{
                  borderColor: `color-mix(in srgb, ${section.color} 18%, var(--color-border, transparent))`,
                  background:
                    "color-mix(in srgb, var(--color-surface, #fff) 82%, transparent)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${section.tint} 58%, white)`,
                      color: section.color,
                    }}
                    aria-hidden="true"
                  >
                    <CheckListIcon size={10} className="shrink-0" />
                  </span>

                  <span className="relative z-10">{rule}</span>
                </div>

                <span
                  className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r transition-all duration-300 group-hover/item:w-1.5"
                  style={{ background: section.color }}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Corner detail */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-10 w-10"
        style={{
          background:
            "linear-gradient(135deg, transparent 50%, color-mix(in srgb, var(--color-surface, #fff) 90%, #e2e8f0) 50%)",
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

/* -------------------------------------------------------
   Rules Page
------------------------------------------------------- */

export default function RulesHero() {
  const isReducedMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* Background glows */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-40 -top-40 size-[500px] rounded-full bg-volunteer/5 blur-[120px]" />
        <div className="absolute -right-60 top-1/3 size-[400px] rounded-full bg-health/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 size-[360px] rounded-full bg-environment/5 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative pb-16 pt-28 sm:pb-20 sm:pt-36">
        <div className="container-page mx-auto max-w-4xl px-4 text-center">
          <Reveal preset="fade-up" delay={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              <span
                className="size-1.5 animate-pulse rounded-full bg-accent"
                aria-hidden="true"
              />
              Sudharva Marathon 2025
            </span>
          </Reveal>

          <Reveal preset="blur" delay={0.08} className="mt-5 block">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              Rules &amp; <span className="text-accent">Regulations</span>
            </h1>
          </Reveal>

          <Reveal preset="fade-up" delay={0.16} className="mt-5 block">
            <p className="mx-auto max-w-2xl text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
              Everything you need to know to run safely, stay prepared, and make
              the most of race day. Please read all rules carefully before 
              participating.
            </p>
          </Reveal>

          {/* Quick stats */}
          <Reveal preset="fade-up" delay={0.24} className="mt-8 block">
            <div className="flex flex-wrap justify-center gap-3">
              {quickStats.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-[var(--color-surface)]/80 px-4 py-2 text-xs font-medium text-[var(--color-ink-soft)] shadow-sm backdrop-blur-sm"
                >
                  <Icon size={13} className="shrink-0 text-accent" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Important notice */}
      <div className="container-page mx-auto mb-12 max-w-5xl px-4">
        <Reveal preset="fade-up" delay={0}>
          <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-[var(--color-ink-soft)]">
            <ActivityIcon
              size={20}
              className="mt-0.5 shrink-0 text-amber-500"
            />

            <p>
              <span className="font-bold text-[var(--color-ink)]">
                Important:{" "}
              </span>
              By completing your registration, you agree to abide by all rules
              and regulations listed on this page. Violation of any rule may
              result in immediate disqualification without refund. The
              organisers reserve the right to amend these rules at any time.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Rules */}
      <section className="container-page relative mx-auto max-w-7xl px-4 pb-20 sm:pb-24">
        {/* Mobile stacked cards */}
        <div className="relative lg:hidden">
          <ScrollStack
            className="mx-auto w-full [&>div]:px-0 sm:[&>div]:px-2"
            useWindowScroll
            stackPosition="12%"
            itemDistance={45}
            itemStackDistance={18}
            holdDistance={80}
            baseScale={0.96}
            itemScale={0.025}
            dimAmount={0.08}
            blurAmount={0}
            smoothScroll
            snap
          >
            {RULE_SECTIONS.map((section, index) => (
              <RuleCard key={section.id} section={section} index={index} />
            ))}
          </ScrollStack>
        </div>

        {/* Desktop grid remains unchanged */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {RULE_SECTIONS.map((section, index) => (
            <RuleCard key={section.id} section={section} index={index} />
          ))}
        </div>
      </section>

      {/* CTA: naturally follows the completed rules section */}
      <section className="relative z-10 border-t border-border/90">
        {!isReducedMotion && (
          <Particles
            className="absolute inset-0"
            quantity={90}
            size={1.8}
            staticity={70}
            ease={70}
            color="#ed174f"
          />
        )}
        <div className="container-page mx-auto max-w-3xl px-4 py-20 text-center">
          <Reveal preset="fade-up" delay={0}>
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-4xl">
              Ready to Run?
            </h2>

            <p className="mt-3 text-base text-[var(--color-ink-soft)]">
              You&apos;ve read the rules. Now it&apos;s time to register and
              make every stride count for a diabetes-free tomorrow.
            </p>
          </Reveal>

          <Reveal preset="fade-up" delay={0.1} className="mt-8 block">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <RainbowButton asChild variant="accent" size="lg">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2"
                >
                  Register Now
                  <ArrowRight02Icon
                    size={16}
                    duration={1}
                    className="shrink-0"
                  />
                </Link>
              </RainbowButton>
              {/* <Button asChild variant="outline" size="lg">
                <Link
                  href="/event"
                  className="text-sm font-medium text-[var(--color-ink-soft)] underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline"
                >
                  View Event Categories →
                </Link>
              </Button> */}
              <button
                type="button"
                onClick={() => setSubmitted(null)}
                className="cursor-pointer inline-flex items-center rounded-md border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] transition hover:border-accent hover:text-accent"
              >
                View Event Categories
                <ArrowRight02Icon
                  size={16}
                  duration={1}
                  className="shrink-0 ml-2"
                />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
