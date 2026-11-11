"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { resetClientSessionData } from "@/lib/resetClientSession";

export default function ResetHomeLink({
  className = "",
  children,
  ariaLabel,
}) {
  const dispatch = useAppDispatch();
  const [isResetting, setIsResetting] = useState(false);

  const handleClick = async () => {
    if (isResetting) return;

    setIsResetting(true);

    try {
      await resetClientSessionData(dispatch);
    } catch {
      // Continue to home even if reset has partial failures.
    } finally {
      window.location.replace("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      disabled={isResetting}
    >
      {children}
    </button>
  );
}
