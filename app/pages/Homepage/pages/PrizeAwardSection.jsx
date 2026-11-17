"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { eventCategoriesData } from "@/app/datas/homepage/data";
import { PRIZE_ROWS } from "@/components/registration/datas/data";
import { Reveal } from "@/components/animation/Reveal";
import { cn } from "@/lib/utils";
import { Award01Icon, MoneyBag01Icon, TrophyIcon, UserGroupIcon } from "@animateicons/react/huge";

const CATEGORY_THEME = {
  volunteer: {
    halo: "from-volunteer/25 via-volunteer/10 to-transparent",
    card: "border-volunteer/40 bg-volunteer/10",
    chip: "border-volunteer/40 bg-volunteer/15 text-volunteer",
  },
  health: {
    halo: "from-health/25 via-health/10 to-transparent",
    card: "border-health/40 bg-health/10",
    chip: "border-health/40 bg-health/15 text-health",
  },
  environment: {
    halo: "from-environment/25 via-environment/10 to-transparent",
    card: "border-environment/40 bg-environment/10",
    chip: "border-environment/40 bg-environment/15 text-environment",
  },
  education: {
    halo: "from-education/25 via-education/10 to-transparent",
    card: "border-education/40 bg-education/10",
    chip: "border-education/40 bg-education/15 text-education",
  },
};

const PODIUM_LEVELS = [
  { key: "prize1", label: "1st", icon: TrophyIcon },
  { key: "prize2", label: "2nd", icon: MoneyBag01Icon },
  { key: "prize3", label: "3rd", icon: Award01Icon },
];

const PODIUM_META = {
  prize1: {
    stepHeight: "min-h-[13.5rem] sm:min-h-[12rem]",
    stageOffset: "-translate-y-3",
    ring: "ring-amber-400/50",
    chip: "border-amber-500/45 bg-amber-300/25 text-amber-800 dark:text-amber-200",
    cardGradient:
      "bg-linear-to-b from-amber-50 via-amber-100/95 to-amber-200/80 dark:from-amber-500/20 dark:via-amber-400/15 dark:to-amber-300/10",
    iconTone:
      "bg-amber-500/20 text-amber-700 dark:bg-amber-300/20 dark:text-amber-200",
    amountTone: "text-amber-800 dark:text-amber-200",
    glow: "from-amber-300/30 via-amber-300/10 to-transparent",
  },
  prize2: {
    stepHeight: "min-h-[12rem] sm:min-h-[11rem]",
    stageOffset: "translate-y-6 sm:translate-y-3",
    ring: "ring-slate-400/45",
    chip: "border-slate-400/50 bg-slate-300/30 text-slate-700 dark:text-slate-200",
    cardGradient:
      "bg-linear-to-b from-slate-50 via-slate-100/95 to-slate-200/80 dark:from-slate-400/20 dark:via-slate-300/15 dark:to-slate-200/10",
    iconTone:
      "bg-slate-500/20 text-slate-700 dark:bg-slate-300/20 dark:text-slate-200",
    amountTone: "text-slate-800 dark:text-slate-200",
    glow: "from-slate-300/30 via-slate-300/10 to-transparent",
  },
  prize3: {
    stepHeight: "min-h-[11rem] sm:min-h-[8rem]",
    stageOffset: "translate-y-9 sm:translate-y-3",
    ring: "ring-orange-500/40",
    chip: "border-orange-500/45 bg-orange-300/25 text-orange-800 dark:text-orange-200",
    cardGradient:
      "bg-linear-to-b from-orange-50 via-orange-100/95 to-orange-200/75 dark:from-orange-500/20 dark:via-orange-400/15 dark:to-orange-300/10",
    iconTone:
      "bg-orange-500/20 text-orange-700 dark:bg-orange-300/20 dark:text-orange-200",
    amountTone: "text-orange-800 dark:text-orange-200",
    glow: "from-orange-400/30 via-orange-400/10 to-transparent",
  },
};

const SUMMARY_CARD_META = {
  categories: {
    icon: UserGroupIcon,
    iconTone: "bg-primary/15 text-primary",
    lineTone: "from-primary/70 via-primary/20 to-transparent",
  },
  perCategory: {
    icon: MoneyBag01Icon,
    iconTone: "bg-accent/15 text-accent",
    lineTone: "from-accent/70 via-accent/20 to-transparent",
  },
  overall: {
    icon: TrophyIcon,
    iconTone: "bg-environment/20 text-environment",
    lineTone: "from-environment/70 via-environment/20 to-transparent",
  },
};

const formatINR = (value) =>
  `Rs. ${new Intl.NumberFormat("en-IN").format(Number(value || 0))}/-`;

const getCategoryDistance = (label = "") => {
  const direct = label.match(/\b(\d+(?:\.\d+)?)\s*K\b/i);
  if (direct) return `${direct[1]}K`;
  if (/half marathon/i.test(label)) return "21.1K";
  return "Run";
};

const getPoolFromRows = (rows = []) =>
  rows.reduce((sum, row) => sum + row.prize1 + row.prize2 + row.prize3, 0);

const PrizeAwardSection = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState(
    eventCategoriesData[0]?.key ?? "volunteer",
  );

  useEffect(() => {
    if (eventCategoriesData.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveCategoryKey((currentKey) => {
        const currentIndex = eventCategoriesData.findIndex(
          (item) => item.key === currentKey,
        );
        const safeIndex = currentIndex >= 0 ? currentIndex : 0;
        const nextIndex = (safeIndex + 1) % eventCategoriesData.length;
        return eventCategoriesData[nextIndex].key;
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeCategory =
    eventCategoriesData.find((item) => item.key === activeCategoryKey) ??
    eventCategoriesData[0];

  const theme = CATEGORY_THEME[activeCategory?.key] ?? CATEGORY_THEME.volunteer;
  const poolPerCategory = useMemo(() => getPoolFromRows(PRIZE_ROWS), []);
  const overallPool = useMemo(
    () => poolPerCategory * eventCategoriesData.length,
    [poolPerCategory],
  );

  const activeCategoryIndex = Math.max(
    0,
    eventCategoriesData.findIndex((item) => item.key === activeCategoryKey),
  );

  const summaryCards = [
    {
      id: "categories",
      label: "Event Categories",
      value: eventCategoriesData.length,
      valueTone: "text-primary",
    },
    {
      id: "perCategory",
      label: "Prize Pool / Category",
      value: formatINR(poolPerCategory),
      valueTone: "text-accent",
    },
    {
      id: "overall",
      label: "Overall Pool (All Categories)",
      value: formatINR(overallPool),
      valueTone: "text-foreground",
    },
  ];

  return (
    <section
      id="prize-awards"
      aria-labelledby="prize-awards-heading"
      className="relative overflow-hidden bg-linear-to-b from-bg via-surface to-bg py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_0%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_92%_14%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_62%)]" />
        <div className="absolute inset-0 opacity-50 bg-size-[18px_18px] bg-[linear-gradient(to_right,color-mix(in_srgb,var(--border)_65%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_65%,transparent)_1px,transparent_1px)]" />
        <motion.div
          className="absolute -left-20 top-14 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
          animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-environment/20 blur-3xl"
          animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-page relative z-10">
        <Reveal preset="fade-up" delay={0}>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Prize Arena
          </span>
        </Reveal>

        <Reveal preset="blur" delay={0.06} className="mt-5 block">
          <h2
            id="prize-awards-heading"
            className="font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl"
          >
            Event Categories & Awards
          </h2>
        </Reveal>

        <Reveal preset="fade-up" delay={0.12} className="mt-4 block">
          <p className="max-w-3xl text-sm leading-7 text-ink-soft sm:text-base">
            Pick an event category to preview entry details, perks, and the
            prize ladder. Each category includes the same age and gender award
            structure for transparent, fair competition.
          </p>
        </Reveal>

        <Reveal preset="fade-up" delay={0.16} className="mt-8 block">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-3 shadow-[0_25px_55px_-35px_rgba(17,24,39,0.35)] backdrop-blur sm:p-4">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_100%_at_0%_0%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_70%)]"
            />

            <div className="relative grid gap-3 sm:grid-cols-3">
              {summaryCards.map((card) => {
                const meta =
                  SUMMARY_CARD_META[card.id] ?? SUMMARY_CARD_META.categories;
                const Icon = meta.icon;

                return (
                  <motion.article
                    key={card.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.28 }}
                    className="relative overflow-hidden rounded-2xl border border-border/70 bg-background/90 px-4 py-3"
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-linear-to-r",
                        meta.lineTone,
                      )}
                      aria-hidden="true"
                    />
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                        {card.label}
                      </p>
                      <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", meta.iconTone)}>
                        <Icon size={15} />
                      </span>
                    </div>
                    <p className={cn("mt-1 text-2xl font-black leading-tight", card.valueTone)}>
                      {card.value}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 rounded-2xl border border-border/70 bg-card/75 p-2 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="flex w-full items-stretch gap-2 overflow-x-auto pb-2">
            {eventCategoriesData.map((category, index) => {
              const isActive = category.key === activeCategoryKey;
              const distance = getCategoryDistance(category.label);
              const categoryTheme =
                CATEGORY_THEME[category.key] ?? CATEGORY_THEME.volunteer;

              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategoryKey(category.key)}
                  className={cn(
                    "group relative flex-1 min-w-56 rounded-xl border px-4 py-2 text-left transition-all duration-300",
                    isActive
                      ? cn(categoryTheme.card, "-translate-y-0.5 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.45)]")
                      : "border-border bg-background/95 hover:border-accent/40 hover:bg-accent/5",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="category-pill-active"
                      className="pointer-events-none absolute inset-0 rounded-xl ring-2"
                      style={{ boxShadow: "inset 0 0 0 2px color-mix(in srgb, var(--accent), transparent 80%)" }}
                    />
                  )}

                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                    {distance}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {category.label}
                  </p>

                  <span
                    className={cn(
                      "mt-1 block h-0.5 w-full rounded-full transition",
                      isActive ? "bg-accent" : "bg-transparent group-hover:bg-accent/40",
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="px-1 pt-0.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-border/65">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-primary via-accent to-environment"
                animate={{
                  width: `${((activeCategoryIndex + 1) / Math.max(1, eventCategoriesData.length)) * 100}%`,
                }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeCategory?.key}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className={cn(
                "relative overflow-hidden rounded-3xl border p-6 sm:p-8",
                theme.card,
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-linear-to-br",
                  theme.halo,
                )}
                aria-hidden="true"
              />

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                      Selected Category
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-foreground sm:text-3xl">
                      {activeCategory?.label}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
                      {activeCategory?.message || activeCategory?.description}
                    </p>
                  </div>

                  <div className={cn("rounded-xl border px-4 py-3", theme.chip)}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em]">
                      Entry Fee
                    </p>
                    <p className="mt-1 text-2xl font-black">
                      {activeCategory?.Amount || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(activeCategory?.benefits ?? []).map((benefit) => (
                    <div
                      key={benefit}
                      className="rounded-xl border border-border/60 bg-background/70 px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-ink-soft">
                    <UserGroupIcon size={14} />
                    {PRIZE_ROWS.length} Award Divisions
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-ink-soft">
                    <Award01Icon size={14} />
                    Pool: {formatINR(poolPerCategory)}
                  </span>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/register?category=${activeCategory?.anchorId || ""}`}
                    className="inline-flex items-center rounded-xl border border-accent bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition hover:brightness-105"
                  >
                    Register for {getCategoryDistance(activeCategory?.label)}
                  </Link>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              Podium Ladder
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-foreground">
              Awards for Every Category
            </h3>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/70 bg-background/75 px-3 pb-4 pt-5 sm:px-4 sm:pb-5 sm:pt-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_0%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_70%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[repeating-linear-gradient(90deg,color-mix(in_srgb,var(--border)_75%,transparent)_0,color-mix(in_srgb,var(--border)_75%,transparent)_1px,transparent_1px,transparent_14px)]"
              />

              <div className="relative grid grid-cols-3 items-end gap-2 sm:gap-3">
                {[PODIUM_LEVELS[1], PODIUM_LEVELS[0], PODIUM_LEVELS[2]].map(
                  (level, index) => {
                    const Icon = level.icon;
                    const amount = PRIZE_ROWS[0]?.[level.key] ?? 0;
                    const meta = PODIUM_META[level.key] ?? PODIUM_META.prize3;

                    return (
                      <motion.article
                        key={level.key}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 0.32, delay: index * 0.08 }}
                        className={cn("relative", meta.stageOffset)}
                      >
                        <div
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute inset-x-2 -top-4 h-20 rounded-full bg-linear-to-b blur-2xl",
                            meta.glow,
                          )}
                        />

                        <div
                          className={cn(
                            "relative mx-auto flex w-full max-w-42 flex-col items-center justify-between rounded-2xl border border-border/70 px-2 py-3 text-center ring-1 backdrop-blur",
                            meta.stepHeight,
                            meta.ring,
                            meta.cardGradient,
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em]",
                              meta.chip,
                            )}
                          >
                            {level.label}
                          </span>

                          <span className={cn("mt-2 inline-flex h-8 w-8 items-center justify-center rounded-lg", meta.iconTone)}>
                            <Icon size={16} />
                          </span>

                          <p className="mt-2 text-[11px] font-semibold text-ink-soft">
                            Prize
                          </p>
                          <p className={cn("text-sm font-black leading-tight sm:text-base", meta.amountTone)}>
                            {formatINR(amount)}
                          </p>
                        </div>
                      </motion.article>
                    );
                  },
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-accent/35 bg-accent/12 px-4 py-3">
              <p className="text-xs font-semibold text-ink-soft">
                Each division receives the above 1st, 2nd, and 3rd place
                awards. Total prize distribution per category: 
                <span className="ml-1 font-bold text-accent">
                  {formatINR(poolPerCategory)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border/70 bg-card/90 p-5 shadow-[0_24px_55px_-40px_rgba(0,0,0,0.35)] backdrop-blur sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
              Age & Gender Award Divisions
            </h3>
            <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
              Transparent Matrix
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {PRIZE_ROWS.map((row, index) => (
              <motion.article
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="rounded-2xl border border-border/70 bg-background/85 px-4 py-4 backdrop-blur"
              >
                <p className="text-sm font-bold text-foreground">{row.category}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-border/60 bg-card px-2 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                      1st
                    </p>
                    <p className="mt-1 text-sm font-black text-primary">
                      {formatINR(row.prize1)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-card px-2 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                      2nd
                    </p>
                    <p className="mt-1 text-sm font-black text-foreground">
                      {formatINR(row.prize2)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-card px-2 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                      3rd
                    </p>
                    <p className="mt-1 text-sm font-black text-accent">
                      {formatINR(row.prize3)}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizeAwardSection;