"use client";

import Image from "next/image";

export default function AppLoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Sudharva Marathon"
      className="fixed inset-0 z-[9999] grid min-h-screen w-full place-items-center overflow-hidden bg-background px-6 text-foreground"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-20 size-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center rounded-3xl border border-border/70 bg-surface/90 px-8 py-9 text-center shadow-2xl shadow-accent/10 backdrop-blur-xl">
        <Image
          src="/image/cta/logo.png"
          alt="Sudharva Marathon"
          width={190}
          height={49}
          priority
          className="h-auto w-40"
        />

        <div className="relative mt-5 grid size-32 place-items-center">
          <span
            aria-hidden="true"
            className="absolute inset-1 rounded-full aspect-square"
          />
          <span
            aria-hidden="true"
            className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-accent"
          />
          <Image
            src="/video/preloader.gif"
            alt=""
            width={110}
            height={110}
            unoptimized
            className="size-28 object-contain"
          />
        </div>

        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.22em] text-accent">
          Sudharva 2027
        </p>
        <p className="mt-2 text-sm font-medium text-ink-soft">
          Getting everything ready for you
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
        </div>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
