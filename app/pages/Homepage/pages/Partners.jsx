import React from "react";
import { GridPattern } from "@/components/animation/GridPattern";

import {
  PartnersBackground,
  PartnersCenterBrandShowcase,
  PartnersHeader,
  PartnersLoop,
  PartnersSponsorTiers,
} from "./PartnersAnimations";
import { imageLogos } from "../../../datas/homepage/data";

const partnerCenterShowcase = {
 eyebrow: "Official Marathon Partners",
  title: "Partners & Sponsors",
  description:
    "Every great marathon is made possible by the power of partnership. Together with our sponsors and partners, we bring communities together, inspire healthier lifestyles, and create an unforgettable running experience.",
  centerLogo: {
    src: "/favicon.svg",
    alt: "Featured center partner",
  },
  leftLogos: [
    { src: "/image/cta/appa.webp", alt: "Left partner 5", href: "https://www.appatrust.com", tier:"silver" },
    { src: "/image/cta/dolor.webp", alt: "Left partner 2", href: "https://www.fiveplushospitals.com/", tier:"silver" },
    { src: "/image/cta/appa-logo.svg", alt: "Left partner 6", href: "https://www.appatrust.com", tier:"silver" },
    { src: "/image/cta/appa.webp", alt: "Left partner 5", href: "https://www.appatrust.com", tier:"silver" },
    { src: "/image/cta/fiveplus.webp", alt: "Left partner 1", href: "https://www.fiveplushospitals.com/", tier:"gold" },
    { src: "/image/cta/ssdental.webp", alt: "Left partner 3", href: "https://www.fiveplushospitals.com/", tier:"gold" },
    { src: "/image/cta/appa-logo.svg", alt: "Left partner 6", href: "https://www.appatrust.com", tier:"gold" },
    { src: "/image/cta/sspharma.webp", alt: "Left partner 4", href: "https://www.fiveplushospitals.com/", tier:"Bronze" },
    { src: "/image/cta/appa.webp", alt: "Left partner 5", href: "https://www.appatrust.com", tier:"bronze" },
    { src: "/image/cta/appa-logo.svg", alt: "Left partner 6", href: "https://www.appatrust.com", tier:"bronze" },
  ],
  rightLogos: [
    { src: "/image/cta/appa-logo.svg", alt: "Right partner 5", href: "https://www.appatrust.com", tier: "bronze" },
    { src: "/image/cta/appa.webp", alt: "Right partner 6", href: "https://www.appatrust.com", tier: "bronze" },
    { src: "/image/cta/appa-logo.svg", alt: "Right partner 5", href: "https://www.appatrust.com", tier: "bronze" },
    { src: "/image/cta/appa.webp", alt: "Right partner 6", href: "https://www.appatrust.com", tier: "bronze" },
    { src: "/image/cta/sspharma.webp", alt: "Right partner 1", href: "https://www.fiveplushospitals.com/", tier: "gold" },
    { src: "/image/cta/fiveplus.webp", alt: "Right partner 4", href: "https://www.fiveplushospitals.com/", tier: "gold" },
    { src: "/image/cta/appa-logo.svg", alt: "Right partner 5", href: "https://www.appatrust.com", tier: "gold" },
    { src: "/image/cta/ssdental.webp", alt: "Right partner 2", href: "https://www.fiveplushospitals.com/", tier: "silver" },
    { src: "/image/cta/dolor.webp", alt: "Right partner 3", href: "https://www.fiveplushospitals.com/" , tier: "silver"},
    { src: "/image/cta/appa.webp", alt: "Right partner 6", href: "https://www.appatrust.com", tier: "silver" },
  ],
};

const sponsorTierCards = [
  {
    key: "gold",
    label: "Gold Sponsorship",
    tag: "Largest Presence",
    amount: "INR 5,00,000+",
    description:
      "Headline placement across stage, media, and event storytelling touchpoints.",
    className: "md:col-span-7 min-h-[300px]",
    logoGridClass: "grid-cols-1 sm:grid-cols-2 gap-3",
    logoBoxClass: "min-h-[92px] sm:min-h-[104px]",
    logoImageClass: "h-16 sm:h-20",
    logoTileClass:
      "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200/65",
    surfaceClass:
      "border-amber-200/70 bg-gradient-to-br from-amber-50/95 via-yellow-50 to-orange-100/80 ring-amber-200/50",
    titleClass: "text-amber-900",
    logos: [
      { src: "/image/cta/fiveplus.webp", alt: "Gold partner one", href: "https://www.fiveplushospitals.com/", featured: true },
      { src: "/image/cta/dolor.webp", alt: "Gold partner two", href: "https://www.fiveplushospitals.com/",  },
      { src: "/image/cta/ssdental.webp", alt: "Gold partner three", href: "https://www.fiveplushospitals.com/",  },
      { src: "/image/cta/sspharma.webp", alt: "Gold partner four", href: "https://www.fiveplushospitals.com/",  },
      { src: "/image/cta/appa-logo.svg", alt: "Gold partner five", href: "https://www.appatrust.com",  },
    ],
  },
  {
    key: "silver",
    label: "Silver Sponsorship",
    tag: "Strong Presence",
    amount: "INR 2,00,000+",
    description:
      "Premium visibility with high recall in race zones and digital campaigns.",
    className: "md:col-span-5 min-h-[280px]",
    logoGridClass: "grid-cols-2 gap-2.5",
    logoBoxClass: "min-h-[82px]",
    logoImageClass: "h-14 sm:h-16",
    logoTileClass:
      "bg-gradient-to-br from-slate-50 to-zinc-50 border-slate-300/65",
    surfaceClass:
      "border-slate-300/70 bg-gradient-to-br from-slate-100/95 via-zinc-50 to-slate-200/85 ring-slate-300/50",
    titleClass: "text-slate-800",
    logos: [
      { src: "/image/cta/ssdental.webp", alt: "Silver partner one", href: "https://www.fiveplushospitals.com/",  },
      { src: "/image/cta/sspharma.webp", alt: "Silver partner two", href: "https://www.fiveplushospitals.com/" , featured: true},
    ],
  },
  {
    key: "bronze",
    label: "Bronze Sponsorship",
    tag: "Focused Presence",
    amount: "INR 1,00,000+",
    description:
      "Targeted category support with repeated participant touchpoints.",
    className: "md:col-span-4 min-h-[250px]",
    logoGridClass: "grid-cols-2 gap-2",
    logoBoxClass: "min-h-[72px]",
    logoImageClass: "h-12 sm:h-14",
    logoTileClass:
      "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/70",
    surfaceClass:
      "border-orange-200/70 bg-gradient-to-br from-orange-100/95 via-amber-50 to-yellow-50/85 ring-orange-200/50",
    titleClass: "text-orange-900",
    logos: [
      { src: "/image/cta/appa.webp", alt: "Bronze partner one", href: "https://www.appatrust.com", featured: true },
      { src: "/image/cta/appa-logo.svg", alt: "Bronze partner two", href: "https://www.appatrust.com" },
    ],
  },
  {
    key: "community",
    label: "Community Contributor",
    tag: "Support Layer",
    amount: "INR 50,000+",
    description:
      "Helps power hydration, volunteer support, and wellness outreach.",
    className: "md:col-span-4 min-h-[250px]",
    logoGridClass: "grid-cols-2 gap-2",
    logoBoxClass: "min-h-[64px]",
    logoImageClass: "h-10 sm:h-12",
    logoTileClass:
      "bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200/65",
    surfaceClass:
      "border-cyan-200/70 bg-gradient-to-br from-cyan-50/95 via-sky-50 to-blue-50/85 ring-cyan-200/50",
    titleClass: "text-cyan-900",
    logos: [
      { src: "/image/cta/dolor.webp", alt: "Community contributor one", href: "https://www.fiveplushospitals.com/" },
      { src: "/image/cta/fiveplus.webp", alt: "Community contributor two", href: "https://www.fiveplushospitals.com/" },
    ],
  },
  {
    key: "inkind",
    label: "In-Kind Partner",
    tag: "Operational Value",
    amount: "Goods / Services",
    description:
      "Provides products and services required for smooth race-day delivery.",
    className: "md:col-span-4 min-h-[250px]",
    logoGridClass: "grid-cols-2 gap-2",
    logoBoxClass: "min-h-[64px]",
    logoImageClass: "h-10 sm:h-12",
    logoTileClass:
      "bg-gradient-to-br from-emerald-50 to-lime-50 border-emerald-200/65",
    surfaceClass:
      "border-emerald-200/70 bg-gradient-to-br from-emerald-50/95 via-lime-50 to-green-50/85 ring-emerald-200/50",
    titleClass: "text-emerald-900",
    logos: [
      { src: "/image/cta/sspharma.webp", alt: "In-kind partner one", href: "https://www.fiveplushospitals.com/" },
      { src: "/image/cta/ssdental.webp", alt: "In-kind partner two", href: "https://www.fiveplushospitals.com/" },
    ],
  },
];

const Partners = () => {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="relative isolate overflow-hidden bg-bg text-[var(--color-ink)]"
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

        <PartnersCenterBrandShowcase showcase={partnerCenterShowcase} />

        <PartnersSponsorTiers tiers={sponsorTierCards} />
      </div>
    </section>
  );
};

export default Partners;
