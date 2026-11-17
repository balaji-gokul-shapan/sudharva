
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

import {
  ArrowRightDoubleIcon,
  FilterAddIcon,
  HandshakeIcon,
  UserAdd01Icon,
} from "@animateicons/react/huge";

import { AuroraText } from "@/components/animation/AuroraText";
import { RainbowButton } from "@/components/animation/rainbowButton";
import {
  Float,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/Reveal";
import { NumberTicker } from "@/components/animation/NumberTicker";
import { heroRuningData, META } from "../../../datas/homepage/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LineShadowText } from "@/components/animation/line-shadow-text";

gsap.registerPlugin(CustomEase, SplitText);

CustomEase.create(
  "stutterEase",
  "M0,0 C0,0 0.052,0.1 0.152,0.1 0.242,0.1 0.299,0.349 0.399,0.349 0.586,0.349 0.569,0.596 0.67,0.624 0.842,0.671 0.95,0.95 1,1"
);

/* ------------------------------------------------------- */
/* SplitText animation helpers                              */
/* ------------------------------------------------------- */

function createSplitTextAnimations(splitInstances) {
  return {
    logoAnimation: (el) => {
      const split = SplitText.create(el, {
        type: "chars",
        smartWrap: true,
        mask: "chars",
      });

      splitInstances.push(split);

      split.chars.forEach((charEl) => {
        const text = charEl.innerText;

        charEl.innerHTML = "";

        const original = document.createElement("div");
        original.className = "og-char";
        original.innerText = text;

        const duplicate = document.createElement("div");
        duplicate.className = "duplicate-char";
        duplicate.innerText = text;

        charEl.appendChild(original);
        charEl.appendChild(duplicate);
      });

      gsap.from(split.chars, {
        yPercent: -100,
        ease: "power2.inOut",
        stagger: {
          each: 0.02,
          from: "random",
        },
        duration: 0.5,
        repeat: 1,
        repeatDelay: 0.75,
      });
    },

    headerAnimation: (el) => {
      const split = SplitText.create(el, {
        type: "chars",
        smartWrap: true,
        mask: "chars",
        charsClass: "header-char",
      });

      splitInstances.push(split);

      gsap.from(split.chars, {
        xPercent: -100,
        ease: "power2.inOut",
        stagger: {
          each: 0.02,
          from: "random",
        },
        duration: 0.5,
      });
    },

    bodyAnimation: (el) => {
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,

        onSplit: (self) => {
          return gsap.from(self.lines, {
            opacity: 0,
            yPercent: -100,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.inOut",
          });
        },
      });

      splitInstances.push(split);
    },
  };
}

function animateTextInScope(scope, selector, textAnimations) {
  const target = scope.querySelector(selector);

  if (!target) return;

  gsap.set(target, {
    visibility: "visible",
  });

  const animationType = target.dataset.textAnim;
  const animation = textAnimations[animationType];

  if (animation) {
    animation(target);
  }
}

/* ------------------------------------------------------- */
/* HeroPreloader                                            */
/* Replays on every full page reload                        */
/* ------------------------------------------------------- */


import dynamic from "next/dynamic";


// ...keep your other imports (icons, Reveal, Stagger, etc.) EXCEPT:
//   remove  `import { Lottie } from "lottie-react"`
//   remove  `import preloaderAnimation from ".../preloader.json"`
//   remove  CustomEase import + CustomEase.create(...)


gsap.registerPlugin(SplitText);

/* ---------- config ---------- */
const DISTANCE_KM = 3;      // shown on the counter
const RUN_SECONDS = 3;    // how long the "race" lasts without sprint taps
const MARKERS = Array.from({ length: DISTANCE_KM + 1 }, (_, i) => i);
const CONFETTI = Array.from({ length: 28 }, (_, i) => i);
const HERO_PRELOADER_STORAGE_KEY = "hero-preloader-seen-v1";

// resets on a full page reload, survives client-side route changes
let hasPlayedThisPageLoad = false;

/* ... createSplitTextAnimations + animateTextInScope stay unchanged ... */

export function HeroPreloader() {
  const scopeRef = useRef(null);

  useEffect(() => {
    const shell = scopeRef.current;
    if (!shell) return;

    const heroImage = document.querySelector(".hero-img img");
    const html = document.documentElement;
    const previousPreloaderState = html.getAttribute("data-hero-preloader");
    let hasSeenPreloader = false;
    try {
      hasSeenPreloader =
        window.localStorage.getItem(HERO_PRELOADER_STORAGE_KEY) === "1";
    } catch {
      hasSeenPreloader = false;
    }
    const shouldSkipPreloader =
      hasPlayedThisPageLoad ||
      previousPreloaderState === "seen" ||
      hasSeenPreloader;

    // Ensure stale CSS/inline styles never keep the preloader hidden on mount.
    html.setAttribute(
      "data-hero-preloader",
      shouldSkipPreloader ? "seen" : "new",
    );
    gsap.set(shell, {
      clearProps: "display,opacity,visibility,pointerEvents",
      display: "block",
      autoAlpha: 1,
      pointerEvents: "auto",
    });

    const revealHeroImmediately = () => {
      [".hero-main-title", ".hero-tagline", ".hero-subtitle", ".hero-body"].forEach((sel) => {
        const node = document.querySelector(sel);
        if (node) gsap.set(node, { visibility: "visible", opacity: 1, clearProps: "transform" });
      });
      const divider = document.querySelector(".hero-divider");
      if (divider) gsap.set(divider, { scaleY: 1, transformOrigin: "top" });
    };

    if (shouldSkipPreloader) {
      hasPlayedThisPageLoad = true;
      html.setAttribute("data-hero-preloader", "seen");
      gsap.set(shell, { display: "none" });
      if (heroImage) gsap.set(heroImage, { scale: 1 });
      revealHeroImmediately();
      return;
    }

    /* ---------- elements ---------- */
    const q = (s) => shell.querySelector(s);
    const panels = shell.querySelectorAll(".pl-panel");
    const content = q(".pl-content");
    const track = q(".pl-track");
    const runner = q(".pl-runner");
    const fill = q(".pl-fill");
    const lane = q(".pl-lane");
    const kmEl = q(".pl-km");
    const pctEl = q(".pl-pct");
    const statusEl = q(".pl-status");
    const hint = q(".pl-hint");
    const tapeL = q(".pl-tape-l");
    const tapeR = q(".pl-tape-r");
    const confetti = shell.querySelectorAll(".pl-confetti i");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const splitInstances = [];
    const textAnimations = createSplitTextAnimations(splitInstances);
    const animateHeroText = (sel) => animateTextInScope(document, sel, textAnimations);

    const state = { p: 0 };   // race progress 0 → 1
    const boost = { v: 1 };   // sprint multiplier
    let finished = false;
    let cancelled = false;
    let lastStatus = "";
    let sprintCall;
    let fin;
    let forceExitTimer;
    let finishExitTimer;

    const finalizePreloader = () => {
      gsap.set(shell, { display: "none" });
      html.setAttribute("data-hero-preloader", "seen");
      try {
        window.localStorage.setItem(HERO_PRELOADER_STORAGE_KEY, "1");
      } catch {
        // Ignore storage restrictions and continue hiding preloader.
      }
      document.documentElement.style.overflow = "";
    };

    /* ---------- initial state ---------- */
    gsap.set(shell, { display: "block", autoAlpha: 1 });
    gsap.set(panels, { yPercent: 0 });
    gsap.set(confetti, { autoAlpha: 0 });
    if (heroImage) gsap.set(heroImage, { scale: 2.5, transformOrigin: "center center" });
    document.documentElement.style.overflow = "hidden";

    const introNodes = [".pl-eyebrow", ".pl-title", ".pl-sub", ".pl-track", ".pl-meta", ".pl-hint"]
      .map(q)
      .filter(Boolean);
    gsap.set(introNodes, { autoAlpha: 1, y: 0 });

    gsap.from(introNodes, {
      y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
    });

    /* ---------- the race ---------- */
    const run = gsap.timeline({ paused: true, onComplete: finish });

    function applySpeed() {
      run.timeScale(boost.v);
    }

    function render() {
      if (!track || !runner || !fill || !lane || !kmEl || !pctEl || !statusEl) {
        return;
      }

      const w = track.clientWidth;
      const rw = runner.offsetWidth;
      const startX = w * 0.08;
      const endX = w * 0.92;
      // runner's chest (~65% of sprite width) travels from startX to endX
      gsap.set(runner, { x: startX + state.p * (endX - startX) - rw * 0.65 });
      fill.style.transform = `scaleX(${state.p})`;
      lane.style.backgroundPositionX = `${-state.p * 900}px`;
      kmEl.textContent = (state.p * DISTANCE_KM).toFixed(1);
      pctEl.textContent = `${Math.round(state.p * 100)}%`;

      const s =
        state.p < 0.25 ? "Warming up"
        : state.p < 0.6 ? "Finding rhythm"
        : state.p < 0.9 ? "Pushing on"
        : "Final stretch";
      if (s !== lastStatus) {
        statusEl.textContent = s;
        lastStatus = s;
      }
      applySpeed();
    }

    run.to(state, {
      p: 1,
      duration: reduceMotion ? 0.8 : RUN_SECONDS,
      ease: "power1.inOut",
      onUpdate: render,
    });
    render();

    /* ---------- interactivity: tap / click / space = sprint ---------- */
    function sprint() {
      if (finished) return;
      shell.classList.add("is-sprinting");
      sprintCall?.kill();
      sprintCall = gsap.delayedCall(0.8, () => shell.classList.remove("is-sprinting"));

      gsap.killTweensOf(boost);
      gsap
        .timeline()
        .to(boost, { v: 2.8, duration: 0.12, onUpdate: applySpeed })
        .to(boost, { v: 1, duration: 1.1, ease: "power2.out", onUpdate: applySpeed }, "+=0.25");

      gsap.fromTo(kmEl, { scale: 1.18 }, { scale: 1, duration: 0.3, ease: "back.out(3)", overwrite: true });
    }
    const onKey = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        sprint();
      }
    };
    shell.addEventListener("pointerdown", sprint);
    window.addEventListener("keydown", onKey);

    /* ---------- finish: tape breaks, confetti, gates open, hero reveals ---------- */
    function finish() {
      if (finished) return;
      finished = true;
      shell.classList.remove("is-sprinting");
      shell.removeEventListener("pointerdown", sprint);
      window.removeEventListener("keydown", onKey);

      // Hide race track immediately once finish triggers.
      // if (track) gsap.set(track, { autoAlpha: 0, display: "none" });

      if (statusEl) statusEl.textContent = "Finish!";
      if (kmEl) kmEl.textContent = DISTANCE_KM.toFixed(1);
      if (pctEl) pctEl.textContent = "100%";

      fin = gsap.timeline();

      fin
        .to(hint, { autoAlpha: 0, duration: 0.2 }, 0)
        .to(tapeL, { rotate: -35, x: -50, y: 50, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 0)
        .to(tapeR, { rotate: 35, x: 50, y: 50, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 0)
        .to(runner, { y: -14, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, 0)
        .set(confetti, { autoAlpha: 1 }, 0)
        .to(confetti, {
          x: () => gsap.utils.random(-280, 280),
          y: () => gsap.utils.random(-280, -60),
          rotation: () => gsap.utils.random(-540, 540),
          duration: 0.9,
          ease: "power3.out",
        }, 0)
        .to(confetti, { y: "+=170", autoAlpha: 0, duration: 0.7, ease: "power1.in" }, ">-0.3")

        // gates open
        .to(content, { autoAlpha: 0, duration: 0.18, ease: "power2.out" }, 1.28)
        .to(panels[0], { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, 1.4)
        .to(panels[1], { yPercent: 100, duration: 1.1, ease: "power4.inOut" }, 1.4)
        // As soon as panels finish opening, remove preloader shell completely.
        .call(finalizePreloader, null, 2.52);

      // Failsafe: if finish timeline stalls mid-way, force close.
      finishExitTimer = window.setTimeout(() => {
        if (cancelled) return;
        finalizePreloader();
      }, 4200);

      if (heroImage) {
        fin.to(heroImage, { scale: 1, duration: 1.8, ease: "power3.out" }, 1.4);
      }

      // hero text (same elements/animations you already had)
      const divider = document.querySelector(".hero-divider");
      fin.call(() => animateHeroText(".hero-tagline"), null, 1.95);
      if (divider) {
        fin.fromTo(divider, { scaleY: 0, transformOrigin: "top" },
          { scaleY: 1, duration: 0.5, ease: "back.inOut" }, 2.1);
      }
      fin
        .call(() => animateHeroText(".hero-main-title"), null, 2.3)
        .call(() => animateHeroText(".hero-subtitle"), null, 2.45)
        .call(() => animateHeroText(".hero-body"), null, 2.55);
    }

    /* ---------- start once fonts are ready (SplitText needs them) ---------- */
    const start = () => {
      if (cancelled) return;
      hasPlayedThisPageLoad = true;
      run.play();

      // Failsafe: ensure preloader always closes even if timeline callbacks are interrupted.
      forceExitTimer = window.setTimeout(() => {
        if (cancelled) return;
        if (!finished) {
          finish();
        } else {
          finalizePreloader();
        }
      }, Math.max(7000, Math.round((reduceMotion ? 0.8 : RUN_SECONDS) * 1000) + 3200));
    };
    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      cancelled = true;
      run.kill();
      fin?.kill();
      sprintCall?.kill();
      if (forceExitTimer) window.clearTimeout(forceExitTimer);
      if (finishExitTimer) window.clearTimeout(finishExitTimer);
      gsap.killTweensOf([boost, kmEl]);
      shell.removeEventListener("pointerdown", sprint);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      splitInstances.forEach((s) => s.revert());
    };
  }, []);

  return (
    <div
      ref={scopeRef}
      className="hero-preloader-shell"
      role="status"
      aria-label="Loading Sudharva 2027"
    >
      <div className="pl-panel pl-panel-top" />
      <div className="pl-panel pl-panel-bottom" />

      <div className="pl-content">
        <p className="pl-eyebrow">Appa Charitable Trust presents</p>
        <h2 className="pl-title">
          Sudharva <span>2027</span>
        </h2>
        <p className="pl-sub">Run Against Diabetes</p>

        <div className="pl-track">
          <div className="pl-speed" />
          <div className="pl-road">
            <div className="pl-lane" />
          </div>
          <div className="pl-fill" />

          <div className="pl-finish" />
          <div className="pl-tape">
            <i className="pl-tape-l" />
            <i className="pl-tape-r" />
          </div>

          <div className="pl-runner">
            <span className="pl-dust"><i /><i /><i /></span>
            <Image
              src="/video/preloader.gif"
              alt="Runner animation"
              width={190}
              height={190}
              unoptimized
              className="pl-runner-anim"
              draggable={false}
            />
            <span className="pl-shadow" />
          </div>

          <div className="pl-confetti">
            {CONFETTI.map((i) => <i key={i} />)}
          </div>

          <ul className="pl-markers">
            {MARKERS.map((i) => (
              <li key={i} style={{ left: `${8 + (i / DISTANCE_KM) * 84}%` }}>
                {i === 0 ? "START" : i === DISTANCE_KM ? "FINISH" : `${i} km`}
              </li>
            ))}
          </ul>
        </div>

        <div className="pl-meta">
          <div className="pl-dist">
            <span className="pl-km">0.0</span>
            <small> / {DISTANCE_KM} km</small>
          </div>
          <span className="pl-status">Warming up</span>
          <span className="pl-pct">0%</span>
        </div>

        <p className="pl-hint">Tap anywhere to sprint</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- */
/* HeroBadge                                                */
/* ------------------------------------------------------- */

export function HeroBadge() {
  return (
    <Reveal
      preset="fade-down"
      duration={0.6}
      data-fade-in="down"
      className="flex flex-col items-center gap-3 sm:items-start"
    >
     <div className="flex flex-col items-center gap-3 sm:items-start">
       <Float distance={7} duration={3.5}>
        <Image
          src="/image/cta/appa-logo.svg"
          alt="Appa Charitable Trust"
          width={267}
          height={108}
          priority
          className="mx-auto block h-auto w-44 sm:mx-0 sm:w-52"
        />
      </Float>
      <Float distance={5} duration={3.5}>
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm sm:text-xs">
          <span
            className="size-1.5 animate-pulse rounded-full bg-emerald-300"
            aria-hidden="true"
          />

          A charitable initiative by&nbsp;

          <span className="text-white">
            Appa Charitable Trust
          </span>
        </p>
      </Float>
     </div>
    </Reveal>
  );
}

/* ------------------------------------------------------- */
/* HeroHeading                                              */
/* HeroPreloader controls the SplitText animations          */
/* ------------------------------------------------------- */

export function HeroHeading() {
  return (
    <div>
      <Stagger
        delay={0.05}
        gap={0.12}
        className="mt-5"
      >
        <StaggerItem preset="blur">
          <div className="relative flex h-auto flex-wrap items-center justify-center sm:justify-start">
            <Image
              src="/image/cta/logo.png"
              alt="Sudharva 2027"
              width={300}
              height={300}
              priority
              className="mx-auto block h-auto w-auto sm:mx-0"
              style={{ width: "auto", height: "auto" }}
            />

            <LineShadowText
              data-text-anim="headerAnimation"
              shadowColor="white"
              className="hero-main-title invisible block font-serif text-4xl font-bold leading-[1.05] text-accent sm:text-5xl lg:text-7xl"
            >
              2027
            </LineShadowText>
          </div>
        </StaggerItem>

        <StaggerItem preset="blur">
          <div className="tagline">
            <span
              data-text-anim="bodyAnimation"
              className="hero-tagline invisible block text-md font-bold leading-[1.05] text-white/80 sm:text-lg lg:text-xl"
            >
              Run Against <AuroraText>Diabetes</AuroraText>
            </span>
          </div>
        </StaggerItem>

        <StaggerItem preset="fade-up">
          <span
            data-text-anim="headerAnimation"
            className="hero-subtitle invisible mt-3 block text-lg font-semibold leading-snug text-primary sm:text-2xl lg:text-3xl"
          >
            Run for a Cause, Run for a Change
          </span>
        </StaggerItem>

        <StaggerItem preset="fade-up">
          <span
            data-text-anim="bodyAnimation"
            className="hero-body invisible mx-auto mt-5 block max-w-xl text-sm leading-7 tracking-normal text-white/85 sm:mx-0 sm:text-base lg:text-lg"
          >
            Join us in raising awareness for diabetes prevention
            and building a healthier community - one stride at a time.
          </span>
        </StaggerItem>
      </Stagger>
    </div>
  );
}

/* ------------------------------------------------------- */
/* HeroEventMeta                                            */
/* ------------------------------------------------------- */



export function HeroEventMeta() {
  return (
    <Stagger
      delay={0.35}
      gap={0.1}
      data-fade-in="up"
      className="mx-auto mt-7 grid max-w-3xl grid-cols-1 gap-4 text-lg text-white sm:mx-0 sm:grid-cols-3 sm:gap-5"
    >
      {META.map((item) => {
        const Icon = item.icon
        return (
          <StaggerItem
            key={item.label}
            preset="fade-up"
          >
            <span className="flex items-center justify-center gap-2 sm:justify-start">
              {/* <span aria-hidden="true">
                {item.icon}
              </span> */}
              <Icon
                className="relative z-10 shrink-0 size-8 sm:size-10 lg:size-12"
              />

              <span className="text-sm sm:text-base">
                {item.label}
                {item.location && (
                  <a
                    href={item.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-white/70 underline"
                  >
                    View Map
                  </a>
                )}
              </span>
            </span>
          </StaggerItem>
        )
      })}
    </Stagger>
  );
}

/* ------------------------------------------------------- */
/* HeroCtas                                                 */
/* ------------------------------------------------------- */

export function HeroCtas() {
  return (
    <Reveal
      preset="zoom-in"
      delay={0.5}
      duration={0.6}
      data-fade-in="left"
    >
      <span className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start">
        <RainbowButton
          asChild
          size="lg"
          className="w-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider sm:w-auto"
        >
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center sm:w-auto"
          >
            <UserAdd01Icon
              size={24}
              duration={1}
              color="currentColor"
              className="mr-2"
            />

            Register Now
          </Link>
        </RainbowButton>

        <Button
          nativeButton={false}
          className="h-auto w-full items-center justify-center gap-2.5 rounded-lg border-white/50 bg-white/10 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
          render={<Link href="/event" />}
        >
          <HandshakeIcon
            size={24}
            duration={1}
            color="currentColor"
            className="mr-2 shrink-0"
          />

          Be a Part of the Marathon
        </Button>
      </span>
    </Reveal>
  );
}

/* ------------------------------------------------------- */
/* HeroStats                                                */
/* ------------------------------------------------------- */

export function HeroStats() {
  return (
    <Stagger
      gap={0.1}
      amount={0.2}
      className="container-page grid grid-cols-2 gap-4 py-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
    >
      {heroRuningData.map(
        ({ id, icon: Icon, count, label, color }) => (
          <StaggerItem
            key={id}
            preset="fade-up"
            className="flex flex-row items-center gap-1 text-center sm:text-left"
          >
            <Icon
              size={30}
              weight="duotone"
              className={cn(
                color,
                "mr-2 transition-transform duration-300 group-hover:scale-110"
              )}
              aria-hidden="true"
            />

            <span className="flex flex-col gap-2">
              <NumberTicker
                value={count}
                className="text-2xl font-bold text-white"
              />

              <span className="text-sm text-white/85">
                {label}
              </span>
            </span>
          </StaggerItem>
        )
      )}
    </Stagger>
  );
}
