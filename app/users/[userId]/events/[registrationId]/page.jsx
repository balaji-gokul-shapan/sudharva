import Link from "next/link";
import { ArrowLeft, Receipt } from "@phosphor-icons/react/dist/ssr";

export default async function RegistrationDetailPage({ params }) {
  const { userId, registrationId } = await params;
  const encodedUserId = encodeURIComponent(String(userId || ""));

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <Receipt size={14} weight="bold" />
          Registration Detail
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Detailed view coming soon
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
          We are preparing a detailed page for registration ID
          <span className="mx-1 font-semibold text-foreground">
            {registrationId ? `#${registrationId}` : "(unavailable)"}
          </span>
          with payment proof, category metadata, and receipt timeline.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/users/${encodedUserId}/events`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:brightness-105"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to my events
          </Link>

          <Link
            href={`/users/${encodedUserId}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/5"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
