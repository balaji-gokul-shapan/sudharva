import { Building01Icon, UserIcon } from "@animateicons/react/huge";
import { CorporateDetails } from "./CorporateDetails";
import { IndividualDetails } from "./IndividualDetails";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PersonalDetails = ({ form, errors, onChange, age }) => {
  const isCorporate = form.entryType === "corporate";

  const selectType = (entryType) => {
    if (form.entryType === entryType) return;
    onChange("entryType", entryType);
  };

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Registration type"
        className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-muted/60 p-1.5"
      >
        {[
          {
            value: "individual",
            label: "Individual",
            hint: "Running for yourself",
            icon: UserIcon,
          },
          {
            value: "corporate",
            label: "Corporate",
            hint: "Running as a team",
            icon: Building01Icon,
          },
        ].map((tab) => {
          const selected = form.entryType === tab.value;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectType(tab.value)}
              className={cn(
                "relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-left transition",
                selected
                  ? "bg-surface text-foreground shadow-md shadow-primary/10 ring-1 ring-accent/30"
                  : "text-ink-soft hover:bg-surface/60 hover:text-foreground",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="entry-type-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl border border-accent/30 bg-accent/5"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl transition",
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-ink-soft",
                )}
              >
                <TabIcon size={20} weight={selected ? "fill" : "duotone"} />
              </span>
              <span className="relative min-w-0">
                <span className="block text-sm font-bold">{tab.label}</span>
                <span className="block truncate text-xs text-ink-soft">
                  {tab.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {isCorporate ? (
        <CorporateDetails form={form} errors={errors} onChange={onChange} />
      ) : (
        <IndividualDetails
          form={form}
          errors={errors}
          onChange={onChange}
          age={age}
        />
      )}
    </div>
  );
}