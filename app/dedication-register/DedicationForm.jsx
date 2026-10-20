"use client";

import { useState } from "react";
import { RainbowButton } from "@/components/animation/rainbowButton";

const CATEGORIES = [
  { value: "5k", label: "5K Run" },
  { value: "10k", label: "10K Run" },
  { value: "volunteer", label: "Volunteer" },
];

const RELATIONSHIPS = [
  { value: "parent", label: "Parent" },
  { value: "spouse", label: "Spouse / Partner" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];

const fieldClasses =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-ink-soft/70 focus:border-accent focus:ring-2 focus:ring-accent/30";

const labelClasses =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft";

export default function DedicationForm() {
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted({
      fullName: data.get("fullName"),
      dedicateTo: data.get("dedicateTo"),
    });
    // NOTE: there is no backend yet — submissions are acknowledged on the
    // client only. Wire this to your API/dedication service here.
  };

  if (submitted) {
    return (
      <div
        aria-live="polite"
        className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-lg"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-5 font-serif text-2xl font-bold text-primary-deep sm:text-3xl">
          Dedication registered for {submitted.fullName}{" "}
          <span className="text-ink-soft/70 font-normal">
            in honor of {submitted.dedicateTo}
          </span>
        </h2>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          Your stride now carries their name. A confirmation with your bib
          details will be sent to you before race day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="mt-6 cursor-pointer rounded-md border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:border-accent hover:text-accent"
        >
          Register another dedication
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className={labelClasses}>
            Your full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Arjun Kumar"
            className={fieldClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. arjun@example.com"
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 90000 00000"
            className={fieldClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="dedicateTo" className={labelClasses}>
            Dedicate your run to
          </label>
          <input
            id="dedicateTo"
            name="dedicateTo"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. My grandmother"
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="relationship" className={labelClasses}>
            Relationship
          </label>
          <select id="relationship" name="relationship" className={fieldClasses}>
            <option value="" disabled>
              Select relationship
            </option>
            {RELATIONSHIPS.map((relationship) => (
              <option key={relationship.value} value={relationship.value}>
                {relationship.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClasses}>
            Dedication message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="A short message that will appear with your bib..."
            className={fieldClasses}
          />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={labelClasses}>Category</legend>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((category) => (
              <span key={category.value} className="relative">
                <input
                  type="radio"
                  id={`category-${category.value}`}
                  name="category"
                  value={category.value}
                  required
                  className="peer sr-only"
                />
                <label
                  htmlFor={`category-${category.value}`}
                  className="block cursor-pointer rounded-md border border-border px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-ink transition hover:border-primary peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground"
                >
                  {category.label}
                </label>
              </span>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <label
            htmlFor="consent"
            className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ink-soft sm:col-span-2"
          >
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <span>
              I confirm the details above are correct and agree to the event
              rules, health guidelines, and use of my information for race
              organisation.
            </span>
          </label>
        </div>
      </div>

      <RainbowButton
        type="submit"
        size="lg"
        className="mt-7 w-full px-6 py-3.5 text-sm font-bold uppercase tracking-wider"
      >
        Register dedication
      </RainbowButton>
    </form>
  );
}

