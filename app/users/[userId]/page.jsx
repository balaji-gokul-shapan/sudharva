import Link from "next/link";
import {
  ArrowUpRight01Icon,
  Calendar01Icon,
  CheckListIcon,
  Clock01Icon,
  Flag01Icon,
  Target01Icon,
} from "@animateicons/react/huge";
import RunnerRegistrationCard from "./RunnerRegistrationCard";
import RegistrationStepper from "./RegistrationStepper";
import { getUserRegistrationServer } from "@/lib/server/getUserRegistration";
import PendingPaymentPanel from "./PendingPaymentPanel";
import { isRegistrationRecord } from "@/lib/users/registrationPayload";
import { getUserData } from "./data/userData";

export const instant = false;

const hasMeaningfulRegistration = (entry) => {
  if (!isRegistrationRecord(entry)) return false;

  const hasReference = Boolean(
    entry?.registration_id ||
      entry?.id ||
      entry?.participant_reference ||
      entry?.participantReference ||
      entry?.reference,
  );
  const hasRunner = Boolean(
    entry?.runner &&
      typeof entry.runner === "object" &&
      Object.keys(entry.runner).length > 0,
  );
  const hasEventMeta = Boolean(
    entry?.event ||
      entry?.event_name ||
      entry?.category ||
      entry?.category_name ||
      entry?.runner_category_id,
  );

  return hasReference || hasRunner || hasEventMeta;
};

const hasRegistrationData = (registration) => {
  if (Array.isArray(registration)) {
    return registration.some((entry) => hasMeaningfulRegistration(entry));
  }

  return hasMeaningfulRegistration(registration);
};

const stats = [
  {
    label: "Total Registrations",
    value: "02",
    detail: "Marathon entries",
    icon: Target01Icon,
  },
  {
    label: "Upcoming Events",
    value: "01",
    detail: "Your next race",
    icon: Calendar01Icon,
  },
  {
    label: "Completed Orders",
    value: "02",
    detail: "Payment confirmed",
    icon: CheckListIcon,
  },
];

export default async function UserDashboard({ params }) {
  const { userId } = await params;
  const encodedUserId = userId ? encodeURIComponent(userId) : "";
  const registration = await getUserRegistrationServer(userId, {
    redirectPath: `/users/${encodeURIComponent(String(userId || ""))}`,
  });
  const hasRegistration = hasRegistrationData(registration);
  const isPendingPayment =
    hasRegistration &&
    (registration?.status === "PENDING_PAYMENT" ||
      registration?.status === "pending_payment");
  const isPaymentCompleted = !isPendingPayment;

  if (!hasRegistration) {
    return <RegistrationStepper />;
  }

  const showPaymentStepper = isPendingPayment;
  const raceStatusLabel = showPaymentStepper ? "Payment pending" : "Confirmed";
  const raceStatusTone = showPaymentStepper
    ? "bg-warning/12 text-warning"
    : "bg-success/12 text-success";

  const getData = getUserData(userId, registration);
  const userData = {
    name: getData.fullName,
    email: getData.email,
    registrationId: getData.registrationId,
    eventName: getData.eventName,
    distance: getData.category,
    location: `${getData.city}, ${getData.state}`,
    status: getData.registrationStatus,
  };

  const user = userData;

  return (
    <>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 text-foreground shadow-sm sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-medium text-accent">
              SUDHARVA MARATHON · RUNNER PORTAL
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {user.name}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
              Your marathon journey, registrations, payments, and race updates -
              all in one place.
            </p>

            <Link
              href={encodedUserId ? `/users/${encodedUserId}/events` : "/users"}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
            >
              View My Events <ArrowUpRight01Icon size={18} />
            </Link>
          </div>
        </section>

        {/* <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ink-soft">{label}</p>
                <p className="mt-3 text-3xl font-bold">{value}</p>
                <p className="mt-2 text-xs text-ink-soft">{detail}</p>
              </div>

              <div className="rounded-xl bg-accent/10 p-3 text-accent">
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </section> */}

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-ink-soft">YOUR NEXT RACE</p>
                <h2 className="mt-2 text-xl font-bold">{user.eventName}</h2>
              </div>

              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${raceStatusTone}`}>
                {raceStatusLabel}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <Calendar01Icon className="text-accent" size={20} />
                <p className="mt-3 text-sm text-ink-soft">Race Category</p>
                <p className="mt-1 font-semibold">{user.distance}</p>
              </div>

              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <Flag01Icon className="text-accent" size={20} />
                <p className="mt-3 text-sm text-ink-soft">Location</p>
                <p className="mt-1 font-semibold">{"Ajeya Stadium, Avadi, Chennai" ||  user.location}</p>
                <Link 
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.google.com/maps/place/ajeya+stadium/data=!4m2!3m1!1s0x3a52627fc6dca50d:0xad76da86c69d66ca?sa=X&ved=1t:242&ictx=111"
                  className="mt-1 text-xs text-ink-soft"
                >
                  Venue for the race
                </Link>
              </div>
            </div>

            {showPaymentStepper ? (
              <div className="mt-5">
                <PendingPaymentPanel
                  registration={registration}
                  userId={userId}
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
              {/* <div>
              <p className="text-xs text-ink-soft">Registration ID</p>
              <p className="mt-1 font-semibold">{user.registrationId}</p>
            </div> */}

              <Link
                href={
                  encodedUserId ? `/users/${encodedUserId}/events` : "/users"
                }
                className="text-sm font-semibold text-accent hover:text-accent/80"
              >
                View details →
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {!showPaymentStepper && (

            <RunnerRegistrationCard />
            )}

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold">Recent Activity</h2>

              <div className="mt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                    <CheckListIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Registration confirmed
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Your marathon entry is confirmed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Clock01Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Race preparation</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Check your event updates before race day.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                      isPaymentCompleted
                        ? "bg-success/12 text-success"
                        : "bg-warning/12 text-warning"
                    }`}
                  >
                    {isPaymentCompleted ? (
                      <CheckListIcon size={20} />
                    ) : (
                      <Clock01Icon size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {isPaymentCompleted
                        ? "Payment completed"
                        : "Pending payment"}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {isPaymentCompleted
                        ? "Your payment is complete and your entry is secured."
                        : "Complete your payment to finish registration."}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={
                  encodedUserId ? `/users/${encodedUserId}/timeline` : "/users"
                }
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent"
              >
                Full activity timeline <ArrowUpRight01Icon size={17} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
