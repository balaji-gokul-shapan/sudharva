import AuthEntryActions from "./AuthEntryActions";

export const metadata = {
  title: "Runner Portal - Sudharva Marathon",
  description:
    "Sign in to view your runner dashboard, registration progress, and payment status.",
};

export default function UsersIndexPage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <section className="mx-auto max-w-3xl rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-10">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Runner Portal
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Access your marathon dashboard
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
            Sign in to continue your registration, view your event details, and
            track payment status.
          </p>

          <AuthEntryActions />
        </div>
      </section>
    </main>
  );
}