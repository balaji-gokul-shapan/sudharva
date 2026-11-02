"use client";

import PartnerLoop from "@/components/animation/partnerLoop";
import { Reveal, Stagger, StaggerItem } from "@/components/animation/Reveal";
import { GsParallax } from "@/components/animation/GsScroll";

/* ------------------------------------------------------------------ */
/*  PartnersHeader — pill + title + copy (Motion stagger)              */
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

/* ------------------------------------------------------------------ */
/*  PartnersLoop — logo marquee (Motion reveal wrapper)                */
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
/*  PartnersBackground — GSAP-drifted ambient glow + streaks           */
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
