"use client";
import { useState } from "react";
import { MarathonPassTicket } from "../animation/MarathonPassTicket";
import {
  Home01Icon,
  Mail01Icon,
  PhoneIcon,
  UserIcon,
} from "@animateicons/react/huge";
import { Field } from "./components/Field";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const GiftDetails = ({ form, onChange, errors }) => {
  const [ticketUsed, setTicketUsed] = useState(false);
  const useNominee = Boolean(form.useNominee);

  return (
    <div>
      <MarathonPassTicket fluid onTear={() => setTicketUsed(true)} />
      <div className="space-y-7">
        <div>
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Nominee contact{" "}
  
                <span className="text-accent" aria-hidden="true">
                  *
                </span>
              </h3>
              <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
                Someone we can reach on race day if anything comes up. We only
                use this in an emergency.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Switch
                id="use-nominee"
                checked={useNominee}
                onCheckedChange={(checked) => onChange("useNominee", checked)}
              />
              <Label
                htmlFor="use-nominee"
                className="text-sm font-medium text-foreground"
              >
                Use nominee
              </Label>
            </div>
          </div>
          <fieldset
            className={cn(
              "border-0 p-0",
              !useNominee && "hidden",
            )}
            aria-hidden={!useNominee}
          >
            <legend className="sr-only">Nominee contact details</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="beneficiary_name"
                name="beneficiary_name"
                label="Nominee name"
                placeholder="e.g. Priya Kumar"
                value={form.beneficiary_name}
                onChange={onChange}
                icon={UserIcon}
                error={errors.beneficiary_name}
                autoComplete="off"
              />
              <Field
                id="beneficiary_mobile"
                name="beneficiary_mobile"
                label="Nominee phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.beneficiary_mobile}
                onChange={onChange}
                icon={PhoneIcon}
                error={errors.beneficiary_mobile}
                autoComplete="off"
              />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field
                id="beneficiary_email"
                name="beneficiary_email"
                label="Nominee email"
                type="email"
                placeholder="e.g. nominee@example.com"
                value={form.beneficiary_email}
                onChange={onChange}
                icon={Mail01Icon}
                error={errors.beneficiary_email}
                autoComplete="off"
              />
              <Field
                id="beneficiary_address"
                name="beneficiary_address"
                label="Nominee address"
                type="text"
                placeholder="e.g. 123 Main St, City, Country"
                value={form.beneficiary_address}
                onChange={onChange}
                icon={Home01Icon}
                error={errors.beneficiary_address}
                autoComplete="off"
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default GiftDetails;
