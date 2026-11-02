import { motion } from "framer-motion";
import {
  HEALTH_DECLARATIONS,
  HEALTH_SNAPSHOT,
  SNAPSHOT_TINTS,
  DECLARATION_STYLES,
} from "./datas/data";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  HeartIcon,
  LockKeyholeIcon,
  ShieldCheck,
} from "@animateicons/react/huge";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

function DeclarationRow({
  id,
  label,
  icon: Icon,
  tint,
  checked,
  onChange,
  error,
}) {
  const styles = DECLARATION_STYLES[tint];

  return (
    <Label
      className={cn(
        "group flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-200",
        "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/20",
        checked
          ? cn(styles.selected, "shadow-sm")
          : error
            ? "border-destructive/50 bg-destructive/5"
            : "border-border bg-background hover:border-accent/40 hover:shadow-sm",
      )}
    >
      <Checkbox
        id={id}
        name={id}
        checked={checked}
        onCheckedChange={(nextChecked) => onChange(id, nextChecked === true)}
        aria-required="true"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-0.5 h-5 w-5 rounded-md shrink-0 cursor-pointer accent-[var(--accent)]"
      />
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors",
          checked ? styles.icon : "bg-muted text-ink-soft",
        )}
      >
        <Icon size={20} weight="duotone" />
      </span>
      <span
        className={cn(
          "min-w-0 text-sm leading-relaxed transition-colors",
          checked ? "text-foreground" : "text-ink-soft",
        )}
      >
        {label}
      </span>
    </Label>
  );
}

function HealthSnapshot({ form, onChange }) {
  return (
    <section
      aria-labelledby="health-snapshot-title"
      className="rounded-2xl border border-health/20 bg-gradient-to-br from-health/5 via-background to-primary/5 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4
            id="health-snapshot-title"
            className="text-sm font-bold text-foreground"
          >
            Your health, at a glance
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            A few details help our team make race day safer for you.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-health/20 bg-health/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-health">
          Private
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {HEALTH_SNAPSHOT.map((item) => {
          const Icon = item.icon;
          const value = form[item.id];
          const styles = SNAPSHOT_TINTS[item.tint] ?? SNAPSHOT_TINTS.health;

          if (item.kind === "toggle") {
            return (
              <fieldset
                key={item.id}
                className="min-w-0 rounded-xl border border-border/70 bg-background/80 p-3"
              >
                <legend className="sr-only">{item.label}</legend>
                <div className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg",
                      styles.active,
                    )}
                  >
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-relaxed text-foreground">
                      {item.label}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {item.options.map((option) => {
                        const optionId = `${item.id}-${option.value ? "yes" : "no"}`;
                        const optionStyles =
                          SNAPSHOT_TINTS[option.tint] ?? SNAPSHOT_TINTS.neutral;
                        const isActive = value === option.value;

                        return (
                          <label
                            key={optionId}
                            htmlFor={optionId}
                            className={cn(
                              "flex min-h-9 flex-1 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-[11px] font-semibold transition",
                              "focus-within:ring-2 focus-within:ring-accent/30",
                              isActive
                                ? optionStyles.active
                                : optionStyles.chip,
                            )}
                          >
                            <input
                              id={optionId}
                              type="radio"
                              name={item.id}
                              value={String(option.value)}
                              checked={isActive}
                              onChange={() => onChange(item.id, option.value)}
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {item.hint ? (
                  <p className="mt-2 pl-[2.625rem] text-[10px] leading-relaxed text-ink-soft">
                    {item.hint}
                  </p>
                ) : null}
              </fieldset>
            );
          }

          return (
            <div
              key={item.id}
              className="min-w-0 rounded-xl border border-border/70 bg-background/80 p-3"
            >
              <label
                htmlFor={item.id}
                className="flex items-center gap-2.5 text-xs font-semibold text-foreground"
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg",
                    styles.active,
                  )}
                >
                  <Icon size={17} aria-hidden="true" />
                </span>
                {item.label}
              </label>
              <textarea
                id={item.id}
                name={item.id}
                value={value ?? ""}
                onChange={(event) => onChange(item.id, event.target.value)}
                placeholder={item.placeholder}
                rows={2}
                className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-ink-soft">
        <LockKeyholeIcon
          size={14}
          aria-hidden="true"
          className="mt-0.5 shrink-0"
        />
        Optional details to help the event team plan participant support. This
        page does not submit your information.
      </div>
    </section>
  );
}

export const HealthDeclaration = ({
  form,
  errors,
  onChange,

}) => {
  const total = HEALTH_DECLARATIONS.length + 1;
  const done =
    HEALTH_DECLARATIONS.filter((item) => form[item.id]).length +
    (form.dataPrivacy ? 1 : 0);
  const progress = Math.round((done / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="relative overflow-hidden rounded-3xl border border-health/30 bg-health/5">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-10 w-full text-health/60"
        >
          <motion.path
            d="M0 20 H120 L132 20 L140 8 L150 32 L158 14 L166 20 H400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        </svg>
        <div className="flex items-start gap-4 px-5 pb-5 pt-12 sm:px-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-health/10 text-health">
            <HeartIcon size={26} weight="duotone" />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
              Health Declaration
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              Your well-being comes first, always.
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-foreground">
              <AlertCircleIcon
                size={15}
                className="mt-0.5 shrink-0 text-warning"
              />
              <span>
                High diabetic and cardiac patients should be under control
                before race day.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Declarations signed"
          className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <motion.div
            className={cn(
              "h-full rounded-full",
              progress === 100 ? "bg-success" : "bg-health",
            )}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span
          className={cn(
            "text-xs font-bold tabular-nums transition-colors",
            progress === 100 ? "text-success" : "text-health",
          )}
        >
          {done}/{total} signed
        </span>
      </div>

      <div className="space-y-3">
        {HEALTH_DECLARATIONS.map((item) => (
          <div key={item.id}>
            <DeclarationRow
              {...item}
              checked={form[item.id]}
              onChange={onChange}
              error={errors[item.id]}
            />
            {item.id === "medical_fitness_declaration" && (
              <div className="my-3">
                <HealthSnapshot form={form} onChange={onChange} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "rounded-3xl border p-5 transition-colors",
          form.dataPrivacy
            ? "border-primary/30 bg-primary/5"
            : errors.dataPrivacy
              ? "border-destructive/50 bg-destructive/5"
              : "border-border bg-background",
        )}
      >
        <div className="mb-4 flex items-center gap-3">
          <span
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors",
              form.dataPrivacy
                ? "bg-primary/10 text-primary"
                : "bg-muted text-ink-soft",
            )}
          >
            <LockKeyholeIcon size={22} weight="duotone" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-foreground">Data Privacy</h4>
            <p className="text-xs text-ink-soft">Your data, your call.</p>
          </div>
        </div>
        <DeclarationRow
          id="dataPrivacy"
          label="I authorize Appa Charitable Trust to use participation data for wellness reporting."
          icon={ShieldCheck}
          tint="primary"
          checked={form.dataPrivacy}
          onChange={onChange}
          error={errors.dataPrivacy}
        />
      </div>
    </motion.div>
  );
};
