"use client";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import TearTicket from "./TearTicket";
import { SpinningText } from "./spinning-text";
import Image from "next/image";

/* Default geometry + motion settings for the Sudharva event pass. */
export const PASS_TICKET_PROPS = {
  image: "/image/cta/marathon-bib.webp",
  imageAlt: "Marathon runner",
  orientation: "horizontal",
  scrim: false,
  imageRadius: 8,
  imageFit: "contain",
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

/* The printable stub — official event pass details. Reusable with dynamic props. */
export function MarathonPassStub({
  className,
  label = "OFFICIAL EVENT PASS",
  event = "Sudharva Marathon 2027",
  distance = "10K RUN · OPEN REGISTRATION",
  location = "Chennai, Tamil Nadu",
  regNo = "SM-284619",
  participantName,
  showQRCode = true,
}) {
  return (
    <div className={cn("my-2 space-y-1.5 flex flex-col pl-2", className)}>
       <SpinningText className="text-xs text-ink-soft relative top-12 left-20">Sample • Sample • Sample •</SpinningText>
      <p className="text-xs font-bold text-ink-soft">{label}</p>
      <h3 className="my-1 text-base text-primary font-bold leading-[1.2]">{event}</h3>
      <span className="text-sm text-ink-soft">{distance}</span>
      <p className="text-xs text-ink-soft">{location}</p>
      <span className="text-2xl text-primary">{participantName}</span>
      <span className="py-2 text-xs text-ink-soft">REG. NO. {regNo}</span>
      {showQRCode && (
        <Image
          src="/image/cta/events/QR.svg"
          alt="Marathon QR Code"
          width={80}
          height={250}
          className="rounded-md"
        />
      )}
    </div>
  );
}

export function MarathonPassTicket({
  children,
  className,
  revealClassName,
  stub,
  stubClassName,
  stubLabel,
  stubEvent,
  stubDistance,
  stubLocation,
  stubRegNo,
  image = PASS_TICKET_PROPS.image,
  imageAlt = PASS_TICKET_PROPS.imageAlt,
  scrim = PASS_TICKET_PROPS.scrim,
  imageRadius = PASS_TICKET_PROPS.imageRadius,
  imageFit = PASS_TICKET_PROPS.imageFit,
  orientation = PASS_TICKET_PROPS.orientation,
  width = PASS_TICKET_PROPS.width,
  height = PASS_TICKET_PROPS.height,
  bodyWidth,
  bodyHeight,
  stubSize = PASS_TICKET_PROPS.stubSize,
  radius = PASS_TICKET_PROPS.radius,
  holes = PASS_TICKET_PROPS.holes,
  holeSize = PASS_TICKET_PROPS.holeSize,
  notch = PASS_TICKET_PROPS.notch,
  roughness = PASS_TICKET_PROPS.roughness,
  tearAngle = PASS_TICKET_PROPS.tearAngle,
  stretch = PASS_TICKET_PROPS.stretch,
  resistance = PASS_TICKET_PROPS.resistance,
  rotate = PASS_TICKET_PROPS.rotate,
  tilt = PASS_TICKET_PROPS.tilt,
  tiltMax = PASS_TICKET_PROPS.tiltMax,
  tiltReach = PASS_TICKET_PROPS.tiltReach,
  parallax = PASS_TICKET_PROPS.parallax,
  perspective = PASS_TICKET_PROPS.perspective,
  background = PASS_TICKET_PROPS.background,
  color = PASS_TICKET_PROPS.color,
  border = PASS_TICKET_PROPS.border,
  borderWidth = PASS_TICKET_PROPS.borderWidth,
  recenter = PASS_TICKET_PROPS.recenter,
  onTear,
  isCustom = false,
  fluid = false,
  participantName,
  style,
  tearTicketContentClassName,
  tearTicketStubClassName,
  showQRCode = true,
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
        image={image}
        imageAlt={imageAlt}
        scrim={scrim}
        imageRadius={imageRadius}
        imageFit={imageFit}
        orientation={orientation}
        width={width}
        height={height}
        bodyWidth={bodyWidth}
        bodyHeight={bodyHeight}
        stubSize={stubSize}
        radius={radius}
        holes={holes}
        holeSize={holeSize}
        notch={notch}
        roughness={roughness}
        tearAngle={tearAngle}
        stretch={stretch}
        resistance={resistance}
        rotate={rotate}
        tilt={tilt}
        tiltMax={tiltMax}
        tiltReach={tiltReach}
        parallax={parallax}
        perspective={perspective}
        background={background}
        color={color}
        border={border}
        borderWidth={borderWidth}
        recenter={recenter}
        fluid={fluid}
        stub={
          stub ??
          (isCustom
            ? null
            : <MarathonPassStub
                className={stubClassName}
                label={stubLabel}
                event={stubEvent}
                distance={stubDistance}
                location={stubLocation}
                regNo={stubRegNo}
                participantName={participantName}
                showQRCode={showQRCode}
              />)
        }
        onTear={onTear}
        className={cn(fluid && "w-full", className)}
        style={style}
        tearTicketContentClassName={tearTicketContentClassName}
        tearTicketStubClassName={tearTicketStubClassName}
        {...props}
      >
        {children}
      </TearTicket>
    </Reveal>
  );
}

export default MarathonPassTicket;
