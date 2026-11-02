import * as React from "react";
import { cn } from "@/lib/utils";

function SidebarLabel({ className, side = "left", children, ...props }) {
  return (
    <div
      data-side={side}
      className={cn(
        "flex h-8 items-center rounded-md px-3 text-xs font-medium text-sidebar-foreground/50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { SidebarLabel };
