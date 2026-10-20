import Image from "next/image";

import {
  HeroBadge,
  HeroCtas,
  HeroEventMeta,
  HeroHeading,
  HeroStats,
} from "./HeroAnimations";
import { GsParallax } from "@/components/animation/GsScroll";

const Hero = () => {
  return (
    <section
      id="home"
      aria-label="Sudharva Marathon hero"
      className="relative -mt-16 flex min-h-svh w-full flex-col overflow-hidden pt-16"
    >
      {/* GSAP parallax background — scrolls slower than the content */}
      <GsParallax speed={0.22} className="absolute inset-0" aria-hidden="true">
        <Image
          src="/image/cta/hero-banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[10%_5%] scale-110"
        />
      </GsParallax>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Main content wrapper */}
      <div className="container-page relative z-10 flex min-h-screen w-full flex-1 flex-col justify-center py-8 sm:min-h-0 sm:py-10 lg:py-12">
        {/* Hero content — all animation lives in reusable client islands */}
        <div className="mx-auto w-full max-w-5xl text-center sm:text-left">
          <HeroBadge />
          <h1 className="contents">
            <HeroHeading />
          </h1>
          <HeroEventMeta />
          <HeroCtas />
        </div>
      </div>

      {/* Statistics pinned to the bottom of the hero */}
      <div className="relative z-10 mt-auto w-full bg-color-ink-soft text-white">
        <HeroStats />
      </div>
    </section>
  );
};

export default Hero;
