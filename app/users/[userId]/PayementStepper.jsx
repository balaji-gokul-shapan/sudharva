"use client";

import { X, CheckCircle, Sparkle, Ticket } from "@phosphor-icons/react";
import StepperForm from "@/components/registration/StepperForm";
import { useEffect, useState } from "react";
import { ConfettiSideCannons } from "@/components/animation/confetti-side-cannons";

export default function PayementStepper({ registration, userId, onClose }) {
  void userId;
  const [identifier, setIdentifier] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

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
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8 lg:p-10"
      onWheelCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px] -translate-y-1/4 animate-pulse" />
        <div className="absolute bottom-0 right-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] translate-y-1/3 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-success/10 blur-[80px] animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl items-start sm:items-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-border/80 bg-surface/95 backdrop-blur-md shadow-2xl shadow-accent/20 ring-1 ring-white/20 transition-all duration-300" style={{ transform: isClosing ? "scale(0.95)" : "scale(1)", opacity: isClosing ? 0 : 1 }}>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close payment stepper"
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-white/90 text-foreground shadow-lg transition-all hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:shadow-accent/40 focus-visible:ring-4 focus-visible:ring-accent/20"
          >
            <X size={18} weight="bold" className="transition-transform hover:rotate-90" />
          </button>

          <div className="relative border-b border-border/60 bg-gradient-to-b from-surface/80 to-surface/60 p-6 sm:p-8 md:p-10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-success" />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent shadow-sm">
                  <span className="relative flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Payment Step - Final Stage
                </div>
                <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Finish your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-success">
                    marathon registration
                  </span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft max-w-xl sm:max-w-none">
                  You&apos;re almost there! Submit your runner details to unlock
                  your dashboard, race bib, and exclusive race-day updates.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 hidden sm:flex items-center gap-2 text-center">
                <div className="w-16 h-16 rounded-full border border-border/60 bg-white flex items-center justify-center shadow-sm">
                  <Ticket size={32} className="text-accent" />
                </div>
                <div className="w-16 h-16 rounded-full border border-border/60 bg-white flex items-center justify-center shadow-sm ml-2">
                  <Sparkle size={32} className="text-primary animate-bounce" style={{ animationDelay: "0.5s" }} />
                </div>
                <div className="w-16 h-16 rounded-full border border-border/60 bg-white flex items-center justify-center shadow-sm ml-2">
                  <CheckCircle size={32} className="text-success animate-bounce" style={{ animationDelay: "1s" }} />
                </div>
              </div>
            </div>
          </div>

          <div
            className="max-h-[85vh] overflow-y-auto overscroll-contain p-6 sm:max-h-[88vh] sm:p-8 md:p-10"
            onWheelCapture={(event) => event.stopPropagation()}
            onTouchMoveCapture={(event) => event.stopPropagation()}
          >
            <StepperForm identifier={identifier} setIdentifier={setIdentifier} step="4" registerData={registration} />
          </div>
        </div>
      </div>

      <ConfettiSideCannons
        className="pointer-events-none"
        triggerKey={registration?.participant_reference || registration?.reference || ""}
        fireOnClick={false}
      />
    </div>
  );
}