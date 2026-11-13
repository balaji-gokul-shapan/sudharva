"use client";

import { useSyncExternalStore } from "react";
import {  MoonIcon, SunIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { Moon01Icon, Sun01Icon } from "@animateicons/react/huge";

const THEME_EVENT = "sudharva:themechange";

export function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

export function subscribeThemeChanges(callback) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = (event) => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.classList.toggle("dark", event.matches);
    }
    callback();
  };

  media.addEventListener("change", handleSystemChange);
  window.addEventListener(THEME_EVENT, callback);

  return () => {
    media.removeEventListener("change", handleSystemChange);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeThemeChanges, isDarkMode, () => false);

  const toggleTheme = () => {
    const nextDark = !isDarkMode();
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <Button
      variant="outline"
      className={cn("rounded-md cursor-pointer")}
      size="icon"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun01Icon  /> : <Moon01Icon />}
    </Button>
  );
}