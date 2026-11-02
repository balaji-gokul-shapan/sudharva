"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { EventSubnav } from "@/components/animation/EventSubnav";
import { OverviewSubnav } from "@/components/animation/OverviewSubnav";
import { LinksSubnav } from "@/components/animation/LinksSubnav";
import { CaretDownIcon } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { CountdownTimer } from "@/components/utilities/CountdownTimer";
// import { EVENT_SUBNAV, OVERVIEW_SUBNAV } from "@/app/datas/homepage/data";
import Link from "next/link";

// Example: "2026-12-14T05:30:00+05:30" (IST morning slot).
const MARATHON_DATE = "2027-01-24T05:30:00+05:30";
import Image from "next/image";
import { Cancel01Icon, Menu01Icon } from "@animateicons/react/huge";
import { EVENT_SUBNAV, OVERVIEW_SUBNAV } from "../datas/homepage/data";

/* ------------------------------------------------------------------ */
/*  NavSubnav — dispatches to the right dropdown for a nav link        */
/* ------------------------------------------------------------------ */

function NavSubnav({ type, link, leaveTimeoutRef, setOpenSubnav }) {
  const props = { link, leaveTimeoutRef, setOpenSubnav };

  if (type === "overview") return <OverviewSubnav {...props} />;
  if (type === "event") return <EventSubnav {...props} />;
  if (type === "links") return <LinksSubnav {...props} />;

  return null;
}

const NAV_LINKS = [
  { label: "Home", href: "/", decoration: "decoration-primary" },
  {
    label: "Event Overview",
    href: "#overview",
    decoration: "decoration-accent",
    subnavType: "overview",
  },
  { label: "Sudharva 2027", href: "/event", decoration: "decoration-accent" },
  {
    label: "Event Categories",
    href: "#event-categories",
    decoration: "decoration-primary",
    subnavType: "event",
  },
  // { label: "Our Partners", href: "#partners", decoration: "decoration-primary" },
  {
    label: "Contact",
    href: "#contact",
    decoration: "decoration-accent",
    subnavType: "links",
    subnav: [
      { label: "Get in Touch", href: "#contact" },
      { label: "Email Us", href: "mailto:sudharvarun@yahoo.com" },
      { label: "Call Us", href: "tel:+91 8445505533" },
    ],
  },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubnav, setOpenSubnav] = useState(null);
  const leaveTimeoutRef = useRef(null);
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

  // Clear pending subnav-close timeout on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Spacer so the fixed header never overlaps page content */}
      <div className="h-19 sm:h-20" aria-hidden="true" />
      <header
        onKeyDown={(event) => {
          if (event.key === "Escape" && mobileMenuOpen) {
            setMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }
        }}
        className={`fixed top-0 left-0 right-0 z-40 h-19 border-b transition-all duration-300 sm:h-20 ${
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
            {NAV_LINKS.map((link, index) => {
              const isOpen = openSubnav === index;
              const hasSubnav = Boolean(link.subnavType);
              return (
                <div key={link.href} className="inline-block">
                  <div
                    className="relative inline-flex"
                    onMouseEnter={() => {
                      if (leaveTimeoutRef.current) {
                        clearTimeout(leaveTimeoutRef.current);
                        leaveTimeoutRef.current = null;
                      }
                      if (hasSubnav) setOpenSubnav(index);
                    }}
                    onMouseLeave={() => {
                      if (hasSubnav) {
                        leaveTimeoutRef.current = setTimeout(
                          () => setOpenSubnav(null),
                          150
                        );
                      }
                    }}
                  >
                    <a
                      href={link.href}
                      className={`whitespace-nowrap underline-offset-8 decoration-2 transition-colors hover:text-ink hover:underline flex items-center ${link.decoration}`}
                    >
                      {link.label}
                      {hasSubnav && (
                        <CaretDownIcon
                          size={14}
                          className="ml-1 text-ink-soft transition-transform duration-200"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      )}
                    </a>
                    <AnimatePresence>
                      {isOpen && hasSubnav && (
                        <NavSubnav
                          key={`subnav-${link.subnavType}`}
                          type={link.subnavType}
                          link={link}
                          leaveTimeoutRef={leaveTimeoutRef}
                          setOpenSubnav={setOpenSubnav}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
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
                <div key={link.href} className="border-b border-border/40 last:border-b-0">
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2.5 transition-colors hover:bg-muted hover:text-primary"
                  >
                    {link.label}
                  </a>

                  {/* Nested subnav links (mobile) */}
                  {link.subnavType === "overview" && (
                    <ul className="mb-2 ml-3 space-y-0.5 border-l border-border pl-3">
                      {OVERVIEW_SUBNAV.map((item) => (
                        <li key={item.id}>
                          <a
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-muted hover:text-primary"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {link.subnavType === "event" && (
                    <ul className="mb-2 ml-3 space-y-0.5 border-l border-border pl-3">
                      {EVENT_SUBNAV.map((item) =>
                        item.href.startsWith("/") ? (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-muted hover:text-primary"
                            >
                              {item.label}
                              <span className="ml-2 text-xs text-ink-soft/70">
                                {item.Amount}
                              </span>
                            </Link>
                          </li>
                        ) : (
                          <li key={item.id}>
                            <a
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-muted hover:text-primary"
                            >
                              {item.label}
                              <span className="ml-2 text-xs text-ink-soft/70">
                                {item.Amount}
                              </span>
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  )}

                  {link.subnavType === "links" && (
                    <ul className="mb-2 ml-3 space-y-0.5 border-l border-border pl-3">
                      {link.subnav.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-muted hover:text-primary"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

