"use client";

import { cn } from "cn";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LABEL_CLASSES = "mb-2 block text-sm font-semibold text-foreground";

export const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  icon: Icon,
  error,
  required = true,
  disabled = false,
  className,
}) => {
  const items = options.map((option) => ({
    value: String(option.value),
    label: option.label,
  }));

   useEffect(() => {
    if (items.length === 1 && !value) {
      onChange?.(name, items[0].value);
    }
  }, [items, name, value, onChange]);



  const selectedLabel = items.find((item) => item.value === String(value))
    ?.label;

  const resolvedItems =
    value && !selectedLabel
      ? [...items, { value: String(value), label: String(value) }]
      : items;

  return (
    <div className={cn("min-w-0", className)}>
      <label id={`${id}-label`} htmlFor={id} className={LABEL_CLASSES}>
        {label}{" "}
        {required && (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <Select
        name={name}
        items={resolvedItems}
        value={value ? String(value) : null}
        onValueChange={(next) => onChange?.(name, next ?? "")}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-required={required}
          aria-invalid={required && Boolean(error)}
          aria-describedby={required && error ? `${id}-error` : undefined}
          className={cn(
            // Geometry / typography identical to the sibling text inputs.
            "relative w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition",
            "hover:border-accent/50",
            "focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/10",
            "data-[size=default]:h-auto",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-placeholder:text-ink-soft/60",
            Icon && "pl-11",
            error && "border-destructive",
          )}
        >
          {Icon && (
            <Icon
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
            />
          )}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          side="bottom"
          sideOffset={12}
          align="center"
          alignItemWithTrigger={false}
          className="w-(--anchor-width) min-w-[12rem] max-w-[min(20rem,90vw)] rounded-xl border border-border p-1 shadow-lg"
        >
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="rounded-lg py-2 pl-3 pr-8 text-sm"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
