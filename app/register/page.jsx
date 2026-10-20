import Image from "next/image";
import Link from "next/link";
import StepperForm from "@/components/registration/StepperForm";
import Index from "./pages";

export const metadata = {
  title: "Register — Sudharva Marathon",
  description:
    "Register for the Sudharva Marathon — run 5K or 10K, or join as a volunteer, for health, the environment, and education.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
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
            <span className="mt-0.5 block max-w-full px-1 text-center text-[7px] font-bold uppercase leading-none tracking-[0.12em] text-ink-soft min-[375px]:text-[8px] sm:mt-1 sm:text-[10px]">
              Run Against Diabetes
            </span>
          </Link>
          <Link
            href="/"
            className="whitespace-nowrap text-xs font-semibold text-ink-soft transition-colors hover:text-accent sm:text-sm"
          >
            Back to website
          </Link>
        </div>
      </header>

      <section className="relative overflow-x-clip py-10 sm:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="container-page">
          <Index />
        </div>
      </section>
    </div>
  );
}
