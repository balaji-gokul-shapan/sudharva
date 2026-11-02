
"use client";

import Image from "next/image";

import {
  HeroBadge,
  HeroCtas,
  HeroEventMeta,
  HeroHeading,
  HeroPreloader,
  HeroStats,
} from "./HeroAnimations";

import { GsParallax } from "@/components/animation/GsScroll";

const Hero = () => {
  return (
    <section
      id="home"
      aria-label="Sudharva Marathon hero"
      className="relative -mt-19 flex min-h-svh w-full flex-col overflow-hidden pt-19 sm:-mt-20 sm:pt-20"
    >
      {/* 1. Preloader overlay — keep it first */}
      <HeroPreloader />

      {/* 2. Background image */}
      <GsParallax
        speed={0.22}
        className="hero-img absolute inset-0"
        aria-hidden="true"
      >
        <Image
          src="/image/cta/hero-banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="scale-[1.2] object-cover object-[10%_5%]"
        />
      </GsParallax>

      {/* 3. Dark background overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />

      {/* 4. Main hero content */}
      <div className="container-page relative z-10 flex min-h-screen w-full flex-1 flex-col justify-center py-8 sm:min-h-0 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-5xl text-center sm:text-left">
          <HeroBadge />

          <h1 className="contents">
            <HeroHeading />
          </h1>

          <HeroEventMeta />

          <HeroCtas />
        </div>
      </div>

      {/* 5. Statistics at the bottom */}
      <div className="relative z-10 mt-auto w-full bg-color-ink-soft text-ink">
        <HeroStats />
      </div>
    </section>
  );
};

export default Hero;
