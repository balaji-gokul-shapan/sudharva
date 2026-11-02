"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HeartIcon,
  HeartCheckIcon,
  ArrowUpRight01Icon,
  AddSquareIcon,
} from "@animateicons/react/huge";
import { awarenessTopics } from "../datas/events/data";

gsap.registerPlugin(ScrollTrigger);

export default function EventMotto() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            ".diabetes-eyebrow",
            ".diabetes-heading",
            ".diabetes-intro",
            ".diabetes-topic",
            ".diabetes-center",
            ".diabetes-bottom",
          ],
          { clearProps: "all" },
        );
        return;
      }

      gsap.from(".diabetes-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".diabetes-heading", {
        opacity: 0,
        y: 55,
        duration: 1,
        delay: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".diabetes-intro", {
        opacity: 0,
        y: 25,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".diabetes-topic", {
        opacity: 0,
        y: 38,
        scale: 0.97,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".diabetes-topics",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".diabetes-center", {
        opacity: 0,
        scale: 0.82,
        duration: 1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".diabetes-center",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".diabetes-bottom", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".diabetes-bottom",
          start: "top 90%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="diabetes-awareness"
      className="relative isolate overflow-hidden border-y border-border/70 bg-background px-5 py-24 text-foreground sm:px-8 lg:px-12 lg:py-32"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -left-40 top-20 h-96 w-96 rounded-full blur-[120px]"
          style={{
            background: "color-mix(in srgb, var(--primary) 22%, transparent)",
          }}
        />
        <div
          className="absolute -right-40 top-1/3 h-120 w-120 rounded-full blur-[140px]"
          style={{
            background: "color-mix(in srgb, var(--accent) 18%, transparent)",
          }}
        />

        <div
          className="absolute left-1/2 top-8 h-48 w-[min(90vw,58rem)] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--primary) 28%, transparent), color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--brand-health) 24%, transparent))",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--foreground) 18%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 18%, transparent) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage: "linear-gradient(to bottom, black, transparent 90%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section introduction */}
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <div className="diabetes-eyebrow mb-7 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-50" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                The cause we run for
              </span>

              <span className="h-px w-12 bg-primary/40" />
            </div>

            <h2 className="diabetes-heading max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              India&apos;s Growing
              <span
                className="mt-2 block bg-clip-text pb-2 text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--primary), var(--accent), var(--brand-health))",
                }}
              >
                Diabetes Challenge.
              </span>
            </h2>
          </div>

          <div className="diabetes-intro pb-2 lg:pb-3">
            <div className="mb-5 flex items-center gap-3 text-accent">
              <HeartIcon size={23} strokeWidth={1.6} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Appa Health Run 2027
              </span>
            </div>

            <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Every step can start a conversation about prevention. Appa Health
              Run 2027 brings people and families together to champion
              awareness, regular screening, physical activity, and healthier
              living.
            </p>

            <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/30 bg-card/65">
                <AddSquareIcon size={16} />
              </span>
              Six focus areas. One healthier future.
            </div>
          </div>
        </div>

        {/* Awareness topic grid */}
        <div className="diabetes-topics mt-16 grid gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {awarenessTopics.map((topic) => {
            const TopicIcon = topic.icon;

            return (
              <motion.article
                key={topic.number}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -7,
                        rotateX: 1.2,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 22,
                        },
                      }
                }
                className="diabetes-topic group relative min-h-66.25 overflow-hidden rounded-[1.6rem] border border-border/80 bg-card/75 p-6 shadow-sm backdrop-blur-sm transition-colors duration-300 hover:border-primary/35 hover:bg-card sm:p-7"
              >
                {/* Hover glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-40"
                  style={{ backgroundColor: topic.color }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-background/70"
                    style={{ color: topic.color }}
                  >
                    <TopicIcon
                      size={29}
                      isAnimated
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground">
                    / {topic.number}
                  </span>
                </div>

                <div className="relative z-10 mt-8">
                  <span
                    className="mb-3 inline-block text-[10px] font-bold tracking-[0.24em]"
                    style={{ color: topic.color }}
                  >
                    {topic.tag}
                  </span>

                  <h3 className="max-w-xs text-xl font-bold leading-snug tracking-tight text-accent sm:text-[1.35rem]">
                    {topic.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                    {topic.description}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-2 w-16 rounded-full opacity-80"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in srgb, var(--foreground) 8%, transparent), transparent)",
                  }}
                />

                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{
                    background: `linear-gradient(to right, ${topic.color}, transparent)`,
                  }}
                />
              </motion.article>
            );
          })}
        </div>

        {/* Campaign statement */}
        <div
          className="diabetes-center relative mt-8 overflow-hidden rounded-[2rem] border border-primary/20 p-7 shadow-md sm:p-10 lg:mt-12 lg:p-14"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, var(--card)), color-mix(in srgb, var(--accent) 10%, var(--card)) 52%, color-mix(in srgb, var(--brand-health) 14%, var(--card)))",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-primary/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-1 -top-11 h-56 w-56 rounded-full border border-accent/15"
          />

          <div className="relative grid items-center gap-9 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
            <div className="relative mx-auto grid h-28 w-28 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 lg:mx-0">
              <div className="absolute inset-2 rounded-full border border-dashed border-primary/35" />
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
              <HeartIcon
                className="relative text-primary"
                size={45}
                strokeWidth={1.3}
              />
              <span className="absolute -right-1 top-3 h-3 w-3 rounded-full bg-accent shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_60%,transparent)]" />
            </div>

            <div className="text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Awareness into action
              </span>

              <h3 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Small steps today.
                <span className="block text-primary">
                  Healthier tomorrows.
                </span>
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Let&apos;s encourage preventive action through exercise,
                periodic screening, and healthier living — together with our
                families and communities.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <motion.a
                href="#overview"
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Discover the run
                <ArrowUpRight01Icon size={18} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Closing campaign line */}
        <div className="diabetes-bottom mt-12 flex flex-col justify-between gap-5 border-t border-border pt-7 sm:flex-row sm:items-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Appa Health Run 2027
          </p>

          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <HeartCheckIcon size={21} isAnimated className="text-primary" />
            Run with purpose. Live with awareness.
          </span>
        </div>
      </div>
    </section>
  );
}
