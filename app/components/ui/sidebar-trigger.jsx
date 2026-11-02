import * as React from "react";
import { PanelLeft } from "lucide-react";
import { useSidebar } from "./use-sidebar";
import { cn } from "@/lib/utils";

function SidebarTrigger({ className, onClick, ...props }) {
  const { toggleSidebar } = useSidebar();

  const handleClick = (e) => {
    e.preventDefault();
    toggleSidebar();
    if (onClick) onClick(e);
  };

  return (
    <button
      data-sidebar="trigger"
      onClick={handleClick}
      className={cn(
        "flex h-8 w-8 touch-none items-center justify-center rounded-md text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
        className,
      )}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
}

export { SidebarTrigger };
