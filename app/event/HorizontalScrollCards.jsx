
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollCards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const wrapper = section.querySelector(".wrapper");
      const items = gsap.utils.toArray(
        section.querySelectorAll(".item")
      );

      if (!wrapper || items.length < 2) return;

      const getScrollDistance = () =>
        Math.max(0, wrapper.scrollWidth - section.clientWidth);

      const horizontalTween = gsap.to(wrapper, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Subtle card animation while scrolling horizontally.
      items.forEach((item) => {
        gsap.fromTo(
          item,
          {
            scale: 0.94,
            opacity: 0.75,
          },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              containerAnimation: horizontalTween,
              start: "left 90%",
              end: "left 45%",
              scrub: true,
            },
          }
        );
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }

    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, []);

  const cards = [
    {
      number: "01",
      eyebrow: "THE CHALLENGE",
      title: "Every Step Counts",
      description:
        "Run with purpose. Every stride helps build awareness for diabetes prevention and a healthier community.",
      accentClass: "horizontal-card--health",
    },
    {
      number: "02",
      eyebrow: "THE MISSION",
      title: "Run Against Diabetes",
      description:
        "Bring families and communities together to champion early detection, active living, and healthy habits.",
      accentClass: "horizontal-card--environment",
    },
    {
      number: "03",
      eyebrow: "THE COMMUNITY",
      title: "Stronger Together",
      description:
        "Run alongside friends, families, and fellow runners who believe meaningful change starts with us.",
      accentClass: "horizontal-card--volunteer",
    },
    {
      number: "04",
      eyebrow: "THE FINISH",
      title: "Make Every Move Matter",
      description:
        "Cross the finish line knowing you helped move the conversation about diabetes awareness forward.",
      accentClass: "horizontal-card--education",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="scroll-section horizontal-section horizontal-cards-section relative overflow-hidden"
    >
      <div aria-hidden="true" className="horizontal-cards-backdrop" />
      <div aria-hidden="true" className="horizontal-cards-grid" />

      <div className="relative z-10 flex min-h-screen flex-col justify-center py-12">
        {/* Section heading */}
        <div className="container-page mb-8 flex items-end justify-between gap-6 px-5 md:mb-12">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              Sudharva Marathon 2027
            </p>

            <h2 className="max-w-2xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              More Than
              <span className="block text-accent">
                A Run.
              </span>
            </h2>
          </div>

          <p className="hidden max-w-xs text-sm leading-6 text-(--hc-text-soft) md:block">
            Scroll to discover the movement, the mission, and
            the people behind every stride.
          </p>
        </div>

        {/* Keep the existing wrapper and item class names */}
        <div className="wrapper flex w-max gap-5 px-5 md:gap-7 md:px-10">
          {cards.map((card) => (
            <article
              key={card.number}
              className={`item horizontal-card ${card.accentClass} relative flex min-h-97.5 w-[82vw] max-w-140 shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-(--hc-card-border) p-6 sm:min-h-110 sm:p-9 lg:min-h-120 lg:p-12`}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full border border-(--hc-card-border) sm:size-64" />

              <div className="relative flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.25em] text-(--hc-text-soft)">
                  {card.eyebrow}
                </span>

                <span className="font-mono text-sm text-accent">
                  / {card.number}
                </span>
              </div>

              <div className="relative z-10">
                <div className="mb-5 h-1 w-12 rounded-full bg-orange-400" />

                <h3 className="max-w-md text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                  {card.title}
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-(--hc-text-soft) sm:text-base">
                  {card.description}
                </p>
              </div>

              <div className="relative mt-8 flex items-center justify-between border-t border-(--hc-card-border) pt-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--hc-text-faint)">
                  Run for a cause
                </span>

                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full border border-(--hc-card-border) text-xl transition-colors"
                >
                  ↗
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll progress hint */}
        <div className="container-page mt-8 flex items-center gap-4 px-5 md:px-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--hc-text-faint)">
            Keep scrolling
          </span>

          <div className="h-px w-20 bg-accent/70" />

          <span className="text-xs text-(--hc-text-faint)">
            01 — 04
          </span>
        </div>
      </div>
    </section>
  );
}
