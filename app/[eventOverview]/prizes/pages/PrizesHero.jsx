"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/animation/Reveal";
import {
  Award01Icon,
  MoneyBag01Icon,
  Target01Icon,
  UserGroupIcon,
} from "@animateicons/react/huge";
import {
  PRIZE_CATEGORY_GROUPS,
  PRIZE_ROWS,
} from "@/components/registration/datas/data";
import { NumberTicker } from "@/components/animation/NumberTicker";
import { MedalIcon } from "@/components/ui/icons/medal-icon";
import { IndianRupeeIcon } from "@/components/ui/icons/indian-rupee-icon";
import { RainbowButton } from "@/components/animation/rainbowButton";
import Link from "next/link";
import { GemIcon } from "@/components/ui/icons/gem-icon";
import { cn } from "@/lib/utils";

const withRowTotals = (rows = []) =>
  rows.map((row) => ({
    ...row,
    total: row.prize1 + row.prize2 + row.prize3,
  }));

const BASE_TOTALS = withRowTotals(PRIZE_ROWS);
const DEFAULT_TOTAL_GIFT_PRIZE = BASE_TOTALS.reduce(
  (sum, row) => sum + row.total,
  0,
);
const DEFAULT_TOTAL_CATEGORIES = BASE_TOTALS.length;

const tableHeader = [
  {
    label: "Category",
    icon: UserGroupIcon,
  },
  {
    label: "Prize 1",
    icon: MedalIcon,
  },
  {
    label: "Prize 2",
    icon: MoneyBag01Icon,
  },
  {
    label: "Prize 3",
    icon: Target01Icon,
  },
  {
    label: "Total",
    icon: UserGroupIcon,
  },
];

const PrizeRibbon = ({ amount, variant = "total" }) => {
  return (
    <div className="relative inline-flex items-center">
      <div className={cn("prize-ribbon", `prize-ribbon--${variant}`)}>
        <span className="prize-ribbon-icon">
          <Award01Icon className="size-4" />
        </span>

        <span className="text-sm sm:text-lg font-bold ">₹{amount}</span>
      </div>
    </div>
  );
};
const currency = (value) => new Intl.NumberFormat("en-IN").format(value);

const getPodiumTotalsForRows = (rows = []) => {
  return rows.reduce(
    (acc, row) => {
      acc.prize1 += Number(row?.prize1 || 0);
      acc.prize2 += Number(row?.prize2 || 0);
      acc.prize3 += Number(row?.prize3 || 0);
      return acc;
    },
    { prize1: 0, prize2: 0, prize3: 0 },
  );
};

const PrizesHero = () => {
  const [activePrizeGroup, setActivePrizeGroup] = useState("all");

  const selectedPrizeGroup = useMemo(
    () =>
      PRIZE_CATEGORY_GROUPS.find((group) => group.key === activePrizeGroup) ||
      PRIZE_CATEGORY_GROUPS[0],
    [activePrizeGroup],
  );

  const withTotals = useMemo(
    () => withRowTotals(selectedPrizeGroup?.rows || PRIZE_ROWS),
    [selectedPrizeGroup],
  );

  const totalGiftPrize = useMemo(
    () => withTotals.reduce((sum, row) => sum + row.total, 0),
    [withTotals],
  );
  const totalCategories = withTotals.length || DEFAULT_TOTAL_CATEGORIES;

  const activePodiumLadder = useMemo(() => {
    const fallbackGroup = PRIZE_CATEGORY_GROUPS.find(
      (group) => group.key !== "all",
    );
    const sourceGroup =
      selectedPrizeGroup?.key === "all"
        ? fallbackGroup
        : selectedPrizeGroup || fallbackGroup;

    return {
      key: sourceGroup?.key || "all",
      label: sourceGroup?.label || "All",
      ...getPodiumTotalsForRows(sourceGroup?.rows || []),
    };
  }, [selectedPrizeGroup]);

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] text-[var(--color-ink)]">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-40 -top-40 size-125 rounded-full bg-volunteer/5 blur-[120px]" />
        <div className="absolute -right-60 top-1/3 size-100 rounded-full bg-health/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 size-90 rounded-full bg-environment/5 blur-[100px]" />
      </div>

      <section className="relative pb-14 pt-28 sm:pb-16 sm:pt-36">
        <div className="container-page mx-auto max-w-5xl px-4 text-center">
          <Reveal preset="fade-up" delay={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              <span
                className="size-1.5 animate-pulse rounded-full bg-accent"
                aria-hidden="true"
              />
              Sudharva Marathon 2025
            </span>
          </Reveal>

          <Reveal preset="blur" delay={0.08} className="mt-5 block">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              Prizes & <span className="text-accent">Awards</span>
            </h1>
          </Reveal>

          <Reveal preset="fade-up" delay={0.16} className="mt-5 block">
            <p className="mx-auto max-w-3xl text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
              A transparent prize structure for every division. Top three
              finishers in each category win cash rewards, with a total gift
              pool of Rs. {currency(totalGiftPrize || DEFAULT_TOTAL_GIFT_PRIZE)}/-.
            </p>
          </Reveal>

          <Reveal preset="fade-up" delay={0.24} className="mt-8 block">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Total Gift Prize",
                  value: `Rs. ${currency(totalGiftPrize || DEFAULT_TOTAL_GIFT_PRIZE)}/-`,
                  icon: Award01Icon,
                },
                {
                  label: "Per Category Prize",
                  value: `Rs. ${currency((totalGiftPrize || DEFAULT_TOTAL_GIFT_PRIZE) / totalCategories)}/-`,
                  icon: MoneyBag01Icon,
                },
                {
                  label: "Prize Categories",
                  value: `${totalCategories}`,
                  icon: UserGroupIcon,
                },
                {
                  label: "Podium Slots",
                  value: "1st, 2nd, 3rd",
                  icon: Target01Icon,
                },
              ].map(({ label, value, icon: Icon }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                  className="rounded-2xl border flex flex-col items-center border-primary bg-bg p-6 text-left space-y-2 shadow-sm backdrop-blur"
                >
                  <div className="mb-3 inline-flex rounded-xl border border-accent/30 bg-accent/10 p-2 text-accent">
                    <Icon size={18} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                    {label}
                  </p>
                  <NumberTicker
                    value={value}
                    className="text-2xl font-bold text-primary sm:text-2xl leading-none whitespace-nowrap"
                  />
                  {/* <NumberTicker className="mt-1 text-lg font-extrabold text-[var(--color-ink)]">{value}</NumberTicker> */}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page relative mx-auto max-w-7xl px-4 pb-24">

        
        <Reveal preset="fade-up" delay={0}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
                Prize Matrix
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Showing: {selectedPrizeGroup?.label || "All"}
              </p>
            </div>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Transparent Breakdown
            </span>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {PRIZE_CATEGORY_GROUPS.map((group) => {
              const isActive = group.key === selectedPrizeGroup?.key;
              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => setActivePrizeGroup(group.key)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition",
                    isActive
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-[var(--color-surface)] text-[var(--color-ink-soft)] hover:border-accent/40 hover:text-[var(--color-ink)]",
                  )}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </Reveal>
  <Reveal preset="fade-up" delay={0.1} className="mt-10 block">
          <div className="rounded-3xl border border-border/70 bg-[var(--color-surface)]/75 p-4 my-4 shadow-[0_20px_70px_-35px_rgba(10,10,30,0.35)] backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-primary sm:text-xl">
                Podium Ladder by Category
              </h3>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                1st / 2nd / 3rd
              </span>
            </div>

            <motion.article
              key={activePodiumLadder.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-border/70 bg-background/90 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                {activePodiumLadder.label}
              </p>

              <div className="mt-4 flex items-end justify-center gap-2">
                <div className="flex w-1/3 flex-col items-center">
                  <span className="mb-1 rounded-full border border-slate-400/50 bg-slate-300/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                    2nd
                  </span>
                  <div className="flex min-h-20 w-full items-end justify-center rounded-t-xl border border-slate-400/50 bg-linear-to-b from-slate-100 to-slate-200 px-1 pb-2">
                    <span className="text-[11px] font-extrabold text-slate-700">
                      ₹{currency(activePodiumLadder.prize2)}
                    </span>
                  </div>
                </div>

                <div className="flex w-1/3 flex-col items-center">
                  <span className="mb-1 rounded-full border border-amber-500/50 bg-amber-300/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                    1st
                  </span>
                  <div className="flex min-h-28 w-full items-end justify-center rounded-t-xl border border-amber-500/50 bg-linear-to-b from-amber-100 to-amber-200 px-1 pb-2">
                    <span className="text-[11px] font-extrabold text-amber-800">
                      ₹{currency(activePodiumLadder.prize1)}
                    </span>
                  </div>
                </div>

                <div className="flex w-1/3 flex-col items-center">
                  <span className="mb-1 rounded-full border border-orange-500/50 bg-orange-300/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-800">
                    3rd
                  </span>
                  <div className="flex min-h-16 w-full items-end justify-center rounded-t-xl border border-orange-500/50 bg-linear-to-b from-orange-100 to-orange-200 px-1 pb-2">
                    <span className="text-[11px] font-extrabold text-orange-800">
                      ₹{currency(activePodiumLadder.prize3)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </Reveal>
        <Reveal preset="fade-up" delay={0.06} className="hidden lg:block">
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-[var(--color-surface)]/70 shadow-[0_20px_70px_-35px_rgba(10,10,30,0.35)] backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left">
                <thead className="bg-ink/3">
                  <tr>
                    {tableHeader.map(({ label, icon: Icon }) => (
                      <th
                        key={label}
                        className="border-b border-border/60 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--color-ink)]"
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={16} />
                          {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {withTotals.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="odd:bg-primary/5 even:bg-accent/5"
                    >
                      <td className="border-b border-border/50 px-6 py-4 text-lg font-semibold text-[var(--color-ink)]">
                        {row.category}
                      </td>
                      <td className="border-b border-border/50 px-6 py-4 text-lg font-medium text-[var(--color-ink)]">
                        <PrizeRibbon amount={currency(row.prize1)} variant="gold" />
                      </td>
                      <td className="border-b border-border/50 px-6 py-4 text-lg font-medium text-[var(--color-ink)]">
                        <PrizeRibbon amount={currency(row.prize2)} variant="silver" />
                      </td>
                      <td className="border-b border-border/50 px-6 py-4 text-lg font-medium text-[var(--color-ink)]">
                        <PrizeRibbon amount={currency(row.prize3)} variant="bronze" />
                      </td>
                      <td className="border-b border-border/50 px-6 py-4 text-xl font-extrabold text-accent">
                        <PrizeRibbon amount={currency(row.total)} variant="total" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <div className="space-y-4 lg:hidden">
          {withTotals.map((row, index) => (
            <motion.article
              key={row.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--color-surface)]/75 shadow-sm backdrop-blur"
            >
              <header className="border-b border-border/60 bg-accent/6 px-4 py-3">
                <h3 className="text-base font-bold text-[var(--color-ink)]">{row.category}</h3>
              </header>
              <div className="grid grid-cols-2 gap-2 p-4 text-sm">
                <div className="rounded-xl border border-border/50 bg-[var(--color-surface)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                    Prize 1
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-ink)]">
                    {currency(row.prize1)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-[var(--color-surface)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                    Prize 2
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-ink)]">
                    {currency(row.prize2)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-[var(--color-surface)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                    Prize 3
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-ink)]">
                    {currency(row.prize3)}
                  </p>
                </div>
                <div className="rounded-xl border border-accent/40 bg-accent/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Total
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-accent">
                    {currency(row.total)}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      

        <Reveal preset="fade-up" delay={0.12} className="mt-10 block">
          <div className="relative overflow-hidden rounded-2xl flex flex-col sm:flex-row items-center  border border-accent/30 bg-linear-to-r from-accent/10 via-primary/10 to-volunteer/10 p-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              aria-hidden="true"
            >
              <div className="absolute -left-12 top-1/2 size-24 -translate-y-1/2 rounded-full border border-accent/30" />
              <div className="absolute -right-12 top-1/2 size-24 -translate-y-1/2 rounded-full border border-primary/30" />
            </div>
            <div className="flex flex-1 flex-col sm:flex-col w-auto">
              <div className="">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
                  Total Gift Prize
                </p>
                <IndianRupeeIcon
                  className="mr-2 inline-block size-6 text-accent sm:size-7 lg:size-8"
                />
                <NumberTicker
                  value={`Rs. ${currency(totalGiftPrize || DEFAULT_TOTAL_GIFT_PRIZE)}/-`}
                  className="text-2xl font-bold text-accent sm:text-4xl leading-none whitespace-nowrap"
                />
              </div>
            </div>
            <div className="italic flex flex-col sm:flex-row  items-center gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold text-accent sm:text-2xl">
                  Your Finish Line
                </p>
                <p className="text-lg font-bold text-primary sm:text-xl">
                  Your Moment
                </p>
              </div>
              <RainbowButton
                asChild
                variant="accent"
                size="default"
                className="shrink-0 px-5 py-2.5 text-sm font-bold uppercase tracking-wider"
              >
                <GemIcon size={32} duration={1} color="#ffffff" />
                <Link
                  href="/register"
                  className="group flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap"
                >
                  Register Now
                </Link>
              </RainbowButton>
            </div>
          </div>
        </Reveal>
      </section>
    </section>
  );
};

export default PrizesHero;
