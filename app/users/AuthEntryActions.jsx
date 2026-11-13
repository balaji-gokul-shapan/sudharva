"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, SignIn } from "@phosphor-icons/react";
import { useAppDispatch } from "@/store/hooks";
import { resetClientSessionData } from "@/lib/resetClientSession";

export default function AuthEntryActions() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleFreshStartNavigation = async (path) => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      await resetClientSessionData(dispatch);
    } catch {
      // Even if reset fails partially, continue navigation.
    } finally {
      router.push(path);
      setIsNavigating(false);
    }
  };

  return (
    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => handleFreshStartNavigation("/login")}
        disabled={isNavigating}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <SignIn size={18} weight="bold" />
        Continue to login
      </button>

      <button
        type="button"
        onClick={() => handleFreshStartNavigation("/register")}
        disabled={isNavigating}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Create account
        <ArrowRight size={16} weight="bold" />
      </button>
    </div>
  );
}