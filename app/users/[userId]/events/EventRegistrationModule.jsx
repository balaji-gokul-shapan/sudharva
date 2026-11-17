import Link from "next/link";
import {
  Calendar01Icon,
  CheckListIcon,
  Flag01Icon,
  Rocket01Icon,
} from "@animateicons/react/huge";

const MISSING = "Not available";

const pick = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (typeof value === "object") continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return "";
};

const getStatusTone = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("confirm") || normalized.includes("success")) {
    return "border-success/35 bg-success/12 text-success";
  }
  if (normalized.includes("pending") || normalized.includes("hold")) {
    return "border-warning/35 bg-warning/12 text-warning";
  }
  return "border-primary/30 bg-primary/10 text-primary";
};

const formatStatus = (status) => {
  const raw = String(status || "Pending").trim();
  if (!raw) return "Pending";
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const EventDetail = ({ icon, label, value, action }) => (
  <article className="rounded-xl border border-border bg-muted/40 p-4">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 rounded-lg bg-accent/10 p-2 text-accent">
        {icon}
      </span>
      <div>
        <p className="text-xs text-ink-soft">{label}</p>
        <p className="mt-1 font-semibold text-foreground">{value}</p>
        {action}
      </div>
    </div>
  </article>
);

export default function EventRegistrationModule({
  userId = "",
  registration = null,
}) {
  const encodedUserId = encodeURIComponent(userId);

  if (!registration) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/12 blur-3xl" />
        <div className="relative max-w-2xl">
          <h1 className="text-2xl font-bold text-foreground">My Events</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            We could not find a completed event registration in this session.
            You can continue registration from your dashboard or refresh after
            signing in again.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={userId ? `/users/${encodedUserId}` : "/users"}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:brightness-105"
            >
              Go to dashboard
            </Link>
            <Link
              href={userId ? `/users/${encodedUserId}/profile` : "/users"}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/5"
            >
              Review profile
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const details = registration?.runner?.details || {};
  const eventName =
    pick(
      registration?.event_name,
      registration?.event?.name,
      registration?.event,
      registration?.event_title,
    ) || MISSING;
  const category =
    pick(
      registration?.category?.name,
      registration?.category,
      registration?.category_name,
      registration?.event_category,
    ) || MISSING;
  const tshirtSize =
    pick(
      registration?.tshirt_size_name,
      registration?.tshirt_size_label,
      registration?.tshirt_size?.name,
      registration?.tshirt_size,
      registration?.runner?.details?.tshirt_size,
      registration?.runner?.details?.tshirt_size_name,
      registration?.tshirt_size_id,
    ) || MISSING;

  const place =
    pick(
      registration?.venue,
      registration?.location,
      registration?.event_location,
      [
        details?.resident_city,
        details?.resident_district,
        details?.resident_state,
      ]
        .filter(Boolean)
        .join(", "),
    ) || MISSING;

  const participantReference =
    pick(
      registration?.participant_reference,
      registration?.participantReference,
      registration?.reference,
    ) || MISSING;

  const status = formatStatus(
    pick(
      registration?.registration_status,
      registration?.status,
      registration?.payment_status,
    ) || "Pending",
  );
  const hasRegistration = Boolean(registration);
  const paymentStatus = pick(
    registration?.status,
    registration?.registration_status,
    registration?.payment_status,
    registration?.paymentStatus,
  )
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const isPendingPayment =
    hasRegistration && paymentStatus === "pending_payment";
  const isPaymentCompleted = hasRegistration && !isPendingPayment;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-14 bottom-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Events</h1>
            <p className="mt-2 text-sm text-ink-soft">
              Your race snapshot with confirmed registration details.
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] ${getStatusTone(status)}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-border/80 bg-linear-to-br from-background via-background to-primary/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Event Spotlight
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {eventName}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Category:{" "}
            <span className="font-semibold text-foreground">{category}</span>
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <EventDetail
            icon={<Calendar01Icon size={18} />}
            label="Event Name"
            value={eventName}
          />
          <EventDetail
            icon={<CheckListIcon size={18} />}
            label="Category"
            value={category}
          />
          <EventDetail
            icon={<Flag01Icon size={18} />}
            label="Place"
            value={place}
            action={
              <Link
                href="https://www.google.com/maps/place/ajeya+Stadium,/data=!4m2!3m1!1s0x3a52627fc6dca50d:0xad76da86c69d66ca?sa=X&ved=1t:242&ictx=111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                view on map
              </Link>
            }
          />
          <EventDetail
            icon={<CheckListIcon size={18} />}
            label="T-shirt Size"
            value={tshirtSize}
          />
        </div>

        {isPaymentCompleted && participantReference !== MISSING ? (
          <div className="mt-4 rounded-xl border border-border bg-background/70 p-4">
            <div className="flex items-center gap-2 text-ink-soft">
              <Rocket01Icon size={17} />
              <p className="text-xs">Participant Reference</p>
            </div>
            <p className="mt-2 text-sm font-semibold tracking-wide text-foreground">
              {participantReference}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
