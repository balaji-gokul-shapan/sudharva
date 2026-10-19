"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getYearSnapshot = () => new Date().getFullYear().toString();
const getServerYearSnapshot = () => "";

export default function CurrentYear() {
  return useSyncExternalStore(subscribe, getYearSnapshot, getServerYearSnapshot);
}
