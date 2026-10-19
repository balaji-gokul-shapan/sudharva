"use client";

import Link from "next/link";
import { FilterAddIcon } from "@animateicons/react/huge";

import { AuroraText } from "@/components/animation/AuroraText";
import { RainbowButton } from "@/components/animation/rainbowButton";
import {
  Float,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/Reveal";
import { NumberTicker } from "@/components/animation/NumberTicker";

/* ------------------------------------------------------------------ */
/*  HeroBadge — floating trust pill (Motion float + fade)              */
/* ------------------------------------------------------------------ */

export function HeroBadge() {
  return (
    <Reveal preset="fade-down" duration={0.6}>
      <Float distance={5} duration={3.5}>
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm sm:text-xs">
          <span
            className="size-1.5 animate-pulse rounded-full bg-emerald-300"
            aria-hidden="true"
          />
          A charitable initiative by&nbsp;
          <span className="text-white">Appa Charitable Trust</span>
        </p>
      </Float>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  HeroHeading — staggered serif headline + subcopy (Motion)          */
/* ------------------------------------------------------------------ */

export function HeroHeading() {
  return (
    <Stagger delay={0.05} gap={0.12} className="mt-5">
      <StaggerItem preset="blur">
        <span className="block font-serif text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-7xl">
          Run Against <AuroraText>Diabetes</AuroraText>
        </span>
      </StaggerItem>

      <StaggerItem preset="fade-up">
        <span className="mt-3 block font-serif text-lg font-semibold leading-snug text-white/90 sm:text-2xl lg:text-3xl">
          Run for a Cause, Run for a Change
        </span>
      </StaggerItem>

      <StaggerItem preset="fade-up">
        <span className="mx-auto mt-5 block max-w-xl text-sm leading-7 text-white/85 sm:mx-0 sm:text-base lg:text-lg">
          Join us in raising awareness for diabetes prevention and building a
          healthier community — one stride at a time.
        </span>
      </StaggerItem>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
/*  HeroEventMeta — date / venue / time row (Motion stagger)           */
/* ------------------------------------------------------------------ */

const META = [
  { icon: "📅", label: "Sunday, 10th December 2023" },
  { icon: "📍", label: "SMS Hospital, Avadi, Chennai" },
  { icon: "🕒", label: "10:00 AM – 4:00 PM" },
];

export function HeroEventMeta() {
  return (
    <Stagger
      delay={0.35}
      gap={0.1}
      className="mx-auto mt-7 grid max-w-3xl grid-cols-1 gap-4 text-lg text-white sm:mx-0 sm:grid-cols-3 sm:gap-5"
    >
      {META.map((item) => (
        <StaggerItem key={item.label} preset="fade-up">
          <span className="flex items-center justify-center gap-2 sm:justify-start">
            <span aria-hidden="true">{item.icon}</span>
            <span className="text-sm sm:text-base">{item.label}</span>
          </span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
/*  HeroCtas — register + explore buttons (Motion pop)                 */
/* ------------------------------------------------------------------ */

export function HeroCtas() {
  return (
    <Reveal preset="zoom-in" delay={0.5} duration={0.6}>
      <span className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start">
        <RainbowButton
          asChild
          size="lg"
          className="w-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider sm:w-auto"
        >
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center sm:w-auto"
          >
            <FilterAddIcon
              size={24}
              duration={1}
              color="currentColor"
              className="mr-2"
            />
            Register Now
          </Link>
        </RainbowButton>

        <Link
          href="#overview"
          className="inline-flex w-full items-center justify-center rounded-md border border-white/50 bg-white/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
        >
          Explore the Course
        </Link>
      </span>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  HeroStats — count-up band (Motion ticker, once in view)            */
/* ------------------------------------------------------------------ */

export function HeroStats({ items }) {
  return (
    <Stagger
      gap={0.1}
      amount={0.2}
      className="container-page grid grid-cols-2 gap-4 py-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
    >
      {items.map(({ id, icon, count, label }) => (
        <StaggerItem
          key={id}
          preset="fade-up"
          className="flex flex-row items-center gap-1 text-center sm:text-left"
        >
          <span className="text-2xl font-bold" aria-hidden="true">
            {icon}
          </span>
          <span className="flex flex-col gap-2">
            <NumberTicker
              value={count}
              className="text-2xl font-bold text-white"
            />
            <span className="text-sm text-white/85">{label}</span>
          </span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
