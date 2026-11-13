import { MapPin, UserCircle } from "@phosphor-icons/react/dist/ssr";
import BloodGroupValue from "./BloodGroupValue";

const MISSING = "Not available";

function DetailCell({ label, value, desc, className = "" }) {
  const isMissing = !value || value === MISSING;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border/75 bg-background/80 p-3.5 transition-colors hover:border-primary/35 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </p>
      <p
        className={`mt-1.5 text-sm font-semibold wrap-break-word ${isMissing ? "text-ink-soft" : "text-foreground"}`}
      >
        {value || MISSING}
      </p>
      {desc ? <p className="mt-1 text-xs text-ink-soft wrap-break-word">{desc}</p> : null}
    </article>
  );
}

export default function PersonalDetailsCard({
  firstName,
  lastName,
  runnerAge,
  dateOfBirth,
  personalMobile,
  bloodGroup,
  height,
  weight,
  address,
  alternateMobile,
}) {
  const bloodGroupDisplay = bloodGroup ? (
    <BloodGroupValue value={bloodGroup} />
  ) : (
    MISSING
  );

  const displayName = [firstName, lastName]
    .filter((part) => part && part !== MISSING)
    .join(" ")
    .trim();

  const initials = displayName
    ? displayName
        .split(" ")
        .map((chunk) => chunk[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "RN";

  const completionFields = [
    firstName,
    lastName,
    dateOfBirth,
    personalMobile,
    bloodGroup,
    height,
    weight,
    address,
  ];
  const completion = Math.round(
    (completionFields.filter((field) => field && field !== MISSING).length /
      completionFields.length) *
      100,
  );

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-br from-background/96 via-background/92 to-primary/8 p-5 shadow-[0_18px_42px_-28px_color-mix(in_srgb,var(--primary)_38%,transparent)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,color-mix(in_srgb,var(--accent)_12%,transparent)_0%,transparent_38%),radial-gradient(circle_at_15%_86%,color-mix(in_srgb,var(--primary)_16%,transparent)_0%,transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl"
      />

      <div className="relative mb-5 rounded-2xl border border-border/70 bg-background/75 p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 aspect-square place-items-center rounded-xl bg-primary/15 text-primary">
              <UserCircle size={20} weight="duotone" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Runner Information
              </p>
              <h2 className="text-lg font-bold text-foreground">Personal Details</h2>
            </div>
          </div>

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/35 bg-primary/12 text-xs font-black tracking-[0.08em] text-primary">
            {initials}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-sm font-medium text-foreground wrap-break-word">
            {displayName || "Runner profile"}
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1">
            {/* <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              Completion
            </span> */}
            <span className="text-xs font-black text-primary">{completion}%</span>
          </div>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/80">
          <div
            className="h-full rounded-full bg-linear-to-r from-accent via-primary to-accent"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="relative mb-4 flex items-center gap-2 rounded-xl border border-border/70 bg-background/75 px-3 py-2">
        <MapPin size={15} className="text-primary" weight="duotone" />
        <p className="text-xs text-ink-soft">
          Keep personal details current to ensure smooth check-in and emergency
          coordination.
        </p>
      </div>

      <div className="relative grid gap-3 sm:grid-cols-2">
        <DetailCell label="First Name" value={firstName} />
        <DetailCell label="Last Name" value={lastName} />
        <DetailCell
          label="Date of Birth"
          value={dateOfBirth}
          desc={runnerAge && runnerAge !== MISSING ? `Age ${runnerAge}` : null}
          className="sm:col-span-2"
        />
        <DetailCell label="Mobile Number" value={personalMobile} />
        <DetailCell label="Blood Group" value={bloodGroup} />
        <DetailCell label="Height" value={height} />
        <DetailCell label="Alternate Mobile" value={alternateMobile} />
        <DetailCell label="Weight" value={weight} />
        <DetailCell label="Address" value={address} className="sm:col-span-2" />
      </div>
    </article>
  );
}
