"use client";

import Image from "next/image";
import Link from "next/link";

import PartnerLoop from "@/components/animation/partnerLoop";
import { Reveal, Stagger, StaggerItem } from "@/components/animation/Reveal";
import { GsParallax } from "@/components/animation/GsScroll";
import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  PartnersHeader - pill + title + copy (Motion stagger)              */
/* ------------------------------------------------------------------ */

export function PartnersHeader() {
  return (
    <Stagger delay={0} gap={0.1} className="mx-auto max-w-3xl text-center">
      <StaggerItem preset="fade-down">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-environment bg-environment/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-environment shadow-2xs backdrop-blur-md">
          <span
            className="size-1.5 animate-pulse rounded-full bg-accent"
            aria-hidden="true"
          />
          Together for a Cause
        </span>
      </StaggerItem>

      <StaggerItem preset="blur">
        <span
          id="partners-heading"
          className="block text-3xl text-primary font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          Our Partners
        </span>
      </StaggerItem>

      <StaggerItem preset="fade-up">
        <span className="mx-auto mt-4 block max-w-xl text-sm leading-7 text-accent/90 sm:text-base">
          Working together with organizations that share our vision for a
          healthier, stronger community.
        </span>
      </StaggerItem>
    </Stagger>
  );
}

/* ---------- honeycomb layout engine ---------- */

// Circumradius per tier (relative units). Tweak these to change the size contrast.
const TIER_RADIUS = { gold: 6.6, silver: 4.3, bronze: 3.22 };
const HEX_GAP = 0.27; // same gap between ALL tiles (relative to gold radius)

const SQRT3_2 = Math.sqrt(3) / 2;
const rad = (deg) => (deg * Math.PI) / 180;
const AXES = [0, 60, 120].map((d) => [Math.cos(rad(d)), Math.sin(rad(d))]);
const DIRS = [0, 60, 120, 180, 240, 300].map((d) => [
  Math.cos(rad(d)),
  Math.sin(rad(d)),
]);

function layoutHoneycomb(logos) {
  const tiles = logos.map((logo, i) => {
    const tier = (logo?.tier ?? "").toLowerCase();
    const r = TIER_RADIUS[tier] ?? TIER_RADIUS.silver;
    return { logo, i, r, a: r * SQRT3_2, x: 0, y: 0 }; // a = apothem
  });

  // biggest first, so gold ends up in the middle
  const sorted = [...tiles].sort((p, q) => q.r - p.r || p.i - q.i);
  const placed = [];
  const EPS = 1e-6;

  const fits = (x, y, a) =>
    placed.every((p) => {
      const dx = x - p.x;
      const dy = y - p.y;
      const need = a + p.a + HEX_GAP - EPS;
      return AXES.some(([ax, ay]) => Math.abs(dx * ax + dy * ay) >= need);
    });

  sorted.forEach((t) => {
    if (!placed.length) {
      placed.push(t);
      return;
    }
    const cx = placed.reduce((s, p) => s + p.x, 0) / placed.length;
    const cy = placed.reduce((s, p) => s + p.y, 0) / placed.length;

    let best = null;
    let bestScore = Infinity;

    for (const p of placed) {
      for (const [dx, dy] of DIRS) {
        const dist = p.a + t.a + HEX_GAP; // edge-to-edge => equal gap
        const x = p.x + dx * dist;
        const y = p.y + dy * dist;
        if (!fits(x, y, t.a)) continue;
        const score = Math.hypot(x - cx, y - cy);
        if (score < bestScore - 1e-9) {
          bestScore = score;
          best = { x, y };
        }
      }
    }
    t.x = best.x;
    t.y = best.y;
    placed.push(t);
  });

  const minX = Math.min(...placed.map((t) => t.x - t.a));
  const maxX = Math.max(...placed.map((t) => t.x + t.a));
  const minY = Math.min(...placed.map((t) => t.y - t.r));
  const maxY = Math.max(...placed.map((t) => t.y + t.r));

  return { tiles: placed, minX, minY, W: maxX - minX, H: maxY - minY };
}

/* ---------- tile (fills whatever box the cluster gives it) ---------- */
// Hexagon with rounded corners. Increase CORNER_RADIUS for a softer look (max ~12).
const CORNER_RADIUS = 8;

function roundedHexPath(r = CORNER_RADIUS) {
  const pts = [
    [43.3, 0],
    [86.6, 25],
    [86.6, 75],
    [43.3, 100],
    [0, 75],
    [0, 25],
  ];
  const n = pts.length;
  const move = (from, to) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const len = Math.hypot(dx, dy);
    return [from[0] + (dx / len) * r, from[1] + (dy / len) * r];
  };

  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const s = move(cur, prev); // where the curve starts
    const e = move(cur, next); // where the curve ends
    d += `${i === 0 ? "M" : "L"} ${s[0]} ${s[1]} Q ${cur[0]} ${cur[1]} ${e[0]} ${e[1]} `;
  }
  return d + "Z";
}

const HEX_PATH = roundedHexPath();

function HexLogoTile({ logo }) {
  const tier = (logo?.tier ?? "").toLowerCase();
  const tierToneClass =
    tier === "gold"
      ? "text-amber-200"
      : tier === "silver"
        ? "text-slate-200"
        : tier === "bronze"
          ? "text-orange-200"
          : "text-white";

  return (
    <Link
      href={logo.href}
      target="_blank"
      rel="noreferrer"
      className="group block h-full w-full"
    >
      <div
        className={`relative h-full w-full transition duration-300 group-hover:-translate-y-1 ${tierToneClass}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 86.6 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_8px_14px_rgba(15,23,42,0.12)]"
        >
          {/* outer rounded hexagon */}
          <path
            d={HEX_PATH}
            fill="currentColor"
            stroke="rgba(148,163,184,0.55)"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          {/* inner soft highlight, same rounded shape scaled to 80% */}
          <path
            d={HEX_PATH}
            transform="translate(43.3 50) scale(0.8) translate(-43.3 -50)"
            fill="rgba(255,255,255,0.4)"
          />
        </svg>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[10%] bg-white/40 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"
        />

        {/* logo scales with the tile, so no per-tier image classes needed */}
        <span className="absolute inset-x-[17%] inset-y-[27%]">
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            sizes="(min-width: 768px) 120px, 25vw"
            className="object-contain"
          />
        </span>
      </div>
    </Link>
  );
}

/* ---------- cluster ---------- */

function HoneycombCluster({ logos, side = "left" }) {
  const { tiles, minX, minY, W, H } = useMemo(
    () => layoutHoneycomb((logos ?? []).slice(0, 12)),
    [logos],
  );

  if (!tiles.length) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-[450px] sm:max-w-[650px]"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {tiles.map((t) => (
        <div
          key={`${side}-${t.logo.src}-${t.i}`}
          className="absolute"
          style={{
            left: `${((t.x - t.a - minX) / W) * 100}%`,
            top: `${((t.y - t.r - minY) / H) * 100}%`,
            width: `${((2 * t.a) / W) * 100}%`,
            height: `${((2 * t.r) / H) * 100}%`,
          }}
        >
          <HexLogoTile logo={t.logo} />
        </div>
      ))}
    </div>
  );
}
/* ------------------------------------------------------------------ */
/*  PartnersLoop - logo marquee (Motion reveal wrapper)                */
/*  PartnerLoop itself is already a client component with its own      */
/*  rAF loop + drag physics, so this island only handles the entrance. */
/* ------------------------------------------------------------------ */

export function PartnersLoop({ logos, ...props }) {
  return (
    <Reveal preset="fade-up" delay={0.15} amount={0.2}>
      <PartnerLoop logos={logos} {...props} />
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  PartnersBackground - GSAP-drifted ambient glow + streaks           */
/* ------------------------------------------------------------------ */

export function PartnersBackground() {
  return (
    <GsParallax
      speed={0.14}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12),transparent_60%)]" />
      <span className="absolute -left-1/4 top-0 h-px w-[150%] rotate-[12deg] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <span className="absolute -left-1/4 top-24 h-px w-[150%] rotate-[12deg] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <span className="absolute -left-1/4 bottom-24 h-px w-[150%] -rotate-[8deg] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
    </GsParallax>
  );
}

export function PartnersSponsorTiers({ tiers }) {
  const getFeaturedTileClass = (tier, logo) => {
    if (!logo?.featured) return "";

    if (tier.key === "gold") {
      return "sm:col-span-2 sm:row-span-2";
    }

    if (tier.key === "silver") {
      return "sm:col-span-2";
    }

    return "sm:col-span-2";
  };

  const getFeaturedLogoImageClass = (tier, logo) => {
    if (!logo?.featured) {
      return tier.logoImageClass ?? "h-12";
    }

    if (tier.key === "gold") {
      return "h-24 sm:h-28";
    }

    if (tier.key === "silver") {
      return "h-18 sm:h-20";
    }

    return "h-14 sm:h-16";
  };

  return (
    <Reveal preset="fade-up" delay={0.1} amount={0.2}>
      <div className="mt-12 rounded-3xl border border-border/70 bg-surface/75 p-4 shadow-lg backdrop-blur sm:p-6 lg:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent/80">
              Sponsorship Tiers
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Gold, Silver, Bronze & More
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-ink-soft">
            Higher tiers get larger placement and stronger visual priority.
          </p>
        </div>

        <Stagger
          delay={0.05}
          gap={0.08}
          className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-12 lg:gap-4"
        >
          {tiers.map((tier) => (
            <StaggerItem
              key={tier.key}
              preset="fade-up"
              className={tier.className}
            >
              <article
                className={`h-full overflow-hidden rounded-2xl border p-4 shadow-sm ring-1 ring-inset sm:p-5 ${tier.surfaceClass}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/80">
                    {tier.tag}
                  </span>
                  <span className="text-[11px] font-bold text-foreground/70">
                    {tier.amount}
                  </span>
                </div>

                <h4
                  className={`mt-3 text-xl font-black tracking-tight sm:text-2xl ${tier.titleClass}`}
                >
                  {tier.label}
                </h4>
                <p className="mt-2 text-xs leading-6 text-foreground/75 sm:text-sm">
                  {tier.description}
                </p>

                <div
                  className={`mt-4 grid ${tier.logoGridClass ?? "grid-cols-2 gap-2"}`}
                >
                  {tier.logos.map((logo, index) => (
                    <Link
                      key={`${tier.key}-${logo.src}-${index}`}
                      href={logo.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group block ${getFeaturedTileClass(tier, logo)}`}
                    >
                      <div
                        className={`relative grid place-items-center overflow-hidden rounded-xl border p-2 transition group-hover:-translate-y-0.5 group-hover:shadow-sm ${tier.logoBoxClass ?? "min-h-[64px]"} ${tier.logoTileClass ?? "border-black/10 bg-white/85"} ${logo?.featured ? "ring-2 ring-accent/30" : ""}`}
                      >
                        {logo?.featured && (
                          <span className="absolute right-2 top-2 rounded-full bg-accent/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-accent-foreground">
                            Featured
                          </span>
                        )}
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={180}
                          height={80}
                          className={`w-full object-contain ${getFeaturedLogoImageClass(tier, logo)}`}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <Link href="/partners">
          <button className="mt-8 rounded-lg bg-violet-600 px-6 py-3 text-white hover:bg-violet-700">
            View All Partners
          </button>
        </Link>
      </div>
    </Reveal>
  );
}

export function PartnersCenterBrandShowcase({ showcase }) {
  const leftLogos = showcase?.leftLogos ?? [];
  const rightLogos = showcase?.rightLogos ?? [];

  return (
    <Reveal preset="fade-up" delay={0.12} amount={0.2}>
      <section className="relative mt-8 overflow-hidden rounded-[1.8rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.94))] px-4 py-8 shadow-[0_30px_80px_-42px_rgba(15,23,42,0.35)] sm:px-6 md:mt-10 md:px-8 md:py-10 lg:px-10 lg:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-18 -top-16 h-44 w-44 rounded-full bg-violet-200/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-14 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl"
        />

        <div className="relative text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            {showcase?.eyebrow}
          </p>
          <h3 className="mt-2 text-balance text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-5xl">
            {showcase?.title}
          </h3>
          <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
            {showcase?.description}
          </p>
        </div>

        <div className="relative mt-8 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <HoneycombCluster logos={leftLogos} side="left" />

          <div className="mx-auto">
            <div className="relative grid aspect-square w-46 place-items-center sm:w-54">
              {/* <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_20px_22px_rgba(17,24,39,0.35)]"
              >
                <defs>
                  <linearGradient
                    id="partner-center-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#2f1264" />
                    <stop offset="58%" stopColor="#1f1147" />
                    <stop offset="100%" stopColor="#120f2a" />
                  </linearGradient>
                </defs>
                <path
                  d="M30 3 Q35 0 40 3 L60 3 Q65 0 70 3 L88 29 Q97 34 97 43 L97 57 Q97 66 88 71 L70 97 Q65 100 60 97 L40 97 Q35 100 30 97 L12 71 Q3 66 3 57 L3 43 Q3 34 12 29 Z"
                  fill="url(#partner-center-gradient)"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1"
                />
              </svg> */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 108"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_8px_14px_rgba(15,23,42,0.12)]"
              >
                <defs>
                  <linearGradient
                    id="partner-center-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4c1d95" />
                    <stop offset="55%" stopColor="#5b21b6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <path
                  d="
      M 43 2
      Q 50 -1 57 2
      L 89 21
      Q 98 26 98 36
      L 98 68
      Q 98 77 89 82
      L 57 103
      Q 50 107 43 103
      L 11 82
      Q 2 77 2 68
      L 2 36
      Q 2 26 11 21
      Z
    "
                  fill="url(#partner-center-gradient)"
                  // stroke="#e5e7eb"
                  // strokeWidth="0.8"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1"
                />
              </svg>
              <Image
                src={showcase?.centerLogo?.src}
                alt={showcase?.centerLogo?.alt ?? "Featured partner"}
                width={220}
                height={220}
                className="relative z-10 h-28 w-28 object-contain sm:h-32 sm:w-32"
              />
            </div>
          </div>

          <HoneycombCluster logos={rightLogos} side="right" />
        </div>
      </section>
    </Reveal>
  );
}
