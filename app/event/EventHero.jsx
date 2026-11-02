"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight02Icon } from "@animateicons/react/huge";
import { Reveal, Stagger, StaggerItem } from "@/components/animation/Reveal";
import { AuroraText } from "@/components/animation/AuroraText";
import { ShimmerButton } from "@/components/animation/shimmerButton";
import { GsParallax } from "@/components/animation/GsScroll";

export default function EventHero() {
  return (
    <section
      id="event-hero"
      aria-label="Sudharva Marathon events hero"
      className="relative -mt-19 flex h-screen w-full flex-col overflow-hidden"
    >
      {/* GSAP parallax background — scrolls slower than the content */}
      <GsParallax speed={0.22} className="absolute inset-0" aria-hidden="true">
        <Image
          src="/image/cta/events/event_hero.webp"
          alt="Sudharva Marathon Event Hero"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="object-cover object-center scale-110"
        />
      </GsParallax>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Main content wrapper */}
      <div className="container-page relative z-10 flex min-h-screen w-full flex-1 flex-col justify-center py-8 sm:min-h-0 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-5xl text-center sm:text-left">
          <Stagger
            delay={0}
            gap={0.12}
            className="mx-auto max-w-2xl sm:mx-0 sm:text-left"
          >
            <StaggerItem preset="fade-up">
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent shadow-sm backdrop-blur-md">
                <span
                  className="size-1.5 animate-pulse rounded-full bg-accent"
                  aria-hidden="true"
                />
                Sudharva Marathon · 2027
              </span>
            </StaggerItem>

            <StaggerItem preset="blur">
              <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-ink sm:text-4xl lg:text-6xl">
                Every Step.
                <br />
                <AuroraText
                  className="inline-block mt-4"
                  colors={["#F97316", "#FDBA74", "var(--color-ink)", "#F43F5E"]}
                >
                  A Healthier Tomorrow.
                </AuroraText>
              </h1>
            </StaggerItem>
            <StaggerItem preset="blur">
              <h4 className="mt-5 max-w-2xl text-xl font-bold tracking-tight  text-ink sm:text-xl lg:text-2xl">
               Every Step Lowers the Risk. <span className="text-accent" >Every Run Builds Awareness</span>
                <br />
                
              </h4>
            </StaggerItem>

            <StaggerItem preset="fade-up">
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink/90 sm:text-base">
                Be part of Sudharva Marathon in Chennai — a movement bringing
                people together through running, diabetes awareness, early
                detection, and healthier living. Choose your distance, embrace
                the challenge, and make every stride count.
              </p>
            </StaggerItem>

            <StaggerItem preset="fade-up">
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
                <ShimmerButton
                  asChild
                  size="lg"
                  className="shadow-2xl"
                  background="var(--color-accent)"
                  foreground="var(--color-accent-foreground)"
                >
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider sm:text-base"
                  >
                    Register Now
                    <ArrowRight02Icon size={20} duration={1} />
                  </Link>
                </ShimmerButton>

                <Link
                  href="#event-overview"
                  className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-6 py-3 text-sm font-semibold text-accent backdrop-blur-md transition hover:bg-accent/20"
                >
                  Explore the Event
                </Link>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
