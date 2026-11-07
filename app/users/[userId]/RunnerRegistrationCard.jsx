"use client";

import { useRunnerRegistrationData } from "./data/registerInfo";

export default function RunnerRegistrationCard() {
  const registration = useRunnerRegistrationData();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <h2 className="text-lg font-bold">Registration Snapshot</h2>
      <p className="mt-3 text-sm text-ink-soft">Participant Reference</p>
      <p className="mt-1 font-semibold text-foreground">
        {registration?.participant_reference || "Not available"}
      </p>
    </div>
  );
}
