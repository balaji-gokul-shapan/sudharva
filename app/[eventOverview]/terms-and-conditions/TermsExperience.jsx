"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AuroraText } from "@/components/animation/AuroraText";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

let pluginsReady = false;

function ensureGsapPlugins() {
  if (!pluginsReady && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    pluginsReady = true;
  }
}

function toSectionId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function TermsExperience({ termsSections }) {
  const rootRef = useRef(null);

  useIsoLayoutEffect(() => {
    ensureGsapPlugins();
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        return;
      }

      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      introTl
        .from("[data-terms-chip]", {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
        .from(
          "[data-terms-title]",
          {
            opacity: 0,
            y: 56,
            duration: 0.85,
          },
          "-=0.35",
        )
        .from(
          "[data-terms-copy]",
          {
            opacity: 0,
            y: 24,
            duration: 0.65,
          },
          "-=0.4",
        )
        .from(
          "[data-terms-actions]",
          {
            opacity: 0,
            y: 16,
            duration: 0.55,
          },
          "-=0.25",
        );

      gsap.fromTo(
        "[data-terms-card]",
        {
          opacity: 0,
          y: 52,
          rotateX: 7,
          transformPerspective: 800,
          transformOrigin: "top center",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-terms-grid]",
            start: "top 76%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-terms-rail-fill]",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const asideEl = root.querySelector("[data-terms-aside]");
        const gridEl = root.querySelector("[data-terms-grid]");
        if (!asideEl || !gridEl) return;

        ScrollTrigger.create({
          trigger: gridEl,
          start: "top top+=96",
          end: "bottom bottom-=24",
          pin: asideEl,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });

      gsap.to("[data-terms-orb='left']", {
        x: 24,
        y: -18,
        duration: 6.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to("[data-terms-orb='right']", {
        x: -22,
        y: 16,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && root.contains(trigger.trigger)) {
          trigger.kill();
        }
      });
      ctx.revert();
    };
  }, []);

  return (
    <main ref={rootRef} className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div
          data-terms-orb="left"
          className="absolute -left-32 top-20 h-80 w-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary) 28%, transparent), transparent 66%)",
          }}
        />
        <div
          data-terms-orb="right"
          className="absolute -right-28 top-42 h-84 w-84 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--foreground) 16%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 16%, transparent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(circle at center, black, transparent 85%)",
          }}
        />
      </div>

      <section className="relative border-b border-border/80 bg-surface/85 backdrop-blur-sm">
        <div className="container-page grid gap-10 py-14 sm:py-18 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <div
              data-terms-chip
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary"
            >
              Sudharva Marathon 2027
            </div>

            <h1
              data-terms-title
              className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-ink sm:text-6xl"
            >
              Terms crafted for
              <AuroraText
              colors={["#ff6687", "#fefeff", "#a142ff", "#FFFFFF"]}
                className="block bg-clip-text pb-2 text-transparent"
                // style={{
                //   backgroundImage:
                //     "linear-gradient(100deg, var(--primary), var(--accent), var(--health))",
                // }}
              >
                transparent participation.
              </AuroraText>
            </h1>

            <p
              data-terms-copy
              className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft sm:text-base"
            >
              Please review this legal playbook before registering. It outlines
              race-day behavior, medical fitness expectations, payment terms,
              and protections for both participants and organizers.
            </p>
          </div>

          <div data-terms-actions className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-md sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Effective Date
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">06 November 2026</p>
            <p className="mt-4 text-sm text-ink-soft">
              Continue registration only if you understand and agree to all
              sections below.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                Go to Registration
              </Link>
              <a
                href="mailto:sudharvarun@yahoo.com"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-muted"
              >
                Contact Organizer
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page relative py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside data-terms-aside className="lg:self-start lg:h-fit">
            <div className="rounded-2xl border border-border/80 bg-card/85 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">
                Quick Jump
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {termsSections.map((section) => {
                  const sectionId = toSectionId(section.title);
                  return (
                    <li key={section.title}>
                      <a
                        href={`#${sectionId}`}
                        className="text-ink-soft transition-colors hover:text-primary"
                      >
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative mt-4 hidden h-56 overflow-hidden rounded-2xl border border-border/75 bg-surface lg:block">
              <div className="absolute left-1/2 top-3 h-[calc(100%-1.5rem)] w-0.75 -translate-x-1/2 rounded-full bg-border/70" />
              <div
                data-terms-rail-fill
                className="absolute left-1/2 top-3 h-[calc(100%-1.5rem)] w-0.75 -translate-x-1/2 rounded-full bg-linear-to-b from-primary via-accent to-health"
              />
            </div>
          </aside>

          <div data-terms-grid className="space-y-6">
            {termsSections.map((section, index) => {
              const sectionId = toSectionId(section.title);

              return (
                <article
                  key={section.title}
                  id={sectionId}
                  data-terms-card
                  className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/92 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-accent to-health opacity-85"
                  />

                  <div className="mb-4 inline-flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <h2 className="text-lg font-semibold text-ink sm:text-xl">
                      {section.title}
                    </h2>
                  </div>

                  <ul className="space-y-2.5 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-surface/92 p-5 sm:p-7">
          <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
            For any clarification regarding these terms, email
            <a
              href="mailto:sudharvarun@yahoo.com"
              className="mx-1.5 font-semibold text-accent underline underline-offset-2"
            >
              sudharvarun@yahoo.com
            </a>
            or call
            <a
              href="tel:+918445505533"
              className="mx-1.5 font-semibold text-accent underline underline-offset-2"
            >
              +91 84455 05533
            </a>
            . By proceeding with registration, you acknowledge that you have
            read and accepted these terms.
          </p>
        </div>
      </section>
    </main>
  );
}
