"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { useAppDispatch } from "@/store/hooks";
import { requestOtp } from "@/store/slices/otp/otpRequestSlice";
import { verifyOtp } from "@/store/slices/otp/otpVerifySlice";

const PANEL_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 32,
};

const panelVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir >= 0 ? 48 : -48,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir >= 0 ? -48 : 48,
    filter: "blur(6px)",
  }),
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentifier(value, type) {
  const identifier = value.trim();

  if (!identifier) {
    return type === "email"
      ? "Enter your registered email to continue your journey."
      : "Enter your registered mobile number to continue.";
  }

  if (type === "email") {
    return emailPattern.test(identifier)
      ? ""
      : "That email doesn't look right. Check it and try again.";
  }

  const digitCount = identifier.replace(/\D/g, "").length;

  return digitCount >= 7 && digitCount <= 15
    ? ""
    : "Enter a valid phone number with 7–15 digits.";
}

export default function LoginForm({
  isAuthenticated,
  setIsAuthenticated,
  identifier,
  setIdentifier,
}) {
  const [identifierType, setIdentifierType] = useState("email");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("identifier");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [justVerified, setJustVerified] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const dispatch = useAppDispatch();

  const visualRef = useRef(null);
  const formPanelRef = useRef(null);
  const verificationTimerRef = useRef(null);

  const shouldReduceMotion = useReducedMotion();
  const isEmail = identifierType === "email";

  // GSAP entrance animation for the brand panel and login content.
  useEffect(() => {
    if (shouldReduceMotion) return;

    const visualContext = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .fromTo(
          ".login-brand",
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.7 },
        )
        .fromTo(
          ".login-reveal",
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.13,
          },
          "-=0.35",
        );

      gsap.to(".login-orbit", {
        rotation: 360,
        duration: 45,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      gsap.to(".login-glow", {
        opacity: 0.7,
        scale: 1.12,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, visualRef);

    const formContext = gsap.context(() => {
      gsap.fromTo(
        ".login-form-intro",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.15,
        },
      );
    }, formPanelRef);

    return () => {
      visualContext.revert();
      formContext.revert();
    };
  }, [shouldReduceMotion]);

  // Clear a pending verification timer when the component unmounts.
  useEffect(() => {
    return () => {
      if (verificationTimerRef.current) {
        clearTimeout(verificationTimerRef.current);
      }
    };
  }, []);

  const switchIdentifierType = (type) => {
    setIdentifierType(type);
    setIdentifier("");
    setOtp("");
    setError("");
    setNotice("");
    setJustVerified(false);
  };

  const handleIdentifierSubmit = async (event) => {
    event.preventDefault();

    if (isRequestingOtp) return;

    const validationError = validateIdentifier(identifier, identifierType);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    const trimmedIdentifier = identifier.trim();
    const payload = {
      purpose: identifierType,
      email: identifierType === "email" ? trimmedIdentifier : "",
      mobile_number: identifierType === "phone" ? trimmedIdentifier : "",
    };

    try {
      setIsRequestingOtp(true);
      await dispatch(requestOtp(payload)).unwrap();
    } catch (requestError) {
      const message =
        typeof requestError === "string"
          ? requestError
          : requestError?.message ||
            "Unable to send OTP right now. Please try again.";
      setError(message);
      setNotice("");
      return;
    } finally {
      setIsRequestingOtp(false);
    }

    setError("");
    setOtp("");
    setDirection(1);
    setStep("otp");
    setNotice("Verification code sent. Enter the 6-digit OTP to continue.");
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    if (isVerifyingOtp) return;

    const validationError = validateIdentifier(identifier, identifierType);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter all 6 digits to continue your journey.");
      setNotice("");
      return;
    }

    const trimmedIdentifier = identifier.trim();
    const payload = {
      purpose: identifierType,
      email: identifierType === "email" ? trimmedIdentifier : "",
      mobile_number: identifierType === "phone" ? trimmedIdentifier : "",
      otp,
    };

    try {
      setIsVerifyingOtp(true);
      await dispatch(verifyOtp(payload)).unwrap();
    } catch (verifyError) {
      const message =
        typeof verifyError === "string"
          ? verifyError
          : verifyError?.message ||
            "Unable to verify OTP right now. Please try again.";
      setError(message);
      setNotice("");
      setIsVerifyingOtp(false);
      return;
    }

    setError("");
    setNotice("Your next chapter starts now. Let's get moving!");
    setJustVerified(true);

    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
    }

    verificationTimerRef.current = setTimeout(() => {
      setIsAuthenticated(true);
      setIsVerifyingOtp(false);
    }, 1400);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
    setError("");
    setNotice("");
    setIsAuthenticated(false);
    setJustVerified(false);
  };

  const goBack = () => {
    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
      verificationTimerRef.current = null;
    }

    setDirection(-1);
    setStep("identifier");
    setOtp("");
    setError("");
    setNotice("");
    setJustVerified(false);
    setIsAuthenticated(false);
    setIsVerifyingOtp(false);
  };

  return (
    <section
      aria-label="Sign in to Sudharva Marathon"
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-surface shadow-2xl shadow-primary/10"
    >
      <div className="grid min-h-[560px] lg:grid-cols-[0.92fr_1.08fr]">
        {/* Brand and animated visual panel */}
        <aside
          ref={visualRef}
          className="relative isolate flex min-h-56 flex-col justify-between overflow-hidden bg-gradient-primary p-6 text-white sm:p-9 lg:min-h-full lg:p-11"
        >
          <div
            aria-hidden="true"
            className="login-orbit pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="login-glow pointer-events-none absolute -bottom-36 -left-24 -z-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl"
          />

          <div>
            <Link
              href="/"
              aria-label="Sudharva Marathon home"
              className="login-brand inline-flex flex-col items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white"
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
            <motion.span
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [0, -8, 8, 0],
                      scale: 1.06,
                    }
              }
              transition={{ duration: 0.35 }}
              className="login-reveal mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent"
            >
              <Heartbeat size={24} weight="duotone" />
            </motion.span>

            <p className="login-reveal text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Every stride has a purpose
            </p>

            <h1 className="login-reveal mt-3 font-serif text-3xl font-bold leading-tight text-volunteer-tint sm:text-4xl">
              Welcome back, changemaker.
            </h1>

            <p className="login-reveal mt-4 max-w-sm text-sm leading-relaxed text-foreground sm:text-base">
              Every step moves us closer to a healthier tomorrow. Pick up where
              your journey began and keep the spirit of change alive.
            </p>
          </div>

          <div className="login-reveal hidden items-center gap-2 text-xs font-medium text-volunteer-tint lg:flex">
            <ShieldCheck size={17} className="text-volunteer" />A community in
            motion. A future in better health.
          </div>

          <div className="login-reveal flex items-center gap-2 text-xs font-medium text-volunteer-tint lg:hidden">
            <Sparkle size={16} className="text-accent" />
            Move Together · Live Healthier · Make an Impact
          </div>
        </aside>

        {/* Login form panel */}
        <div
          ref={formPanelRef}
          className="relative flex items-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14"
        >
          {/* Verification success overlay */}
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
                  initial={
                    shouldReduceMotion
                      ? false
                      : { scale: 0.4, opacity: 0, rotate: -30 }
                  }
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 16,
                    delay: 0.05,
                  }}
                  className="grid h-20 w-20 place-items-center rounded-full bg-success text-foreground shadow-lg shadow-success/40"
                >
                  <CheckCircle size={44} weight="fill" />
                </motion.span>

                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.35 }}
                >
                  <p className="font-serif text-2xl font-bold text-foreground">
                    You&rsquo;re Ready to Move!
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Your next chapter starts now.
                  </p>
                </motion.div>

                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 1.1,
                    delay: 0.15,
                    ease: "easeInOut",
                  }}
                  className="h-1 w-44 origin-left rounded-full bg-gradient-to-r from-success via-accent to-success"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mx-auto w-full max-w-md">
            {/* Step indicator */}
            <div className="login-form-intro mb-8">
              <div className="mb-5 flex items-center gap-2">
                <motion.span
                  key={
                    step === "identifier" ? "account-step" : "verification-step"
                  }
                  initial={
                    shouldReduceMotion
                      ? false
                      : { scale: 0.6, opacity: 0, rotate: -20 }
                  }
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                  }}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                    step === "identifier"
                      ? "bg-accent text-accent-foreground"
                      : "bg-success text-foreground",
                  )}
                >
                  {step === "otp" ? (
                    <CheckCircle size={17} weight="fill" color="white" />
                  ) : (
                    "1"
                  )}
                </motion.span>

                <span
                  aria-hidden="true"
                  className="relative h-0.5 w-9 overflow-hidden rounded-full bg-border"
                >
                  <AnimatePresence initial={false}>
                    {step === "otp" && (
                      <motion.span
                        key="connector-fill"
                        aria-hidden="true"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
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
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {step === "identifier"
                      ? "Your journey continues."
                      : "One last step."}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step === "identifier"
                      ? "Pick up where your purpose began. Sign in with your email or phone to continue."
                      : `Enter the 6-digit code for ${identifier.trim()} to continue your journey.`}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Identifier and OTP forms */}
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
                  {/* Email / phone selector */}
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
                      Mobile
                    </button>
                  </div>

                  <label
                    htmlFor="login-identifier"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    {isEmail
                      ? "Your registered email"
                      : "Your registered mobile"}
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
                        ? "Use the email linked to your marathon registration."
                        : "Enter the mobile number linked to your registration.")}
                  </p>

                  <RainbowButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={isRequestingOtp}
                    className="mt-4 min-h-12 w-full rounded-xl"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="inline-flex"
                      animate={
                        error && !shouldReduceMotion
                          ? {
                              x: [0, -7, 7, -4, 4, 0],
                              transition: { duration: 0.35 },
                            }
                          : { x: 0 }
                      }
                    >
                      {isRequestingOtp
                        ? "Sending OTP..."
                        : "Continue My Journey"}
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
                    Your 6-digit verification code
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
                    {error ||
                      "Keep your verification code private. Your account security matters."}
                  </p>

                  <RainbowButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={isVerifyingOtp}
                    className="mt-4 min-h-12 w-full rounded-xl"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="inline-flex"
                      animate={
                        error && !shouldReduceMotion
                          ? {
                              x: [0, -7, 7, -4, 4, 0],
                              transition: { duration: 0.35 },
                            }
                          : { x: 0 }
                      }
                    >
                      {isVerifyingOtp
                        ? "Verifying OTP..."
                        : "Verify &amp; Get Moving"}
                    </motion.span>
                    <ArrowRight size={18} weight="bold" />
                  </RainbowButton>

                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <ArrowLeft size={17} />
                    Try another {isEmail ? "email" : "mobile number"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Status message */}
            {notice && (
              <motion.div
                key={notice}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                className="mt-5 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm leading-relaxed text-foreground"
              >
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-warning"
                />
                <p>{notice}</p>
              </motion.div>
            )}

            {/* Registration link */}
            <div className="login-form-intro mt-7 border-t border-border pt-5 text-center">
              <p className="text-sm text-ink-soft">
                Haven&rsquo;t joined the movement yet?{" "}
                <Link
                  href="/register"
                  className="font-bold text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Claim your place at the starting line
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
