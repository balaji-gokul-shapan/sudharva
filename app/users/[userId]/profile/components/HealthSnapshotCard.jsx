import { Heartbeat, IdentificationCard, Sparkle } from "@phosphor-icons/react/dist/ssr";
import BloodGroupValue from "./BloodGroupValue";

const MISSING = "Not available";

const normalize = (value) => {
  if (value === undefined || value === null || value === "") return MISSING;
  return value;
};

function HealthCell({ label, value, tone = "primary", className = "" }) {
  const normalized = normalize(value);
  const missing = normalized === MISSING;

  const toneClass =
    tone === "warning"
      ? "from-warning/14 to-background border-warning/25"
      : tone === "success"
        ? "from-environment/14 to-background border-environment/25"
        : "from-primary/12 to-background border-primary/20";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-linear-to-br p-3.5 transition-colors hover:border-primary/40 ${toneClass} ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-linear-to-b from-transparent via-primary/55 to-transparent opacity-60"
      />
      <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold wrap-break-word ${missing ? "text-ink-soft" : "text-foreground"}`}
      >
        {normalized}
      </p>
    </div>
  );
}

export default function HealthSnapshotCard({
  bloodGroup,
  cardiacCondition,
  allergies,
  diabetes,
  height,
  weight,
  otherMedical,
}) {
  const criticalFlag =
    String(cardiacCondition || "").toLowerCase() !== "not available" &&
    String(cardiacCondition || "").toLowerCase() !== "no";

  const diabetesFlag = String(diabetes || "").toLowerCase() === "yes";

  const profileHealthTone = criticalFlag || diabetesFlag ? "Elevated attention" : "Stable baseline";
  const riskScore = (criticalFlag ? 55 : 20) + (diabetesFlag ? 30 : 5);
  const riskBand =
    riskScore >= 70
      ? "High"
      : riskScore >= 45
        ? "Moderate"
        : "Low";
  const riskToneClass =
    riskBand === "High"
      ? "text-warning border-warning/35 bg-warning/10"
      : riskBand === "Moderate"
        ? "text-accent border-accent/35 bg-accent/10"
        : "text-environment border-environment/35 bg-environment/10";

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-br from-background/96 via-background/90 to-primary/8 p-5 shadow-[0_18px_42px_-28px_color-mix(in_srgb,var(--primary)_35%,transparent)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,color-mix(in_srgb,var(--primary)_17%,transparent)_0%,transparent_40%),radial-gradient(circle_at_10%_95%,color-mix(in_srgb,var(--accent)_12%,transparent)_0%,transparent_42%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/16 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-accent/12 blur-2xl" />

      <div className="relative mb-5 rounded-2xl border border-border/70 bg-background/72 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 aspect-square place-items-center rounded-xl bg-primary/15 text-primary">
              <IdentificationCard size={20} weight="duotone" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Health Snapshot</p>
              <h2 className="text-lg font-bold text-foreground">Vital Intelligence Matrix</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              <Sparkle size={11} weight="fill" />
              {profileHealthTone}
            </span>
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${riskToneClass}`}>
              Risk {riskBand}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-soft">
              Race Health Load
            </p>
            <p className="text-xs font-black text-foreground">{riskScore}%</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border/80">
            <div
              className="h-full rounded-full bg-linear-to-r from-environment via-accent to-warning"
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative mb-4 flex items-center gap-2 rounded-xl border border-border/70 bg-background/75 px-3 py-2">
        <Heartbeat size={16} className="text-primary" weight="duotone" />
        <p className="text-xs text-ink-soft">
          Health metrics are your race support baseline for hydration, pacing, and emergency response.
        </p>
      </div>

      <div className="relative grid gap-3 sm:grid-cols-2">
        <HealthCell
          label="Blood Group"
          value={bloodGroup}
          // value={<BloodGroupValue value={bloodGroup} />}
          tone="success"
        />
        <HealthCell label="Cardiac Condition" value={cardiacCondition} tone={criticalFlag ? "warning" : "success"} />
        <HealthCell label="Allergies" value={allergies} tone="primary" />
        <HealthCell label="Diabetes" value={diabetes} tone={diabetesFlag ? "warning" : "success"} />
        <HealthCell label="Height" value={height} tone="primary" />
        <HealthCell label="Weight" value={weight} tone="primary" />
        <HealthCell label="Other Medical Conditions" value={otherMedical} tone="primary" className="sm:col-span-2" />
      </div>
    </article>
  );
}
