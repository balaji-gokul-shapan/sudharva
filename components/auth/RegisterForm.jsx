"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeSlash,
  Envelope,
  Heartbeat,
  Phone,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { useAppDispatch } from "@/store/hooks";
import { requestOtp } from "@/store/slices/otp/otpRequestSlice";
import { registerUser } from "@/store/slices/users/userRegisterSlice";
import { verifyOtp } from "@/store/slices/otp/otpVerifySlice";
import { EyeIcon, EyeOffIcon } from "@animateicons/react/huge";

const panelVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 35 : -35,
    filter: "blur(5px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -35 : 35,
    filter: "blur(5px)",
  }),
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

  const digits = identifier.replace(/\D/g, "").length;

  return digits >= 7 && digits <= 15
    ? ""
    : "Enter a valid phone number with 7–15 digits.";
}

function validateAccountPayload({ username, password, confirmPassword }) {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return "Choose a username to continue.";
  }

  if (trimmedUsername.length < 3) {
    return "Username should be at least 3 characters.";
  }

  if (!password) {
    return "Create a password to secure your account.";
  }

  if (password.length < 8) {
    return "Password should be at least 8 characters.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match. Please re-check.";
  }

  return "";
}

function toReadableErrorMessage(payload, fallbackMessage) {
  if (!payload) return fallbackMessage;

  if (typeof payload === "string") {
    try {
      return toReadableErrorMessage(JSON.parse(payload), fallbackMessage);
    } catch {
      return payload;
    }
  }

  if (Array.isArray(payload)) {
    return payload[0] || fallbackMessage;
  }

  if (typeof payload === "object") {
    if (Array.isArray(payload.non_field_errors) && payload.non_field_errors[0]) {
      return payload.non_field_errors[0];
    }

    if (payload.detail) return String(payload.detail);
    if (payload.message) return String(payload.message);

    const firstKey = Object.keys(payload)[0];
    if (!firstKey) return fallbackMessage;

    const firstValue = payload[firstKey];
    if (Array.isArray(firstValue) && firstValue[0]) {
      return `${firstKey}: ${firstValue[0]}`;
    }

    if (typeof firstValue === "string" && firstValue.trim()) {
      return `${firstKey}: ${firstValue}`;
    }
  }

  return fallbackMessage;
}

export default function RegisterForm({
  isAuthenticated,
  setIsAuthenticated,
  identifier,
  setIdentifier,
}) {
  const dispatch = useAppDispatch();
  const [identifierType, setIdentifierType] = useState("email");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("identifier");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [justVerified, setJustVerified] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [userCreds, setUserCreds] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const pageRef = useRef(null);
  const visualRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const isEmail = identifierType === "email";

  // GSAP entrance animation for the registration-only visual panel.
  useEffect(() => {
    if (!visualRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".register-eyebrow",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65 },
      )
        .fromTo(
          ".register-headline",
          { opacity: 0, y: 35, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
          },
          "-=0.3",
        )
        .fromTo(
          ".register-copy",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.45",
        )
        .fromTo(
          ".register-stat",
          { opacity: 0, y: 16, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.12,
          },
          "-=0.25",
        );

      gsap.to(".register-orbit", {
        rotation: 360,
        duration: 35,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    }, visualRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const switchIdentifierType = (type) => {
    setIdentifierType(type);
    setIdentifier("");
    setOtp("");
    setError("");
    setNotice("");
  };

  const handleCredsChange = (event) => {
    const { name, value } = event.target;
    setUserCreds((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setNotice("");
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
      const message = toReadableErrorMessage(
        requestError,
        "Unable to send OTP right now. Please try again.",
      );
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
      setError("Enter all 6 digits to continue.");
      setNotice("");
      return;
    }
    const trimmedIdentifier = identifier.trim() || null;
    const payload = {
      email: identifierType === "email" ? trimmedIdentifier : null,
      mobile_number: identifierType === "phone" ? trimmedIdentifier : null,
      otp: otp || null,
    };
    setIsVerifyingOtp(true);
    try {
      await dispatch(verifyOtp(payload)).unwrap();
    } catch (error) {
      const message = toReadableErrorMessage(
        error,
        "Unable to verify OTP right now. Please try again.",
      );
      setError(message);
      setNotice("");
      setIsVerifyingOtp(false);
      return;
    }
    setIsVerifyingOtp(false);
    setError("");
    setNotice("OTP verified. Complete your account setup.");
    setDirection(1);
    setStep("account");
  };

  const handleCreateAccountSubmit = async (event) => {
    event.preventDefault();
    if (isCreatingAccount) return;

    const validationError = validateAccountPayload({
      username: userCreds.username,
      password: userCreds.password,
      confirmPassword: userCreds.confirmPassword,
    });

    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    try {
      setIsCreatingAccount(true);
      await dispatch(
        registerUser({
          username: userCreds.username,
          password: userCreds.password,
          email: identifier.trim(),
        }),
      ).unwrap();
    } catch (requestError) {
      const message = toReadableErrorMessage(
        requestError,
        "Unable to create your account. Please try again.",
      );
      setError(message);
      setNotice("");
      return;
    } finally {
      setIsCreatingAccount(false);
    }
    setError("");
    setNotice("Account created successfully. Welcome to Sudharva Marathon!");
    setJustVerified(true);
    setTimeout(() => {
      setJustVerified(false);
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

    if (step === "account") {
      setStep("otp");
      // setPassword("");
      // setConfirmPassword("");
    } else {
      setStep("identifier");
      setOtp("");
    }

    setError("");
    setNotice("");
    setIsAuthenticated(false);
  };

  return (
    <section
      ref={pageRef}
      aria-label="Register for Sudharva Marathon"
      className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-surface shadow-2xl shadow-primary/10"
    >
      <div className="grid min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Registration editorial panel */}
        <aside
          ref={visualRef}
          className="relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden bg-gradient-primary p-6 text-white sm:p-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-white/15"
          />

          <div
            aria-hidden="true"
            className="register-orbit absolute -bottom-40 -left-32 -z-10 h-[430px] w-[430px] rounded-full border border-dashed border-white/20"
          />

          <div
            aria-hidden="true"
            className="absolute right-0 top-1/3 -z-10 h-56 w-56 rounded-full bg-accent/25 blur-3xl"
          />

          <Link
            href="/"
            aria-label="Sudharva Marathon home"
            className="inline-flex w-fit flex-col items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-white"
          >
            <Image
              src="/image/cta/logo.png"
              alt="Sudharva Marathon"
              width={190}
              height={49}
              priority
              className="h-auto w-32 sm:w-40"
            />
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">
              Run against Diabetes
            </span>
          </Link>

          <div className="my-6` max-w-lg lg:my-0 lg:py-8">
            <motion.span
              initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-accent"
            >
              <Heartbeat size={27} weight="duotone" />
            </motion.span>

            <p className="register-eyebrow text-xs font-bold uppercase tracking-[0.22em] text-foreground">
              YOUR FIRST STEP CHANGES EVERYTHING
            </p>

            <h1 className="register-headline mt-4 text-2xl font-bold leading-[1.08] text-volunteer-tint sm:text-3xl lg:text-4xl">
              Don&apos;t just watch the movement.
              <span className="mt-2 block text-accent">
                Be the reason it moves.
              </span>
            </h1>

            <p className="register-copy mt-6 max-w-md text-sm leading-7 text-foreground sm:text-base">
              Lace up for something bigger than a finish line. Join Sudharva
              Marathon and take a meaningful step towards a healthier, more
              active tomorrow.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="register-stat rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm">
                <Sparkle size={21} className="mb-3 text-accent" />
                <p className="text-sm font-bold text-white">
                  Every Step Counts
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/65">
                  Small steps. Lasting change.
                </p>
              </div>

              <div className="register-stat rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm">
                <ShieldCheck size={21} className="mb-3 text-accent" />
                <p className="text-sm font-bold text-white">One Shared Goal</p>
                <p className="mt-1 text-xs leading-relaxed text-white/65">
                  Move together. Live better.
                </p>
              </div>
            </div>
          </div>

          <p className="hidden text-xs font-medium tracking-wide text-white/70 lg:block">
            MOVE WITH PURPOSE. MAKE EVERY MILE MATTER.
          </p>
        </aside>

        {/* Form panel */}
        <div className="relative flex items-center px-5 py-9 sm:px-10 sm:py-12 lg:px-12">
          <AnimatePresence>
            {justVerified && (
              <motion.div
                key="verified"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-surface/95 px-8 text-center backdrop-blur-sm"
              >
                <motion.span
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 16 }}
                  className="grid h-20 w-20 place-items-center rounded-full bg-success text-foreground shadow-lg shadow-success/30"
                >
                  <CheckCircle size={44} weight="fill" />
                </motion.span>

                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  You&apos;re on your way!
                </h2>

                <p className="text-sm text-ink-soft">
                  Moving to the next step…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mx-auto w-full max-w-md">
            {/* Progress */}
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-xs font-bold",
                    step === "identifier"
                      ? "bg-accent text-accent-foreground"
                      : "bg-success text-white",
                  )}
                >
                  {step !== "identifier" ? (
                    <CheckCircle size={18} weight="fill" />
                  ) : (
                    "01"
                  )}
                </span>

                <span
                  aria-hidden="true"
                  className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border"
                >
                  <motion.span
                    className="absolute inset-0 origin-left bg-success"
                    initial={false}
                    animate={{ scaleX: step === "identifier" ? 0 : 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </span>

                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-xs font-bold",
                    step === "otp"
                      ? "bg-accent text-accent-foreground"
                      : step === "account"
                        ? "bg-success text-white"
                        : "bg-muted text-white",
                  )}
                >
                  {step === "account" ? (
                    <CheckCircle size={18} weight="fill" />
                  ) : (
                    "02"
                  )}
                </span>

                <span
                  aria-hidden="true"
                  className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border"
                >
                  <motion.span
                    className="absolute inset-0 origin-left bg-success"
                    initial={false}
                    animate={{ scaleX: step === "account" ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </span>

                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-xs font-bold",
                    step === "account"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-white",
                  )}
                >
                  03
                </span>
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {step === "identifier"
                  ? "YOUR MARATHON STORY"
                  : "ONE LAST CHECK"}
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {step === "identifier"
                      ? "Make your first move."
                      : step === "otp"
                        ? "Let’s make it official."
                        : "Create your account."}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {step === "identifier"
                      ? "Start with your email or phone number. Your journey to the starting line begins here."
                      : step === "otp"
                        ? `Enter the 6-digit verification code for ${identifier.trim()}.`
                        : "Choose a username and password to finish creating your account."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {step === "identifier" ? (
                <motion.form
                  key="register-identifier"
                  custom={direction}
                  onSubmit={handleIdentifierSubmit}
                  noValidate
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                >
                  {/* <div
                    role="group"
                    aria-label="Choose registration contact method"
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
                  </div> */}

                  <label
                    htmlFor="register-identifier"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    {isEmail ? "Your email address" : "Your phone number"}
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
                      id="register-identifier"
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
                        error ? "register-error" : "register-hint"
                      }
                      className={cn(
                        "min-h-12 w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                        error && "border-destructive focus:border-destructive",
                      )}
                    />
                  </div>

                  <p
                    id={error ? "register-error" : "register-hint"}
                    role={error ? "alert" : undefined}
                    className={cn(
                      "mt-2 min-h-5 text-xs",
                      error ? "font-medium text-destructive" : "text-ink-soft",
                    )}
                  >
                    {error ||
                      (isEmail
                        ? "Use an email address you can access."
                        : "Include your country code, for example +91.")}
                  </p>

                  <RainbowButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={isRequestingOtp}
                    className="mt-4 min-h-12 w-full rounded-xl"
                  >
                    <motion.span className="inline-flex" whileHover={{ x: 2 }}>
                      {isRequestingOtp ? "Sending OTP..." : "Start My Journey"}
                    </motion.span>
                    <ArrowRight size={18} weight="bold" />
                  </RainbowButton>

                  <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
                    One step closer to the start line.
                  </p>
                </motion.form>
              ) : step === "otp" ? (
                <motion.form
                  key="register-otp"
                  custom={direction}
                  onSubmit={handleOtpSubmit}
                  noValidate
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                >
                  <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={20}
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      <p className="text-sm leading-relaxed text-ink-soft">
                        Your verification code is for{" "}
                        <span className="break-all font-semibold text-foreground">
                          {identifier.trim()}
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <label
                    htmlFor="register-otp"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    6-digit verification code
                  </label>

                  <input
                    id="register-otp"
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
                      "min-h-14 w-full rounded-xl border border-border bg-background px-4 text-center font-mono text-2xl font-bold tracking-[0.6em] text-foreground outline-none transition placeholder:text-ink-soft/40 focus:border-accent focus:ring-accent/10 sm:text-3xl",
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
                    {error || "Keep your verification code private."}
                  </p>

                  <RainbowButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={isVerifyingOtp}
                    className="mt-4 min-h-12 w-full rounded-xl"
                  >
                    {isVerifyingOtp ? "Verifying OTP..." : "Verify & Continue"}
                    <ArrowRight size={18} weight="bold" />
                  </RainbowButton>

                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-accent"
                  >
                    <ArrowLeft size={17} />
                    Use a different {isEmail ? "email" : "phone number"}
                  </button>
                </motion.form>
              ) 
              : (
                <motion.form
                  key="register-account"
                  custom={direction}
                  onSubmit={handleCreateAccountSubmit}
                  noValidate
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                >
                  {/* <label
                    htmlFor="register-email"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    autoFocus
                    required
                    value={identifier}
                    onChange={handleCredsChange}
                    placeholder="Enter your email"
                    readOnly={true}
                    aria-invalid={Boolean(error)}
                    className={cn(
                      "min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                      error && "border-destructive focus:border-destructive",
                    )}
                  /> */}
                  <label
                    htmlFor="register-username"
                    className="mb-2 mt-4 block text-sm font-semibold text-foreground"
                  >
                    Username
                  </label>
                  <input
                    id="register-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoFocus
                    required
                    value={userCreds.username}
                    onChange={handleCredsChange}
                    placeholder="Choose a username"
                    aria-invalid={Boolean(error)}
                    className={cn(
                      "min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                      error && "border-destructive focus:border-destructive",
                    )}
                  />

                  <label
                    htmlFor="register-password"
                    className="mb-2 mt-4 block text-sm font-semibold text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={userCreds.password}
                      onChange={handleCredsChange}
                      placeholder="Minimum 8 characters"
                      aria-invalid={Boolean(error)}
                      className={cn(
                        "min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                        error && "border-destructive focus:border-destructive",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((visible) => !visible)}
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                      aria-pressed={isPasswordVisible}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-soft transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {isPasswordVisible ? (
                        <EyeIcon size={20} aria-hidden="true" />
                      ) : (
                        <EyeOffIcon size={20} aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <label
                    htmlFor="register-confirm-password"
                    className="mb-2 mt-4 block text-sm font-semibold text-foreground"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={userCreds.confirmPassword}
                      onChange={handleCredsChange}
                      placeholder="Re-enter your password"
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error ? "account-error" : "account-hint"
                      }
                      className={cn(
                        "min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                        error && "border-destructive focus:border-destructive",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsConfirmPasswordVisible((visible) => !visible)
                      }
                      aria-label={
                        isConfirmPasswordVisible
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      aria-pressed={isConfirmPasswordVisible}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-soft transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeIcon size={20} aria-hidden="true" />
                      ) : (
                        <EyeIcon size={20} aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <p
                    id={error ? "account-error" : "account-hint"}
                    role={error ? "alert" : undefined}
                    className={cn(
                      "mt-2 min-h-5 text-xs",
                      error ? "font-medium text-destructive" : "text-ink-soft",
                    )}
                  >
                    {error || "Use a strong password to protect your account."}
                  </p>

                  <RainbowButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={isCreatingAccount}
                    className="mt-4 min-h-12 w-full rounded-xl"
                  >
                    {isCreatingAccount ? "Creating Account..." : "Create Account"}
                    <ArrowRight size={18} weight="bold" />
                  </RainbowButton>

                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-accent"
                  >
                    <ArrowLeft size={17} />
                    Back to OTP verification
                  </button>
                </motion.form>
              )
              }
             
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
                Already part of the movement?{" "}
                <Link
                  href="/login"
                  className="font-bold text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-accent"
                >
                  Sign in to your account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
