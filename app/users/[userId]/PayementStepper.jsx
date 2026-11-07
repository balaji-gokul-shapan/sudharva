"use client";

import { X } from "@phosphor-icons/react";
import StepperForm from "@/components/registration/StepperForm";
import { useEffect, useState } from "react";

export default function PayementStepper({ registration, userId, onClose }) {
  void userId;
  const [identifier, setIdentifier] = useState("");

  useEffect(() => {
    const mainScroll = document.getElementById("users-main-scroll");
    if (!mainScroll) return;

    const previousOverflow = mainScroll.style.overflow;
    const previousOverscrollBehavior = mainScroll.style.overscrollBehavior;

    mainScroll.style.overflow = "hidden";
    mainScroll.style.overscrollBehavior = "contain";

    return () => {
      mainScroll.style.overflow = previousOverflow;
      mainScroll.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-4 sm:p-6"
      onWheelCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl items-start sm:items-center">
        <div className="w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment stepper"
            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm transition hover:bg-muted focus-visible:border-accent focus-visible:bg-accent/10"
          >
            <X size={18} weight="bold" />
          </button>

          <div className="border-b border-accent/20 bg-accent/5 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Complete Payment Registration
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Finish your marathon registration
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Your account is ready. Submit your runner details to unlock your
              dashboard and race updates.
            </p>
          </div>

          <div
            className="max-h-[75vh] overflow-y-auto overscroll-contain p-4 sm:max-h-[78vh] sm:p-6"
            onWheelCapture={(event) => event.stopPropagation()}
            onTouchMoveCapture={(event) => event.stopPropagation()}
          >
            <StepperForm identifier={identifier} setIdentifier={setIdentifier} step="4" registerData={registration} />
          </div>
        </div>
      </div>
    </div>
  );
}