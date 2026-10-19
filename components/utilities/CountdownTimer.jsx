'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { ShineBorder } from '@/components/animation/shine-border';

export function diffParts(target, now) {
  const total = Math.max(0, target - now);
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
  };
}

export const pad2 = (n) => String(n).padStart(2, '0');

export function useCountdown(target) {
  const targetMs = new Date(target).getTime();
  const valid = Number.isFinite(targetMs);
  // null until mount: `Date.now()` is unstable during prerender (Next 16
  // errors on it in Client Components), so it is only read inside the effect.
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (!valid) return;
    const initial = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [valid, targetMs]);

  if (!valid) return { valid: false, ready: false, parts: null };
  const ready = now !== null;
  // Before mount, show a stable all-zero skeleton that matches the server HTML.
  const parts = diffParts(targetMs, ready ? now : targetMs);
  return { valid: true, ready, parts };
}

function RollDigit({ value, label }) {
  const reduce = useReducedMotion();
  return (
    <span className="flex flex-col items-center leading-none">
      <span
        className="relative block h-[1.35em] w-[2ch] overflow-hidden tabular-nums"
        aria-hidden="true"
      >
        {reduce ? (
          <span className="absolute inset-0 grid place-items-center">{value}</span>
        ) : (
          <motion.span
            key={value}
            className="absolute inset-0 grid place-items-center"
            initial={{ y: '100%', opacity: 0.4 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            {value}
          </motion.span>
        )}
      </span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] opacity-70">
        {label}
      </span>
    </span>
  );
}

export function CountdownTimer({
  target,
  variant = 'navbar',
  className,
  onComplete,
  expiredLabel = 'Race day is here!',
  ...props
}) {
  const { valid, ready, parts } = useCountdown(target);
  const fired = useRef(false);
  const done = valid && ready && parts && parts.total <= 0;

  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onComplete?.();
    }
    if (!done) fired.current = false;
  }, [done, onComplete]);

  const isHero = variant === 'hero';

  if (!valid) {
    return (
      <span
        role="timer"
        aria-label="Countdown unavailable"
        className={cn('text-xs text-ink-soft', className)}
        {...props}
      >
        Countdown unavailable
      </span>
    );
  }

  if (done) {
    return (
      <span
        role="timer"
        aria-live="polite"
        className={cn(
          'inline-flex items-center gap-1.5 font-bold',
          isHero ? 'text-lg text-primary' : 'text-xs text-accent',
          className
        )}
        {...props}
      >
        <span
          className="size-1.5 animate-pulse rounded-full bg-accent"
          aria-hidden="true"
        />
        {expiredLabel}
      </span>
    );
  }

  const cells = [
    { value: pad2(parts.days), label: parts.days === 1 ? 'Day' : 'Days' },
    { value: pad2(parts.hours), label: 'Hrs' },
    { value: pad2(parts.minutes), label: 'Min' },
    { value: pad2(parts.seconds), label: 'Sec' },
  ];

  return (
    <span
      className={cn(
        'relative inline-block rounded-md border border-border bg-muted/60',
        variant === 'hero' ? 'px-3 py-1.5' : 'px-2 py-1',
        className
      )}
      {...props}
    >
      <ShineBorder
        borderWidth={1}
        duration={10}
        shineColor={["#1F1F1F", "#6B7280", "#E5E7EB", "#525252"]}
        className="rounded-[inherit]"
      />
      <span
        role="timer"
        aria-live="off"
        className={cn(
          'relative inline-flex items-stretch gap-1 font-bold tabular-nums px-1 py-0.5',
          isHero ? 'text-3xl text-foreground sm:text-4xl' : 'text-sm text-ink',
        )}
      >
        {cells.map((cell, i) => (
          <span key={cell.label} className="flex items-stretch">
            <RollDigit value={cell.value} label={cell.label} />
            {i < cells.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'mx-0.5 self-start opacity-40',
                  isHero ? 'mt-1 text-2xl' : 'mt-0.5 text-xs'
                )}
              >
                :
              </span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

export default CountdownTimer;
