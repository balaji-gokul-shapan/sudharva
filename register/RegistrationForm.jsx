"use client";

import { useState } from "react";
import { RainbowButton } from "@/components/animation/rainbowButton";

const CATEGORIES = [
  { value: "5k", label: "5K Run" },
  { value: "10k", label: "10K Run" },
  { value: "volunteer", label: "Volunteer" },
];

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const fieldClasses =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-ink-soft/70 focus:border-accent focus:ring-2 focus:ring-accent/30";

const labelClasses =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft";

export default function RegistrationForm() {
  const [submittedName, setSubmittedName] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmittedName(data.get("fullName"));
    // NOTE: there is no backend yet — submissions are acknowledged on the
    // client only. Wire this to your API/registration service here.
  };

  if (submittedName) {
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
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="mt-5 font-serif text-2xl font-bold text-primary-deep sm:text-3xl">
          You&apos;re registered, {submittedName}!
        </h2>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          See you at the starting line. A confirmation with your bib details
          will be sent to you before race day.
        </p>
        <button
          type="button"
          onClick={() => setSubmittedName(null)}
          className="mt-6 cursor-pointer rounded-md border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:border-accent hover:text-accent"
        >
          Register another participant
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
            Full name
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

        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
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
            required
            autoComplete="tel"
            placeholder="+91 90000 00000"
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

        <fieldset className="sm:col-span-2">
          <legend className={labelClasses}>Gender</legend>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((gender) => (
              <span key={gender.value} className="relative">
                <input
                  type="radio"
                  id={`gender-${gender.value}`}
                  name="gender"
                  value={gender.value}
                  required
                  className="peer sr-only"
                />
                <label
                  htmlFor={`gender-${gender.value}`}
                  className="block cursor-pointer rounded-full border border-border px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink transition hover:border-primary peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground"
                >
                  {gender.label}
                </label>
              </span>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="emergency" className={labelClasses}>
            Emergency contact{" "}
            <span className="font-medium normal-case">(optional)</span>
          </label>
          <input
            id="emergency"
            name="emergency"
            type="tel"
            placeholder="+91 90000 00000"
            className={fieldClasses}
          />
        </div>

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

      <RainbowButton
        type="submit"
        size="lg"
        className="mt-7 w-full px-6 py-3.5 text-sm font-bold uppercase tracking-wider"
      >
        Complete registration
      </RainbowButton>
    </form>
  );
}
