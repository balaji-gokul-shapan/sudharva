import * as React from "react";
import { cn } from "@/lib/utils";

function SidebarNav({ className, side = "left", ...props }) {
  return (
    <nav
      data-side={side}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  );
}

export { SidebarNav };
