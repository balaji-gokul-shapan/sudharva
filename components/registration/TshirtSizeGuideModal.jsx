"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BadgeInfoIcon } from "@animateicons/react/huge";

const MEN_SIZES = [
  { size: "XS", us: "XS", uk: "XS", india: "XS", chest: "34–36" },
  { size: "S", us: "S", uk: "S", india: "S", chest: "36–38" },
  { size: "M", us: "M", uk: "M", india: "M", chest: "38–40" },
  { size: "L", us: "L", uk: "L", india: "L", chest: "40–42" },
  { size: "XL", us: "XL", uk: "XL", india: "XL", chest: "42–44" },
  { size: "XXL", us: "XXL", uk: "XXL", india: "XXL", chest: "44–46" },
  { size: "XXXL", us: "XXXL", uk: "XXXL", india: "XXXL", chest: "46–48" },
];

const WOMEN_SIZES = [
  { size: "XS", us: "0–2", uk: "4–6", india: "30–32", bust: "30–32" },
  { size: "S", us: "4–6", uk: "8–10", india: "32–34", bust: "32–34" },
  { size: "M", us: "8–10", uk: "12–14", india: "34–36", bust: "34–36" },
  { size: "L", us: "12–14", uk: "16–18", india: "36–38", bust: "36–38" },
  { size: "XL", us: "16–18", uk: "20–22", india: "38–40", bust: "38–40" },
  { size: "XXL", us: "18–20", uk: "24–26", india: "40–42", bust: "40–42" },
  { size: "XXXL", us: "22–24", uk: "28–30", india: "42–44", bust: "42–44" },
];

export function TshirtSizeGuideModal({ open, onOpenChange }) {
  const [tab, setTab] = useState("men");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl overflow-hidden border-border/80 p-0 shadow-lg">
        <div className="relative overflow-hidden border-b border-border/70 bg-gradient-to-br from-[var(--color-primary-tint)] via-background to-[var(--color-health-tint)] px-6 pb-5 pt-6">
          <div className="pointer-events-none absolute -left-14 -top-16 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-2 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--accent)_84%,var(--foreground))]">
                Marathon Wear Fit Lab
              </div>
              <div className="flex items-center gap-2">
                <BadgeInfoIcon size={20} className="text-accent" />
                <DialogTitle className="font-serif text-2xl text-foreground sm:text-3xl">
                  T-Shirt Size Guide
                </DialogTitle>
              </div>
              <p className="max-w-xl text-sm text-ink-soft sm:text-base">
                Pick your fit lane and match your body measurements for a
                race-day ready tee.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-right shadow-sm sm:block">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Measurement Unit
              </p>
              <p className="text-base font-semibold text-foreground">Inches</p>
            </div>
          </div>
        </div>

        <div className="bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_94%,transparent)_0%,color-mix(in_srgb,var(--color-bg-warm)_30%,var(--background))_100%)] p-6">
          <div className="mb-6 inline-flex rounded-full border border-border/70 bg-background/80 p-1 shadow-sm backdrop-blur">
            <button
              onClick={() => setTab("men")}
              className={cnTabs(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                tab === "men"
                  ? "bg-accent text-accent-foreground shadow-[0_6px_16px_-8px_color-mix(in_srgb,var(--accent)_70%,transparent)]"
                  : "text-ink-soft hover:text-foreground",
              )}
            >
              Men
            </button>
            <button
              onClick={() => setTab("women")}
              className={cnTabs(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                tab === "women"
                  ? "bg-accent text-accent-foreground shadow-[0_6px_16px_-8px_color-mix(in_srgb,var(--accent)_70%,transparent)]"
                  : "text-ink-soft hover:text-foreground",
              )}
            >
              Women
            </button>
          </div>

          <SizeTable
            title={tab === "men" ? "Men's T-Shirt Size Chart" : "Women's T-Shirt Size Chart"}
            sizes={tab === "men" ? MEN_SIZES : WOMEN_SIZES}
            measureLabel={tab === "men" ? "Chest (in)" : "Bust (in)"}
            laneLabel={tab === "men" ? "Men" : "Women"}
          />
        </div>

        <div className="border-t border-border/70 bg-background/70 px-6 py-4">
          <p className="text-xs text-ink-soft">
            Measurements are body measurements in inches. If you are between
            sizes, we recommend sizing up for a comfortable race-day fit.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function cnTabs(base, conditional) {
  return [base, conditional].filter(Boolean).join(" ");
}

function SizeTable({ title, sizes, measureLabel, laneLabel }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {laneLabel} Fit Lane
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/70 bg-background/90 p-2 shadow-sm">
        <table className="w-full border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                Size
              </th>
              <th className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                US
              </th>
              <th className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                UK
              </th>
              <th className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                India
              </th>
              <th className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                {measureLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s, index) => (
              <tr
                key={s.size}
                className={cnTabs(
                  "rounded-xl transition-transform duration-200 hover:-translate-y-0.5",
                  index % 2 === 0
                    ? "bg-[color-mix(in_srgb,var(--color-primary-tint)_44%,transparent)]"
                    : "bg-[color-mix(in_srgb,var(--color-health-tint)_52%,transparent)]",
                )}
              >
                <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-foreground">
                  <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-background px-2.5 py-1 text-xs font-bold text-foreground shadow-sm">
                    {s.size}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-ink-soft">{s.us}</td>
                <td className="px-3 py-3 text-sm text-ink-soft">{s.uk}</td>
                <td className="px-3 py-3 text-sm text-ink-soft">{s.india}</td>
                <td className="rounded-r-xl px-3 py-3 text-sm font-medium text-foreground">
                  <span className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--accent)_32%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2.5 py-1 text-xs font-semibold text-[color-mix(in_srgb,var(--accent)_85%,var(--foreground))]">
                    {s.chest || s.bust}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}