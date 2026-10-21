import {
  Check,
  Home01Icon,
  PhoneIcon,
  Trophy,
  UserIcon,
} from "@animateicons/react/huge";
import { Field } from "./components/Field";
import { CATEGORIES, SHIRT_SIZES } from "./datas/data";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export const EventDetails = ({ form, errors, onChange }) => {
  const useResident = Boolean(form.useResidentAddress);
  const hasResidentAddress = form.entryType !== "corporate";

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-sm font-semibold text-foreground">
          Choose your event{" "}
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        </legend>
        <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
          Pick the distance that matches your stride. Every category includes
          timing chips, hydration and medical support.
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          {CATEGORIES.map((category) => {
            const selected = form.category === category.value;

            return (
              <label
                key={category.value}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center  rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  selected ? category.selected : category.className,
                  "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15",
                )}
              >
                <input
                  id={`category-${category.value}`}
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={selected}
                  onChange={() => onChange("category", category.value)}
                  aria-required="true"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? "category-error" : undefined
                  }
                  className="sr-only"
                />
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-surface shadow-sm">
                  <Trophy
                    size={22}
                    weight="duotone"
                    className={category.icon}
                  />
                </span>
                <span className="font-bold text-foreground">
                  {category.label}
                </span>
                <span className="mt-1 text-xs text-ink-soft">
                  {category.detail}
                </span>
                <span className="mt-3 rounded-full bg-surface/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  {category.distance}
                </span>
                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground"
                  >
                    <Check size={12} weight="bold" />
                  </span>
                )}
              </label>
            );
          })}
        </div>
        {errors.category && (
          <p
            id="category-error"
            className="mt-2 text-xs font-medium text-destructive"
          >
            {errors.category}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-foreground">
          Event T-shirt size{" "}
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        </legend>
        <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
          Run in a size that fits you comfortably — we order in small batches,
          so this choice is final once the race closes.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SHIRT_SIZES.map((size) => (
            <label
              key={size}
              className={cn(
                "flex cursor-pointer justify-center rounded-xl border px-3 py-3 text-sm font-bold transition",
                form.shirtSize === size
                  ? "border-accent bg-accent text-accent-foreground shadow-sm"
                  : "border-border bg-background text-ink-soft hover:border-accent/50",
                "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15",
              )}
            >
              <input
                id={`shirt-${size.toLowerCase()}`}
                type="radio"
                name="shirtSize"
                value={size}
                checked={form.shirtSize === size}
                onChange={() => onChange("shirtSize", size)}
                aria-required="true"
                aria-invalid={Boolean(errors.shirtSize)}
                aria-describedby={errors.shirtSize ? "shirt-error" : undefined}
                className="sr-only"
              />
              {size}
            </label>
          ))}
        </div>
        {errors.shirtSize && (
          <p
            id="shirt-error"
            className="mt-2 text-xs font-medium text-destructive"
          >
            {errors.shirtSize}
          </p>
        )}
      </fieldset>

      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Emergency contact{" "}
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        </h3>
        <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
          Someone we can reach on race day if anything comes up. We only use
          this in an emergency.
        </p>
        <div className="grid gap-5 sm:grid-cols-4">
          <span className="sr-only">Emergency Contact Details</span>
          <Field
            id="emergencyName"
            name="emergencyName"
            label="Emergency contact name"
            placeholder="e.g. Priya Kumar"
            value={form.emergencyName}
            onChange={onChange}
            icon={UserIcon}
            error={errors.emergencyName}
            autoComplete="off"
            className="sm:col-span-2"
          />
          <Field
            id="emergencyPhone"
            name="emergencyPhone"
            label="Emergency contact phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.emergencyPhone}
            onChange={onChange}
            icon={PhoneIcon}
            error={errors.emergencyPhone}
            autoComplete="off"
          />
          <Field
            id="emergencyRelation"
            name="emergencyRelation"
            label="Emergency contact relation"
            type="text"
            placeholder="e.g. Parent, Sibling"
            value={form.emergencyRelation}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.emergencyRelation}
            autoComplete="off"
          />
        </div>
      </div>

      <fieldset>
        <div className="flex flex-wrap items-center justify-between  gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            Delivery address
            <span className="ml-1 text-accent" aria-hidden="true">
              *
            </span>
          </h3>

          {hasResidentAddress && (
            <div className="flex items-center gap-2">
              <Switch
                id="use-resident-address"
                checked={useResident}
                onCheckedChange={(checked) =>
                  onChange("useResidentAddress", checked)
                }
              />

              <Label
                htmlFor="use-resident-address"
                className="cursor-pointer text-sm font-medium text-foreground"
              >
                Use as resident Address
              </Label>
            </div>
          )}
        </div>
        <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
          {useResident
            ? "Your residential address is being used for delivery. Switch it off to enter a different delivery address."
            : "Where should we send your race kit and bib? We hand off to our courier partner after the registration window closes."}
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <span className="sr-only">Address Details</span>
          <Field
            id="address_line1"
            name="address_line1"
            label="Address Line 1"
            placeholder="e.g. 123 Main St"
            value={form.address_line1}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.address_line1}
            autoComplete="off"
            readOnly={useResident}
          />
          <Field
            id="address_line2"
            name="address_line2"
            label="Address Line 2"
            placeholder="e.g. Apt 4B"
            value={form.address_line2}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.address_line2}
            autoComplete="off"
            required={false}
            readOnly={useResident}
          />
          <Field
            id="delivery_pincode"
            name="delivery_pincode"
            label="Pincode"
            placeholder="e.g. 123456"
            value={form.delivery_pincode}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.delivery_pincode}
            autoComplete="off"
            readOnly={useResident}
          />
          <Field
            id="delivery_city"
            name="delivery_city"
            label="City"
            placeholder="e.g. New York"
            value={form.delivery_city}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.delivery_city}
            autoComplete="off"
            readOnly={useResident}
          />
          <Field
            id="area"
            name="area"
            label="Area"
            placeholder="e.g. Downtown"
            value={form.area}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.area}
            autoComplete="off"
            readOnly={useResident}
          />
          <Field
            id="delivery_state"
            name="delivery_state"
            label="State"
            placeholder="e.g. New York"
            value={form.delivery_state}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.delivery_state}
            autoComplete="off"
            readOnly={useResident}
          />
        </div>
      </fieldset>
    </div>
  );
};
