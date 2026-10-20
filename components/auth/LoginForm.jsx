"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Envelope,
  Heartbeat,
  LockKey,
  Phone,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { RainbowButton } from "@/components/animation/rainbowButton";

const PANEL_SPRING = { type: "spring", stiffness: 300, damping: 32 };

const panelVariants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 48 : -48, filter: "blur(6px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -48 : 48, filter: "blur(6px)" }),
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentifier(value, type) {
  const identifier = value.trim();
  if (!identifier) {
    return type === "email"
      ? "Enter your email address to continue."
      : "Enter your phone number to continue.";
  }

  if (type === "email") {
    return emailPattern.test(identifier) ? "" : "Enter a valid email address.";
  }

  const digitCount = identifier.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15
    ? ""
    : "Enter a valid phone number with 7–15 digits.";
}

export default function LoginForm({ isAuthenticated, setIsAuthenticated }) {
  const [identifierType, setIdentifierType] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("identifier");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [justVerified, setJustVerified] = useState(false);
  const [direction, setDirection] = useState(1);

  const isEmail = identifierType === "email";

  const switchIdentifierType = (type) => {
    setIdentifierType(type);
    setIdentifier("");
    setOtp("");
    setError("");
    setNotice("");
  };

  const handleIdentifierSubmit = (event) => {
    event.preventDefault();
    const validationError = validateIdentifier(identifier, identifierType);
    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    setError("");
    setOtp("");
    setDirection(1);
    setStep("otp");
    setNotice(
      "Preview only: sign-in is not connected yet, so no verification code was sent.",
    );
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter all 6 digits to continue.");
      setNotice("");
      return;
    }

    setError("");
    setNotice("Welcome aboard — taking you to registration.");
    setJustVerified(true);
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 1400);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
    setError("");
    setNotice("");
    setIsAuthenticated(false);
  };

  const goBack = () => {
    setDirection(-1);
    setStep("identifier");
    setOtp("");
    setError("");
    setNotice("");
    setIsAuthenticated(false);
  };

  return (
    <section
      aria-label="Sign in to Sudharva Marathon"
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-surface shadow-2xl shadow-primary/10"
    >
      <div className="grid min-h-[560px] lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative isolate flex min-h-56 flex-col justify-between overflow-hidden bg-gradient-primary p-6 text-white sm:p-9 lg:min-h-full lg:p-11">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-36 -left-24 -z-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl"
          />
          <div>
            <Link
              href="/"
              aria-label="Sudharva Marathon home"
              className="inline-flex flex-col items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white"
            >
              <Image
                src="/image/cta/logo.png"
                alt="Sudharva Marathon"
                width={190}
                height={49}
                priority
                sizes="(max-width: 639px) 128px, 190px"
                className="h-auto w-32 sm:w-40"
              />
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">
                Run Against Diabetes
              </span>
            </Link>
          </div>

          <div className="my-8 max-w-md lg:my-0 lg:py-14">
            <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent">
              <Heartbeat size={24} weight="duotone" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Every stride matters
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-volunteer-tint sm:text-4xl">
              Good to have you back.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground sm:text-base">
              Sign in to continue your journey with the Sudharva Marathon
              community.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs font-medium text-volunteer-tint lg:flex">
            <ShieldCheck size={17} className="text-volunteer" />
            A healthier community starts with us.
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-volunteer-tint lg:hidden">
            <Sparkle size={16} className="text-accent" />
            Health · Community · Movement
          </div>
        </aside>

        <div className="relative flex items-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
          <AnimatePresence>
            {justVerified && (
              <motion.div
                key="verified"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-surface/95 px-8 text-center backdrop-blur-sm"
              >
                <motion.span
                  initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
                  className="grid h-20 w-20 place-items-center rounded-full bg-success text-foreground shadow-lg shadow-success/40"
                >
                  <CheckCircle size={44} weight="fill" />
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.35 }}
                >
                  <p className="font-serif text-2xl font-bold text-foreground">Verified!</p>
                  <p className="mt-1 text-sm text-ink-soft">Taking you to registration…</p>
                </motion.div>
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: "easeInOut" }}
                  className="h-1 w-44 origin-left rounded-full bg-gradient-to-r from-success via-accent to-success"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-2">
                <motion.span
                  key={step === "identifier" ? "step-1" : "step-check"}
                  initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                    step === "identifier"
                      ? "bg-accent text-accent-foreground"
                      : "bg-success text-foreground",
                  )}
                >
                  {step === "otp" ? <CheckCircle size={17} weight="fill" color="white" /> : "1"}
                </motion.span>
                <span aria-hidden="true" className="relative h-0.5 w-9 overflow-hidden rounded-full bg-border">
                  <AnimatePresence initial={false}>
                    {step === "otp" && (
                      <motion.span
                        key="connector-fill"
                        aria-hidden="true"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 origin-left rounded-full bg-success"
                      />
                    )}
                  </AnimatePresence>
                </span>
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                    step === "otp"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-ink-soft",
                  )}
                >
                  2
                </span>
                <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  {step === "identifier" ? "Your account" : "Verification"}
                </span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {step === "identifier" ? "Sign in" : "Enter your code"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step === "identifier"
                      ? "Choose how you’d like to identify your account."
                      : `Enter the 6-digit code for ${identifier.trim()}.`}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {step === "identifier" ? (
                <motion.form
                  key="login-identifier"
                  custom={direction}
                  onSubmit={handleIdentifierSubmit}
                  noValidate
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={PANEL_SPRING}
                >
                <div
                  role="group"
                  aria-label="Choose sign-in method"
                  className="mb-5 grid grid-cols-2 rounded-xl bg-muted/70 p-1"
                >
                  <button
                    type="button"
                    aria-pressed={isEmail}
                    onClick={() => switchIdentifierType("email")}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isEmail
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-ink-soft hover:text-foreground",
                    )}
                  >
                    <Envelope size={17} />
                    Email
                  </button>
                  <button
                    type="button"
                    aria-pressed={!isEmail}
                    onClick={() => switchIdentifierType("phone")}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      !isEmail
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-ink-soft hover:text-foreground",
                    )}
                  >
                    <Phone size={17} />
                    Phone
                  </button>
                </div>

                <label
                  htmlFor="login-identifier"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {isEmail ? "Email address" : "Phone number"}
                </label>
                <div className="relative">
                  {isEmail ? (
                    <Envelope
                      size={19}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                    />
                  ) : (
                    <Phone
                      size={19}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                    />
                  )}
                  <input
                    id="login-identifier"
                    name="identifier"
                    type={isEmail ? "email" : "tel"}
                    inputMode={isEmail ? "email" : "tel"}
                    autoComplete={isEmail ? "email" : "tel"}
                    autoFocus
                    required
                    value={identifier}
                    onChange={(event) => {
                      setIdentifier(event.target.value);
                      setError("");
                      setNotice("");
                    }}
                    placeholder={
                      isEmail ? "you@example.com" : "+91 98765 43210"
                    }
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error ? "login-error" : "login-identifier-hint"
                    }
                    className={cn(
                      "min-h-12 w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-4 focus:ring-accent/10",
                      error && "border-destructive focus:border-destructive",
                    )}
                  />
                </div>
                <p
                  id={error ? "login-error" : "login-identifier-hint"}
                  role={error ? "alert" : undefined}
                  className={cn(
                    "mt-2 min-h-5 text-xs",
                    error ? "font-medium text-destructive" : "text-ink-soft",
                  )}
                >
                  {error ||
                    (isEmail
                      ? "We’ll use this email to look up your account."
                      : "Include your country code, for example +91.")}
                </p>

                <RainbowButton
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="mt-4 min-h-12 w-full rounded-xl"
                >
                  <motion.span
                    aria-hidden="true"
                    className="inline-flex"
                    animate={
                      error
                        ? { x: [0, -7, 7, -4, 4, 0], transition: { duration: 0.35 } }
                        : { x: 0 }
                    }
                  >
                    Continue
                  </motion.span>
                  <ArrowRight size={18} weight="bold" />
                </RainbowButton>
              </motion.form>
            ) : (
              <motion.form
                key="login-otp"
                custom={direction}
                onSubmit={handleOtpSubmit}
                noValidate
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={PANEL_SPRING}
              >
                <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <div className="flex items-start gap-3">
                    <LockKey
                      size={19}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    <p className="text-sm leading-relaxed text-ink-soft">
                      Enter the one-time code for{" "}
                      <span className="break-all font-semibold text-foreground">
                        {identifier.trim()}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="login-otp"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  6-digit verification code
                </label>
                <input
                  id="login-otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoFocus
                  required
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="••••••"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "otp-error" : "otp-hint"}
                  className={cn(
                    "min-h-14 w-full rounded-xl border border-border bg-background px-4 text-center font-mono text-2xl font-bold tracking-[0.6em] text-foreground outline-none transition placeholder:text-ink-soft/40 focus:border-accent focus:ring-4 focus:ring-accent/10 sm:text-3xl",
                    error && "border-destructive focus:border-destructive",
                  )}
                />
                <p
                  id={error ? "otp-error" : "otp-hint"}
                  role={error ? "alert" : undefined}
                  className={cn(
                    "mt-2 min-h-5 text-xs",
                    error ? "font-medium text-destructive" : "text-ink-soft",
                  )}
                >
                  {error || "For your security, never share a sign-in code."}
                </p>

                <RainbowButton
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="mt-4 min-h-12 w-full rounded-xl"
                >
                  <motion.span
                    aria-hidden="true"
                    className="inline-flex"
                    animate={
                      error
                        ? { x: [0, -7, 7, -4, 4, 0], transition: { duration: 0.35 } }
                        : { x: 0 }
                    }
                  >
                    Verify and sign in
                  </motion.span>
                  <ArrowRight size={18} weight="bold" />
                </RainbowButton>

                <button
                  type="button"
                  onClick={goBack}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <ArrowLeft size={17} />
                  Use a different {isEmail ? "email" : "phone number"}
                </button>
              </motion.form>
            )}
            </AnimatePresence>

            {notice && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm leading-relaxed text-foreground"
              >
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-warning"
                />
                <p>{notice}</p>
              </div>
            )}

            <div className="mt-7 border-t border-border pt-5 text-center">
              <p className="text-sm text-ink-soft">
                New to the movement?{" "}
                <Link
                  href="/register"
                  className="font-bold text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Register for the marathon
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
