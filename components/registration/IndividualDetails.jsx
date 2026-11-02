import { cn } from "@/lib/utils";
import { Field } from "./components/Field";
import { motion } from "framer-motion";
import {
  Calendar01Icon,
  Home02Icon,
  Mail01Icon,
  PencilIcon,
  PhoneIcon,
  Shield01Icon,
  UserIcon,
} from "@animateicons/react/huge";
import { GENDERS } from "./datas/data";
import { Separator } from "../ui/separator";
import { PincodeField } from "./components/PincodeField";
import { SelectField } from "./components/SelectField";

export const IndividualDetails = ({
  form,
  errors,
  onChange,
  age,
  hasCities,
  hasStates,
  hasDistricts,
  hasTaulks,
  cities,
  states,
  districts,
  taluks,
}) => {
  return (
    <motion.div
      key="individual-fields"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
      role="tabpanel"
      aria-label="Individual registration details"
    >
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Contact details{" "}
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        </h3>
        <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
          We send your bib, timing chip and race updates here.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="first_name"
          name="first_name"
          label="First name"
          placeholder="e.g. Arjun"
          value={form.first_name}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            onChange("first_name", value);
          }}
          icon={UserIcon}
          error={errors.first_name}
          autoComplete="given-name"
        />
        <Field
          id="last_name"
          name="last_name"
          label="Last name"
          placeholder="e.g. Kumar"
          value={form.last_name}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            onChange("last_name", value);
          }}
          icon={UserIcon}
          error={errors.last_name}
          autoComplete="name"
        />
        <Field
          id="email"
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          icon={Mail01Icon}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id="mobile_number"
          name="mobile_number"
          label="Mobile number"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.mobile_number}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9\s]/g, "");
            onChange("mobile_number", value);
          }}
          icon={PhoneIcon}
          error={errors.mobile_number}
          autoComplete="tel"
        />
        <Field
          id="alternatePhone"
          name="alternatePhone"
          label="Alternate mobile number"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.alternatePhone}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9\s]/g, "");
            onChange("alternatePhone", value);
          }}
          icon={PhoneIcon}
          error={errors.alternatePhone}
          autoComplete="tel"
          required={false}
        />
        <div className="grid gap-5 sm:grid-cols-[65%_30%]">
          <Field
            id="date_of_birth"
            name="date_of_birth"
            label="Date of birth"
            type="date"
            value={form.date_of_birth}
            onChange={onChange}
            icon={Calendar01Icon}
            error={errors.date_of_birth}
            autoComplete="bday"
          />
          <Field
            id="age"
            name="age"
            label="Age"
            type="number"
            value={age}
            onChange={onChange}
            autoComplete="age"
            readOnly
          />
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Personal details{" "}
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        </h3>
        <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
          Used to confirm your age eligibility and seed your pace predictions.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="col-span-2">
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">
              Gender{" "}
              <span className="text-accent" aria-hidden="true">
                *
              </span>
            </legend>
            <p className="mt-1 mb-2 text-xs leading-relaxed text-ink-soft">
              Used to seed your pace predictions and category eligibility.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {GENDERS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition",
                    form.gender === option.value
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-background text-ink-soft hover:border-accent/50",
                    "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15",
                  )}
                >
                  <input
                    id={`gender-${option.value}`}
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={form.gender === option.value}
                    onChange={() => onChange("gender", option.value)}
                    required
                    aria-describedby={
                      errors.gender ? "gender-error" : undefined
                    }
                    className="h-4 w-4 accent-(--accent)"
                  />
                  {option.icon && <option.icon className="mr-2 h-6 w-6" />}
                  {option.label}
                </label>
              ))}
            </div>
            {errors.gender && (
              <p
                id="gender-error"
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {errors.gender}
              </p>
            )}
          </fieldset>
        </div>

        <div className="col-span-2">
          <h3 className="text-sm font-semibold text-foreground">
            Body metrics{" "}
            {/* <span className="text-accent" aria-hidden="true">
              *
            </span> */}
          </h3>
          <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
            Helps us set safe pacing zones and the right hydration plan for you.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              id="height"
              name="height"
              label="Height"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              max="500"
              placeholder="cm"
              value={form.height}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9\s]/g, "");
                onChange("height", value);
              }}
              icon={PencilIcon}
              error={errors.height}
              autoComplete="height"
              required={false}
            />
            <Field
              id="weight"
              name="weight"
              label="Weight"
              type="number"
              placeholder="kg"
              min="0"
              step="0.01"
              inputMode="decimal"
              max="300"
              value={form.weight}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9\s]/g, "");
                onChange("weight", value);
              }}
              icon={PencilIcon}
              error={errors.weight}
              autoComplete="weight"
              required={false}
            />
            <Field
              id="bloodGroup"
              name="bloodGroup"
              label="Blood Group"
              type="text"
              placeholder="e.g., A+"
              value={form.bloodGroup}
              onChange={onChange}
              icon={Shield01Icon}
              error={errors.bloodGroup}
              autoComplete="blood-group"
              required={false}
            />
          </div>
        </div>
        <Separator className="col-span-2" />

        <div className="col-span-2">
          <h3 className="text-sm font-semibold text-foreground">
            Residential Address{" "}
            <span className="text-accent" aria-hidden="true">
              *
            </span>
          </h3>
          <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
            Where you live — used for the start-line city grouping and prize
            dispatch.
          </p>
          <div className="grid gap-5 sm:grid-cols-1">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="resident_address_line1"
                name="resident_address_line1"
                label="Address Line 1"
                type="text"
                placeholder="e.g. 123 Main St"
                value={form.resident_address_line1}
                onChange={onChange}
                icon={Home02Icon}
                error={errors.resident_address_line1}
                autoComplete="street-address"
              />
              <Field
                id="resident_address_line2"
                name="resident_address_line2"
                label="Address Line 2"
                type="text"
                placeholder="e.g. Apt 4B"
                value={form.resident_address_line2}
                onChange={onChange}
                icon={Home02Icon}
                error={errors.resident_address_line2}
                autoComplete="street-address"
                required={false}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <PincodeField
                id="resident_pincode"
                name="resident_pincode"
                label="Pin Code"
                value={form.resident_pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9\s]/g, "");
                  onChange("resident_pincode", value);
                }}
                icon={Home02Icon}
                error={errors.resident_pincode}
                cityField="resident_city"
                cityValue={form.resident_city}
                stateField="resident_state"
                stateValue={form.resident_state}
                talukField="resident_taulk"
                talukValue={form.resident_taulk}
                districtField="resident_district"
                districtValue={form.resident_district}
              />

              <SelectField
                id="resident_city"
                name="resident_city"
                label="City"
                value={form.resident_city}
                onChange={onChange}
                options={cities}
                placeholder={hasCities ? "Select city" : "Enter pincode first"}
                icon={Home02Icon}
                error={errors.resident_city}
                disabled={!hasCities}
              />

              <SelectField
                id="resident_district"
                name="resident_district"
                label="District"
                value={form.resident_district}
                onChange={onChange}
                options={districts}
                placeholder={
                  hasDistricts ? "Select district" : "Enter pincode first"
                }
                icon={Home02Icon}
                error={errors.resident_district}
                disabled={!hasDistricts}
                required={false}
              />
              <SelectField
                id="resident_taulk"
                name="resident_taulk"
                label="Taluk"
                value={form.resident_taulk}
                onChange={onChange}
                options={taluks}
                placeholder={hasTaulks ? "Select taulk" : "Enter pincode first"}
                icon={Home02Icon}
                error={errors.resident_taulk}
                disabled={!hasTaulks}
                required={false}
              />

              <SelectField
                id="resident_state"
                name="resident_state"
                label="State"
                value={form.resident_state}
                onChange={onChange}
                options={states}
                placeholder={hasStates ? "Select state" : "Enter pincode first"}
                icon={Home02Icon}
                error={errors.resident_state}
                disabled={!hasStates}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
