import { StripedPattern } from "@/components/animation/StripedPattern";
import { ArrowRight02Icon } from "@animateicons/react/huge";
import { HandshakeIcon } from "@animateicons/react/huge";
import Link from "next/link";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/animation/scrollBasedVelocity";
import { ShimmerButton } from "@/components/animation/shimmerButton";
import { AnimatedShinyText } from "@/components/animation/AnimatedShinyText";

const CTABanner = () => {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="cta-banner-section relative isolate overflow-hidden"
    >
      {/* Decorative background — full-bleed pattern behind the content */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <StripedPattern className="z-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-center text-center">
          <span className="my-4 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-[var(--color-surface)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft shadow-sm">
            <AnimatedShinyText className="inline-flex items-center justify-center gap-1 px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Together in Every Stride</span>
              <ArrowRight02Icon className="size-3 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </span>
          <h1
            id="join-heading"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary-foreground"
          >
            Be a Part of the Movement!
          </h1>
          <p className="mx-auto my-4 max-w-md text-pretty text-sm opacity-90 sm:text-base">
            Partner with Sudharva Marathon to champion wellness, empower
            communities, and inspire a healthier tomorrow.
          </p>
          <ShimmerButton
            asChild
            size="md"
            className="shadow-2xl"
            background="var(--primary-foreground)"
            foreground="var(--primary)"
            borderColor="color-mix(in srgb, var(--primary) 30%, transparent)"
          >
            <Link href="mailto:sudharvarun@yahoo.com?subject=Sudharva%20Marathon">
              <HandshakeIcon
                size={20}
                duration={1}
                color="currentColor"
                className="shrink-0"
              />
              Become a Partner
            </Link>
          </ShimmerButton>
        </div>

        {/* Scrolling marquee — full-bleed, decorative */}
      </div>
        <div
          className="relative mt-12 w-full overflow-hidden border-y border-white/15 py-5"
          aria-hidden="true"
        >
          <ScrollVelocityContainer className="text-2xl font-bold uppercase leading-tight tracking-tight text-ink/90 sm:text-3xl md:text-5xl">
            <ScrollVelocityRow baseVelocity={4} direction={1}>
              <span className="inline-flex shrink-0 items-center whitespace-nowrap text-whiteb ">
                More than a Run, a moment for a change
                <span className="mx-6 inline-block size-2 shrink-0 rounded-full bgwhite/60 sm:mx-8" />
              </span>
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
          {/* Edge fades so the loop melts into the banner */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--color-primary-deep)] to-transparent sm:w-1/4" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--color-accent)] to-transparent sm:w-1/4" />
        </div>
    </section>
  );
};

export default CTABanner;

