"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft01Icon,
  CheckmarkCircle01Icon,
  SearchIcon,
} from "@animateicons/react/huge";
import { cn } from "@/lib/utils";

const LABEL_CLASSES = "mb-2 block text-sm font-semibold text-foreground";
const EMPTY_OPTIONS = [];

const normalizeOption = (option) => {
  if (typeof option === "string") {
    const value = option.trim();
    return value ? { value, label: value } : null;
  }

  if (!option || typeof option !== "object") return null;

  const rawValue =
    option.value ??
    option.id ??
    option.code ??
    option.name ??
    option.label ??
    option.blood_group ??
    option.group;

  const rawLabel =
    option.label ??
    option.name ??
    option.value ??
    option.blood_group ??
    option.group ??
    option.code ??
    option.id;

  const value = String(rawValue ?? "").trim();
  const label = String(rawLabel ?? value).trim();

  if (!value) return null;
  return { value, label: label || value };
};

export const SearchSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  options = EMPTY_OPTIONS,
  placeholder = "Search and select",
  searchPlaceholder = "Search...",
  icon: Icon,
  error,
  required = true,
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const items = useMemo(() => {
    const normalized = options
      .map(normalizeOption)
      .filter(Boolean)
      .filter(
        (option, index, array) =>
          array.findIndex((candidate) => candidate.value === option.value) ===
          index,
      );

    return normalized;
  }, [options]);

  const selectedLabel =
    items.find((item) => item.value === String(value || ""))?.label || "";

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) => {
      const candidate = `${item.label} ${item.value}`.toLowerCase();
      return candidate.includes(normalizedQuery);
    });
  }, [items, query]);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
  }, [open]);

  const emitValue = (nextValue) => {
    if (typeof onChange !== "function") return;

    if (onChange.length >= 2) {
      onChange(name, nextValue);
      return;
    }

    onChange({
      target: {
        name,
        value: nextValue,
      },
    });
  };

  const handleSelect = (nextValue) => {
    emitValue(nextValue);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={cn("min-w-0", className)} ref={wrapperRef}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{" "}
        {required && (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-required={required}
          aria-invalid={required && Boolean(error)}
          aria-describedby={required && error ? `${id}-error` : undefined}
          disabled={disabled}
          onClick={() => {
            if (open) {
              setOpen(false);
              setQuery("");
              return;
            }
            setOpen(true);
          }}
          className={cn(
            "relative isolate w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-left text-sm text-foreground outline-none transition",
            "hover:border-accent/50",
            "focus-visible:border-accent cursor-pointer focus-visible:ring-4 focus-visible:ring-accent/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-11",
            error && "border-destructive",
          )}
        >
          {Icon && (
            <Icon
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 z-20 -translate-y-1/2 text-ink-soft"
            />
          )}
          <span
            className={cn(
              "block truncate pr-1",
              selectedLabel ? "text-foreground" : "text-ink-soft/60",
            )}
          >
            {selectedLabel || placeholder}
          </span>
          <ArrowDownLeft01Icon
            size={16}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute right-3.5 top-1/2 z-20 -translate-y-1/2 text-ink-soft transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute z-30 mt-2 sm:mt-3 md:mt-3 w-full rounded-xl border border-border bg-background p-2 shadow-lg">
            <div className="relative">
              <SearchIcon
                size={16}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-border bg-muted/20 py-2 pl-8 pr-3 text-sm text-foreground outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
            </div>

            <ul
              id={`${id}-options`}
              role="listbox"
              className="mt-2 max-h-56 space-y-1 overflow-y-auto"
            >
              {filteredItems.length === 0 ? (
                <li className="px-2 py-2 text-sm text-ink-soft">
                  No matches found.
                </li>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = String(value || "") === item.value;

                  return (
                    <li key={item.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(item.value)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition",
                          isSelected
                            ? "bg-accent/12 text-foreground"
                            : "text-ink-soft hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        <span>{item.label}</span>
                        {isSelected && (
                          <CheckmarkCircle01Icon size={14} className="text-accent" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
