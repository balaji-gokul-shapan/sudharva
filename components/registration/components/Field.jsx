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
  readOnly = false,
  className,
  ...inputProps
}) => {
  return (
    <div className={cn("min-w-0", className)}>
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
          readOnly={readOnly}
          aria-required={required}
          aria-invalid={required && Boolean(error)}
          aria-describedby={required && error ? `${id}-error` : undefined}
          className={cn(
            FIELD_CLASSES,
            Icon && "pl-11",
            error && "border-destructive",
            readOnly &&
              "cursor-not-allowed border-dashed bg-muted/50 text-ink-soft focus:border-accent focus:ring-0",
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