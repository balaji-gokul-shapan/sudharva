"use client";

import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

export function ConfettiSideCannons({
  onClick,
  children,
  className,
  fireOnClick = true,
  triggerKey,
  durationMs = 3000,
  ...props
}) {
  const previousTriggerRef = useRef(triggerKey);

  const launchConfetti = useCallback(() => {
    const end = Date.now() + durationMs;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, [durationMs]);

  useEffect(() => {
    if (triggerKey === undefined || triggerKey === null) return;

    if (previousTriggerRef.current === triggerKey) return;

    previousTriggerRef.current = triggerKey;
    launchConfetti();
  }, [launchConfetti, triggerKey]);

  const handleClick = (event) => {
    onClick?.(event);
    if (event?.defaultPrevented || !fireOnClick) return;
    launchConfetti();
  };

  return (
    <div className="relative">
      <Button onClick={handleClick} className={className} {...props}>
        {children}
      </Button>
    </div>
  );
}
