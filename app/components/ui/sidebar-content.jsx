import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const sidebarContentVariants = cva("flex flex-col gap-0.5 w-full", {
  defaultVariants: {},
});

function SidebarContent({ side = "left", className, ...props }) {
  return (
    <div
      style={{ "--sidebar-side": side }}
      className={cn(sidebarContentVariants(), className)}
      data-sidebar="content"
      {...props}
    />
  );
}

export { SidebarContent, sidebarContentVariants };
