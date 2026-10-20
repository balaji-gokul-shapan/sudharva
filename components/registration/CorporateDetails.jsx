"use client";

import { Buildings, User, Envelope, Phone } from "@phosphor-icons/react";
import { Field } from "./components/Field";
import { motion } from "framer-motion";
import { Building01, Mail01Icon, PhoneIcon, UserIcon } from "@animateicons/react/huge";
import { TEAM_SIZES } from "./datas/data";
import { cn } from "@/lib/utils";

export const CorporateDetails = ({ form, errors, onChange }) => {
  return (
    <motion.div
      key="corporate-fields"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
      role="tabpanel"
      aria-label="Corporate registration details"
    >
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
            <Buildings size={19} weight="duotone" />
          </span>
          <p className="text-sm leading-relaxed text-ink-soft">
            Registering on behalf of your organisation? Add the company and a
            contact person we will coordinate team bibs and invoicing with
            them.
          </p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="companyName"
          name="companyName"
          label="Company name"
          placeholder="e.g. Acme Technologies"
          value={form.companyName}
          onChange={onChange}
          icon={Building01}
          error={errors.companyName}
          autoComplete="organization"
        />
        <Field
          id="contactName"
          name="contactName"
          label="Contact person"
          placeholder="e.g. Priya Sharma"
          value={form.contactName}
          onChange={onChange}
          icon={UserIcon}
          error={errors.contactName}
          autoComplete="name"
        />
        <Field
          id="workEmail"
          name="workEmail"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={form.workEmail}
          onChange={onChange}
          icon={Mail01Icon}
          error={errors.workEmail}
          autoComplete="email"
        />
        <Field
          id="companyPhone"
          name="companyPhone"
          label="Company phone"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.companyPhone}
          onChange={onChange}
          icon={PhoneIcon}
          error={errors.companyPhone}
          autoComplete="tel"
        />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-foreground">
          Team size{" "}
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TEAM_SIZES.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                form.teamSize === option.value
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-background text-ink-soft hover:border-accent/50",
                "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15",
              )}
            >
              <input
                id={`teamsize-${option.value}`}
                type="radio"
                name="teamSize"
                value={option.value}
                checked={form.teamSize === option.value}
                onChange={() => onChange("teamSize", option.value)}
                aria-required="true"
                aria-invalid={Boolean(errors.teamSize)}
                aria-describedby={
                  errors.teamSize ? "teamsize-error" : undefined
                }
                className="h-4 w-4 accent-[var(--accent)]"
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.teamSize && (
          <p
            id="teamsize-error"
            className="mt-1.5 text-xs font-medium text-destructive"
          >
            {errors.teamSize}
          </p>
        )}
      </fieldset>
    </motion.div>
  );
}