import { cn } from "@/lib/utils";
import { Field } from "./components/Field";
import { motion } from "framer-motion";
import {
  Calendar01Icon,
  Mail01Icon,
  PhoneIcon,
  UserIcon,
} from "@animateicons/react/huge";
import { GENDERS } from "./datas/data";

export const IndividualDetails = ({ form, errors, onChange, age }) => {
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          name="firstName"
          label="First name"
          placeholder="e.g. Arjun"
          value={form.firstName}
          onChange={onChange}
          icon={UserIcon}
          error={errors.firstName}
          autoComplete="given-name"
        />
        <Field
          id="lastName"
          name="lastName"
          label="Last name"
          placeholder="e.g. Kumar"
          value={form.lastName}
          onChange={onChange}
          icon={UserIcon}
          error={errors.lastName}
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
          id="phone"
          name="phone"
          label="Mobile number"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={onChange}
          icon={PhoneIcon}
          error={errors.phone}
          autoComplete="tel"
        />
        <Field
          id="alternatePhone"
          name="alternatePhone"
          label="Alternate mobile number"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.alternatePhone}
          onChange={onChange}
          icon={PhoneIcon}
          error={errors.alternatePhone}
          autoComplete="tel"
          required={false}
        />

        <div className="grid gap-5 sm:grid-cols-[65%_30%]">
          <Field
            id="dob"
            name="dob"
            label="Date of birth"
            type="date"
            value={form.dob}
            onChange={onChange}
            icon={Calendar01Icon}
            error={errors.dob}
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

        <div className="col-span-2">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-foreground">
              Gender{" "}
              <span className="text-accent" aria-hidden="true">
                *
              </span>
            </legend>
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

        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
          <Field
            id="height"
            name="height"
            label="Height"
            type="number"
            placeholder="cm"
            value={form.height}
            onChange={onChange}
            // icon={}
            error={errors.height}
            autoComplete="height"
          />
          <Field
            id="weight"
            name="weight"
            label="Weight"
            type="number"
            placeholder="kg"
            value={form.weight}
            onChange={onChange}
            // icon={}
            error={errors.weight}
            autoComplete="weight"
          />
          <Field
            id="bloodGroup"
            name="bloodGroup"
            label="Blood Group"
            type="text"
            placeholder="e.g., A+"
            value={form.bloodGroup}
            onChange={onChange}
            // icon={}
            error={errors.bloodGroup}
            autoComplete="blood-group"
          />
        </div>

        <div className="col-span-2">
          <Field
            id="address"
            name="address"
            label="Address"
            type="text"
            value={form.address}
            onChange={onChange}
            // icon={}
            error={errors.address}
            autoComplete="street-address"
          />
        </div>
        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
          <Field
            id="city"
            name="city"
            label="City"
            type="text"
            value={form.city}
            onChange={onChange}
            // icon={}
            error={errors.city}
            autoComplete="address-level2"
          />
          <Field
            id="state"
            name="state"
            label="State"
            type="text"
            value={form.state}
            onChange={onChange}
            // icon={}
            error={errors.state}
            autoComplete="address-level1"
          />
          <Field
            id="pincode"
            name="pincode"
            label="Pin Code"
            type="text"
            value={form.pincode}
            onChange={onChange}
            // icon={}
            error={errors.pincode}
            autoComplete="postal-code"
          />
        </div>
        {/* <div>
          <label
            htmlFor="age"
            className={cn(LABEL_CLASSES, "flex items-center gap-2")}
          >
            Age
            <span className="text-accent" aria-hidden="true">
              *
            </span>
            <span
              className={cn(
                "ml-auto text-sm font-semibold tabular-nums text-foreground",
                errors.age && "text-destructive"
              )}
            >
              {age ?? "—"}
            </span>
          </label>
        </div> */}
      </div>
    </motion.div>
  );
};
