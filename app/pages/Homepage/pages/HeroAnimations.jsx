
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

import {
  FilterAddIcon,
  HandshakeIcon,
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

export function HeroPreloader() {
  const scopeRef = useRef(null);

  useEffect(() => {
    const PRELOADER_SESSION_KEY = "sudharva:hero-preloader-seen:v1";
    const PRELOADER_MAIN_DURATION = 3;
    const shell = scopeRef.current;

    if (!shell) return;

    let mounted = true;
    let preloaderTimeline;
    let heroTimeline;

    const splitInstances = [];
    const textAnimations = createSplitTextAnimations(splitInstances);

    const preloaderBg = shell.querySelector(".preloader-bg");
    const preloaderMask = shell.querySelector(".preloader-mask");
    const preloaderLogo = shell.querySelector(".preloader-logo");
    const preloaderSunText = shell.querySelector(".preloader-sun-text");
    const progressBar = shell.querySelector(
      ".preloader-progress-bar"
    );

    const heroImage = document.querySelector(".hero-img img");

    const revealHeroImmediately = () => {
      [
        ".hero-main-title",
        ".hero-tagline",
        ".hero-subtitle",
        ".hero-body",
      ].forEach((selector) => {
        const node = document.querySelector(selector);
        if (node) {
          gsap.set(node, { visibility: "visible", opacity: 1, clearProps: "transform" });
        }
      });

      const divider = document.querySelector(".hero-divider");
      if (divider) {
        gsap.set(divider, { scaleY: 1, transformOrigin: "top" });
      }
    };

    const shouldSkipPreloader = (() => {
      try {
        return sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1";
      } catch {
        return false;
      }
    })();

    if (shouldSkipPreloader) {
      gsap.set(shell, {
        display: "none",
        autoAlpha: 0,
        pointerEvents: "none",
      });

      if (heroImage) {
        gsap.set(heroImage, { scale: 1, transformOrigin: "center center" });
      }

      revealHeroImmediately();
      return;
    }

    /*
     * RESET
     *
     * The preloader may have been hidden by the previous animation.
     * Restore its initial state whenever this component mounts.
     */

    gsap.set(shell, {
      display: "block",
      autoAlpha: 1,
      pointerEvents: "auto",
    });

    shell.classList.remove("is-preloader-running");
    shell.style.setProperty(
      "--preloader-main-duration",
      `${PRELOADER_MAIN_DURATION}s`
    );

    gsap.set(preloaderBg, {
      scaleX: 0,
      opacity: 1,
      transformOrigin: "left center",
    });

    gsap.set(preloaderMask, {
      scale: 1,
    });

    gsap.set([preloaderLogo, progressBar], {
      autoAlpha: 1,
    });

    gsap.set(preloaderSunText, {
      autoAlpha: 0,
      yPercent: 18,
    });

    if (heroImage) {
      gsap.set(heroImage, {
        scale: 2.5,
        // transformOrigin: "center center",
      });
    }

    /*
     * The preloader and hero are separate DOM sections.
     * Search document for hero text, but keep preloader
     * selectors scoped to this component.
     */

    const animateHeroText = (selector) => {
      if (!mounted) return;

      animateTextInScope(
        document,
        selector,
        textAnimations
      );
    };

    const runIntro = () => {
      if (!mounted) return;

      try {
        sessionStorage.setItem(PRELOADER_SESSION_KEY, "3");
      } catch {
        // Ignore storage failures and continue animation.
      }

      shell.classList.add("is-preloader-running");

      /*
       * PRELOADER TIMELINE
       */

      preloaderTimeline = gsap.timeline();

      preloaderTimeline
        .to(preloaderBg, {
          scaleX: 1,
          duration: PRELOADER_MAIN_DURATION,
          ease: "power2.inOut",
        })

        .to(
          preloaderSunText,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          PRELOADER_MAIN_DURATION * 0.62
        )

        .to(
          preloaderMask,
          {
            scale: 3,
            duration: PRELOADER_MAIN_DURATION,
            ease: "power2.inOut",
          },
          // "-=0.15"
        )

        .to(
          [preloaderBg, preloaderLogo, progressBar],
          {
            autoAlpha: 0,
            duration: 0.75,
            ease: "power2.inOut",
          },
          PRELOADER_MAIN_DURATION - 0.75
        )

        .to(
          heroImage || shell,
          {
            scale: heroImage ? 1 : 1,
            duration: PRELOADER_MAIN_DURATION,
            ease: "expoScale(0.5,7,power1.out)",
          },
          "<"
        )

        .to(
          shell,
          {
            autoAlpha: 0,
            duration: 0.5,
            pointerEvents: "none",
          },
          "<0.2"
        )

        .set(shell, {
          display: "none",
        });

      preloaderTimeline.eventCallback("onComplete", () => {
        shell.classList.remove("is-preloader-running");
      });

      /*
       * HERO TEXT TIMELINE
       *
       * Do not add another GSAP animation inside HeroHeading.
       * This timeline is responsible for revealing the hero text.
       */

      heroTimeline = gsap.timeline({
        delay: 0.2,
      });

      heroTimeline
        .call(() => {
          animateHeroText(".hero-tagline");
        })

        .fromTo(
          document.querySelector(".hero-divider"),
          {
            scaleY: 0,
            transformOrigin: "top",
          },
          {
            scaleY: 1,
            duration: 0.5,
            ease: "back.inOut",
          },
          "+=0.4"
        );

      heroTimeline.call(
        () => animateHeroText(".hero-main-title"),
        [],
        "-=0.25"
      );

      heroTimeline.call(
        () => animateHeroText(".hero-subtitle"),
        [],
        "<0.2"
      );

      heroTimeline.call(
        () => animateHeroText(".hero-body"),
        [],
        "<0.1"
      );
    };

    /*
     * Wait for fonts so SplitText calculates the correct
     * character and line positions.
     */

    let cancelled = false;

    const startAnimation = () => {
      if (cancelled || !mounted) return;
      runIntro();
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(startAnimation);
    } else {
      startAnimation();
    }

    return () => {
      cancelled = true;
      mounted = false;
      shell.classList.remove("is-preloader-running");

      preloaderTimeline?.kill();
      heroTimeline?.kill();

      gsap.killTweensOf(shell);
      gsap.killTweensOf([
        preloaderBg,
        preloaderMask,
        preloaderLogo,
        preloaderSunText,
        progressBar,
      ]);

      if (heroImage) {
        gsap.killTweensOf(heroImage);
      }

      splitInstances.forEach((split) => {
        split.revert();
      });
    };
  }, []);

  return (
    <div
      ref={scopeRef}
      className="hero-preloader-shell"
      aria-hidden="true"
    >
      <div className="preloader-progress-bar">
        <div className="preloader-bg" />

        <div className="preloader-logo">
          <Image
            src="/video/preloader.gif"
            alt="Sudharva preloader"
            width={320}
            height={320}
            priority
            unoptimized
            className="preloader-gif"
          />

          <p className="preloader-sun-text">
            Sudharva 2027
          </p>
        </div>
      </div>

      <div className="preloader-mask" />
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
          <div className="relative flex h-auto flex-wrap items-center">
            <Image
              src="/image/cta/logo.png"
              alt="Sudharva 2027"
              width={400}
              height={400}
              priority
              className="mx-auto block sm:mx-0"
            />

            <LineShadowText
              data-text-anim="headerAnimation"
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
              className="hero-tagline invisible block text-lg font-bold leading-[1.05] text-white/80 sm:text-xl lg:text-2xl"
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
            <FilterAddIcon
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
          render={<Link href="/register" />}
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
