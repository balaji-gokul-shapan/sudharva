import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarMenuButtonVariants = cva(
  "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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

function SidebarMenuButton({
  className,
  side = "left",
  variant = "default",
  isActive = false,
  inset = false,
  ...props
}) {
  return (
    <button
      data-side={side}
      data-variant={variant}
      data-active={isActive}
      data-inset={inset}
      className={cn(sidebarMenuButtonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { SidebarMenuButton, sidebarMenuButtonVariants };
