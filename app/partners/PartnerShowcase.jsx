"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Reveal, Stagger, StaggerItem } from "@/components/animation/Reveal";

const tiers = [
  {
    key: "gold",
    label: "Gold Sponsorship",
    amount: "INR 5,00,000+",
    badge: "Prime Visibility",
    summary:
      "Dominant stage presence, title-level placements, and lead recognition across race-day assets.",
    perks: ["Main stage branding", "Jersey front placement", "Press feature mention"],
    cardClass:
      "md:col-span-8 lg:col-span-7 min-h-[330px] lg:min-h-[360px] ring-amber-200/70",
    surfaceClass:
      "from-amber-50/95 via-yellow-50/90 to-orange-100/90 dark:from-amber-200/15 dark:via-yellow-200/10 dark:to-orange-200/10",
    titleClass: "text-amber-900 dark:text-amber-200",
  },
  {
    key: "silver",
    label: "Silver Sponsorship",
    amount: "INR 2,00,000+",
    badge: "Strong Visibility",
    summary:
      "High-impact placements with dedicated branding zones in event and digital channels.",
    perks: ["Arch banner branding", "Social media shoutouts", "Booth branding"],
    cardClass:
      "md:col-span-4 lg:col-span-5 min-h-[285px] lg:min-h-[320px] ring-slate-300/70",
    surfaceClass:
      "from-slate-100/95 via-zinc-50/90 to-slate-200/80 dark:from-slate-300/15 dark:via-zinc-300/10 dark:to-slate-200/15",
    titleClass: "text-slate-800 dark:text-slate-100",
  },
  {
    key: "bronze",
    label: "Bronze Sponsorship",
    amount: "INR 1,00,000+",
    badge: "Focused Presence",
    summary:
      "Reliable category-level support with repeated touchpoints through participant journey.",
    perks: ["Backstage branding", "Website logo listing", "On-route display"],
    cardClass:
      "md:col-span-6 lg:col-span-4 min-h-[240px] ring-orange-200/70",
    surfaceClass:
      "from-orange-100/95 via-amber-50/90 to-yellow-50/85 dark:from-orange-300/15 dark:via-amber-300/10 dark:to-yellow-300/10",
    titleClass: "text-orange-900 dark:text-orange-200",
  },
  {
    key: "community",
    label: "Community Contributor",
    amount: "INR 50,000+",
    badge: "Support Layer",
    summary:
      "Support hydration, first-aid, and volunteer operations through targeted contributions.",
    perks: ["Support wall mention", "Volunteer tee mention", "Digital gratitude card"],
    cardClass:
      "md:col-span-4 lg:col-span-3 min-h-[210px] ring-cyan-200/70",
    surfaceClass:
      "from-cyan-50/95 via-sky-50/90 to-blue-50/85 dark:from-cyan-300/15 dark:via-sky-300/10 dark:to-blue-300/10",
    titleClass: "text-cyan-900 dark:text-cyan-200",
  },
  {
    key: "inKind",
    label: "In-Kind Partner",
    amount: "Goods or Services",
    badge: "Operational Value",
    summary:
      "Provide products, nutrition, media, or medical support that powers event execution.",
    perks: ["Partner wall mention", "Category badge", "Post-event recognition"],
    cardClass:
      "md:col-span-3 lg:col-span-3 min-h-[210px] ring-emerald-200/70",
    surfaceClass:
      "from-emerald-50/95 via-lime-50/90 to-green-50/85 dark:from-emerald-300/15 dark:via-lime-300/10 dark:to-green-300/10",
    titleClass: "text-emerald-900 dark:text-emerald-200",
  },
  {
    key: "media",
    label: "Media Ally",
    amount: "Channel Partnership",
    badge: "Amplification",
    summary:
      "Broadcast the mission with campaign storytelling, athlete coverage, and race-day highlights.",
    perks: ["Brand mentions", "Interview access", "Content collaboration"],
    cardClass:
      "md:col-span-3 lg:col-span-2 min-h-[210px] ring-violet-200/70",
    surfaceClass:
      "from-violet-50/95 via-fuchsia-50/90 to-pink-50/85 dark:from-violet-300/15 dark:via-fuchsia-300/10 dark:to-pink-300/10",
    titleClass: "text-violet-900 dark:text-violet-200",
  },
];

const logoDots = [
  "Stride Labs",
  "Artemis Health",
  "Riverline Foods",
  "Pulse One",
  "Urban Rail",
  "Aster Med",
  "Blue Loop",
  "Green Arc",
];

function OrbitalRibbon({ reduceMotion }) {
  if (reduceMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-28 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-accent/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-accent/70 shadow-[0_0_24px_rgba(237,23,79,0.5)]" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-36 h-[320px] w-[320px] -translate-x-1/2 rounded-full border border-primary/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary/70 shadow-[0_0_16px_rgba(0,93,170,0.45)]" />
      </motion.div>
    </div>
  );
}

function TierCard({ tier, index, reduceMotion }) {
  return (
    <StaggerItem preset="fade-up" className={tier.cardClass}>
      <motion.article
        whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className={`group relative h-full overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br p-5 w-full shadow-lg ring-1 backdrop-blur-sm sm:p-6 ${tier.surfaceClass}`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full border min-w-fit border-black/10 bg-white/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/80">
              {tier.badge}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/65">
              Tier {index + 1}
            </span>
          </div>

          <h3 className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl ${tier.titleClass}`}>
            {tier.label}
          </h3>

          <p className="mt-2 text-lg font-bold text-foreground/90">{tier.amount}</p>

          <p className="mt-3 text-sm leading-6 text-foreground/75">{tier.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {tier.perks.map((perk) => (
              <span
                key={perk}
                className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-foreground/75"
              >
                {perk}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </StaggerItem>
  );
}

export default function PartnerShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(237,23,79,0.14),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(0,93,170,0.16),transparent_36%),linear-gradient(180deg,var(--background),color-mix(in_srgb,var(--background)_82%,white)_100%)] pb-20 pt-24 sm:pt-28">
      <OrbitalRibbon reduceMotion={reduceMotion} />

      <motion.div
        className="pointer-events-none absolute -left-20 top-36 h-72 w-72 rounded-full bg-accent/12 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 40, -10, 0], y: [0, -30, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-primary/12 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -35, 12, 0], y: [0, 24, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <section className="container-page relative z-10">
        <Reveal preset="blur">
          <p className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-accent">
            Partnership Deck
          </p>
        </Reveal>

        <Reveal preset="fade-up" delay={0.05}>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Power The Marathon Mission Through Tiered Partnerships
          </h1>
        </Reveal>

        <Reveal preset="fade-up" delay={0.1}>
          <p className="mt-5 max-w-3xl text-base leading-7 text-ink-soft sm:text-lg">
            Gold partners command the largest visual footprint, Silver partners receive major visibility,
            Bronze partners support key event moments, and contribution tracks fund operational impact.
          </p>
        </Reveal>

        <Stagger delay={0.08} gap={0.08} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12 lg:gap-5">
          {tiers.map((tier, index) => (
            <TierCard key={tier.key} tier={tier} index={index} reduceMotion={reduceMotion} />
          ))}
        </Stagger>

        <Reveal preset="fade-up" delay={0.08} className="mt-12">
          <div className="rounded-3xl border border-border/70 bg-surface/75 p-6 shadow-lg backdrop-blur sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Visibility Constellation
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
                  Every contribution appears in a weighted exposure map where sponsor level decides card
                  size, stage proximity, and storytelling priority.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-accent-foreground shadow-md transition hover:brightness-95"
              >
                Become A Partner
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {logoDots.map((name, index) => (
                <motion.div
                  key={name}
                  className="rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-foreground/75"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, index % 2 === 0 ? -4 : -7, 0],
                        }
                  }
                  transition={{ duration: 2.8 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
