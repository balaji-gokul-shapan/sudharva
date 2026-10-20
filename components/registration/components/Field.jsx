import { cn } from "@/lib/utils";

const FIELD_CLASSES =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-4 focus:ring-accent/10";
const LABEL_CLASSES = "mb-2 block text-sm font-semibold text-foreground";

export const Field = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  autoComplete,
  required = true,
  ...inputProps
}) => {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{" "}
        {required && (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
          />
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(name, event.target.value)} onBlur={() => onChange(name, value)}
          autoComplete={autoComplete}
          aria-required={required}
          aria-invalid={required && Boolean(error)}
          aria-describedby={required && error ? `${id}-error` : undefined}
          className={cn(
            FIELD_CLASSES,
            Icon && "pl-11",
            error && "border-destructive",
          )}
          {...inputProps}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}