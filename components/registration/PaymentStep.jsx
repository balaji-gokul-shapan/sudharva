"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  createPaymentOrder,
  selectPaymentOrder,
} from "@/store/slices/payment/createPaymentOrderSlice";
import { Input } from "../ui/input";

const PROMO_CODES = [
  {
    code: "RUN10",
    type: "percent",
    value: 10,
    label: "10% off your entry fee",
  },
  {
    code: "EARLYBIRD",
    type: "percent",
    value: 15,
    label: "15% early-bird discount",
  },
  {
    code: "FIRST500",
    type: "flat",
    value: 500,
    label: "₹500 off your entry fee",
  },
  {
    code: "COMMUNITY50",
    type: "flat",
    value: 50,
    label: "₹50 community discount",
  },
];

const PREMIUM_PROMO_CODES = [
  {
    code: "ELITE5",
    type: "percent",
    value: 5,
    label: "5% premium bib discount",
  },
  {
    code: "VIP250",
    type: "flat",
    value: 250,
    label: "₹250 premium discount",
  },
  {
    code: "BIBBOOST",
    type: "flat",
    value: 100,
    label: "₹100 premium boost",
  },
];

export function findPromo(rawCode, promoCodes = PROMO_CODES) {
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

function AnimatedAmount({ value, className }) {
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

  return <span className={className}>{formatINR(display)}</span>;
}

function PromoCodeCard({
  code,
  promo,
  bibNumber,
  onBibChange,
  onCodeChange,
  onApply,
  onClear,
  promoCodes,
}) {
  const [error, setError] = useState("");

  const handleApply = () => {
    const trimmed = code.trim();

    if (!trimmed) {
      setError("Enter a promo code to continue.");
      return;
    }

    const match = findPromo(trimmed, promoCodes);

    if (!match) {
      setError(`“${trimmed.toUpperCase()}” is not a valid promo code.`);
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
  const bibPreview = String(bibNumber || "").trim() || "ELITE24";

  const handleBibInput = (value) => {
    const sanitized = String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);
    onBibChange(sanitized);
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
          <div className="flex items-start gap-3">
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

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <label
                htmlFor="premium-bib-number"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-(--premium-label)"
              >
                Premium Bib Number
              </label>
              <Input
                id="premium-bib-number"
                name="premiumBibNumber"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={bibNumber ?? ""}
                onChange={(event) => handleBibInput(event.target.value)}
                placeholder="ELITE24"
                className="h-12 w-full rounded-xl border border-(--premium-card-border) bg-(--premium-panel-bg) px-3 text-sm font-semibold uppercase tracking-[0.22em] text-(--premium-input) outline-none transition placeholder:tracking-normal placeholder:text-(--premium-placeholder) focus-visible:outline-[2px_solid_var(--premium-label)]"
              />
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

          <div className="mt-5">
            <label
              htmlFor="premium-promo-code"
              className="mb-2 block text-sm font-semibold text-(--premium-heading)"
            >
              Premium promo code
            </label>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <Tag
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--premium-muted)"
                />
                <input
                  id="premium-promo-code"
                  name="premiumPromoCode"
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
                      handleApply();
                    }
                  }}
                  placeholder="Enter code"
                  aria-describedby="premium-promo-code-status"
                  aria-invalid={status === "error"}
                  className={cn(
                    "w-full rounded-xl border bg-(--premium-panel-bg) py-3 pl-11 pr-11 text-sm font-semibold uppercase tracking-[0.18em] text-(--premium-input) outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-(--premium-placeholder) focus-visible:outline-[2px_solid_var(--premium-label)]",
                    status === "error"
                      ? "border-destructive"
                      : "border-(--premium-card-border)",
                  )}
                />
                {code && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear promo code"
                    className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-(--premium-muted) transition hover:bg-[color-mix(in_srgb,var(--premium-action-bg)_20%,transparent)] hover:text-(--premium-input) focus-visible:outline-[2px_solid_var(--premium-label)]"
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleApply}
                className={cn(
                  "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase tracking-wider transition focus-visible:outline-[2px_solid_var(--premium-label)]",
                  isApplied
                    ? "border border-success/50 bg-success/15 text-success hover:bg-success/20"
                    : "bg-(--premium-action-bg) text-(--premium-action-fg) shadow-md hover:brightness-105",
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
                        : "text-(--premium-error)",
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

          <div className="mt-4 border-t border-dashed border-[color-mix(in_srgb,var(--premium-muted)_35%,transparent)] pt-4">
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

  const handleApply = () => {
    const trimmed = code.trim();

    if (!trimmed) {
      setError("Enter a promo code to continue.");
      return;
    }

    const match = findPromo(trimmed, promoCodes);

    if (!match) {
      setError(`“${trimmed.toUpperCase()}” is not a valid promo code.`);
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
                      handleApply();
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
                onClick={handleApply}
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

export default function PaymentStep({ form, category, teamSize, onChange }) {
  console.log(form, "form");

  const dispatch = useAppDispatch();
  const paymentOrder = useAppSelector(selectPaymentOrder);
  const [paymentLinkOpened, setPaymentLinkOpened] = useState(false);
  const [, setTicketUsed] = useState(false);
  const price = category?.price ?? 0;
  const isCorporate = form.entryType === "corporate";
  const { data: masterData = null } = useQuery({
    queryKey: ["master-data"],
    queryFn: async () => await dispatch(getMasterData()).unwrap(),
    staleTime: 5 * 60 * 1000,
  });

  const participantReference =
    form?.participant_reference ||
    form?.participantReference ||
    form?.reference;

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
  useEffect(() => {
    if (!participantReference || paymentOrder) return;

    dispatch(
      createPaymentOrder({
        participant_reference: participantReference,
      }),
    );
  }, [dispatch, participantReference, paymentOrder]);

  // useEffect(() => {
  //   const fetchPaymentOrder = async () => {
  //     const paymentOrder = await queryClient.getQueryData(["payment-order", participantReference]) ?? queryClient.getQueryData(["payment-order"]) ?? null;
  //     console.log(paymentOrder, "paymentOrder");
  //   };
  //   fetchPaymentOrder();
  // }, [participantReference, queryClient]);

  const getRegistrationCategory = masterData?.registration_category ?? [];

  const getAmountForRegistrationCategory = (category) => {
    const foundCategory = getRegistrationCategory.find(
      (item) => String(item.id) === String(category),
    );
    return foundCategory;
    // return Number(foundCategory?.fee ?? foundCategory?.price ?? 0);
  };
  const getData = getAmountForRegistrationCategory(form?.runner_category_id);
  console.log(getData, "getData");

  const effectivePrice = getData?.fee > 0 ? getData?.fee : price;

  const appliedPromo = form.promoApplied ?? null;
  const appliedPremiumPromo = form.premiumPromoApplied ?? null;

  const regularDiscount = useMemo(
    () => getPromoDiscount(appliedPromo, effectivePrice),
    [appliedPromo, effectivePrice],
  );

  const premiumDiscount = useMemo(() => {
    const remainingAfterRegular = Math.max(0, effectivePrice - regularDiscount);
    return getPromoDiscount(appliedPremiumPromo, remainingAfterRegular);
  }, [appliedPremiumPromo, effectivePrice, regularDiscount]);

  const totalDiscount = Math.min(
    effectivePrice,
    regularDiscount + premiumDiscount,
  );
  const payable = Math.max(0, effectivePrice - totalDiscount);
  const premiumBibNumber = (form.premiumBibNumber || "").trim();
  const bibTicketValue = premiumBibNumber
    ? `CM-${premiumBibNumber}`
    : "CM-00123";

  const razorpayKey =
    paymentOrder?.rzpKey ||
    paymentOrder?.key ||
    paymentOrder?.key_id ||
    paymentOrder?.razorpay_key ||
    "";
  const razorpayOrderId =
    paymentOrder?.order_id || paymentOrder?.orderId || paymentOrder?.id || "";
  const razorpayAmountPaise =
    Number(paymentOrder?.amount || paymentOrder?.amount_paise) ||
    Math.max(0, Math.round(payable * 100));

  const razorpayPopupUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (razorpayKey) params.set("key", razorpayKey);
    if (razorpayOrderId) params.set("orderId", razorpayOrderId);
    if (razorpayAmountPaise) params.set("amount", String(razorpayAmountPaise));

    const query = params.toString();
    return query ? `/razorpay-popup?${query}` : "/razorpay-popup";
  }, [razorpayAmountPaise, razorpayKey, razorpayOrderId]);

  const handleApplyPromo = (promo) => {
    onChange("promoCode", promo.code);
    onChange("promoApplied", promo);
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

  const handleApplyPremiumPromo = (promo) => {
    onChange("premiumPromoCode", promo.code);
    onChange("premiumPromoApplied", promo);
  };

  const handleClearPremiumPromo = () => {
    onChange("premiumPromoCode", "");
    onChange("premiumPromoApplied", null);
  };

  const handlePremiumCodeChange = (value) => {
    onChange("premiumPromoCode", value.toUpperCase());

    if (appliedPremiumPromo) {
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
                {getData?.name ?? "Selected event"} · {getData?.distance ?? "-"}
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 border-t border-border/70 pt-4 text-sm">
            <div className="">
              {/* <div className=""> */}
              <MarathonPassTicket
                fluid
                onTear={() => setTicketUsed(true)}
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
              {/* </div> */}
              {/* <PromoCodeCard
                code={form.premiumPromoCode ?? ""}
                promo={appliedPremiumPromo}
                bibNumber={form.premiumBibNumber ?? ""}
                onBibChange={(value) => onChange("premiumBibNumber", value)}
                onCodeChange={handlePremiumCodeChange}
                onApply={handleApplyPremiumPromo}
                onClear={handleClearPremiumPromo}
                promoCodes={PREMIUM_PROMO_CODES}
              /> */}
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
                      <AnimatedAmount value={regularDiscount} />
                    </dd>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {appliedPremiumPromo && (
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
                        {appliedPremiumPromo.code}
                      </span>
                      Premium promo discount
                    </dt>
                    <dd className="flex items-center gap-2 font-semibold tabular-nums text-success">
                      <span aria-hidden="true">-</span>
                      <AnimatedAmount value={premiumDiscount} />
                    </dd>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="font-bold text-foreground">
                {isCorporate ? "Team total" : "Amount due"}
              </dt>
              <dd className="text-2xl font-black tabular-nums text-foreground">
                {isCorporate ? (
                  "Confirmed by organizer"
                ) : (
                  <AnimatedAmount value={payable} />
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
                  <a
                    href={razorpayPopupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    onClick={() => setPaymentLinkOpened(true)}
                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 sm:w-auto"
                  >
                    Continue to Secure Payment
                    <ArrowSquareOut
                      size={17}
                      weight="bold"
                      aria-hidden="true"
                    />
                  </a>
                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-2 min-h-4 text-xs leading-relaxed text-ink-soft"
                  >
                    {paymentLinkOpened
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
                          Payment reported — awaiting verification
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
      {/* <StandardPromoCodeCard
        code={form.promoCode ?? ""}
        promo={appliedPromo}
        onCodeChange={handleCodeChange}
        onApply={handleApplyPromo}
        onClear={handleClearPromo}
        promoCodes={PROMO_CODES}
      /> */}
      <AnimatePresence initial={false}>
        {(appliedPromo || appliedPremiumPromo) && totalDiscount > 0 && (
          <motion.div
            key="promo-success"
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
                {[appliedPromo, appliedPremiumPromo]
                  .filter(Boolean)
                  .map((promoItem) => `${promoItem.label} (${promoItem.code})`)
                  .join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                handleClearPromo();
                handleClearPremiumPromo();
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
