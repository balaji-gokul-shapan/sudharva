"use client";

import { useEffect, useMemo } from "react";
import {
  PINCODE_PATTERN,
  normalizePincode,
} from "@/components/api/getPincode";
import {
  fetchPincodeByCode,
  selectPincodeEntryByCode,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const DEBOUNCE_MS = 400;

// Compatibility wrapper: keeps existing imports/components working
// while the backing implementation is Redux-based.
export function PincodeProvider({ children }) {
  return children;
}

export function usePincodeLookup(pincode, { debounce = DEBOUNCE_MS } = {}) {
  const dispatch = useAppDispatch();
  const normalized = useMemo(() => normalizePincode(pincode), [pincode]);
  const isValid = PINCODE_PATTERN.test(normalized);

  const entry = useAppSelector((state) =>
    selectPincodeEntryByCode(state, normalized),
  );

  useEffect(() => {
    if (!isValid) return undefined;

    const timer = setTimeout(() => {
      dispatch(fetchPincodeByCode({ pincode: normalized }));
    }, debounce);

    return () => clearTimeout(timer);
  }, [dispatch, normalized, isValid, debounce]);

  return {
    loading: entry.status === "loading",
    error: entry.status === "error" ? entry.error : "",
    details: entry.status === "success" ? entry.data : null,
    options: entry.status === "success" ? entry.data?.options ?? [] : [],
    status: entry.status,
    isValid,
    normalized,
  };
}
