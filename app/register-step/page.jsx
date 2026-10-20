import StepperForm from "@/components/registration/StepperForm";

export const metadata = {
  title: "Register — Sudharva Marathon",
  description:
    "Register for the Sudharva Marathon — run 5K or 10K, or join as a volunteer, for health, the environment, and education.",
};

export default function RegisterStepPage() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-page">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent sm:text-sm">
            Sudharva Marathon
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Join the Movement
          </h1>
          <p className="mt-3 text-sm text-ink-soft sm:text-base">
            Register in three quick steps — personal details, event
            preferences, and confirmation. Your details carry you to the
            start line.
          </p>
        </header>
        {/* <StepperForm /> */}
      </div>
    </section>
  );
}
