"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeSlash,
  Heartbeat,
  LockKey,
  ShieldCheck,
  Sparkle,
  User,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { loginUser } from "@/store/slices/users/userLoginSlice";
import { EyeIcon, EyeOffIcon } from "@animateicons/react/huge";

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

function validateLoginPayload({ username, password }) {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return "Enter your username to continue.";
  }

  if (!password) {
    return "Enter your password to continue.";
  }

  if (password.length < 8) {
    return "Password should be at least 8 characters.";
  }

  return "";
}

export default function LoginForm({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const visualRef = useRef(null);
  const formPanelRef = useRef(null);
  const loginTimerRef = useRef(null);

  const shouldReduceMotion = useReducedMotion();

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

  useEffect(() => {
    return () => {
      if (loginTimerRef.current) {
        clearTimeout(loginTimerRef.current);
      }
    };
  }, []);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validationError = validateLoginPayload({ username, password });

    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }
    const payload = { username: username.trim(), password: password.trim() };

    try {
      setIsSubmitting(true);
      // Hook your login API call here when backend endpoint is ready.
      await dispatch(loginUser(payload)).unwrap();
      await Promise.resolve();
    } finally {
      setIsSubmitting(false);
    }

    setError("");
    setNotice("Login successful. Redirecting to your dashboard...");
    setJustLoggedIn(true);

    if (loginTimerRef.current) {
      clearTimeout(loginTimerRef.current);
    }

    loginTimerRef.current = setTimeout(() => {
      setIsAuthenticated(true);
      setJustLoggedIn(false);
    }, 1400);
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
              className="login-brand inline-flex flex-col items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-white"
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
          <AnimatePresence>
            {justLoggedIn && (
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
                  className="h-1 w-44 origin-left rounded-full bg-linear-to-r from-success via-accent to-success"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mx-auto w-full max-w-md">
            <div className="login-form-intro mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                GOOD TO HAVE YOU BACK
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                Let&rsquo;s get moving.!
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Sign in to access your account and keep your marathon journey
                moving.
              </p>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.form
                key="login-password"
                custom={direction}
                onSubmit={handleLoginSubmit}
                noValidate
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
              >
                <label
                  htmlFor="login-username"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    size={19}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoFocus
                    required
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      setError("");
                      setNotice("");
                    }}
                    placeholder="Enter your username"
                    aria-invalid={Boolean(error)}
                    className={cn(
                      "min-h-12 w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                      error && "border-destructive focus:border-destructive",
                    )}
                  />
                </div>

                <label
                  htmlFor="login-password"
                  className="mb-2 mt-4 block text-sm font-semibold text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKey
                    size={19}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />
                  <input
                    id="login-password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                      setNotice("");
                    }}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "login-error" : "login-hint"}
                    className={cn(
                      "min-h-12 w-full rounded-xl border border-border bg-background py-3 pl-12 pr-12 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
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

                <p
                  id={error ? "login-error" : "login-hint"}
                  role={error ? "alert" : undefined}
                  className={cn(
                    "mt-2 min-h-5 text-xs",
                    error ? "font-medium text-destructive" : "text-ink-soft",
                  )}
                >
                  {error || "Use your account credentials to sign in securely."}
                </p>

                <RainbowButton
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={isSubmitting}
                  className="mt-4 min-h-12 w-full rounded-xl"
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                  <ArrowRight size={18} weight="bold" />
                </RainbowButton>
              </motion.form>
            </AnimatePresence>

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

            <div className="login-form-intro mt-7 border-t border-border pt-5 text-center">
              <p className="text-sm text-ink-soft">
                Haven&rsquo;t joined the movement yet?{" "}
                <Link
                  href="/register"
                  className="font-bold text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-accent"
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
