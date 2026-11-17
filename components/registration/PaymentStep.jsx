"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import confetti from "canvas-confetti";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";
import {
  ArrowCounterClockwise,
  ArrowSquareOut,
  Check,
  Confetti,
  CreditCard,
  Percent,
  ShieldCheck,
  Sparkle,
  Tag,
  Ticket,
  Warning,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import MarathonPassTicket from "../animation/MarathonPassTicket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMasterData } from "@/store/slices/masters/getMasterSlice";
import { getMasterEventCategories } from "@/store/slices/masters/getMasterEventCategoriesSlice";
import {
  enterBibNumber,
  resetEnterBibNumberState,
  selectEnterBibNumberState,
} from "@/store/slices/bibNumber/enterBibNumberSlice";
import { cancelBibNumber } from "@/store/slices/bibNumber/cancelBibNumberSlice";
import {
  createPaymentOrder,
  selectPaymentOrder,
} from "@/store/slices/payment/createPaymentOrderSlice";
import { applyCouponCode } from "@/store/slices/couponCode/ApplyCouponCodeSlice";
import { cancelCouponCode } from "@/store/slices/couponCode/cancelCouponCodeSlice";
import { selectCreateRegistrationData } from "@/store/slices/registration/createRegistrationSlice";
import { Input } from "../ui/input";
import { BadgeXIcon, Cancel01Icon, Coupon01Icon, DiscountTag01Icon, GoogleGeminiIcon, HeartIcon, SparklesIcon } from "@animateicons/react/huge";
import { Ribbon } from "../animation/Ribbon";

export function findPromo(rawCode, promoCodes = []) {
  const normalized = String(rawCode ?? "")
    .trim()
    .toUpperCase();

  if (!normalized) return null;

  return promoCodes.find((promo) => promo.code === normalized) ?? null;
}

export function getPromoDiscount(promo, fee) {
  if (!promo) return 0;

  const raw =
    promo.type === "percent"
      ? Math.round((fee * promo.value) / 100)
      : promo.value;

  return Math.min(Math.max(raw, 0), fee);
}

const formatINR = (amount) =>
  `₹${Math.max(0, Math.round(amount)).toLocaleString("en-IN")}`;

const readCategoryLabel = (value) => {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value?.name || value?.category_name || value?.title || "";
  }
  return String(value);
};

const toFiniteNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrencyAmount = (value, currencyType = "INR") => {
  const normalizedCurrency = String(currencyType || "INR").trim().toUpperCase();
  const numericValue = toFiniteNumber(value);

  if (numericValue === null) return "-";

  if (normalizedCurrency === "INR") {
    return formatINR(numericValue);
  }

  return `${normalizedCurrency} ${numericValue.toFixed(2)}`;
};

const isPaidStatusValue = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (!normalized) return false;
  return [
    "paid",
    "payment_done",
    "completed",
    "success",
    "captured",
    "verified",
  ].includes(normalized);
};

const normalizeCategoryText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s*\(\s*/g, " ")
    .replace(/\s*\)\s*/g, " ")
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCategoryKey = (value) =>
  normalizeCategoryText(value).replace(/[^a-z0-9]/g, "");

const getBibRangeRuleForCategory = (categoryInfo) => {
  const candidates = [
    categoryInfo?.name,
    categoryInfo?.category_name,
    categoryInfo?.distance,
    `${categoryInfo?.distance ?? ""} ${categoryInfo?.name ?? ""}`,
    `${categoryInfo?.name ?? ""} ${categoryInfo?.distance ?? ""}`,
  ]
    .map(normalizeCategoryKey)
    .filter(Boolean);

  const containsAny = (tokens) =>
    tokens.some((token) =>
      candidates.some((candidate) => candidate.includes(token)),
    );

  if (containsAny(["5kmwalk", "5kwalk", "walk5k"])) {
    return { label: "5K Walk", min: 25001, max: 30000 };
  }

  if (containsAny(["5kmrun", "5krun", "run5k"])) {
    return { label: "5K Run", min: 10001, max: 20000 };
  }

  if (containsAny(["10km", "10k"])) {
    return { label: "10K Run", min: 4001, max: 9000 };
  }

  if (containsAny(["211km", "21.1km", "halfmarathon"])) {
    return { label: "21.1K Run", min: 1001, max: 3000 };
  }

  return null;
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const extractBibRangeFromCategory = (categoryInfo) => {
  if (!categoryInfo || typeof categoryInfo !== "object") {
    return null;
  }

  const min =
    toNumberOrNull(categoryInfo?.bib_start) ??
    toNumberOrNull(categoryInfo?.bib_from) ??
    toNumberOrNull(categoryInfo?.bib_min) ??
    toNumberOrNull(categoryInfo?.min_bib_number) ??
    toNumberOrNull(categoryInfo?.bib_number_start) ??
    toNumberOrNull(categoryInfo?.bib_number_min);

  const max =
    toNumberOrNull(categoryInfo?.bib_end) ??
    toNumberOrNull(categoryInfo?.bib_to) ??
    toNumberOrNull(categoryInfo?.bib_max) ??
    toNumberOrNull(categoryInfo?.max_bib_number) ??
    toNumberOrNull(categoryInfo?.bib_number_end) ??
    toNumberOrNull(categoryInfo?.bib_number_max);

  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    return null;
  }

  return {
    label:
      categoryInfo?.name || categoryInfo?.category_name || "Selected category",
    min,
    max,
  };
};

const getBibRangeRuleByCategoryId = (categoryId, categories = []) => {
  if (!categoryId || !Array.isArray(categories) || !categories.length) {
    return null;
  }

  const matched = categories.find(
    (item) => String(item?.id) === String(categoryId),
  );

  return extractBibRangeFromCategory(matched);
};
function AnimatedAmount({ value, className, pulseKey, colorful = false }) {
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.55,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [motionValue, value]);

  const pulseEnabled = pulseKey !== undefined && pulseKey !== null;

  return (
    <motion.span
      key={pulseEnabled ? `amount-pulse-${pulseKey}` : "amount-pulse-static"}
      className={cn(
        className,
        "inline-block transition-all duration-500",
      )}
      initial={pulseEnabled ? { scale: 1, y: 0, color: "currentColor" } : false}
      animate={
        pulseEnabled
          ? {
              scale: [1, 1.1, 1],
              y: [0, -1, 0],
              color: colorful
                ? ["currentColor", "#ec4899", "#0ea5e9", "currentColor"]
                : "currentColor",
            }
          : { scale: 1, y: 0, color: "currentColor" }
      }
      transition={{ duration: pulseEnabled ? 0.5 : 0, ease: "easeOut" }}
      style={
        colorful && pulseEnabled
          ? { filter: "drop-shadow(0 0 10px rgba(217, 70, 239, 0.35))" }
          : undefined
      }
    >
      {formatINR(display)}
    </motion.span>
  );
}

function PromoCodeCard({
  code,
  promo,
  bibNumber,
  bibHint,
  bibHintMaxLength,
  bibApplied,
  onToggleBib,
  onBibChange,
  onCodeChange,
  onApplyCode,
  onCancelCode,
  onApply,
  onClear,
  bibLoading,
  bibError,
  bibSuccess,
  promoApplying,
}) {
  const [error, setError] = useState("");



  const isApplied = Boolean(promo);
  const isBibApplied = Boolean(bibApplied);
  const status = isApplied ? "applied" : error ? "error" : "idle";
  const message = isApplied
    ? promo?.message || promo?.label || "Coupon applied successfully."
    : error;
  const bibPreview = String(bibNumber || "").trim() || "ELITE24";
  const normalizedBibNumber = String(bibNumber || "").trim();
  const [viewPromoTab, setViewPromoTab] = useState(Boolean(promo));
  const hintCutoffLength = Math.max(1, Number(bibHintMaxLength || 5));
  const shouldShowBibHint =
    Boolean(bibHint) && normalizedBibNumber.length < hintCutoffLength;

  const handleBibInput = (value) => {
    const sanitized = String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);
    onBibChange(sanitized);
  };

  const handleBibToggle = async () => {
    if (!isBibApplied && !String(bibNumber || "").trim()) {
      setError("Enter a premium bib number to continue.");
      return;
    }

    setError("");
    await onToggleBib(!isBibApplied);
  };

  const handleApplyCouponCode = async () => {
    if (isApplied) {
      try {
        await onCancelCode();
        setError("");
      } catch (cancelError) {
        setError(
          typeof cancelError === "string"
            ? cancelError
            : cancelError?.message || "Unable to cancel coupon code.",
        );
      }
      return;
    }

    const trimmed = (code || "").trim();

    if (!trimmed) {
      setError("Enter a coupon code to continue.");
      return;
    }

    try {
      const promoToApply =  await onApplyCode(trimmed)


      if (!promoToApply) {
        setError(`"${trimmed}" is not a valid coupon code.`);
        return;
      }

      setError("");
      onApply(promoToApply);
    } catch (applyError) {
      setError(
        typeof applyError === "string"
          ? applyError
          : applyError?.message || "Unable to apply coupon code.",
      );
    }
  };

  const handleClear = () => {
    setError("");
    onClear();
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-(--premium-card-border) bg-(--premium-card-bg) text-(--premium-card-fg) shadow-(--premium-card-shadow)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--premium-card-overlay)" }}
        />

        <div className="relative px-5 py-5 sm:px-6">
          <Ribbon
            className={"bg-gradient-primary"}
            position="top-right"
            color="bg-[var(--color-surface)]"
            textColor="text-[var(--color-white)]"
          >
            <SparklesIcon size={14} className="mr-1 text-danger" /> Pro Access 
          </Ribbon>
          <div className="flex flex-col lg:flex-row items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-(--premium-card-border) bg-(--premium-strong-bg) text-(--premium-icon)">
              <Ticket size={22} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-xl font-bold text-(--premium-heading) sm:text-2xl">
                Premium Bib Studio
              </h3>
              <p className="text-xs text-(--premium-body)">
                Personalize your runner bib and unlock premium perks.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:items-start">
            <div>
              <label
                htmlFor="premium-bib-number"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-(--premium-label)"
              >
                Premium Bib Number
              </label>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
                <div className="w-full">
                  <Input
                    id="premium-bib-number"
                    name="premiumBibNumber"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={bibNumber ?? ""}
                    onChange={(event) =>
                      handleBibInput(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="ELITE24"
                    className="h-12 w-full rounded-xl border border-(--premium-card-border) bg-(--premium-panel-bg) px-3 text-sm font-semibold uppercase tracking-[0.22em] text-(--premium-input) outline-none transition placeholder:tracking-normal placeholder:text-(--premium-placeholder) focus-visible:outline-[2px_solid_var(--premium-label)] sm:flex-1"
                  />
                  {shouldShowBibHint && (
                    <p className="text-xs font-semibold text-(--premium-card-fg) mt-2">
                      {bibHint}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleBibToggle}
                  disabled={bibLoading}
                  className={cn(
                    "inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase tracking-wider transition focus-visible:outline-[2px_solid_var(--premium-label)] sm:w-auto sm:min-w-32",
                    bibLoading && "cursor-not-allowed opacity-70",
                    isBibApplied
                      ? "border border-warning/50 bg-warning/15 text-warning hover:bg-warning/20"
                      : "bg-(--premium-action-bg) text-(--premium-action-fg) shadow-md hover:brightness-105",
                  )}
                >
                  {bibLoading ? (
                    <>
                      <GoogleGeminiIcon size={17} weight="bold" />
                      Applying...
                    </>
                  ) : isBibApplied ? (
                    <>
                      <Cancel01Icon size={17} weight="bold" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <GoogleGeminiIcon size={17} weight="bold" />
                      Apply
                    </>
                  )}
                </button>
              </div>
              <div className="min-h-5 pt-2">
                {bibError ? (
                  <p className="text-xs font-semibold text-(--premium-error)">
                    {bibError}
                  </p>
                ) : bibSuccess && isBibApplied ? (
                  <p className="text-xs font-semibold text-success">
                    Premium bib applied successfully.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="rounded-xl border border-(--premium-card-border) bg-(--premium-soft-bg) px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-(--premium-muted)">
                Bib Preview
              </p>
              <p className="mt-2 truncate font-mono text-xl font-black tracking-[0.24em] text-(--premium-preview)">
                {bibPreview}
              </p>
            </div>
          </div>

          {/* <div className="mt-4 border-t border-dashed border-[color-mix(in_srgb,var(--premium-muted)_35%,transparent)] pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--premium-muted)">
              Try a demo code
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {promoCodes.map((option) => {
                const isCurrent = option.code === promo?.code;

                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setError("");
                      onCodeChange(option.code);
                      onApply(option);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider transition focus-visible:outline-[2px_solid_var(--premium-label)]",
                      isCurrent
                        ? "border-success/50 bg-success/15 text-success"
                        : "border-(--premium-card-border) bg-(--premium-chip-bg) text-(--premium-card-fg) hover:border-(--premium-label) hover:bg-(--premium-chip-hover-bg)",
                    )}
                  >
                    {option.code}
                  </button>
                );
              })}
            </div>
          </div> */}
        </div>
      </div>

      <div className="mt-5">
        <div className="relative overflow-hidden rounded-2xl border border-(--promo-lab-card-border) bg-(--promo-lab-soft-bg) p-4 sm:p-5 shadow-(--promo-lab-card-shadow)">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(70%_120%_at_10%_0%,color-mix(in_srgb,var(--promo-lab-action-bg)_28%,transparent),transparent_75%)]"
          />

          <div className="relative">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--promo-lab-label)">
                  Coupon Lab
                </p>
                <label
                  htmlFor="premium-promo-code"
                  className="mt-1 block text-sm font-semibold text-(--promo-lab-heading)"
                >
                  Add your coupon code
                </label>
                <p className="mt-1 text-xs text-(--promo-lab-body)">
                  Enter a code or tap a quick pick to apply savings instantly.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-(--promo-lab-card-border) bg-(--promo-lab-chip-bg) px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-(--promo-lab-muted)">
                <Percent size={12} weight="bold" />
                For Sponsered runners
              </span>
            </div>

            <button
              type="button"
              onClick={() => setViewPromoTab((current) => !current)}
              aria-expanded={viewPromoTab}
              aria-controls="premium-promo-fields"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-(--promo-lab-label) underline underline-offset-4 transition hover:text-(--promo-lab-input) focus-visible:outline-[2px_solid_var(--promo-lab-label)]"
            >
              <Percent size={14} weight="bold" />
              {viewPromoTab ? "Hide coupon code" : "Apply coupon code"}
            </button>

            <AnimatePresence initial={false}>
              {viewPromoTab && (
                <motion.div
                  id="premium-promo-fields"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
                    <div className="relative flex-1 w-full">
                      <Tag
                        size={17}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--promo-lab-muted)"
                      />
                      <input
                        id="premium-coupon-code"
                        name="premiumCouponCode"
                        type="text"
                        autoComplete="off"
                        spellCheck={false}
                        value={code}
                        onChange={(event) => {
                          onCodeChange(event.target.value);
                          setError("");
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleApplyCouponCode();
                          }
                        }}
                        placeholder="ENTER CODE"
                        aria-describedby="premium-promo-code-status"
                        aria-invalid={status === "error"}
                        className={cn(
                          "h-12 w-full rounded-xl border bg-(--promo-lab-panel-bg) py-3 pl-11 pr-11 text-sm font-semibold  tracking-[0.2em] text-(--promo-lab-input) outline-none transition placeholder:font-medium placeholder:tracking-[0.12em] placeholder:text-(--promo-lab-placeholder) focus-visible:outline-[2px_solid_var(--promo-lab-label)]",
                          status === "error"
                            ? "border-destructive"
                            : "border-(--promo-lab-card-border)",
                        )}
                      />
                      {code && (
                        <button
                          type="button"
                          onClick={handleClear}
                          aria-label="Clear promo code"
                          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-(--promo-lab-muted) transition hover:bg-[color-mix(in_srgb,var(--promo-lab-action-bg)_20%,transparent)] hover:text-(--promo-lab-input) focus-visible:outline-[2px_solid_var(--promo-lab-label)]"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyCouponCode}
                      disabled={promoApplying}
                      className={cn(
                        "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase tracking-wider transition focus-visible:outline-[2px_solid_var(--promo-lab-label)] sm:min-w-36",
                        promoApplying && "cursor-not-allowed opacity-70",
                        isApplied
                          ? "border border-success/50 bg-success/15 text-success hover:bg-success/20"
                          : "bg-(--promo-lab-action-bg) text-(--promo-lab-action-fg) shadow-md hover:-translate-y-0.5 hover:brightness-105",
                      )}
                    >
                      {promoApplying ? (
                        <>
                          <DiscountTag01Icon size={17} weight="bold" />
                              {isApplied ? "Cancelling..." : "Applying..."}
                        </>
                      ) : isApplied ? (
                        <>
                          <BadgeXIcon size={17} weight="bold" />
                              Cancel
                        </>
                      ) : (
                        <>
                          <Coupon01Icon size={17} weight="bold" />
                          Apply
                        </>
                      )}
                    </button>
                  </div>

                  {/* <div className="mt-3 flex flex-wrap gap-2">
                    {promoCodes.map((option) => {
                      const isCurrent = option.code === promo?.code;

                      return (
                        <button
                          key={option.code}
                          type="button"
                          onClick={() => {
                            setError("");
                            onCodeChange(option.code);
                            onApply(option);
                          }}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition focus-visible:outline-[2px_solid_var(--promo-lab-label)]",
                            isCurrent
                              ? "border-success/50 bg-success/15 text-success"
                              : "border-(--promo-lab-card-border) bg-(--promo-lab-chip-bg) text-(--promo-lab-card-fg) hover:border-(--promo-lab-label) hover:bg-(--promo-lab-chip-hover-bg)",
                          )}
                        >
                          {option.code}
                        </button>
                      );
                    })}
                  </div> */}

                  <div
                    id="premium-promo-code-status"
                    aria-live="polite"
                    className="min-h-6"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {message && (
                        <motion.p
                          key={message}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "mt-2 flex items-center gap-1.5 text-xs font-semibold",
                            status === "applied"
                              ? "text-success"
                              : "text-(--promo-lab-error)",
                          )}
                        >
                          {status === "applied" ? (
                            <Sparkle size={14} weight="fill" />
                          ) : (
                            <Warning size={14} weight="fill" />
                          )}
                          {message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* {isApplied && (
                    <div className="mt-2 rounded-xl border border-success/25 bg-success/5 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-success">
                        Applied Coupon
                      </p>
                      <div className="mt-1.5 space-y-1 text-xs text-ink-soft">
                        <div className="flex items-center justify-between gap-3">
                          <span>Original amount</span>
                          <span className="font-semibold text-foreground">
                            {formatCurrencyAmount(
                              promo?.originalAmount,
                              promo?.currencyType,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Discount amount</span>
                          <span className="font-semibold text-success">
                            - {formatCurrencyAmount(
                              promo?.discountAmount,
                              promo?.currencyType,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Final amount</span>
                          <span className="font-semibold text-foreground">
                            {formatCurrencyAmount(
                              promo?.finalAmount,
                              promo?.currencyType,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )} */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-2 h-4"
      >
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-border" />
        <span className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-surface" />
        <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-surface" />
      </div>
    </div>
  );
}

function StandardPromoCodeCard({
  code,
  promo,
  onCodeChange,
  onApply,
  onClear,
  promoCodes,
}) {
  const [error, setError] = useState("");

  const handleApplyCouponCode = () => {
    const trimmed = String(code || "").trim();

    if (!trimmed) {
      setError("Enter a promo code to continue.");
      return;
    }

    const match = findPromo(trimmed, promoCodes);

    if (!match) {
      setError(`"${trimmed.toUpperCase()}" is not a valid promo code.`);
      return;
    }

    setError("");
    onApply(match);
  };

  const handleClear = () => {
    setError("");
    onClear();
  };

  const isApplied = Boolean(promo);
  const status = isApplied ? "applied" : error ? "error" : "idle";
  const message = isApplied ? `${promo.label} applied.` : error;

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-background">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_70%)]"
        />

        <div className="relative px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
              <Tag size={22} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                Have a promo code?
              </h3>
              <p className="text-xs text-ink-soft">
                Apply a discount before you confirm your entry.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="promo-code"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Promo code
            </label>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <Tag
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  id="promo-code"
                  name="promoCode"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={code}
                  onChange={(event) => {
                    onCodeChange(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleApplyCouponCode();
                    }
                  }}
                  placeholder="Enter code"
                  aria-describedby="promo-code-status"
                  aria-invalid={status === "error"}
                  className={cn(
                    "w-full rounded-xl border bg-background py-3 pl-11 pr-11 text-sm font-semibold uppercase tracking-[0.18em] text-foreground outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-soft/60 focus:ring-4",
                    status === "error"
                      ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                      : "border-border focus:border-accent focus:ring-accent/10",
                  )}
                />
                {code && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear promo code"
                    className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition hover:bg-border/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleApplyCouponCode}
                className={cn(
                  "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20",
                  isApplied
                    ? "border border-success/40 bg-success/10 text-success hover:bg-success/15"
                    : "bg-accent text-accent-foreground shadow-md hover:brightness-105",
                )}
              >
                {isApplied ? (
                  <>
                    <Check size={17} weight="bold" />
                    Applied
                  </>
                ) : (
                  <>
                    <Percent size={17} weight="bold" />
                    Apply
                  </>
                )}
              </button>
            </div>

            <div id="promo-code-status" aria-live="polite" className="min-h-6">
              <AnimatePresence mode="wait" initial={false}>
                {message && (
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "mt-2 flex items-center gap-1.5 text-xs font-semibold",
                      status === "applied"
                        ? "text-success"
                        : "text-destructive",
                    )}
                  >
                    {status === "applied" ? (
                      <Sparkle size={14} weight="fill" />
                    ) : (
                      <Warning size={14} weight="fill" />
                    )}
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 border-t border-dashed border-border pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              Try a demo code
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {promoCodes.map((option) => {
                const isCurrent = option.code === promo?.code;

                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setError("");
                      onCodeChange(option.code);
                      onApply(option);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                      isCurrent
                        ? "border-success/50 bg-success/10 text-success"
                        : "border-border bg-surface text-foreground hover:border-accent/50 hover:bg-accent/10 hover:text-accent",
                    )}
                  >
                    {option.code}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-2 h-4"
      >
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-border" />
        <span className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-surface" />
        <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-surface" />
      </div>
    </div>
  );
}

export default function PaymentStep({
  form,
  category,
  teamSize,
  onChange,
  step,
  registerData,
  participantReferenceNo,
}) {
  console.log(registerData, "registerData");

  const dispatch = useAppDispatch();
  const paymentOrder = useAppSelector(selectPaymentOrder);
  const savedRegistrationData = useAppSelector(selectCreateRegistrationData);
  const bibNumberState = useAppSelector(selectEnterBibNumberState);
  const [paymentLinkOpened, setPaymentLinkOpened] = useState(false);
  const [paymentLinkError, setPaymentLinkError] = useState("");
  const paymentOrderRequestRef = useRef("");
  const previousPayableRef = useRef(null);
  const bibTicketWrapRef = useRef(null);
  const [isTicketTorn, setIsTicketTorn] = useState(false);
  const [isCancellingBib, setIsCancellingBib] = useState(false);
  const [bibClientError, setBibClientError] = useState("");
  const [couponCelebrationTick, setCouponCelebrationTick] = useState(0);
  const [amountColorTick, setAmountColorTick] = useState(0);
  const [isApplyingPremiumCoupon, setIsApplyingPremiumCoupon] = useState(false);
  const price = category?.price ?? 0;
  const isCorporate = form.entryType === "corporate";
  const { data: masterData = null } = useQuery({
    queryKey: ["master-data"],
    queryFn: async () => await dispatch(getMasterData()).unwrap(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: masterEventCategoriesData = [] } = useQuery({
    queryKey: ["master-event-categories"],
    queryFn: async () => await dispatch(getMasterEventCategories()).unwrap(),
    staleTime: 5 * 60 * 1000,
  });
  // console.log(form, "form");
  // console.log(masterEventCategoriesData, "masterEventCategoriesData");
  // console.log(masterData, "masterData");
  // console.log(registerData, "registerData");

  const participantReference =
    participantReferenceNo ||
    savedRegistrationData?.participant_reference ||
    savedRegistrationData?.participantReference ||
    savedRegistrationData?.reference ||
    savedRegistrationData?.id ||
    form?.participant_reference ||
    form?.participantReference ||
    form?.reference ||
    registerData?.participant_reference ||
    registerData?.participantReference ||
    registerData?.reference ||
    "";
  const paymentCompletionKey = participantReference
    ? `payment.completed.${participantReference}`
    : "";
  // console.log(participantReferenceNo,"participantReferenceNo");

  const bibError = bibClientError || bibNumberState?.error || "";

  const paidStatusFromData = useMemo(() => {
    const statusValues = [
      paymentOrder?.status,
      paymentOrder?.payment_status,
      paymentOrder?.registration_status,
      savedRegistrationData?.status,
      savedRegistrationData?.payment_status,
      registerData?.status,
      registerData?.payment_status,
      registerData?.registration_status,
      form?.payment_status,
    ];

    return statusValues.some(isPaidStatusValue);
  }, [
    form?.payment_status,
    paymentOrder?.payment_status,
    paymentOrder?.registration_status,
    paymentOrder?.status,
    registerData?.payment_status,
    registerData?.registration_status,
    registerData?.status,
    savedRegistrationData?.payment_status,
    savedRegistrationData?.status,
  ]);

  const isPaymentCompleted = useMemo(() => {
    if (!participantReference || typeof window === "undefined") {
      return paidStatusFromData;
    }

    const localPaid = Boolean(
      window.localStorage.getItem(paymentCompletionKey),
    );
    return localPaid || paidStatusFromData;
  }, [participantReference, paidStatusFromData, paymentCompletionKey]);

  useEffect(() => {
    if (!participantReference || !paymentCompletionKey) return;
    if (typeof window === "undefined") return;
    if (!isPaymentCompleted) return;

    window.localStorage.setItem(
      paymentCompletionKey,
      JSON.stringify({ paid: true, at: Date.now() }),
    );
  }, [isPaymentCompleted, participantReference, paymentCompletionKey]);

  const handleTogglePremiumBib = async (isEnabled) => {
    if (!isEnabled) {
      if (!participantReference) {
        setBibClientError(
          "Participant reference missing. Please retry registration.",
        );
        return;
      }

      setBibClientError("");
      setIsCancellingBib(true);

      try {
        await dispatch(
          cancelBibNumber({ participant_reference: participantReference }),
        ).unwrap();

        onChange("premiumBibApplied", false);
        onChange("premiumBibNumber", "");
        setIsTicketTorn(false);
        dispatch(resetEnterBibNumberState());
      } catch (error) {
        onChange("premiumBibApplied", true);
        setBibClientError(
          typeof error === "string"
            ? error
            : error?.message || "Failed to cancel premium bib number.",
        );
      } finally {
        setIsCancellingBib(false);
      }

      return;
    }

    const bibValue = String(form?.premiumBibNumber ?? "")
      .trim()
      .toUpperCase();
    const categoryId = Number(
      selectedCategoryFromMasters?.id ?? getData?.id ?? 0,
    );
    if (!participantReference) {
      setBibClientError(
        "Participant reference missing. Please retry registration.",
      );
      onChange("premiumBibApplied", false);
      return;
    }

    if (!categoryId) {
      setBibClientError(
        "Runner category missing. Please select your event again.",
      );
      onChange("premiumBibApplied", false);
      return;
    }

    if (!bibValue) {
      setBibClientError("Enter a premium bib number to continue.");
      onChange("premiumBibApplied", false);
      return;
    }

    const bibRangeRule = premiumBibRangeRule;

    const isNumericBib = /^\d+$/.test(bibValue);

    if (bibRangeRule && !isNumericBib) {
      setBibClientError(
        `${bibRangeRule.label} bib must be numeric (${bibRangeRule.min} to ${bibRangeRule.max}).`,
      );
      onChange("premiumBibApplied", false);
      return;
    }

    if (bibRangeRule && isNumericBib) {
      const bibNumber = Number.parseInt(bibValue, 10);
      if (bibNumber < bibRangeRule.min || bibNumber > bibRangeRule.max) {
        setBibClientError(
          `${bibRangeRule.label} bib must be between ${bibRangeRule.min} and ${bibRangeRule.max}.`,
        );
        onChange("premiumBibApplied", false);
        return;
      }
    }

    setBibClientError("");

    try {
      await dispatch(
        enterBibNumber({
          participant_reference: participantReference,
          category_id: categoryId,
          bib_number: bibValue,
        }),
      ).unwrap();

      onChange("premiumBibApplied", true);
    } catch {
      onChange("premiumBibApplied", false);
    }
  };

  const handleBibNumberChange = (value) => {
    onChange("premiumBibNumber", value);
    setIsTicketTorn(false);

    if (form?.premiumBibApplied) {
      onChange("premiumBibApplied", false);
      dispatch(resetEnterBibNumberState());
    }

    if (bibClientError) {
      setBibClientError("");
    }
  };

  // const { data: paymentOrder = null } = useQuery({
  //   queryKey: ["payment-order", participantReference || "default"],
  //   queryFn: async () => {
  //     const scoped = participantReference
  //       ? queryClient.getQueryData(["payment-order", participantReference])
  //       : null;
  //     const shared = queryClient.getQueryData(["payment-order"]);
  //     return scoped ?? shared ?? null;
  //   },
  //   staleTime: Infinity,
  // });
  // console.log(paymentOrder, "paymentOrder");

  // useEffect(() => {
  //   const fetchPaymentOrder = async () => {
  //     const paymentOrder = await queryClient.getQueryData(["payment-order", participantReference]) ?? queryClient.getQueryData(["payment-order"]) ?? null;
  //     console.log(paymentOrder, "paymentOrder");
  //   };
  //   fetchPaymentOrder();
  // }, [participantReference, queryClient]);

  const registrationCategoriesFromMasterData = Array.isArray(
    masterData?.registration_category,
  )
    ? masterData.registration_category
    : [];
  const registrationCategoriesFromEventCategories = Array.isArray(
    masterEventCategoriesData,
  )
    ? masterEventCategoriesData
    : [];

  const getRegistrationCategory =
    registrationCategoriesFromMasterData.length > 0
      ? registrationCategoriesFromMasterData
      : registrationCategoriesFromEventCategories;
      console.log(getRegistrationCategory,"getRegistrationCategory");
      

  const selectedCategoryFromMasters = (() => {
    if (
      !Array.isArray(getRegistrationCategory) ||
      !getRegistrationCategory.length
    ) {
      return null;
    }

    const selectedId =
      form?.runner_category_id ||
      registerData?.runner_category_id ||
      registerData?.category?.id
      console.log(form, registerData,selectedId, "selectedId");
      

    if (selectedId) {
      const byId = getRegistrationCategory.find(
        (item) => String(item?.id) === String(selectedId),
      );
      if (byId) return byId;
    }

    const candidateNames = [
      form?.event,
      readCategoryLabel(registerData?.category),
      registerData?.category_name,
      registerData?.event_category,
      category?.name,
      category?.title,
    ]
      .map(normalizeCategoryText)
      .filter(Boolean);

    if (!candidateNames.length) return null;

    return (
      getRegistrationCategory.find((item) => {
        const itemValues = [
          item?.name,
          item?.category_name,
          item?.distance,
          `${item?.distance ?? ""} ${item?.name ?? ""}`,
          `${item?.name ?? ""} ${item?.distance ?? ""}`,
        ]
          .map(normalizeCategoryText)
          .filter(Boolean);

        const itemKeys = itemValues.map(normalizeCategoryKey);

        return candidateNames.some((candidate) => {
          const candidateKey = normalizeCategoryKey(candidate);

          return (
            itemValues.some(
              (value) =>
                value === candidate ||
                value.includes(candidate) ||
                candidate.includes(value),
            ) ||
            itemKeys.some(
              (key) =>
                key === candidateKey ||
                key.includes(candidateKey) ||
                candidateKey.includes(key),
            )
          );
        });
      }) || null
    );
  })();

  const getAmountForRegistrationCategory = (category) => {
    const foundCategory = getRegistrationCategory.find(
      (item) => String(item.id) === String(category),
    );
    return foundCategory || selectedCategoryFromMasters;
    // return Number(foundCategory?.fee ?? foundCategory?.price ?? 0);
  };
  const getData = getAmountForRegistrationCategory(form?.runner_category_id);
  // console.log(getData, "getData");
  // console.log(masterEventCategoriesData, "masterEventCategoriesData");
  // console.log(selectedCategoryFromMasters, "selectedCategoryFromMasters");

  const selectedCategoryForRule = selectedCategoryFromMasters || getData;
  const selectedEventLabel =
    readCategoryLabel(registerData?.category) ||
    registerData?.category_name ||
    registerData?.event_category ||
    category?.name ||
    category?.title ||
    "-";
  
  const premiumBibRangeRule =
    getBibRangeRuleByCategoryId(
      selectedCategoryForRule?.id,
      masterEventCategoriesData,
    ) ||
    extractBibRangeFromCategory(selectedCategoryForRule) ||
    getBibRangeRuleForCategory(selectedCategoryForRule);

  const premiumBibHintMaxLength = premiumBibRangeRule
    ? Math.max(
        String(premiumBibRangeRule.min).length,
        String(premiumBibRangeRule.max).length,
      )
    : 5;

  const premiumBibRangeHint = premiumBibRangeRule
    ? `${premiumBibRangeRule.label} bib must be between ${premiumBibRangeRule.min} and ${premiumBibRangeRule.max}.`
    : "";

  const effectivePrice =
    registerData?.base_fee || (getData?.fee > 0 ? getData?.fee : price);

  // console.log(effectivePrice, "effectivePrice");

  const appliedPromo = form.promoApplied ?? null;
  const appliedPremiumCoupon =
    form.premiumCouponApplied ?? form.premiumPromoApplied ?? null;

  const regularDiscount = useMemo(
    () => getPromoDiscount(appliedPromo, effectivePrice),
    [appliedPromo, effectivePrice],
  );

  const premiumDiscount = useMemo(() => {
    const remainingAfterRegular = Math.max(0, effectivePrice - regularDiscount);
    return getPromoDiscount(appliedPremiumCoupon, remainingAfterRegular);
  }, [appliedPremiumCoupon, effectivePrice, regularDiscount]);

  const totalDiscount = Math.min(
    effectivePrice,
    regularDiscount + premiumDiscount,
  );
  const premiumBibCharge = form.premiumBibApplied ? 500 : 0;
  const payable = Math.max(
    0,
    effectivePrice - totalDiscount + premiumBibCharge,
  );
  const expectedAmountPaise = Math.max(0, Math.round(payable * 100));

  const launchCouponCelebration = useCallback(() => {
    const colors = ["#f97316", "#22c55e", "#06b6d4", "#ec4899", "#f59e0b"];

    confetti({
      particleCount: 90,
      spread: 70,
      startVelocity: 55,
      origin: { y: 0.68 },
      colors,
    });

    confetti({
      particleCount: 55,
      angle: 60,
      spread: 50,
      startVelocity: 50,
      origin: { x: 0, y: 0.7 },
      colors,
    });

    confetti({
      particleCount: 55,
      angle: 120,
      spread: 50,
      startVelocity: 50,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    setCouponCelebrationTick((current) => current + 1);
    setAmountColorTick((current) => current + 1);
  }, []);

  useEffect(() => {
    if (previousPayableRef.current === null) {
      previousPayableRef.current = payable;
      return;
    }

    if (previousPayableRef.current !== payable) {
      previousPayableRef.current = payable;
      setAmountColorTick((current) => current + 1);
    }
  }, [payable]);

  useEffect(() => {
    if (!participantReference) return;

    const currentOrderAmountPaise = Number(
      paymentOrder?.amount || paymentOrder?.amount_paise || 0,
    );

    if (
      paymentOrder &&
      currentOrderAmountPaise > 0 &&
      currentOrderAmountPaise === expectedAmountPaise
    ) {
      return;
    }

    const requestKey = `${participantReference}:${expectedAmountPaise}`;
    if (paymentOrderRequestRef.current === requestKey) return;
    paymentOrderRequestRef.current = requestKey;

    dispatch(
      createPaymentOrder({
        participant_reference: participantReference,
        payable_amount: payable,
      }),
    );
  }, [
    dispatch,
    expectedAmountPaise,
    participantReference,
    paymentOrder,
    payable,
  ]);

  const premiumBibNumber = (form.premiumBibNumber || "").trim();
  const shouldShowBibTicket = Boolean(premiumBibNumber);
  const bibTicketValue = premiumBibNumber ? `${premiumBibNumber}` : "00123";

  useEffect(() => {
    const el = bibTicketWrapRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    if (shouldShowBibTicket) {
      gsap.set(el, { display: "block", overflow: "hidden" });
      gsap.fromTo(
        el,
        { height: 0, opacity: 0, y: -12 },
        {
          height: "auto",
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(el, { clearProps: "height,overflow" });
          },
        },
      );
      return;
    }

    gsap.set(el, { overflow: "hidden", display: "block" });
    gsap.to(el, {
      height: 0,
      opacity: 0,
      y: -12,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(el, {
          display: "none",
          clearProps: "height,overflow",
        });
      },
    });
  }, [shouldShowBibTicket]);

  const razorpayKey =
    paymentOrder?.rzpKey ||
    paymentOrder?.key ||
    paymentOrder?.key_id ||
    paymentOrder?.razorpay_key ||
    "";
  const razorpayOrderId =
    paymentOrder?.order_id || paymentOrder?.orderId || paymentOrder?.id || "";
  const razorpayAmountPaise = expectedAmountPaise;

  const razorpayPopupUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (razorpayKey) params.set("key", razorpayKey);
    if (razorpayOrderId) params.set("orderId", razorpayOrderId);
    if (razorpayAmountPaise) params.set("amount", String(razorpayAmountPaise));
    if (participantReference)
      params.set("reference", String(participantReference));
    if (payable > 0) params.set("payable", String(payable));

    const query = params.toString();
    return query ? `/razorpay-popup?${query}` : "/razorpay-popup";
  }, [
    participantReference,
    payable,
    razorpayAmountPaise,
    razorpayKey,
    razorpayOrderId,
  ]);

  const handleOpenPaymentPopup = async () => {
    if (isPaymentCompleted) {
      setPaymentLinkOpened(false);
      setPaymentLinkError(
        "Payment is already completed for this registration. No further payment popup is needed.",
      );
      return;
    }

    if (!participantReference) {
      setPaymentLinkError(
        "Participant reference missing. Please retry registration.",
      );
      return;
    }

    setPaymentLinkError("");

    const popupTab = window.open("", "_blank");

    if (!popupTab) {
      setPaymentLinkError(
        "Popup was blocked. Please allow popups and try again.",
      );
      return;
    }

    popupTab.document.title = "Preparing Payment";
    popupTab.document.body.style.margin = "0";
    popupTab.document.body.style.minHeight = "100vh";
    popupTab.document.body.style.display = "grid";
    popupTab.document.body.style.placeItems = "center";
    popupTab.document.body.style.fontFamily =
      "var(--font-sans), ui-sans-serif, system-ui, sans-serif";
    popupTab.document.body.innerHTML =
      "<p style='font-size:14px;color:#444'>Preparing your secure payment...</p>";

    try {
      const response = await dispatch(
        createPaymentOrder({
          participant_reference: participantReference,
          payable_amount: payable,
        }),
      ).unwrap();

      const latestOrder =
        response?.order || response?.data || response?.result || response || {};
        console.log(latestOrder,"dsddsdsdsdsd");
        

      const latestKey =
        latestOrder?.rzpKey ||
        latestOrder?.key ||
        latestOrder?.key_id ||
        latestOrder?.razorpay_key ||
        razorpayKey;

      const latestOrderId =
        latestOrder?.order_id || latestOrder?.orderId || latestOrder?.id || "";

      const serverAmountPaise = Number(
        latestOrder?.amount || latestOrder?.amount_paise || 0,
      );
      const latestAmountPaise = expectedAmountPaise;

      if (serverAmountPaise > 0 && serverAmountPaise !== expectedAmountPaise) {
        setPaymentLinkError(
          "Payment amount is still syncing on server. Please click once again to continue with updated amount.",
        );
      }

      if (!latestKey || !latestOrderId || !latestAmountPaise) {
        popupTab.location.href = `${razorpayPopupUrl}${
          razorpayPopupUrl.includes("?") ? "&" : "?"
        }ts=${Date.now()}`;
        setPaymentLinkOpened(true);
        return;
      }

      const params = new URLSearchParams();
      params.set("key", String(latestKey));
      params.set("orderId", String(latestOrderId));
      params.set("amount", String(latestAmountPaise));
      params.set("reference", String(participantReference));
      if (payable > 0) {
        params.set("payable", String(payable));
      }
      params.set("ts", String(Date.now()));

      popupTab.location.href = `/razorpay-popup?${params.toString()}`;
      setPaymentLinkOpened(true);
    } catch (error) {
      setPaymentLinkError(
        typeof error === "string"
          ? error
          : error?.message ||
              "Unable to open payment right now. Please try again.",
      );
      popupTab.document.title = "Payment Error";
      popupTab.document.body.innerHTML =
        "<div style='font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif;max-width:460px;margin:40px auto;padding:16px;color:#333'><h2 style='margin:0 0 8px;font-size:18px'>Unable to prepare payment</h2><p style='margin:0 0 10px;font-size:14px'>Please close this tab and try again from the registration page.</p></div>";
    }
  };

  const handleApplyPromo = (promo) => {
    const shouldCelebrate = appliedPromo?.code !== promo?.code;
    onChange("promoCode", promo.code);
    onChange("promoApplied", promo);

    if (shouldCelebrate) {
      launchCouponCelebration();
    }
  };

  const handleClearPromo = () => {
    onChange("promoCode", "");
    onChange("promoApplied", null);
  };

  const handleCodeChange = (value) => {
    onChange("promoCode", value.toUpperCase());

    // Typing a new code invalidates the previously applied promo.
    if (appliedPromo) {
      onChange("promoApplied", null);
    }
  };

  const handleApplyPremiumCoupon = (coupon) => {
    const shouldCelebrate = appliedPremiumCoupon?.code !== coupon?.code;
    onChange("premiumCouponCode", coupon.code);
    onChange("premiumCouponApplied", coupon);
    // Backward compatibility for existing form payload consumers.
    onChange("premiumPromoCode", coupon.code);
    onChange("premiumPromoApplied", coupon);

    if (shouldCelebrate) {
      launchCouponCelebration();
    }
  };

  const handleApplyPremiumCouponCode = useCallback(
    async (rawCode) => {
      const trimmed = String(rawCode || "")
        .trim();

      if (!trimmed) {
        throw new Error("Enter a coupon code to continue.");
      }

      setIsApplyingPremiumCoupon(true);
      try {
        const payload = await dispatch(
          applyCouponCode({
            coupon_code: trimmed,
            participant_reference: participantReference,
          }),
        ).unwrap();

        const serverData =
          payload?.data || payload?.result || payload?.coupon || payload || {};
        const serverCode = String(
          serverData?.coupon_code || serverData?.couponCode || trimmed,
        )
          .trim()
          .toUpperCase();

        const serverCurrencyType =
          serverData?.currency_type ||
          serverData?.currencyType ||
          serverData?.currency ||
          "INR";
        const originalAmount =
          serverData?.original_amount ??
          serverData?.originalAmount ??
          serverData?.amount;
        const discountAmount =
          serverData?.discount_amount ??
          serverData?.discountAmount ??
          serverData?.discount_value ??
          serverData?.discountValue ??
          serverData?.value;
        const finalAmount =
          serverData?.final_amount ??
          serverData?.finalAmount ??
          serverData?.payable_amount ??
          serverData?.payableAmount;
        const normalizedDiscountAmount = toFiniteNumber(discountAmount);

        if (normalizedDiscountAmount !== null && normalizedDiscountAmount > 0) {
          return {
            code: serverCode,
            type: "flat",
            value: normalizedDiscountAmount,
            label:
              serverData?.message ||
              payload?.message ||
              `${serverCode} applied`,
            message: serverData?.message || payload?.message || "",
            currencyType: serverCurrencyType,
            originalAmount,
            discountAmount: normalizedDiscountAmount,
            finalAmount,
            participantReference:
              serverData?.participant_reference ||
              serverData?.participantReference ||
              participantReference ||
              "",
          };
        }

        throw new Error("Coupon applied but discount details were not returned.");
      } catch (error) {
        throw new Error(
          typeof error === "string"
            ? error
            : error?.message || "Unable to apply coupon code.",
        );
      } finally {
        setIsApplyingPremiumCoupon(false);
      }
    },
    [dispatch, participantReference],
  );

  const handleCancelPremiumCouponCode = async () => {
    const appliedCouponCode =
      appliedPremiumCoupon?.code ||
      form?.premiumCouponCode ||
      form?.premiumPromoCode ||
      "";

    const normalizedCouponCode = String(appliedCouponCode || "")
      .trim()
      .toUpperCase();

    if (!participantReference) {
      throw new Error("Participant reference missing. Please retry registration.");
    }

    if (!normalizedCouponCode) {
      throw new Error("No applied coupon code to cancel.");
    }

    setIsApplyingPremiumCoupon(true);
    try {
      await dispatch(
        cancelCouponCode({
          coupon_code: normalizedCouponCode,
          participant_reference: participantReference,
        }),
      ).unwrap();

      onChange("premiumCouponCode", "");
      onChange("premiumCouponApplied", null);
      onChange("premiumPromoCode", "");
      onChange("premiumPromoApplied", null);
    } catch (error) {
      throw new Error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to cancel coupon code.",
      );
    } finally {
      setIsApplyingPremiumCoupon(false);
    }
  };

  const handleClearPremiumCoupon = () => {
    onChange("premiumCouponCode", "");
    onChange("premiumCouponApplied", null);
    onChange("premiumPromoCode", "");
    onChange("premiumPromoApplied", null);
  };

  const handlePremiumCouponCodeChange = (value) => {
    onChange("premiumCouponCode", value);
    onChange("premiumPromoCode", value);

    if (appliedPremiumCoupon) {
      onChange("premiumCouponApplied", null);
      onChange("premiumPromoApplied", null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-background">
        <div className="border-b border-border bg-surface px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
              <CreditCard size={22} weight="duotone" />
            </span>
            <div className="min-w-0">
              <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                Payment summary
              </h3>
              <p className="text-xs text-ink-soft">
                {}
                {"Selected event"} · {selectedEventLabel}{" "}
                {"Distance"} - {getData?.distance ?? "-"}
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 border-t border-border/70 pt-4 text-sm">
            <div className="">
              {/* <div className=""> */}
              <div
                ref={bibTicketWrapRef}
                style={shouldShowBibTicket ? undefined : { display: "none" }}
              >
                <MarathonPassTicket
                  fluid
                  disabled={true}
                  torn={isTicketTorn}
                  onTear={() => setIsTicketTorn(false)}
                  tearTicketContentClassName="bg-transparent"
                  tearTicketStubClassName="bg-gradient-mesh"
                  width={820}
                  height={320}
                  imageFit="fill"
                  bodyWidth={520}
                  bodyHeight={320}
                  artSpan={1}
                  imageRadius={16}
                  radius={24}
                  stubSize={300}
                  holes={8}
                  holeSize={4}
                  notch={4}
                  tearAngle={0}
                  stretch={0}
                  rotate={0}
                  tiltMax={0}
                  parallax={0}
                  tilt={false}
                  background="var(--card-background)"
                  color="#c679c4"
                  stubEvent={form?.event ?? "City Marathon 2027"}
                  participantName={
                    form?.first_name && form?.last_name
                      ? `${form?.first_name} ${form?.last_name}`
                      : "John Doe"
                  }
                  stubDistance={getData?.name}
                  stubLocation="Avadi"
                  stubRegNo={bibTicketValue}
                />
              </div>
              {/* </div> */}
              <PromoCodeCard
                code={form.premiumCouponCode ?? form.premiumPromoCode ?? ""}
                promo={appliedPremiumCoupon}
                bibNumber={form.premiumBibNumber ?? ""}
                bibApplied={form.premiumBibApplied}
                onToggleBib={handleTogglePremiumBib}
                onBibChange={handleBibNumberChange}
                onCodeChange={handlePremiumCouponCodeChange}
                onApplyCode={handleApplyPremiumCouponCode}
                onCancelCode={handleCancelPremiumCouponCode}
                onApply={handleApplyPremiumCoupon}
                onClear={handleClearPremiumCoupon}
                bibHint={premiumBibRangeHint}
                bibHintMaxLength={premiumBibHintMaxLength}
                bibLoading={Boolean(bibNumberState?.loading) || isCancellingBib}
                bibError={bibError}
                bibSuccess={Boolean(bibNumberState?.success)}
                promoApplying={isApplyingPremiumCoupon}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-soft">
                {isCorporate ? "Entry fee per participant" : "Entry fee"}
              </dt>
              <dd className="font-semibold tabular-nums text-foreground">
                {formatINR(effectivePrice)}
              </dd>
            </div>

            {isCorporate && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-soft">Team size</dt>
                <dd className="font-semibold text-foreground">
                  {teamSize?.label ?? "-"}
                </dd>
              </div>
            )}

            <AnimatePresence initial={false}>
              {appliedPromo && (
                <motion.div
                  key="promo-row-regular"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-ink-soft">
                      <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-success">
                        {appliedPromo.code}
                      </span>
                      Promo discount
                    </dt>
                    <dd className="flex items-center gap-2 font-semibold tabular-nums text-success">
                      <span aria-hidden="true">-</span>
                      <AnimatedAmount value={regularDiscount} pulseKey={amountColorTick} />
                    </dd>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {appliedPremiumCoupon && (
                <motion.div
                  key="promo-row-premium"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-ink-soft">
                      <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-success">
                        {appliedPremiumCoupon.code}
                      </span>
                      Premium coupon discount
                    </dt>
                    <dd className="flex items-center gap-2 font-semibold tabular-nums text-success">
                      <span aria-hidden="true">-</span>
                      <AnimatedAmount value={premiumDiscount} pulseKey={amountColorTick} />
                    </dd>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {appliedPremiumCoupon && (
                <motion.div
                  key="premium-coupon-breakdown"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-success/25 bg-success/5 px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-success">
                      Coupon Breakdown
                    </p>
                    <div className="mt-2 space-y-1.5 text-xs text-ink-soft">
                      <div className="flex items-center justify-between gap-3">
                        <span>Original amount</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrencyAmount(
                            appliedPremiumCoupon?.originalAmount,
                            appliedPremiumCoupon?.currencyType,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Discount amount</span>
                        <span className="font-semibold text-success">
                          - {formatCurrencyAmount(
                            appliedPremiumCoupon?.discountAmount,
                            appliedPremiumCoupon?.currencyType,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Final amount</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrencyAmount(
                            appliedPremiumCoupon?.finalAmount,
                            appliedPremiumCoupon?.currencyType,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {premiumBibCharge > 0 && (
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-ink-soft">
                  <span className="rounded-md bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-warning">
                    BIB
                  </span>
                  Premium bib add-on
                </dt>
                <dd className="flex items-center gap-2 font-semibold tabular-nums text-warning">
                  <span aria-hidden="true">+</span>
                  <AnimatedAmount value={premiumBibCharge} pulseKey={amountColorTick} />
                </dd>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="font-bold text-foreground">
                {isCorporate ? "Team total" : "Amount due"}
              </dt>
              <dd className="text-2xl font-black tabular-nums text-foreground">
                {isCorporate ? (
                  "Confirmed by organizer"
                ) : (
                  <AnimatedAmount
                    value={payable}
                    pulseKey={amountColorTick}
                    colorful
                  />
                )}
              </dd>
            </div>
          </dl>

          {isCorporate && (
            <p className="mt-3 rounded-xl bg-primary/5 px-3 py-2 text-xs leading-relaxed text-ink-soft">
              Indicative payable per participant:{" "}
              <span className="font-bold text-foreground">
                {formatINR(payable)}
              </span>{" "}
              - the final team amount is confirmed by the organizers.
            </p>
          )}
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 px-5 py-5 sm:px-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-accent/10 blur-2xl"
          />
          <div className="relative flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={21} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-foreground">
                  Continue with Razorpay
                </p>
                <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Hosted payment
                </span>
              </div>

              {isCorporate ? (
                <>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Team pricing needs organizer confirmation before payment.
                  </p>
                  <a
                    href="mailto:sudharvarun@yahoo.com?subject=Marathon%20corporate%20entry%20payment"
                    className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
                  >
                    Contact organizers
                  </a>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Pay{" "}
                    <strong className="text-foreground">
                      {formatINR(payable)}
                    </strong>{" "}
                    for this entry. Razorpay opens in a new tab; check the
                    amount there before completing payment.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenPaymentPopup}
                    disabled={isPaymentCompleted}
                    className={cn(
                      "mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-md transition focus-visible:outline-none focus-visible:ring-4 sm:w-auto",
                      isPaymentCompleted
                        ? "cursor-not-allowed bg-success/80 text-success-foreground shadow-success/20 focus-visible:ring-success/30"
                        : "bg-primary text-primary-foreground shadow-primary/15 hover:brightness-105 focus-visible:ring-primary/25",
                    )}
                  >
                    {isPaymentCompleted
                      ? "Payment Completed"
                      : "Continue to Secure Payment"}
                    <ArrowSquareOut
                      size={17}
                      weight="bold"
                      aria-hidden="true"
                    />
                  </button>
                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-2 min-h-4 text-xs leading-relaxed text-ink-soft"
                  >
                    {paymentLinkError
                      ? paymentLinkError
                      : isPaymentCompleted
                        ? "Payment already verified. You can continue from this page without reopening Razorpay."
                        : paymentLinkOpened
                          ? "Razorpay opened in a new tab. Return here after checkout to report your payment."
                          : "Opening Razorpay does not submit this registration or confirm payment."}
                  </p>
                  {/* {form.paymentReported ? (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mt-3 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-3"
                    >
                      <Warning
                        size={19}
                        weight="fill"
                        className="mt-0.5 shrink-0 text-warning"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">
                          Payment reported - awaiting verification
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                          Thanks for letting us know. This is not a verified
                          payment confirmation; the organizers must confirm your
                          payment before your entry is complete.
                        </p>
                        <button
                          type="button"
                          onClick={() => onChange("paymentReported", false)}
                          className="mt-2 rounded-md text-xs font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                        >
                          Undo payment report
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onChange("paymentReported", true)}
                      className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      I’ve completed payment
                    </button>
                  )} */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {(appliedPromo || appliedPremiumCoupon) && totalDiscount > 0 && (
          <motion.div
            key={`promo-success-${couponCelebrationTick}`}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-4 py-4 sm:px-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
              <Confetti size={20} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">
                You saved {formatINR(totalDiscount)} on this entry
              </p>
              <p className="text-xs text-ink-soft">
                {[appliedPromo, appliedPremiumCoupon]
                  .filter(Boolean)
                  .map((promoItem) => `${promoItem.label} (${promoItem.code})`)
                  .join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                handleClearPromo();
                handleClearPremiumCoupon();
              }}
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-ink-soft transition hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <ArrowCounterClockwise size={14} weight="bold" />
              Remove
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-ink-soft">
            Complete payment only on the official Razorpay page. This
            registration page does not receive payment status or reserve a bib.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
