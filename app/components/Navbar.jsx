"use client";

import { useEffect, useRef, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { CountdownTimer } from "@/components/utilities/CountdownTimer";
import Link from "next/link";

// Configure the race date here â€” accepts an ISO string, Date, or epoch ms.
// Example: "2026-12-14T05:30:00+05:30" (IST morning slot).
const MARATHON_DATE = "2026-11-15T05:30:00+05:30";
import Image from "next/image";
import { Cancel01Icon, Menu01Icon } from "@animateicons/react/huge";

const NAV_LINKS = [
  { label: "Home", href: "#home", decoration: "decoration-primary" },
  {
    label: "Event Overview",
    href: "#overview",
    decoration: "decoration-accent",
    subnav: [
      { label: "5K & 10K Runs", href: "#runs" },
      { label: "Volunteer", href: "#volunteer" },
      { label: "Donate", href: "#donate" },
      { label: "Partners", href: "#partners" },
    ],
  },
  { label: "Join Us", href: "#join", decoration: "decoration-accent" },
  {
    label: "Event Categories",
    href: "#event-categories",
    decoration: "decoration-primary",
    subnav: [
      { label: "5K Run", href: "#5k" },
      { label: "10K Challenge", href: "#10k" },
      { label: "Half Marathon", href: "#half-marathon" },
      { label: "Team Entries", href: "#team" },
    ],
  },
  { label: "Our Partners", href: "#partners", decoration: "decoration-primary" },
  {
    label: "Contact",
    href: "#contact",
    decoration: "decoration-accent",
    subnav: [
      { label: "Get in Touch", href: "#contact-form" },
      { label: "Workshop", href: "#workshop" },
      { label: "Media", href: "#media" },
    ],
  },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const nextScrolled = window.scrollY > 30;
      setScrolled((currentScrolled) =>
        currentScrolled === nextScrolled ? currentScrolled : nextScrolled,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer so the fixed header never overlaps page content */}
      <div className="h-[76px] sm:h-20" aria-hidden="true" />
      <header
        onKeyDown={(event) => {
          if (event.key === "Escape" && mobileMenuOpen) {
            setMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }
        }}
        className={`fixed top-0 left-0 right-0 z-40 h-[76px] border-b transition-all duration-300 sm:h-20 ${
          scrolled
            ? "border-border bg-surface/95 shadow-md backdrop-blur-md"
            : "border-border/60 bg-surface/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-content items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand wordmark */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex shrink-0 flex-col items-center"
          >
            <Image
              src="/image/cta/logo.png"
              alt="Sudharva Logo"
              width={250}
              height={64}
              className="block h-auto w-28 max-w-full min-[375px]:w-32 sm:w-40 lg:w-48"
              sizes="(max-width: 374px) 112px, (max-width: 639px) 128px, (max-width: 1023px) 160px, 192px"
            />
            <span className="mt-0.5 block max-w-full px-1 text-center text-[7px] font-bold uppercase leading-none tracking-[0.12em] text-ink-soft min-[375px]:text-[8px] sm:mt-0 sm:text-[10px]">
              Run Against Diabetes
            </span>
          </Link>

          {/* Zone 2: Desktop nav links */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-sm font-semibold tracking-wide text-ink-soft lg:flex xl:gap-8"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap underline-offset-8 decoration-2 transition-colors hover:text-ink hover:underline ${link.decoration}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <CountdownTimer
              target={MARATHON_DATE}
              variant="navbar"
              className="hidden xl:inline-flex"
            />
            <ThemeToggle />
            <RainbowButton
              asChild
              variant="accent"
              size="default"
              className="shrink-0 px-5 py-2.5 text-sm font-bold uppercase tracking-wider"
            >
              <Link
                href="/register"
                className="group flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap"
              >
                Register Now
              </Link>
            </RainbowButton>
          </div>

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <ThemeToggle />
            <RainbowButton
              asChild
              size="sm"
              className="shrink-0 px-3 py-1.5 text-xs font-bold uppercase"
            >
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer whitespace-nowrap"
              >
                Register
              </Link>
            </RainbowButton>
            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="cursor-pointer p-2 text-ink-soft transition-colors hover:text-ink"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-controls="mobile-navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <Cancel01Icon className="h-6 w-6" />
              ) : (
                <Menu01Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-surface shadow-lg lg:hidden"
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-auto flex w-full max-w-content flex-col gap-1 px-4 py-4 text-base font-semibold text-ink sm:px-6"
            >
              {/* Countdown shown at the top of the mobile menu */}
              <CountdownTimer
                target={MARATHON_DATE}
                variant="navbar"
                className="mb-2 justify-center"
              />
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2.5 transition-colors hover:bg-muted hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

