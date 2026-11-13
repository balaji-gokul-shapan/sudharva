"use client";

import { useState } from "react";
import { ArrowUpRight01Icon, Clock01Icon } from "@animateicons/react/huge";
import PayementStepper from "./PayementStepper";

export default function PendingPaymentPanel({ registration, userId }) {
  const [isStepperOpen, setIsStepperOpen] = useState(false);

  const openStepper = () => setIsStepperOpen(true);
  const closeStepper = () => setIsStepperOpen(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-linear-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm">
        <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-amber-300/30 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              Payment Pending
            </p>

            <h3 className="mt-3 text-lg font-bold text-amber-900 sm:text-xl">
              Your registration is almost complete
            </h3>

            <p className="mt-1 text-sm text-amber-900/80">
              Click continue to finish payment and unlock your full runner dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={openStepper}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            Continue Payment <ArrowUpRight01Icon size={16} />
          </button>
        </div>

        <div className="relative mt-4 flex items-center gap-2 text-xs font-medium text-amber-800/85">
          <Clock01Icon size={16} />
          Payment session will resume from your last completed step.
        </div>
      </div>

      {isStepperOpen ? (
        <PayementStepper
          registration={registration}
          userId={userId}
          onClose={closeStepper}
        />
      ) : null}
    </>
  );
}
