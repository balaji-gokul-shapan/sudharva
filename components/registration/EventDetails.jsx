import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TshirtSizeGuideModal } from "./TshirtSizeGuideModal";
import {
  Check,
  Home01Icon,
  Home02Icon,
  PhoneIcon,
  Trophy,
  UserIcon,
} from "@animateicons/react/huge";
import { usePincodeLookup } from "./PincodeContext";
import { Field } from "./components/Field";
import {
  CATEGORIES,
  CATEGORY_META_RULES,
  SHIRT_SIZES,
  DEFAULT_CATEGORY_META,
} from "./datas/data";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { PincodeField } from "./components/PincodeField";
import { SelectField } from "./components/SelectField";
import { AnimatedShinyText } from "../animation/AnimatedShinyText";
import PhoneInput from "react-phone-number-input/input";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import countryFlags from "react-phone-number-input/flags";
import countryLabels from "react-phone-number-input/locale/en.json";

const resolveCategoryMeta = (name = "") => {
  const normalizedName = String(name).toLowerCase();
  const matchedRule = CATEGORY_META_RULES.find((rule) =>
    rule.matches.some((token) => normalizedName.includes(token)),
  );

  return matchedRule || DEFAULT_CATEGORY_META;
};

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

export const EventDetails = ({
  form,
  errors,
  onChange,
  masterData,
  fetchMasterData,
}) => {
  const [emergencyCountry, setEmergencyCountry] = useState("IN");
  const countrySelectRef = useRef(null);
  const [emergencyRelationCustom, setEmergencyRelationCustom] = useState("");
  const [showCustomRelation, setShowCustomRelation] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const countryOptions = useMemo(
    () =>
      getCountries().map((code) => ({
        code,
        label: countryLabels[code] || code,
        dialCode: `+${getCountryCallingCode(code)}`,
      })),
    [],
  );

  const selectedEmergencyCountry =
    countryOptions.find((item) => item.code === emergencyCountry) ?? null;
  const EmergencyFlagIcon = selectedEmergencyCountry
    ? countryFlags[selectedEmergencyCountry.code]
    : null;

  // Memoized so the controlled `value` prop is referentially stable unless
  // the underlying phone number actually changes.
  const emergencyPhoneValue = useMemo(
    () => toE164PhoneValue(form.emergency_contact_mobile, emergencyCountry),
    [emergencyCountry, form.emergency_contact_mobile],
  );

  // Stable callback - reads latest form/onChange via refs so its identity
  // never changes across renders.
  const handlePhoneChange = useCallback((field, value, country = "IN") => {
    const localDigits = getLocalPhoneDigits(value, country);
    const dialCode = String(getCountryCallingCode(country || "IN") || "");
    const nextValue = localDigits ? `+${dialCode}${localDigits}` : "";
    const currentValue = toE164PhoneValue(formRef.current[field], country);

    if (currentValue !== nextValue) {
      onChangeRef.current(field, nextValue);
    }
  }, []);

  // Stable onChange prop for PhoneInput (fixed field name).
  const handleEmergencyPhoneChange = useCallback(
    (value) =>
      handlePhoneChange("emergency_contact_mobile", value, emergencyCountry),
    [emergencyCountry, handlePhoneChange],
  );
  //   (field, value) => {
  //     const raw = String(value || "").trim();
  //     if (!raw) {
  //       onChangeRef.current(field, "");
  //       return;
  //     }

  //     const digits = raw.replace(/\D/g, "");
  //     onChangeRef.current(field, digits ? `+${digits}` : "");
  //   },
  //   [],
  // );

  const useResident = Boolean(form.useResidentAddress);
  const hasResidentAddress = form.entryType !== "corporate";

  const { options } = usePincodeLookup(form.delivery_pincode);

  const getCategoryDetail = (name = "") => resolveCategoryMeta(name).detail;
  const getClassName = (name = "") => resolveCategoryMeta(name).className;
  const getIconClassname = (name = "") =>
    resolveCategoryMeta(name).iconClassName;
  const getSelectedClassName = (name = "") =>
    resolveCategoryMeta(name).selectedClassName;
  const getCategories = (masterData) => {
    const categories =
      masterData?.registration_category?.filter((item) => item.is_active) || [];
    // console.log(categories,"categories3333");
    return categories.map((item) => ({
      id: String(item.id),
      value: String(item.id),
      label: item.name,
      detail: getCategoryDetail(item.name),
      distance: item.distance,
      price: Number(item.fee),
      minAge: item.min_age,
      maxAge: item.max_age,
      selected: getSelectedClassName(item.name),
      icon: getIconClassname(item.name),
      className: getClassName(item.name),
    }));
  };

  const mappedMasterCategories = getCategories(masterData);
  // console.log(masterData,"masterData3333333333");

  const fallbackCategories = CATEGORIES.map((item) => ({
    ...item,
    id: String(item.id ?? item.value),
    value: String(item.value ?? item.id),
  }));
  const categoriesToRender =
    mappedMasterCategories.length > 0
      ? mappedMasterCategories
      : fallbackCategories;
  // console.log(categoriesToRender,"categoriesToRender");
  // console.log(mappedMasterCategories,"mappedMasterCategories");

  const shirtSizesFromMaster =
    masterData?.tshirt_size
      ?.filter((item) => item.is_active)
      .map((item) => ({
        id: String(item.id),
        value: String(item.id),
        label: String(
          item.value || item.name || item.size || item.label || "",
        ).trim(),
      }))
      .filter((item) => item.label) || [];

  const fallbackShirtSizes = SHIRT_SIZES.map((size) => ({
    id: String(size),
    value: String(size),
    label: String(size),
  }));

  const shirtSizesToRender =
    shirtSizesFromMaster.length > 0 ? shirtSizesFromMaster : fallbackShirtSizes;

  const isGettingDetails = Array.isArray(options) && options.length > 0;

  const getOptions = (key) => {
    if (!isGettingDetails) return [];

    return [
      ...new Set(options.map((option) => option[key]).filter(Boolean)),
    ].map((value) => ({
      value,
      label: value,
    }));
  };

  const citiesForDelivery = getOptions("city");
  const statesForDelivery = getOptions("state");
  const districtsForDelivery = getOptions("district");
  const taluksForDelivery = getOptions("taluk");

  return (
    <div className="space-y-7 overflow-x-hidden">
      <fieldset className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-b from-background via-background to-surface/70 p-4 shadow-sm sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/10 blur-2xl"
        />
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
        {categoriesToRender.length === 0 &&
          typeof fetchMasterData === "function" && (
            <button
              type="button"
              onClick={fetchMasterData}
              className="mb-3 text-xs font-semibold text-accent underline"
            >
              Retry loading events
            </button>
          )}
        <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesToRender.map((category) => {
            const selected = String(form.runner_category_id) === category.id;

            return (
              <label
                key={category.id}
                className={cn(
                  "group relative flex h-full min-h-48 w-full cursor-pointer flex-col rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                  selected ? category.selected : category.className,
                  "has-focus-visible:ring-accent/15",
                )}
              >
                <input
                  id={`category-${category.id}`}
                  type="radio"
                  name="runner_category_id"
                  value={category.value}
                  checked={selected}
                  onChange={() =>
                    onChange("runner_category_id", category.value)
                  }
                  aria-describedby={
                    errors.runner_category_id ? "category-error" : undefined
                  }
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-0 h-1 bg-linear-to-r from-transparent via-accent/60 to-transparent opacity-70"
                />
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-surface shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Trophy
                    size={22}
                    weight="duotone"
                    className={category.icon}
                  />
                </span>
                <span className="max-w-full text-balance font-bold text-foreground wrap-break-word">
                  {category.label}
                </span>
                <span className="mt-1 max-w-full text-balance text-xs leading-relaxed text-ink-soft wrap-break-word">
                  {category.detail}
                </span>
                {category.price ? (
                  // <span className="mt-1 text-lg text-ink font-bold">
                  //   ₹{category.price}
                  // </span>
                  <AnimatedShinyText className="inline-flex my-2 font-bold items-center justify-center gap-1 px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    ₹{category.price}
                  </AnimatedShinyText>
                ) : null}
                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                  <span className="rounded-full bg-surface/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                    {category.distance}
                  </span>
                  {selected ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                      Selected
                    </span>
                  ) : null}
                </div>
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
        {errors.runner_category_id && (
          <p
            id="category-error"
            className="mt-2 text-xs font-medium text-destructive"
          >
            {errors.runner_category_id}
          </p>
        )}
      </fieldset>

      <fieldset className="rounded-2xl border border-border/60 bg-linear-to-b from-background to-surface/50 p-4 shadow-sm sm:p-5">
        <legend className="flex items-center justify-between text-sm font-semibold text-foreground w-full">
          <div className="flex items-center gap-1 pr-3">
            Event T-shirt size{" "}
            <span className="text-accent" aria-hidden="true">
              *
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="text-xs font-medium text-accent underline hover:text-accent/80"
          >
            View guide
          </button>
        </legend>
        <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-soft">
          Run in a size that fits you comfortably - we order in small batches,
          so this choice is final once the race closes.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {shirtSizesToRender.map((sizeOption) => (
            <label
              key={sizeOption.value}
              className={cn(
                "relative flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition duration-200",
                String(form.tshirt_size_id) === sizeOption.value
                  ? "border-accent bg-accent text-accent-foreground shadow-md"
                  : "border-border bg-background text-ink-soft hover:border-accent/50 hover:bg-accent/5",
                "has-focus-visible:ring-accent/15",
              )}
            >
              <input
                id={`shirt-${sizeOption.value}`}
                type="radio"
                name="tshirt_size_id"
                value={sizeOption.value}
                checked={String(form.tshirt_size_id) === sizeOption.value}
                onChange={() => onChange("tshirt_size_id", sizeOption.value)}
                aria-describedby={
                  errors.tshirt_size_id ? "shirt-error" : undefined
                }
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
              />
              {sizeOption.label}
            </label>
          ))}
        </div>
        {errors.tshirt_size_id && (
          <p
            id="shirt-error"
            className="mt-2 text-xs font-medium text-destructive"
          >
            {errors.tshirt_size_id}
          </p>
        )}
      </fieldset>

      <div className="rounded-2xl border border-border/60 bg-linear-to-b from-background to-surface/50 p-4 shadow-sm sm:p-5">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <span className="sr-only">Emergency Contact Details</span>
          <Field
            id="emergency_contact_name"
            name="emergency_contact_name"
            label="Contact name"
            placeholder="e.g. Priya Kumar"
            value={form.emergency_contact_name}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
              onChange("emergency_contact_name", value);
            }}
            icon={UserIcon}
            error={errors.emergency_contact_name}
            autoComplete="off"
            className="sm:col-span-2 lg:col-span-5"
          />
          <div className="min-w-0 sm:col-span-2 lg:col-span-4">
            <label
              htmlFor="emergency_contact_mobile"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
               Contact Phone Number{" "}
              <span className="text-accent" aria-hidden="true">
                *
              </span>
            </label>
            <div className="relative">
              <PhoneIcon
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <div
                className={cn(
                  "flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1.5 pl-11 text-sm text-foreground transition focus-within:border-accent sm:h-12 sm:flex-nowrap sm:py-0",
                  errors.emergency_contact_mobile && "border-destructive",
                )}
              >
                <div
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={() => {
                    countrySelectRef.current?.click();
                    countrySelectRef.current?.focus();
                  }}
                >
                  <span
                    className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-muted/40 px-1"
                    title={selectedEmergencyCountry?.label || "Country"}
                  >
                    {EmergencyFlagIcon ? (
                      <EmergencyFlagIcon
                        title={selectedEmergencyCountry?.label || "Country"}
                        className="h-4 w-5 rounded-xs"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold text-ink-soft">
                        --
                      </span>
                    )}
                  </span>
                  <select
                    ref={countrySelectRef}
                    aria-label="Select emergency country code"
                    value={emergencyCountry}
                    onChange={(event) => {
                      const nextCountry = event.target.value;
                      const localDigits = getLocalPhoneDigits(
                        formRef.current.emergency_contact_mobile,
                        emergencyCountry,
                      );

                      setEmergencyCountry(nextCountry);

                      if (!localDigits) {
                        onChangeRef.current("emergency_contact_mobile", "");
                        return;
                      }

                      const nextDialCode = String(
                        getCountryCallingCode(nextCountry || "IN") || "",
                      );
                      onChangeRef.current(
                        "emergency_contact_mobile",
                        `+${nextDialCode}${localDigits}`,
                      );
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-ink-soft/50">
                    ▾
                  </span>
                </div>
                <PhoneInput
                  id="emergency_contact_mobile"
                  name="emergency_contact_mobile"
                  country={emergencyCountry}
                  international={false}
                  value={emergencyPhoneValue}
                  onChange={handleEmergencyPhoneChange}
                  placeholder="Enter phone number"
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={Boolean(errors.emergency_contact_mobile)}
                  aria-describedby={
                    errors.emergency_contact_mobile
                      ? "emergency-contact-mobile-error"
                      : undefined
                  }
                  className="min-w-0 grow basis-35 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-ink-soft/60"
                />
              </div>
            </div>
            {errors.emergency_contact_mobile && (
              <p
                id="emergency-contact-mobile-error"
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {errors.emergency_contact_mobile}
              </p>
            )}
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <SelectField
              id="emergency_contact_relationship"
              name="emergency_contact_relationship"
              label="Contact relation"
              value={
                form.emergency_contact_relationship === "others"
                  ? "others"
                  : form.emergency_contact_relationship
              }
              onChange={(name, value) => {
                onChange(name, value);
                if (value === "others") {
                  setShowCustomRelation(true);
                } else {
                  setShowCustomRelation(false);
                  setEmergencyRelationCustom("");
                }
              }}
              options={[
                { value: "father", label: "Father" },
                { value: "mother", label: "Mother" },
                { value: "brother", label: "Brother" },
                { value: "sister", label: "Sister" },
                { value: "spouse", label: "Spouse" },
                { value: "friend", label: "Friend" },
                { value: "others", label: "Others" },
              ]}
              placeholder="Select relation"
              required
              error={errors.emergency_contact_relationship}
            />
            {showCustomRelation && (
              <div className="mt-2">
                <label
                  htmlFor="emergency_contact_relationship_custom"
                  className="mb-1 block text-xs font-semibold text-foreground"
                >
                  Please specify relation
                </label>
                <input
                  id="emergency_contact_relationship_custom"
                  name="emergency_contact_relationship_custom"
                  type="text"
                  placeholder="e.g. Cousin, Guardian"
                  value={emergencyRelationCustom}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setEmergencyRelationCustom(value);
                    onChange("emergency_contact_relationship", value);
                  }}
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-accent/10"
                />
              </div>
            )}
            {/* {errors.emergency_contact_relationship && (
              <p
                id="emergency-contact-relation-error"
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {errors.emergency_contact_relationship}
              </p>
            )} */}
          </div>
        </div>
      </div>

      {/* <fieldset>
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
            id="delivery_address_line1"
            name="delivery_address_line1"
            label="Address Line 1"
            placeholder="e.g. 123 Main St"
            value={form.delivery_address_line1}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.delivery_address_line1}
            autoComplete="off"
            readOnly={useResident}
          />
          <Field
            id="delivery_address_line2"
            name="delivery_address_line2"
            label="Address Line 2"
            placeholder="e.g. Apt 4B"
            value={form.delivery_address_line2}
            onChange={onChange}
            icon={Home01Icon}
            error={errors.delivery_address_line2}
            autoComplete="off"
            required={false}
            readOnly={useResident}
          />
          <PincodeField
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
            cityField="delivery_city"
            cityValue={form.delivery_city}
            stateField="delivery_state"
            stateValue={form.delivery_state}
            talukField="delivery_taulk"
            talukValue={form.delivery_taulk}
            districtField="delivery_district"
            districtValue={form.delivery_district}
          />
     
          <SelectField
            id="delivery_city"
            name="delivery_city"
            label="City"
            value={form.delivery_city}
            onChange={onChange}
            options={citiesForDelivery}
            placeholder={citiesForDelivery.length > 0 ? "Select city" : "Enter pincode first"}
            icon={Home01Icon}
            error={errors.delivery_city}
            disabled={citiesForDelivery.length === 0}
          />
          <SelectField
            id="delivery_taulk"
            name="delivery_taulk"
            label="Taulk"
            value={form.delivery_taulk}
            onChange={onChange}
            options={taluksForDelivery}
            placeholder={taluksForDelivery.length > 0 ? "Select taulk" : "Enter pincode first"}
            icon={Home01Icon}
            error={errors.delivery_taulk}
            disabled={taluksForDelivery.length === 0}
            required={false}
          />
          <SelectField
            id="delivery_district"
            name="delivery_district"
            label="District"
            value={form.delivery_district}
            onChange={onChange}
            options={districtsForDelivery}
            placeholder={districtsForDelivery.length > 0 ? "Select district" : "Enter pincode first"}
            icon={Home01Icon}
            error={errors.delivery_district}
            disabled={districtsForDelivery.length === 0}
            required={false}
          />
          <SelectField
            id="delivery_state"
            name="delivery_state"
            label="State"
            value={form.delivery_state}
            onChange={onChange}
            options={statesForDelivery}
            placeholder={statesForDelivery.length > 0 ? "Select state" : "Enter pincode first"}
            icon={Home01Icon}
            error={errors.delivery_state}
            disabled={statesForDelivery.length === 0}
          />
        </div>
      </fieldset> */}
      <TshirtSizeGuideModal
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
      />
    </div>
  );
};
