import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Field } from "./components/Field";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-number-input/input";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import countryFlags from "react-phone-number-input/flags";
import countryLabels from "react-phone-number-input/locale/en.json";
import {
  Calendar01Icon,
  Home02Icon,
  PencilIcon,
  PhoneIcon,
  Shield01Icon,
  UserIcon,
} from "@animateicons/react/huge";
import { GENDERS } from "./datas/data";
import { Separator } from "../ui/separator";
import { PincodeField } from "./components/PincodeField";
import { SelectField } from "./components/SelectField";
import { SearchSelect } from "./components/SearchSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getBloodGroupMaster,
  selectBloodGroupMasterData,
  selectBloodGroupMasterState,
} from "@/store/slices/masters/getBloodGroupmasterSlice";

const toE164PhoneValue = (value, country = "IN") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  if (raw.startsWith("+")) {
    return `+${digits}`;
  }

  const dialCode = String(getCountryCallingCode(country || "IN") || "");
  return dialCode ? `+${dialCode}${digits}` : `+${digits}`;
};

const getLocalPhoneDigits = (value, country = "IN") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  const dialCode = String(getCountryCallingCode(country || "IN") || "");
  if (raw.startsWith("+") && dialCode && digits.startsWith(dialCode)) {
    return digits.slice(dialCode.length);
  }

  return digits;
};

export const IndividualDetails = ({
  form,
  errors,
  onChange,
  lockedIdentifierField,
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
  const dispatch = useAppDispatch();
  const bloodGroupMasterData = useAppSelector(selectBloodGroupMasterData);
  const bloodGroupMasterState = useAppSelector(selectBloodGroupMasterState);

  useEffect(() => {
    if (bloodGroupMasterState?.loading) return;
    if (Array.isArray(bloodGroupMasterData) && bloodGroupMasterData.length > 0) {
      return;
    }

    dispatch(getBloodGroupMaster());
  }, [dispatch, bloodGroupMasterData, bloodGroupMasterState?.loading]);

  const currentBloodGroupValue = String(form?.bloodGroup || "").trim();

  const bloodGroupOptions = useMemo(() => {
    const normalized = (Array.isArray(bloodGroupMasterData)
      ? bloodGroupMasterData
      : []
    )
      .map((item) => {
        if (typeof item === "string") {
          const value = item.trim();
          return value ? { value, label: value } : null;
        }

        if (!item || typeof item !== "object") return null;

        const rawValue =
          item.blood_group_id ??
          item.blood_group_master_id ??
          item.value ??
          item.id ??
          item.code ??
          item.name ??
          item.label ??
          item.blood_group_name ??
          item.group;
        const rawLabel =
          item.blood_group_name ??
          item.label ??
          item.name ??
          item.value ??
          item.bloodGroupName ??
          item.group ??
          item.code ??
          item.id;

        const value = String(rawValue ?? "").trim();
        const label = String(rawLabel ?? value).trim();

        if (!value) return null;
        return { value, label: label || value };
      })
      .filter(Boolean)
      .filter(
        (option, index, array) =>
          array.findIndex((candidate) => candidate.value === option.value) ===
          index,
      );

    if (
      currentBloodGroupValue &&
      !normalized.some((option) => option.value === currentBloodGroupValue)
    ) {
      normalized.push({ value: currentBloodGroupValue, label: currentBloodGroupValue });
    }

    return normalized;
  }, [bloodGroupMasterData, currentBloodGroupValue]);

  const handleResidentPincodeChange = (field, value) => {
    const nextValue =
      field === "resident_pincode"
        ? value.replace(/[^0-9\s]/g, "")
        : value;
    onChange(field, nextValue);
  };

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const formRef = useRef(form);
  const mobileCountrySelectRef = useRef(null);
  const alternateCountrySelectRef = useRef(null);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const [mobileCountry, setMobileCountry] = useState("IN");
  const [alternateCountry, setAlternateCountry] = useState("IN");

  const handlePhoneChange = useCallback((field, value, country = "IN") => {
    const localDigits = getLocalPhoneDigits(value, country);
    const dialCode = String(getCountryCallingCode(country || "IN") || "");
    const nextValue = localDigits ? `+${dialCode}${localDigits}` : "";
    const currentValue = toE164PhoneValue(formRef.current[field], country);

    if (currentValue !== nextValue) {
      onChangeRef.current(field, nextValue);
    }
  }, []);

  const handleMobilePhoneChange = useCallback(
    (value) => handlePhoneChange("mobile_number", value, mobileCountry),
    [handlePhoneChange, mobileCountry],
  );
  const handleAlternatePhoneChange = useCallback(
    (value) => handlePhoneChange("alternate_mobile_number", value, alternateCountry),
    [alternateCountry, handlePhoneChange],
  );

  const countryOptions = useMemo(
    () =>
      getCountries().map((code) => ({
        code,
        label: countryLabels[code] || code,
        dialCode: `+${getCountryCallingCode(code)}`,
      })),
    [],
  );

  const selectedMobileCountry =
    countryOptions.find((item) => item.code === mobileCountry) ?? null;
  const selectedAlternateCountry =
    countryOptions.find((item) => item.code === alternateCountry) ?? null;
  const MobileFlagIcon = selectedMobileCountry
    ? countryFlags[selectedMobileCountry.code]
    : null;
  const AlternateFlagIcon = selectedAlternateCountry
    ? countryFlags[selectedAlternateCountry.code]
    : null;

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
        {/* Temporary: email field hidden in UI */}
        <div className="min-w-0">
          <label htmlFor="mobile_number" className="mb-2 block text-sm font-semibold text-foreground">
            Mobile number <span className="text-accent" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <PhoneIcon
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <div
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 pl-11 text-sm text-foreground transition focus-within:border-accent",
                errors.mobile_number && "border-destructive",
                lockedIdentifierField === "mobile_number" &&
                  "cursor-not-allowed border-dashed bg-muted/50 text-ink-soft",
              )}
            >
              <div
                className="relative inline-flex items-center cursor-pointer"
                onClick={() => {
                  if (lockedIdentifierField === "mobile_number") return;
                  mobileCountrySelectRef.current?.click();
                  mobileCountrySelectRef.current?.focus();
                }}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-muted/40 px-1"
                  title={selectedMobileCountry?.label || "Country"}
                >
                  {MobileFlagIcon ? (
                    <MobileFlagIcon title={selectedMobileCountry?.label || "Country"} className="h-4 w-5 rounded-xs" />
                  ) : (
                    <span className="text-[10px] font-semibold text-ink-soft">--</span>
                  )}
                </span>
                <select
                  ref={mobileCountrySelectRef}
                  aria-label="Select country code"
                  value={mobileCountry}
                  onChange={(event) => {
                    const nextCountry = event.target.value;
                    const localDigits = getLocalPhoneDigits(
                      formRef.current.mobile_number,
                      mobileCountry,
                    );

                    setMobileCountry(nextCountry);

                    if (!localDigits) {
                      onChangeRef.current("mobile_number", "");
                      return;
                    }

                    const nextDialCode = String(
                      getCountryCallingCode(nextCountry || "IN") || "",
                    );
                    onChangeRef.current(
                      "mobile_number",
                      `+${nextDialCode}${localDigits}`,
                    );
                  }}
                  disabled={lockedIdentifierField === "mobile_number"}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  {countryOptions.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      title={`${country.label} (${country.dialCode})`}
                    >
                      {country.code} {country.dialCode}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-ink-soft/50">
                  ▾
                </span>
              </div>
              <PhoneInput
                id="mobile_number"
                name="mobile_number"
                country={mobileCountry}
                international={false}
                value={toE164PhoneValue(form.mobile_number, mobileCountry)}
                onChange={handleMobilePhoneChange}
                placeholder="Enter phone number"
                autoComplete="tel"
                readOnly={lockedIdentifierField === "mobile_number"}
                aria-required="true"
                aria-invalid={Boolean(errors.mobile_number)}
                aria-describedby={errors.mobile_number ? "mobile_number-error" : undefined}
                className="w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-ink-soft/60"
              />
            </div>
          </div>
          {errors.mobile_number && (
            <p id="mobile_number-error" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.mobile_number}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label htmlFor="alternate_mobile_number" className="mb-2 block text-sm font-semibold text-foreground">
            Alternate mobile number
          </label>
          <div className="relative">
            <PhoneIcon
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <div
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 pl-11 text-sm text-foreground transition focus-within:border-accent",
                errors.alternate_mobile_number && "border-destructive",
              )}
            >
              <div
                className="relative inline-flex items-center cursor-pointer"
                onClick={() => {
                  alternateCountrySelectRef.current?.click();
                  alternateCountrySelectRef.current?.focus();
                }}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-muted/40 px-1"
                  title={selectedAlternateCountry?.label || "Country"}
                >
                  {AlternateFlagIcon ? (
                    <AlternateFlagIcon title={selectedAlternateCountry?.label || "Country"} className="h-4 w-5 rounded-xs" />
                  ) : (
                    <span className="text-[10px] font-semibold text-ink-soft">--</span>
                  )}
                </span>
                <select
                  ref={alternateCountrySelectRef}
                  aria-label="Select alternate country code"
                  value={alternateCountry}
                  onChange={(event) => {
                    const nextCountry = event.target.value;
                    const localDigits = getLocalPhoneDigits(
                      formRef.current["alternate_mobile_number"],
                      alternateCountry,
                    );

                    setAlternateCountry(nextCountry);

                    if (!localDigits) {
                      onChangeRef.current("alternate_mobile_number", "");
                      return;
                    }

                    const nextDialCode = String(
                      getCountryCallingCode(nextCountry || "IN") || "",
                    );
                    onChangeRef.current(
                      "alternate_mobile_number",
                      `+${nextDialCode}${localDigits}`,
                    );
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  {countryOptions.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      title={`${country.label} (${country.dialCode})`}
                    >
                      {country.code} {country.dialCode}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-ink-soft/50">
                  ▾
                </span>
              </div>
              <PhoneInput
                id="alternate_mobile_number"
                name="alternate_mobile_number"
                country={alternateCountry}
                international={false}
                value={toE164PhoneValue(form.alternate_mobile_number, alternateCountry)}
                onChange={handleAlternatePhoneChange}
                placeholder="Enter phone number"
                autoComplete="tel"
                aria-required="false"
                aria-invalid={Boolean(errors.alternate_mobile_number)}
                aria-describedby={errors.alternate_mobile_number ? "alternate_mobile_number-error" : undefined}
                className="w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-ink-soft/60"
              />
            </div>
          </div>
          {errors.alternate_mobile_number && (
            <p id="alternate_mobile_number-error" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.alternate_mobile_number}
            </p>
          )}
        </div>
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
            <SearchSelect
              id="blood_group_id"
              name="blood_group_id"
              label="Blood Group"
              placeholder="Select blood group"
              searchPlaceholder="Search blood group"
              value={form.blood_group_id}
              onChange={onChange}
              options={bloodGroupOptions}
              icon={Shield01Icon}
              error={errors.blood_group_id}
              required={false}
              disabled={bloodGroupMasterState?.loading}
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
            Where you live - used for the start-line city grouping and prize
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
                onChange={handleResidentPincodeChange}
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
