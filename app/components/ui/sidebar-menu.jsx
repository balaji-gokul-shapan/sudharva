import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const sidebarMenuVariants = cva("flex flex-col gap-1 w-full", {
  defaultVariants: {},
});

function SidebarMenu({ className, side = "left", ...props }) {
  return (
    <ul data-side={side} className={cn(sidebarMenuVariants(), className)} {...props} />
  );
}

export { SidebarMenu, sidebarMenuVariants };
