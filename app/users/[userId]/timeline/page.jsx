import Link from "next/link";
import {
  CalendarDots,
  ClockCounterClockwise,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

export default async function TimelinePage({ params }) {
  const { userId } = await params;
  const encodedUserId = encodeURIComponent(String(userId || ""));

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          <ClockCounterClockwise size={14} weight="bold" />
          Activity Timeline
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Timeline is being prepared
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
          We are organizing your registration, payment, and event milestones
          into a single timeline view. You can continue using your dashboard
          and profile in the meantime.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/users/${encodedUserId}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:brightness-105"
          >
            <Sparkle size={16} weight="fill" />
            Back to dashboard
          </Link>
          <Link
            href={`/users/${encodedUserId}/events`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/5"
          >
            <CalendarDots size={16} weight="bold" />
            View my events
          </Link>
        </div>
      </section>
    </main>
  );
}