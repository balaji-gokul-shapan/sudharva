
"use client";

import { cn } from "@/lib/utils";

export function Ribbon({
  children = "SECURED",
  position = "top-left",
  color = "bg-white",
  textColor = "text-blue-900",
  className,
}) {
  const positions = {
    "top-left": "-left-8 top-4 -rotate-45",
    "top-right": "-right-8 top-5 rotate-45",
    "bottom-left": "-left-8 bottom-4 rotate-45",
    "bottom-right": "-right-8 bottom-4 -rotate-45",
  };

  return (
    <div
      className={cn(
        "absolute z-20 flex h-6 w-32 items-center justify-center",
        "text-[10px] font-semibold uppercase tracking-wider",
        color,
        textColor,
        positions[position] || positions["top-left"],
        className
      )}
    >
      {children}
    </div>
  );
}
