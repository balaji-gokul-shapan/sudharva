import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const sidebarMenuItemVariants = cva(
  "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        active:
          "text-sidebar-foreground bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground",
        destructive: "text-red-500 hover:bg-red-50 hover:text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function SidebarMenuItem({
  className,
  variant = "default",
  isActive = false,
  side = "left",
  ...props
}) {
  return (
    <button
      data-side={side}
      data-variant={variant}
      data-active={isActive}
      className={cn(sidebarMenuItemVariants({ variant }), className)}
      {...props}
    />
  );
}

export { SidebarMenuItem, sidebarMenuItemVariants };
