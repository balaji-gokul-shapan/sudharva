import { Heartbeat, IdentificationCard, Sparkle } from "@phosphor-icons/react/dist/ssr";
import BloodGroupValue from "./BloodGroupValue";

function HealthCell({ label, value, tone = "primary" }) {
  const toneClass =
    tone === "warning"
      ? "from-warning/12 to-background border-warning/25"
      : tone === "success"
        ? "from-environment/12 to-background border-environment/25"
        : "from-primary/10 to-background border-primary/20";

  return (
    <div className={`rounded-2xl border bg-linear-to-br p-3.5 ${toneClass}`}>
      <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground wrap-break-word">{value}</p>
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
}) {
  const criticalFlag =
    String(cardiacCondition || "").toLowerCase() !== "not available" &&
    String(cardiacCondition || "").toLowerCase() !== "no";

  const diabetesFlag = String(diabetes || "").toLowerCase() === "yes";

  const profileHealthTone = criticalFlag || diabetesFlag ? "Elevated attention" : "Stable baseline";

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-background/90 p-5 shadow-[0_18px_42px_-28px_color-mix(in_srgb,var(--primary)_35%,transparent)] sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl" />

      <div className="relative mb-5 flex flex-row xl:flex-col items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 aspect-square place-items-center rounded-xl bg-primary/15 text-primary">
            <IdentificationCard size={20} weight="duotone" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Health Snapshot</p>
            <h2 className="text-lg font-bold text-foreground">Body Intelligence Panel</h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          <Sparkle size={11} weight="fill" />
          {profileHealthTone}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/70 bg-background/75 px-3 py-2">
        <Heartbeat size={16} className="text-primary" weight="duotone" />
        <p className="text-xs text-ink-soft">
          Health metrics are your race support baseline for hydration, pacing, and emergency response.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <HealthCell
          label="Blood Group"
          value={<BloodGroupValue value={bloodGroup} />}
          tone="success"
        />
        <HealthCell label="Cardiac Condition" value={cardiacCondition} tone={criticalFlag ? "warning" : "success"} />
        <HealthCell label="Allergies" value={allergies} tone="primary" />
        <HealthCell label="Diabetes" value={diabetes} tone={diabetesFlag ? "warning" : "success"} />
        <HealthCell label="Height" value={height} tone="primary" />
        <HealthCell label="Weight" value={weight} tone="primary" />
      </div>
    </article>
  );
}
