import React from "react";
import { GridPattern } from "@/components/animation/GridPattern";

import {
  PartnersBackground,
  PartnersHeader,
  PartnersLoop,
} from "./PartnersAnimations";
import { imageLogos } from "../datas/homepage/data";

const Partners = () => {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="relative isolate overflow-hidden bg-bg text-ink"
    >
      {/* Decorative background */}

      {/* ---- Premium spotlight decoration (GSAP drift island) ---- */}
      <PartnersBackground />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >

        {/* Geometric outline shapes */}
        <div className="absolute -left-16 top-16 size-52 rotate-45 rounded-[2rem] border border-blue-500/10" />
        <div className="absolute -left-8 top-24 size-36 rotate-45 rounded-[1.5rem] border border-violet-500/10" />

        <div className="absolute -right-20 bottom-0 size-64 rotate-45 rounded-[2.5rem] border border-blue-500/10" />
        <div className="absolute -right-8 bottom-12 size-40 rotate-45 rounded-[2rem] border border-violet-500/10" />

        {/* Small light points */}
        <div className="absolute left-[18%] top-[25%] size-1.5 rounded-full bg-blue-400/50 shadow-[0_0_18px_4px_rgba(59,130,246,0.15)]" />
        <div className="absolute right-[22%] top-[35%] size-1 rounded-full bg-violet-400/50 shadow-[0_0_16px_4px_rgba(139,92,246,0.2)]" />
        <div className="absolute left-[38%] bottom-[18%] size-1 rounded-full bg-sky-400/40" />

        {/* Soft bottom transition */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
        <GridPattern
          squares={[
            [2, 2],
            [7, 4],
            [12, 2],
            [18, 7],
            [23, 3],
            [28, 9],
            [34, 4],
            [39, 8],
            [44, 2],
            [49, 6],
          ]}
          className="absolute inset-0 h-full w-full opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_55%)]"
        />
      </div>

      {/* Content */}
      <div className="container-page relative z-10 py-16 sm:py-20 lg:py-24">
        {/* ---- Header (Motion stagger island) ---- */}
        <header className="contents">
          <PartnersHeader />
        </header>
        <div className="h-auto relative overflow-hidden py-12">
          {/* ---- Logo marquee (Motion reveal island) ---- */}
          <PartnersLoop
            logos={imageLogos}
            speed={100}
            direction="left"
            logoHeight={96}
            gap={56}
            hoverSpeed={40}
            scaleOnHover
            ariaLabel="Technology partners"
          />
        </div>
        {/* Add partner logos or content here */}
      </div>
    </section>
  );
};

export default Partners;
