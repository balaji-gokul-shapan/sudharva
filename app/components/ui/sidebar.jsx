import * as React from "react";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = 204;
const SIDEBAR_WIDTH_MIN = 48;

export const Sidebar = React.memo(function Sidebar({
  side = "left",
  collapsible = "none",
  className,
  children,
  ...props
}) {
  const [state, setState] = React.useState({ collapse: true });

  if (collapsible === "none") {
    return (
      <div
        data-sidebar="sidebar"
        data-state="collapsed"
        className={cn(
          "group flex flex-col overflow-hidden bg-sidebar-foreground text-sidebar-foreground transition-[width,height] duration-200 ease-out",
          `w-${SIDEBAR_WIDTH}`,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-sidebar="wrapper"
      className="group flex min-h-svh w-full touch-none select-none forces-col-fills"
    >
      <div
        data-sidebar="content"
        className="fixed inset-y-0 z-20 flex flex-col bg-sidebar-foreground text-sidebar-foreground"
        style={{
          width: SIDEBAR_WIDTH,
          transform: `translateX(${state.collapse ? SIDEBAR_WIDTH_MIN : 0})`,
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

export const SidebarContent = React.memo(function SidebarContent({ children }) {
  return <div data-sidebar="content">{children}</div>;
});
