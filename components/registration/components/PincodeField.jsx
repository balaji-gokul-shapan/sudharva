"use client";

import { useEffect, useRef } from "react";
import { Spinner } from "@phosphor-icons/react";
import { Field } from "./Field";
import { usePincodeLookup } from "../PincodeContext";
import { mapPincodeToLocationFields } from "@/components/api/getPincode";
import { cn } from "@/lib/utils";

/**
 * Pincode input wired to the shared {@link usePincodeLookup} store.
 *
 * - Debounced lookup (handled inside the context).
 * - Auto-fills the location fields (city / state / taluk / district) whenever
 *   a new pincode resolves. The API spells the taluk key as `taluk` while the
 *   form schema uses `taulk`; the rename is handled by
 *   {@link mapPincodeToLocationFields}.
 * - Renders the lookup status and, when the API returns several localities
 *   for the same pincode, a pick-list to choose from.
 */
export const PincodeField = ({
  id,
  name,
  label = "Pin Code",
  placeholder = "e.g. 560001",
  value,
  onChange,
  icon,
  error,
  autoComplete = "postal-code",
  required = true,
  readOnly = false,
  cityField,
  stateField,
  talukField,
  districtField,
  cityValue,
  stateValue,
  talukValue,
  districtValue,
}) => {
  const { loading, error: lookupError, details, options } =
    usePincodeLookup(value);
  const autoFilledRef = useRef(null);
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (lastValueRef.current === value) return;
    lastValueRef.current = value;

    autoFilledRef.current = null;

    if (cityField && cityValue) onChange(cityField, "");
    if (stateField && stateValue) onChange(stateField, "");
    if (talukField && talukValue) onChange(talukField, "");
    if (districtField && districtValue) onChange(districtField, "");
  }, [
    value,
    cityField,
    stateField,
    talukField,
    districtField,
    cityValue,
    stateValue,
    talukValue,
    districtValue,
    onChange,
  ]);


  useEffect(() => {
    if (!details) return;

    const key = `${name}:${details.pincode}`;
    if (autoFilledRef.current === key) return;
    autoFilledRef.current = key;

    const location = mapPincodeToLocationFields(details);
    const localities = options.map((option) =>
      mapPincodeToLocationFields(option),
    );

    // A current value is acceptable when it is empty or still one of the
    // localities resolved for this pincode.
    const isAcceptable = (current, keyName) => {
      if (!current) return true;
      if (!localities.length) return false;
      return localities.some((candidate) => candidate[keyName] === current);
    };

    const sync = (field, current, keyName, resolved) => {
      if (!field) return;
      if (isAcceptable(current, keyName)) return;
      onChange(field, resolved);
    };

    sync(cityField, cityValue, "city", location.city);
    sync(stateField, stateValue, "state", location.state);
    sync(talukField, talukValue, "taulk", location.taulk);
    sync(districtField, districtValue, "district", location.district);
  }, [
    details,
    options,
    name,
    cityField,
    stateField,
    talukField,
    districtField,
    cityValue,
    stateValue,
    talukValue,
    districtValue,
    onChange,
  ]);

  const handlePick = (option) => {
    const location = mapPincodeToLocationFields(option);

    if (cityField) onChange(cityField, location.city || cityValue || "");
    if (stateField) onChange(stateField, location.state || stateValue || "");
    if (talukField) onChange(talukField, location.taulk || talukValue || "");
    if (districtField) {
      onChange(districtField, location.district || districtValue || "");
    }
  };

  const showOptions = options.length > 1;

  return (
    <div className="min-w-0">
      <Field
        id={id}
        name={name}
        label={label}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon={icon}
        error={error}
        autoComplete={autoComplete}
        required={required}
        readOnly={readOnly}
      />

      {loading && (
        <p
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-soft"
          role="status"
          aria-live="polite"
        >
          <Spinner size={12} weight="bold" className="animate-spin" />
          Looking up pincode…
        </p>
      )}

      {!loading && lookupError && (
        <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
          {lookupError}
        </p>
      )}

      {/* {!loading && !lookupError && details && (
        <p className="mt-1.5 text-xs font-medium text-ink-soft">
          {details.city || details.district || details.taluk}
          {details.state ? `, ${details.state}` : ""}
        </p>
      )} */}

      {/* {showOptions && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-ink-soft">
            Multiple localities:
          </span>
          {options.map((option, index) => {
            const optionLabel = [option.city, option.district, option.taluk]
              .filter(Boolean)
              .join(", ");

            return (
              <button
                key={`${option.pincode}-${option.city}-${option.district}-${index}`}
                type="button"
                onClick={() => handlePick(option)}
                className={cn(
                  "rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-ink-soft transition",
                  "hover:border-accent/50 hover:bg-accent/10 hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                )}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      )} */}
    </div>
  );
};
