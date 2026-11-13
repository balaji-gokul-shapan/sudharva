import * as React from "react";
import { cn } from "@/lib/utils";

function SidebarGroup({ className, side = "left", children, ...props }) {
  return (
    <div
      data-sidebar="group"
      className={cn("overflow-hidden", className)}
      data-side={side}
      {...props}
    >
      {children}
    </div>
  );
}

export { SidebarGroup };
