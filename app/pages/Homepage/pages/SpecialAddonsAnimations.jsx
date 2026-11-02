"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/animation/AnimatedShinyText";
import { ArrowRight02Icon, HeartIcon } from "@animateicons/react/huge";
import { AuroraText } from "@/components/animation/AuroraText";
import { ShineBorder } from "@/components/animation/shine-border";
import { MarathonPassTicket } from "@/components/animation/MarathonPassTicket";
import {
  Float,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/Reveal";
import { GsParallax } from "@/components/animation/GsScroll";
import { Ribbon } from "@/components/animation/Ribbon";

/* ------------------------------------------------------------------ */
/*  AddonsPill — exclusive-benefit badge (Motion float + fade)         */
/* ------------------------------------------------------------------ */

export function AddonsPill() {
  return (
    <Reveal preset="fade-down" duration={0.6}>
      <Float distance={5} duration={3.5}>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-[var(--color-surface)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-soft)] shadow-sm">
          <AnimatedShinyText className="inline-flex items-center justify-center gap-1 px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ EXCLUSIVE RUNNER BENEFIT</span>
            <ArrowRight02Icon className="size-3 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </span>
      </Float>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  AddonsIntro — headline + HbA1c copy + benefit rows (Motion)        */
/* ------------------------------------------------------------------ */

export function AddonsIntro({ items }) {
  return (
    <Stagger delay={0.05} gap={0.1}>
      <StaggerItem preset="blur">
        <h2 className="my-4 block text-2xl sm:text-3xl font-bold">
          Your Run. Your Health. Our Gift.
        </h2>
      </StaggerItem>

      <StaggerItem preset="fade-up">
        <span className="mt-2 block text-2xl font-semibold">
          Free <span className="font-bold text-accent">HbA1c Test</span> for All
          Runners.
        </span>
      </StaggerItem>

      <StaggerItem preset="fade-up">
        <span className="mx-auto mt-2 block max-w-2xl text-lg text-[var(--color-ink-soft)] sm:mx-0 sm:text-left">
          Every registered marathon participant receives a complimentary HbA1c
          test as our gift to support a healthier you and a stronger community.
        </span>
      </StaggerItem>

      {items.map((addon) => (
        <StaggerItem key={addon.id} preset="fade-up">
          <span className="mt-4 flex items-center gap-4">
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full",
                addon.iconBg,
              )}
            >
              <addon.icon className="size-6" aria-hidden="true" />
            </span>
            <span>
              <span className={cn("block font-bold", addon.textColor)}>
                {addon.label}
              </span>
              <span className="block text-[var(--color-ink-soft)]">{addon.description}</span>
            </span>
          </span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
/*  ShareHealthCard — coupon panel with shine border (Motion + GSAP)   */
/* ------------------------------------------------------------------ */

export function ShareHealthCard({ items }) {
  return (
    <GsParallax speed={0.05} direction="up">
      <Reveal
        preset="fade-left"
        delay={0.15}
        className="relative rounded-lg bg-gradient-mesh px-12 py-8 shadow-md overflow-hidden"
      >
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <Ribbon
          className={"bg-gradient-brand"}
          position="top-right"
          color="bg-[var(--color-surface)]"
          textColor="text-[var(--color-ink)]"
        >
          Gift Card <HeartIcon size={14} className="ml-1 text-danger" />
        </Ribbon>
        <span className="mb-2 block text-2xl font-bold">
          Share the Health
          <br />
          <AuroraText colors={["#E85D75", "#F4A261", "#3B82F6", "#FFF1E8"]}>
            with your Loved ones
          </AuroraText>
        </span>
        <span className="block text-[var(--color-ink-soft)]">
          Each participant receives a digital health coupon for a complimentary
          (or discounted) HbA1c test for a family member or friend.
        </span>
        <ul className="mt-4 list-none space-y-3">
          {items.map((addon) => (
            <li key={addon.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-md",
                  addon.iconBg,
                )}
              >
                <addon.icon className="size-6" aria-hidden="true" />
              </span>
              <span>{addon.label}</span>
            </li>
          ))}
        </ul>
        <MarathonPassTicket
          image="/image/cta/marathon-bib.webp"
          onTear={() => setTicketUsed(true)}
          tearTicketContentClassName="bg-transparent"
          tearTicketStubClassName="bg-donate-paper"
          width={460}
          height={250}
          stubSize={150}
          radius={16}
          holes={12}
          holeSize={6}
          notch={3}
          roughness={0}
          tearAngle={30}
          stretch={30}
          resistance={0.45}
          rotate={4}
          tiltMax={9}
          tiltReach={260}
          parallax={6}
          perspective={1000}
          border
          borderWidth={1}
          recenter
          // background="var(--card-background)"
          // color="#c679c4"
          stubEvent="Sudharva Marathon 2027"
          stubDistance="21.1 km"
          stubLocation="Chennai, Tamil Nadu"
          stubRegNo="SM-284619"
          showQRCode={false}
        />
      </Reveal>
    </GsParallax>
  );
}

/* ------------------------------------------------------------------ */
/*  AddonsTicket — interactive tear ticket (stateful client island)    */
/* ------------------------------------------------------------------ */

// export function AddonsTicket() {
//   const [ticketUsed, setTicketUsed] = useState(false);

//   return (

//   );
// }

/* ------------------------------------------------------------------ */
/*  AddonsBackground — GSAP-drifted glow layer                         */
/* ------------------------------------------------------------------ */

export function AddonsBackground() {
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
