"use client";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import TearTicket from "./TearTicket";

/* Default geometry + motion settings for the Sudharva event pass. */
export const PASS_TICKET_PROPS = {
  image: "/image/cta/marathon-bib.webp",
  imageAlt: "Marathon runner",
  orientation: "horizontal",
  scrim: false,
  imageRadius: 8,
  width: 460,
  height: 250,
  stubSize: 150,
  radius: 16,
  holes: 12,
  holeSize: 6,
  notch: 3,
  roughness: 0,
  tearAngle: 30,
  stretch: 30,
  resistance: 0.45,
  rotate: 4,
  tilt: true,
  tiltMax: 9,
  tiltReach: 260,
  parallax: 6,
  perspective: 1000,
  background: "var(--brand-surface)",
  color: "var(--brand-ink)",
  border: true,
  borderWidth: 1,
  recenter: true,
};

/* The printable stub — official event pass details. */
export function MarathonPassStub({ className }) {
  return (
    <div className={cn("my-2 flex flex-col pl-2", className)}>
      <p className="text-xs font-bold">OFFICIAL EVENT PASS</p>
      <h3 className="my-1 text-base font-bold leading-[1.2]">Sudharva Marathon</h3>
      <span className="text-xs">10K RUN · OPEN REGISTRATION</span>
      <p className="text-xs">Chennai, Tamil Nadu</p>
      <span className="pt-8 text-xs">REG. NO. SM-284619</span>
    </div>
  );
}

export function MarathonPassTicket({
  children,
  className,
  revealClassName,
  stub,
  stubClassName,
  onTear,
  fluid = false,
  ...props
}) {
  return (
    <Reveal
      preset="zoom-in"
      delay={0.1}
      className={cn("relative my-8", fluid ? "w-full" : "mr-2", revealClassName)}
    >
      <TearTicket
        {...PASS_TICKET_PROPS}
        {...props}
        fluid={fluid}
        stub={stub ?? <MarathonPassStub className={stubClassName} />}
        onTear={onTear}
        className={cn(fluid && "w-full", className)}
      >
        {children}
      </TearTicket>
    </Reveal>
  );
}

export default MarathonPassTicket;
