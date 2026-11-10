import { CalendarDots, FlagBanner, Heartbeat, MapPin, Phone, Ruler } from "@phosphor-icons/react/dist/ssr";

function ContactNode({ icon: Icon, title, value, note }) {
  return (
    <div className="relative rounded-2xl border border-border/70 bg-background/95 p-3.5 pl-10">
      <span className="absolute left-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-accent/12 text-accent">
        <Icon size={14} weight="duotone" />
      </span>
      <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">{title}</p>
      <p className="mt-1 text-sm font-semibold text-foreground wrap-break-word">{value}</p>
      {note ? <p className="mt-1 text-xs text-ink-soft">{note}</p> : null}
    </div>
  );
}

export default function SafetyReachabilityCard({
  personalMobile,
  city,
  emergencyContactName,
  emergencyContactMobile,
  category,
  distance,
  alternateMobile,
}) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-br from-background/95 to-accent/6 p-5 shadow-[0_18px_42px_-28px_color-mix(in_srgb,var(--accent)_42%,transparent)] sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 top-14 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-8 bottom-12 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />

      <div className="relative mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
          <Heartbeat size={20} weight="duotone" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Safety & Reachability</p>
          <h2 className="text-lg font-bold text-foreground">Race Day Signal Grid</h2>
        </div>
      </div>

      <div className="relative space-y-3">
        <div aria-hidden="true" className="absolute left-6 top-2 bottom-2 w-px bg-linear-to-b from-accent/70 via-primary/45 to-transparent" />

        <ContactNode icon={Phone} title="Primary Mobile" value={personalMobile} />
        <ContactNode icon={MapPin} title="Resident City" value={city} />
        <ContactNode
          icon={FlagBanner}
          title="Emergency Beacon"
          value={`${emergencyContactName} - ${emergencyContactMobile}`}
          note="Used for priority contact during race contingencies."
        />
        <ContactNode
          icon={Ruler}
          title="Event Track"
          value={`${category} · ${distance}`}
          note={`Alternate mobile: ${alternateMobile}`}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-3 py-2 text-xs text-accent">
        <CalendarDots size={15} weight="fill" />
        Keep this grid current so coordinators can reach you instantly on race day.
      </div>
    </article>
  );
}
