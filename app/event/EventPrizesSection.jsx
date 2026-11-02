"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animation/Reveal";
import { AuroraText } from "@/components/animation/AuroraText";
import { eventPrizesData } from "@/app/datas/homepage/data";

export default function EventPrizesSection() {
  return (
    <section
      id="event-prizes"
      aria-labelledby="event-prizes-heading"
      className="relative overflow-hidden bg-bg text-[var(--color-ink)] py-20 sm:py-28"
    >
      <div className="container-page relative z-10">
        <header className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <Reveal preset="fade-up" delay={0} className="inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-soft shadow-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            Finisher Rewards
          </Reveal>

          <Reveal preset="blur" delay={0.08} className="mt-5 block">
            <h2
              id="event-prizes-heading"
              className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl"
           >
              Prizes for Every Finisher
            </h2>
          </Reveal>

          <Reveal preset="fade-up" delay={0.16} className="mt-4 block">
            <p className="text-sm leading-6 opacity-85 sm:text-base">
              Every registered runner walks away with something special to
              commemorate their journey.
            </p>
          </Reveal>
        </header>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {eventPrizesData.map((prize) => (
            <Reveal
              key={prize.number}
              preset="zoom-in"
              delay={0.1 + Number(prize.number) * 0.05}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card dark:border-[var(--color-surface)]/15"
            >
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-xl",
                  prize.iconBg
                )}
                style={{ width: 48, height: 48 }}
              >
                <prize.icon size={22} className={prize.textColor} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-foreground leading-tight">
                {prize.title}
              </h3>
              <p className="text-[11px] leading-5 text-[var(--color-ink-soft)] text-center">
                {prize.description}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Reveal preset="fade-up" delay={0.3} className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-2 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
            <span className="text-accent font-bold">Free for all registered participants</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
