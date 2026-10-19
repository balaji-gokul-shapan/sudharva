"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { DotPattern } from "@/components/animation/dotPattern";
import { AuroraText } from "@/components/animation/AuroraText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight02Icon } from "@animateicons/react/huge";

import { overviewData } from "../datas/homepage/data";
import { ShimmerButton } from "@/components/animation/shimmerButton";

/* ------------------------------------------------------------------ */
/* Pillar card — cursor-tracked spotlight + staggered scroll reveal     */
/* ------------------------------------------------------------------ */
function PillarCard({ pillar, index }) {
  const { icon: Icon, label, description, iconBg, cardBg, textColor, accent, numberBg } = pillar;
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 220, damping: 28, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 28, mass: 0.6 });

  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${springX}px ${springY}px, ${accent}40, transparent 70%)`;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left);
          mouseY.set(e.clientY - rect.top);
        }}
        className={cn(
          "relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl border " + cardBg + " bg-card/70 p-6 text-center backdrop-blur-md dark:border-white/15 dark:bg-white/[0.06]",
          "transition-[transform,box-shadow,border-color] duration-300",
          "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg dark:hover:border-white/30",
        )}
      >
        {/* cursor-tracking spotlight */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
        )}

        {/* journey step number */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-4 top-2 text-5xl font-black tabular-nums text-foreground/10 transition-colors duration-300 group-hover:text-foreground/20",
            numberBg,
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* icon badge */}
        <span
          className={cn(
            "relative flex size-16 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
            iconBg,
          )}
        >
          <Icon
            size={30}
            weight="duotone"
            className={cn(
              textColor,
              "transition-transform duration-300 group-hover:scale-110",
            )}
            aria-hidden="true"
          />
        </span>

        <h3 className="relative text-base font-semibold leading-6 text-foreground">
          {label}
        </h3>
        <p className="relative text-sm leading-6 text-foreground/70">
          {description}
        </p>
      </div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Overview section                                                     */
/* ------------------------------------------------------------------ */
const Overview = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className="overview-section"
    >
      <DotPattern
        glow={true}
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={2}
        className={cn(
          "h-full bg-white mask-[linear-gradient(to_bottom_right,white,white,transparent)] dark:bg-transparent",
        )}
      />

      <div className="container-page relative z-10">
        {/* ---- Header: two-column on large screens ---- */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/80 backdrop-blur-sm"
            >
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-foreground" />
              </span>
              Event Overview
            </motion.span>

            <motion.h2
              id="overview-heading"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-5 max-w-2xl text-3xl font-bold leading-tight text-accent sm:text-4xl lg:text-5xl"
            >
              Our Cause - <AuroraText>A Future Free from Diabetes</AuroraText>
            </motion.h2>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-4 max-w-xl text-sm leading-6 opacity-85 sm:text-base"
            >
              We are committed to raising awareness, enabling early detection,
              and promoting a future free from diabetes through our event.
            </motion.p>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="lg:pb-1"
          >
            {/* <Button
              variant="outline"
              className="h-auto w-full rounded-md border-foreground/50 bg-foreground/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground shadow-md backdrop-blur-sm transition-colors sm:w-auto dark:border-white/50 dark:bg-white/10 dark:hover:bg-white/20 [&_svg]:size-6!"
            >
              <ArrowRight02Icon size={24} duration={1} />
              Know More about our Impact
            </Button> */}
            <ShimmerButton className="shadow-2xl">
              <span className="text-center text-sm font-medium leading-none tracking-tight whitespace-pre-wrap lg:text-lg">
                Know More about our Impact
              </span>
            </ShimmerButton>
          </motion.div>
        </div>

        {/* ---- Pillar journey ---- */}
        <ol className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {overviewData.map((pillar, index) => (
            <PillarCard key={pillar.id} pillar={pillar} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Overview;
