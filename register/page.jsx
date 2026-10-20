import RegistrationForm from "./RegistrationForm";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Register — Sudharva Marathon",
  description:
    "Register for the Sudharva Marathon — run 5K or 10K, or join as a volunteer, for health, the environment, and education.",
};

export default function RegisterPage() {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="container-page flex min-h-[76px] items-center justify-between gap-3 sm:min-h-20">
          <Link
            href="/"
            aria-label="Sudharva Marathon home"
            className="flex shrink-0 flex-col items-center"
          >
            <Image
              src="/image/cta/logo.png"
              alt="Sudharva Marathon"
              width={190}
              height={49}
              priority
              sizes="(max-width: 374px) 112px, (max-width: 639px) 128px, (max-width: 1023px) 160px, 192px"
              className="h-auto w-28 max-w-full min-[375px]:w-32 sm:w-40 lg:w-48"
            />
            <span className="mt-0.5 block max-w-full px-1 text-center text-[7px] font-bold uppercase leading-none tracking-[0.12em] text-ink-soft min-[375px]:text-[8px] sm:mt-0 sm:text-[10px]">
              Run Against Diabetes
            </span>
          </Link>
          <Link
            href="/"
            className="whitespace-nowrap text-xs font-semibold text-ink-soft transition-colors hover:text-accent sm:text-sm"
          >
            Back to Website
          </Link>
        </div>
      </header>

      <section className="relative py-16 sm:py-24">
        <div className="container-page">
          <header className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent sm:text-sm">
              Sudharva Marathon
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Register to Run
            </h1>
            <p className="mt-3 text-sm text-ink-soft sm:text-base">
              Take a stride for health, the environment, and education. Pick your
              category and confirm your spot in a minute.
            </p>
          </header>

          <RegistrationForm />
        </div>
      </section>
    </>
  );
}
