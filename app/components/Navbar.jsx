"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import gsap from "gsap";
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
const MARATHON_DISPLAY_DATE = new Date(MARATHON_DATE).toLocaleDateString(
  "en-IN",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
);
import Image from "next/image";
import {
  ArrowRight02Icon,
  Cancel01Icon,
  FilterAddIcon,
  Menu01Icon,
} from "@animateicons/react/huge";
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
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubnav, setOpenSubnav] = useState(null);
  const leaveTimeoutRef = useRef(null);
  const menuButtonRef = useRef(null);
  const topBarRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const isNavHiddenRef = useRef(false);

  useEffect(() => {
    const topBarNode = topBarRef.current;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nextScrolled = currentScrollY > 30;
      setScrolled((currentScrolled) =>
        currentScrolled === nextScrolled ? currentScrolled : nextScrolled,
      );

      if (!topBarRef.current) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (mobileMenuOpen) {
        gsap.to(topBarRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        isNavHiddenRef.current = false;
        setIsTopBarHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= 8) {
        if (isNavHiddenRef.current) {
          gsap.to(topBarRef.current, {
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          isNavHiddenRef.current = false;
          setIsTopBarHidden(false);
        }
      } else if (delta > 8 && !isNavHiddenRef.current) {
        gsap.to(topBarRef.current, {
          y: -40,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
        isNavHiddenRef.current = true;
        setIsTopBarHidden(true);
      } else if (delta < -8 && isNavHiddenRef.current) {
        gsap.to(topBarRef.current, {
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
        isNavHiddenRef.current = false;
        setIsTopBarHidden(false);
      }

      lastScrollYRef.current = Math.max(currentScrollY, 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (topBarNode) gsap.killTweensOf(topBarNode);
    };
  }, [mobileMenuOpen]);

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
      {/* Spacer so the fixed stacked bars never overlap page content */}
      <div className="h-19 sm:h-30" aria-hidden="true" />
      <div
        ref={topBarRef}
        className="fixed top-0 left-0 right-0 z-50 hidden border-b border-accent/35 bg-primary text-primary-foreground sm:block"
      >
        <div className="mx-auto flex h-10 w-full max-w-content items-center justify-center gap-4 px-3 sm:px-4 lg:px-6 xl:px-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs">
            Sudharva 2027
          </p>
           <CountdownTimer
              target={MARATHON_DATE}
              variant="navbar"
              className="hidden 2xl:inline-flex rounded-xl border border-accent/30 bg-background/70 px-0!"
            />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs">
             {MARATHON_DISPLAY_DATE}
          </p>
          {/* <Link
            href="/register"
            className="inline-flex items-center rounded-md border border-primary-foreground/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-primary-foreground/10 sm:px-3 sm:text-xs"
          >
            Register Now
          </Link> */}
        </div>
      </div>
      <header
        onKeyDown={(event) => {
          if (event.key === "Escape" && mobileMenuOpen) {
            setMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }
        }}
        className={`fixed top-0 left-0 right-0 z-40 h-19 border-b transition-all duration-300 sm:h-20 ${
          isTopBarHidden ? "sm:top-0" : "sm:top-10"
        } ${
          scrolled
            ? "border-border bg-surface/95 shadow-md backdrop-blur-md"
            : "border-border/60 bg-surface/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-content items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 lg:px-6 xl:px-10">
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
            className="hidden items-center gap-5 text-sm font-semibold tracking-wide text-ink-soft xl:flex 2xl:gap-8"
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
                          150,
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
                          style={{
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
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
          <div className="relative hidden shrink-0 items-center gap-2 overflow-visible rounded-2xl border border-accent/30 bg-linear-to-r from-accent/18 via-primary/10 to-accent/18 p-2 shadow-[0_14px_32px_-20px_color-mix(in_srgb,var(--accent)_65%,transparent)] backdrop-blur-sm xl:flex">
            {/* <CountdownTimer
              target={MARATHON_DATE}
              variant="navbar"
              className="hidden 2xl:inline-flex rounded-xl border border-accent/30 bg-background/70 px-2.5"
            /> */}
            <ThemeToggle />
            <RainbowButton
              asChild
              variant="accent"
              size="default"
              className="group h-11 shrink-0 border border-accent/35 px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-400 ease-out hover:border-accent"
            >
              <Link
                href="/register"
                className="group inline-flex h-full shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap"
              >
                {/* <span className="max-w-0 overflow-hidden whitespace-nowrap text-[11px] opacity-0 transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:mr-2 group-hover:max-w-35 group-hover:opacity-100"> */}
                Register
                {/* </span> */}
                {/* <span className="text-base leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:scale-[1.06]" aria-hidden="true"> */}
                <ArrowRight02Icon />
                {/* </span> */}
              </Link>
            </RainbowButton>
            <RainbowButton
              asChild
              variant=""
              size="default"
              className="h-11 shrink-0 border border-accent/35 px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-400 ease-out hover:border-accent"
            >
              <Link
                href="/login"
                className="inline-flex h-full items-center justify-center gap-2 whitespace-nowrap"
              >
                <FilterAddIcon
                  size={18}
                  duration={1}
                  color="currentColor"
                />
                Login
              </Link>
            </RainbowButton>
            {/* <span className="pointer-events-none absolute -bottom-3 right-4 rounded-full border border-accent/35 bg-surface px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent shadow-sm">
              Sudharva 2027
            </span> */}
          </div>

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:hidden">
            <ThemeToggle />
            <RainbowButton
              asChild
              variant="accent"
              size="sm"
              className="h-9 min-w-10 shrink-0 px-2 py-1.5 text-xs font-bold uppercase sm:min-w-21 sm:px-3"
            >
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Register"
                className="inline-flex h-full items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <ArrowRight02Icon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Register</span>
              </Link>
            </RainbowButton>
            <RainbowButton
              asChild
              variant="default"
              size="sm"
              className="h-9 min-w-10 shrink-0 px-2 py-1.5 text-xs font-bold uppercase sm:min-w-21 sm:px-3"
            >
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Login"
                className="inline-flex h-full items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <FilterAddIcon size={16} duration={1} color="currentColor" />
                <span className="sr-only sm:not-sr-only">Login</span>
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
            className="absolute left-0 right-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-surface shadow-lg xl:hidden"
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
                <div
                  key={link.href}
                  className="border-b border-border/40 last:border-b-0"
                >
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
                        ),
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
