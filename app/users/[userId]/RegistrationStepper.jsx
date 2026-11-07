"use client";

import { useEffect, useState } from "react";
import StepperForm from "@/components/registration/StepperForm";


export default function RegistrationStepper() {
  const [identifier, setIdentifier] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
        <div className="border-b border-accent/20 bg-accent/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Complete Registration
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Finish your marathon registration
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Your account is ready. Submit your runner details to unlock your
            dashboard and race updates.
          </p>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-6">
          <StepperForm identifier={identifier} setIdentifier={setIdentifier} />
        </div>
      </div>
    </div>
  );
}
