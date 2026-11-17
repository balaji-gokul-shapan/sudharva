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
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { resetClientSessionData } from "@/lib/resetClientSession";
import { loginUser } from "@/store/slices/users/userLoginSlice";
import {
  ArrowLeft02,
  ArrowRight02,
  CancelCircleIcon,
  EyeIcon,
  EyeOffIcon,
  HelpCircleIcon,
  LockPasswordIcon,
  PasswordValidationIcon,
  SecurityLockIcon,
  UserCircleIcon,
} from "@animateicons/react/huge";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toReadableErrorMessage } from "./RegisterForm";
import { getRequestOtp } from "@/store/slices/forgotPassword/getOtpSlice";
import { verifyOtp } from "@/store/slices/forgotPassword/verifyOtpSlice";
import { resetPassword } from "@/store/slices/forgotPassword/resetPasswordSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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

function validateLoginPayload({ user_credentials, password }) {
  const trimmedUsername = user_credentials?.trim();

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
  const [isResettingSession, setIsResettingSession] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [identifierType, setIdentifierType] = useState("email");
  const visualRef = useRef(null);
  const formPanelRef = useRef(null);
  const loginTimerRef = useRef(null);
  const isEmail = identifierType === "email";
  const shouldReduceMotion = useReducedMotion();
  const [forgotData, setForgotData] = useState({
    identifier: "",
    otp: "",
    resetToken: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(
    forgotData.identifier ? "otp" : "identifier",
  );
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetCompleted, setPasswordResetCompleted] = useState(false);
  const [showIdentifierTypeToggle, setShowIdentifierTypeToggle] =
    useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleNewPasswordChange = (event) => {
    setForgotData((prev) => ({ ...prev, newPassword: event.target.value }));
    setError("");
    setNotice("");
  };

  const handleConfirmPasswordChange = (event) => {
    setForgotData((prev) => ({ ...prev, confirmPassword: event.target.value }));
    setError("");
    setNotice("");
  };

  const validateResetPasswordIdentifier = ({ identifier, identifierType }) => {
    if (!identifier?.trim()) {
      return "Enter your identifier to continue.";
    }

    if (identifierType === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(identifier.trim())) {
        return "Enter a valid email address.";
      }
    } else if (identifierType === "phone") {
      const phonePattern = /^[\d\s\-\(\)\+]{10,}$/;
      if (!phonePattern.test(identifier.trim())) {
        return "Enter a valid phone number.";
      }
    } else {
      const usernamePattern = /^[a-zA-Z0-9_.@]{3,}$/;
      if (!usernamePattern.test(identifier.trim())) {
        return "Enter a valid username (min 3 characters).";
      }
    }

    return "";
  };

  const getOtpRecipientLabel = (rawIdentifier) => {
    const identifier = String(rawIdentifier || "").trim();
    if (!identifier) {
      return "your registered email";
    }

    const isEmailIdentifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    return isEmailIdentifier
      ? identifier
      : `the registered email for this ${identifier}`;
  };

  const handleRegisterClick = async (event) => {
    event.preventDefault();
    if (isResettingSession) return;

    setIsResettingSession(true);

    try {
      await resetClientSessionData(dispatch);
    } catch {
      // Continue to registration even if reset has partial failures.
    } finally {
      window.location.replace("/register");
    }
  };

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

  useEffect(() => {
    if (resendCountdown <= 0) return undefined;

    const countdownTimer = setInterval(() => {
      setResendCountdown((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [resendCountdown]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validationError = validateLoginPayload({
      user_credentials: username,
      password,
    });

    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }
    const payload = { user_credentials: username.trim(), password };

    let loginResponse;
    try {
      setIsSubmitting(true);
      // Hook your login API call here when backend endpoint is ready.
      loginResponse = await dispatch(loginUser(payload)).unwrap();
    } catch (requestError) {
      const message =
        typeof requestError === "string"
          ? requestError
          : requestError?.non_field_errors?.[0] ||
            requestError?.message ||
            "Invalid credentials. Please check your username and password.";
      setError(message);
      setNotice("");
      setJustLoggedIn(false);
      return;
    } finally {
      setIsSubmitting(false);
    }

    setError("");
    setNotice("Login successful. Redirecting to your dashboard...");
    setJustLoggedIn(true);
    // console.log("loginResponse", loginResponse);
    const participantReference =
      loginResponse?.registrations?.[0]?.participant_reference;
    // const getNormalizedUserId =
    //   typeof participantReference === "string"
    //     ? participantReference.split("-")[1]
    //     : undefined;
    // console.log("getNormalizedUserId", getNormalizedUserId);
    const userId =
      loginResponse?.auth_user_id ||
      loginResponse?.user?.id ||
      loginResponse?.user?.user_id ||
      loginResponse?.user_id ||
      loginResponse?.id ||
      loginResponse?.data?.user?.id ||
      loginResponse?.data?.user_id ||
      loginResponse?.data?.id ||
      null;

    if (loginTimerRef.current) {
      clearTimeout(loginTimerRef.current);
    }

    loginTimerRef.current = setTimeout(() => {
      setIsAuthenticated(true);
      setJustLoggedIn(false);
      const redirectParam =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect") || ""
          : "";
      const safeRedirect = redirectParam.startsWith("/") ? redirectParam : "";

      if (safeRedirect) {
        router.push(safeRedirect);
      } else if (userId) {
        router.push(`/users/${encodeURIComponent(String(userId))}`);
      } else {
        router.push("/users");
      }
    }, 1400);
  };

  const openForgotPassword = () => {
    setDirection(1);
    setError("");
    setNotice("");
    setPasswordResetCompleted(false);
    setIsForgotPasswordVisible(true);
  };

  const goBackToLogin = () => {
    setDirection(-1);
    setError("");
    setNotice("");
    setPasswordResetCompleted(false);
    setIsForgotPasswordVisible(false);
  };

  const goBack = () => {
    setDirection(-1);

    if (step === "account" || step === "reset-password") {
      setStep("otp");
      // setPassword("");
      // setConfirmPassword("");
    } else {
      setStep("identifier");
      setForgotData({ ...forgotData, otp: "" });
    }

    setError("");
    setNotice("");
    setIsAuthenticated(false);
  };

  const requestForgotPasswordOtp = async ({
    userCredentials,
    successMessage,
    moveToOtpStep = false,
  }) => {
    if (requestingOtp) return false;

    try {
      setRequestingOtp(true);
      const result = await dispatch(
        getRequestOtp({ user_credentials: userCredentials }),
      ).unwrap();

      if (
        result?.login_required ||
        result?.otp_sent === false ||
        result?.success === false
      ) {
        setError(
          result?.message || "Unable to send OTP right now. Please try again.",
        );
        setNotice("");
        return false;
      }

      setError("");
      setNotice(successMessage || "OTP sent. Enter the code to continue.");
      setResendCountdown(30);

      if (moveToOtpStep) {
        setStep("otp");
      }

      setPasswordResetCompleted(false);

      return true;
    } catch (requestError) {
      const message = toReadableErrorMessage(
        requestError,
        "Unable to send OTP right now. Please try again.",
      );
      setError(message);
      setNotice("");
      return false;
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    if (requestingOtp) return;

    // const validationError = validateIdentifier(
    //   forgotData.identifier,
    //   identifierType,
    // );
    const detectedIdentifierType = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      forgotData.identifier,
    )
      ? "email"
      : "text";
    const validationError = validateResetPasswordIdentifier({
      identifier: forgotData.identifier,
      identifierType: detectedIdentifierType,
    });

    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }
    const identifier = forgotData.identifier.trim();
    await requestForgotPasswordOtp({
      userCredentials: identifier,
      successMessage: "OTP sent. Enter the code to continue.",
      moveToOtpStep: true,
    });

    console.log(forgotData, "forgot");

    // Implement forgot password logic here
  };

  const handleResendOtp = async () => {
    if (requestingOtp || resendCountdown > 0) return;

    const identifier = String(forgotData?.identifier || "").trim();
    if (!identifier) {
      setError("Enter your identifier to continue.");
      setNotice("");
      return;
    }

    await requestForgotPasswordOtp({
      userCredentials: identifier,
      successMessage: "A new OTP has been sent.",
      moveToOtpStep: false,
    });
  };
  const handleOtpChange = (event) => {
    setForgotData({
      ...forgotData,
      otp: event.target.value.replace(/\D/g, "").slice(0, 6),
    });
    setError("");
    setNotice("");
    setIsAuthenticated(false);
  };
  const handleverifyOtp = async (e) => {
    e.preventDefault();
    if (isVerifyingOtp) return;
    const payload = {
      otp: forgotData.otp,
      userCredentials: forgotData.identifier,
    };

    try {
      setIsVerifyingOtp(true);
      const result = await dispatch(verifyOtp(payload)).unwrap();
      const verificationFailed =
        result?.success === false ||
        result?.status === false ||
        result?.verified === false;

      if (verificationFailed) {
        setError(result?.message || "OTP verification failed.");
        setNotice("");
        return;
      }

      setNotice("OTP verified successfully. Set your new password.");
      setError("");
      setPasswordResetCompleted(false);
      setForgotData((prev) => ({
        ...prev,
        resetToken:
          result?.reset_token ||
          result?.resetToken ||
          result?.token ||
          result?.data?.reset_token ||
          result?.data?.resetToken ||
          "",
      }));
      setDirection(1);
      setStep("reset-password");
    } catch (error) {
      const message = toReadableErrorMessage(error, "OTP verification failed.");
      setError(message);
      setNotice("");
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (isResettingPassword) return;

    if (!forgotData.newPassword) {
      setError("Enter your new password.");
      setNotice("");
      return;
    }

    if (forgotData.newPassword.length < 8) {
      setError("Password should be at least 8 characters.");
      setNotice("");
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      setNotice("");
      return;
    }

    const payload = {
      newPassword: forgotData.newPassword,
      userCredentials: forgotData.identifier,
      resetToken: forgotData.resetToken,
    };

    try {
      setIsResettingPassword(true);
      const result = await dispatch(resetPassword(payload)).unwrap();
      const resetFailed =
        result?.success === false ||
        result?.status === false ||
        result?.ok === false;

      if (resetFailed) {
        setError(result?.message || "Password reset failed.");
        setNotice("");
        return;
      }

      setNotice("Your password has been reset. You can now login.");
      setError("");
      setPasswordResetCompleted(true);
      setForgotData((prev) => ({
        ...prev,
        otp: "",
        resetToken: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setStep("identifier");
    } catch (error) {
      const message = toReadableErrorMessage(error, "Password reset failed.");
      setError(message);
      setNotice("");
    } finally {
      setIsResettingPassword(false);
    }
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
                style={{ height: "auto" }}
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
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {isForgotPasswordVisible ? (
              <motion.div
                key="forgot-panel"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="mx-auto w-full max-w-md"
              >
                <div className="login-form-intro mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    GOOD TO HAVE YOU BACK
                  </p>

                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Let&rsquo;s get moving.!
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    Sign in to access your account and keep your marathon
                    journey moving.
                  </p>
                </div>

                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  {step === "identifier" ? (
                    // <motion.div
                    //   key="identifier-step"
                    //   custom={direction}
                    //   variants={panelVariants}
                    //   initial="enter"
                    //   animate="center"
                    //   exit="exit"
                    //   transition={{ type: "spring", stiffness: 300, damping: 32 }}
                    // >
                    //   {/* Identifier Step Content */}
                    // </motion.div>
                    <motion.form
                      id="forgot-password-form"
                      key="forgot-password"
                      custom={direction}
                      onSubmit={handleOtpSubmit}
                      noValidate
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 32,
                      }}
                    >
                      {/* Forgot Password Form Fields */}
                      <div className="relative">
                        <Label
                          htmlFor="register-identifier"
                          className="mb-2 block text-sm font-semibold text-foreground"
                        >
                          {isEmail
                            ? "Email or Username"
                            : "Phone number or Username"}
                        </Label>
                        <SecurityLockIcon
                          size={19}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                        />
                        <Input
                          id="register-identifier"
                          name="identifier"
                          type={isEmail ? "email" : "tel"}
                          autoComplete={isEmail ? "email" : "tel"}
                          required
                          value={forgotData.identifier}
                          onChange={(event) => {
                            setForgotData({
                              ...forgotData,
                              identifier: event.target.value,
                            });
                            setPasswordResetCompleted(false);
                            setError("");
                            setStep("identifier");
                            setNotice("");
                          }}
                          placeholder={
                            isEmail
                              ? "Enter your email or Username"
                              : "Enter your phone number or Username"
                          }
                          aria-invalid={Boolean(error)}
                          className={cn(
                            "min-h-12 w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                            error &&
                              "border-destructive focus:border-destructive",
                            username.length > 0 && "pr-10",
                          )}
                        />

                        <p
                          id={error ? "forgot-error" : "forgot-hint"}
                          role={error ? "alert" : undefined}
                          className={cn(
                            "mt-2 min-h-5 text-xs",
                            error
                              ? "font-medium text-destructive"
                              : "text-ink-soft",
                          )}
                        >
                          {error ||
                            "We'll send a verification code to your email or phone."}
                        </p>
                      </div>
                      {notice && (
                        <motion.div
                          key={notice}
                          initial={
                            shouldReduceMotion ? false : { opacity: 0, y: 8 }
                          }
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
                      <RainbowButton
                        type={passwordResetCompleted ? "button" : "submit"}
                        form="forgot-password-form"
                        variant="accent"
                        size="lg"
                        onClick={passwordResetCompleted ? goBackToLogin : undefined}
                        disabled={passwordResetCompleted ? false : requestingOtp}
                        className="mt-4 min-h-12 w-full rounded-xl"
                      >
                        {passwordResetCompleted
                          ? "Go to Login"
                          : requestingOtp
                            ? "Processing..."
                            : "Proceed"}
                        <ArrowRight02 size={18} weight="bold" />
                      </RainbowButton>
                    </motion.form>
                  ) : step === "otp" ? (
                    <motion.form
                      key="register-otp"
                      custom={direction}
                      onSubmit={handleverifyOtp}
                      noValidate
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 32,
                      }}
                    >
                      <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
                        <div className="flex items-start gap-3">
                          <LockPasswordIcon
                            size={20}
                            className="mt-0.5 shrink-0 text-accent"
                          />
                          <p className="text-sm leading-relaxed text-ink-soft">
                            Your verification code is for{" "}
                            <span className="break-all font-semibold text-foreground">
                              {getOtpRecipientLabel(forgotData?.identifier)}
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
                        value={forgotData?.otp}
                        onChange={handleOtpChange}
                        placeholder="••••••"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "otp-error" : "otp-hint"}
                        className={cn(
                          "min-h-14 w-full rounded-xl border border-border bg-background px-4 text-center font-mono text-2xl font-bold tracking-[0.6em] text-foreground outline-none transition placeholder:text-ink-soft/40 focus:border-accent focus:ring-accent/10 sm:text-3xl",
                          error &&
                            "border-destructive focus:border-destructive",
                        )}
                      />

                      <p
                        id={error ? "otp-error" : "otp-hint"}
                        role={error ? "alert" : undefined}
                        className={cn(
                          "mt-2 min-h-5 text-xs",
                          error
                            ? "font-medium text-destructive"
                            : "text-ink-soft",
                        )}
                      >
                        {error || "Keep your verification code private."}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-ink-soft">
                          Didn&apos;t receive the code?
                        </span>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={requestingOtp || resendCountdown > 0}
                          className={cn(
                            "font-semibold underline-offset-4 transition",
                            requestingOtp || resendCountdown > 0
                              ? "cursor-not-allowed text-ink-soft/70"
                              : "text-accent hover:underline",
                          )}
                        >
                          {requestingOtp
                            ? "Sending..."
                            : resendCountdown > 0
                              ? `Resend OTP in ${resendCountdown}s`
                              : "Resend OTP"}
                        </button>
                      </div>

                      <RainbowButton
                        type="submit"
                        variant="accent"
                        size="lg"
                        disabled={isVerifyingOtp}
                        className="mt-4 min-h-12 w-full rounded-xl"
                      >
                        {isVerifyingOtp
                          ? "Verifying OTP..."
                          : "Verify & Continue"}
                        <ArrowRight size={18} weight="bold" />
                      </RainbowButton>

                      <button
                        type="button"
                        onClick={goBack}
                        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-accent"
                      >
                        <ArrowLeft02 size={17} />
                        Use a different {isEmail ? "email" : "phone number"}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="reset-password"
                      custom={direction}
                      onSubmit={handleResetPasswordSubmit}
                      noValidate
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 32,
                      }}
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
                      {/* <div className="mb-2 mt-4 flex items-center gap-1">
                        <Label
                          htmlFor="register-username"
                          className="text-sm font-semibold text-foreground"
                        >
                          Username
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              className="help-trigger"
                              aria-label="Username requirements"
                            >
                              <HelpCircleIcon size={14} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="help-popover">
                            <ul className="list-disc list-inside space-y-1 text-xs text-foreground">
                              <li>Minimum 4 characters</li>
                              <li>Maximum 150 characters</li>
                              <li>Only letters, numbers, _ and .</li>
                              <li>Must start with a letter or number</li>
                              <li>Case-insensitive uniqueness</li>
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="relative">
                        <Input
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
                            error &&
                              "border-destructive focus:border-destructive",
                            userCreds.username.length > 0 && "pr-10",
                          )}
                        />
                        {userCreds.username.length > 0 && (
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => {
                              setUserCreds((prev) => ({
                                ...prev,
                                username: "",
                              }));
                              setError("");
                              setNotice("");
                            }}
                            aria-label="Clear username"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                          >
                            <CancelCircleIcon size={20} aria-hidden="true" />
                          </Button>
                        )}
                      </div> */}

                      <div className="mb-2 mt-4 flex items-center gap-1">
                        <Label
                          htmlFor="register-password"
                          className="text-sm font-semibold text-foreground"
                        >
                          Password
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              className="help-trigger"
                              aria-label="Password requirements"
                            >
                              <HelpCircleIcon size={14} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="help-popover">
                            <ul className="list-disc list-inside space-y-1 text-xs text-foreground">
                              <li>Minimum 8 characters</li>
                              <li>Maximum 128 characters</li>
                              <li>At least 1 uppercase letter</li>
                              <li>At least 1 lowercase letter</li>
                              <li>At least 1 number</li>
                              <li>At least 1 special character</li>
                              <li>Username/email similarity allowed</li>
                              <li>Space allowed</li>
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="relative">
                        <Input
                          id="reset-password"
                          name="newPassword"
                          type={isNewPasswordVisible ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={forgotData.newPassword}
                          onChange={handleNewPasswordChange}
                          placeholder="Minimum 8 characters"
                          aria-invalid={Boolean(error)}
                          className={cn(
                            "min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 pr-4 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                            error &&
                              "border-destructive focus:border-destructive",
                            forgotData.newPassword.length > 0 && "pr-10",
                          )}
                        />
                        {forgotData.newPassword.length > 0 && (
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => {
                              setForgotData((prev) => ({
                                ...prev,
                                newPassword: "",
                              }));
                              setError("");
                              setNotice("");
                            }}
                            aria-label="Clear password"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                          >
                            <CancelCircleIcon size={20} aria-hidden="true" />
                          </Button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setIsNewPasswordVisible((visible) => !visible)
                          }
                          aria-label={
                            isNewPasswordVisible
                              ? "Hide password"
                              : "Show password"
                          }
                          aria-pressed={isNewPasswordVisible}
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-soft transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                            forgotData.newPassword.length > 0
                              ? "right-10"
                              : "right-3",
                          )}
                        >
                          {isNewPasswordVisible ? (
                            <EyeIcon size={20} aria-hidden="true" />
                          ) : (
                            <EyeOffIcon size={20} aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <Label
                        htmlFor="register-confirm-password"
                        className="mb-2 mt-4 block text-sm font-semibold text-foreground"
                      >
                        Confirm password
                      </Label>
                      <div className="relative">
                        <Input
                          id="reset-confirm-password"
                          name="confirmPassword"
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={forgotData.confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          placeholder="Re-enter your password"
                          aria-invalid={Boolean(error)}
                          aria-describedby={
                            error ? "reset-error" : "reset-hint"
                          }
                          className={cn(
                            "min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 pr-4 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                            error &&
                              "border-destructive focus:border-destructive",
                            forgotData.confirmPassword.length > 0 &&
                              "pr-10",
                          )}
                        />
                        {forgotData.confirmPassword.length > 0 && (
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => {
                              setForgotData((prev) => ({
                                ...prev,
                                confirmPassword: "",
                              }));
                              setError("");
                              setNotice("");
                            }}
                            aria-label="Clear confirm password"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                          >
                            <CancelCircleIcon size={20} aria-hidden="true" />
                          </Button>
                        )}
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
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-soft transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                            forgotData.confirmPassword.length > 0
                              ? "right-10"
                              : "right-3",
                          )}
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeIcon size={20} aria-hidden="true" />
                          ) : (
                            <EyeOffIcon size={20} aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <p
                        id={error ? "reset-error" : "reset-hint"}
                        role={error ? "alert" : undefined}
                        className={cn(
                          "mt-2 min-h-5 text-xs",
                          error
                            ? "font-medium text-destructive"
                            : "text-ink-soft",
                        )}
                      >
                        {error ||
                          "Use a strong password to protect your account."}
                      </p>

                      <RainbowButton
                        type="submit"
                        variant="accent"
                        size="lg"
                        disabled={isResettingPassword}
                        className="mt-4 min-h-12 w-full rounded-xl"
                      >
                        {isResettingPassword
                          ? "Resetting Password..."
                          : "Reset Password"}
                        <ArrowRight size={18} weight="bold" />
                      </RainbowButton>

                      <button
                        type="button"
                        onClick={goBack}
                        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-accent"
                      >
                        <ArrowLeft02 size={17} />
                        Back to OTP verification
                      </button>
                    </motion.form>
                  )}
                  <Button
                    variant="ghost"
                    as="button"
                    onClick={goBackToLogin}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink-soft transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-accent"
                  >
                    <ArrowRight
                      size={14}
                      weight="bold"
                      className="rotate-180"
                    />
                    Back to Login
                  </Button>
                </AnimatePresence>

                {/* <div className="login-form-intro mt-7 border-t border-border pt-5 text-center">
              <p className="text-sm text-ink-soft">
                Haven&rsquo;t joined the Race yet?{" "}
                <Link
                  href="/register"
                  onClick={handleRegisterClick}
                  aria-disabled={isResettingSession}
                  className="font-bold text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-accent"
                >
                  Take the First Step. Claim Your Spot!
                </Link>
              </p>
            </div> */}
              </motion.div>
            ) : (
              <motion.div
                key="login-panel"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="mx-auto w-full max-w-md"
              >
                <div className="login-form-intro mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    GOOD TO HAVE YOU BACK
                  </p>

                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Let&rsquo;s get moving.!
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    Sign in to access your account and keep your marathon
                    journey moving.
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
                    <Label
                      htmlFor="login-username"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Username or E-mail Address
                    </Label>
                    <div className="relative">
                      <UserCircleIcon
                        size={19}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                      />
                      <Input
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
                          error &&
                            "border-destructive focus:border-destructive",
                          username.length > 0 && "pr-10",
                        )}
                      />
                      {username.length > 0 && (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => {
                            setUsername("");
                            setError("");
                            setNotice("");
                          }}
                          aria-label="Clear username"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        >
                          <CancelCircleIcon size={14} aria-hidden="true" />
                        </Button>
                      )}
                    </div>

                    <Label
                      htmlFor="login-password"
                      className="mb-2 mt-4 block text-sm font-semibold text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <PasswordValidationIcon
                        size={19}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                      />
                      <Input
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
                          "min-h-12 w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-accent/10",
                          error &&
                            "border-destructive focus:border-destructive",
                          password.length > 0 && "pr-10",
                        )}
                      />
                      {password.length > 0 && (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => {
                            setPassword("");
                            setError("");
                            setNotice("");
                          }}
                          aria-label="Clear password"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        >
                          <CancelCircleIcon size={14} aria-hidden="true" />
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setIsPasswordVisible((visible) => !visible)
                        }
                        aria-label={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isPasswordVisible}
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-soft transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          password.length > 0 ? "right-10" : "right-3",
                        )}
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
                        "mt-2 min-h-5 text-xs flex justify-between w-full",
                        error
                          ? "font-medium text-destructive"
                          : "text-ink-soft flex-1",
                      )}
                    >
                      {error ||
                        "Use your account credentials to sign in securely."}
                      <span
                        onClick={openForgotPassword}
                        className="ml-2 font-bold text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-accent cursor-pointer"
                      >
                        Forgot Password?
                      </span>
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
                    Haven&rsquo;t joined the Race yet?{" "}
                    <Link
                      href="/register"
                      onClick={handleRegisterClick}
                      aria-disabled={isResettingSession}
                      className="font-bold text-accent underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-accent"
                    >
                      Take the First Step. Claim Your Spot!
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
