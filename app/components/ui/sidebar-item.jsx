import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const sidebarItemVariants = cva(
  "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        active:
          "text-sidebar-foreground bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground",
        destructive: "text-red-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function SidebarItem({
  className,
  variant = "default",
  inactive = false,
  side = "left",
  ...props
}) {
  return (
    <a
      className={cn(sidebarItemVariants({ variant }), className)}
      data-side={side}
      data-variant={variant}
      data-active={variant === "active" && (inactive ? false : true)}
      {...props}
    />
  );
}

export { SidebarItem, sidebarItemVariants };
