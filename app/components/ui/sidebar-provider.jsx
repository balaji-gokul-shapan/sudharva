import * as React from "react";
import { cva } from "class-variance-authority";

const sidebarProviderVariants = cva("flex flex-col", {
  defaultVariants: {
    side: "left",
  },
});

const SidebarProvider = React.forwardRef(function SidebarProvider(
  { defaultOpen = true, open, onOpenChange, side = "left", ...props },
  ref,
) {
  const [state, setState] = React.useState({
    open: defaultOpen,
    side,
  });

  React.useEffect(() => {
    if (open !== undefined) {
      setState({ open, side });
    }
  }, [open, side]);

  return (
    <div
      ref={ref}
      style={{ "--sidebar-width": `${204}px` }}
      className={sidebarProviderVariants({ side })}
      data-sidebar="provider"
      data-state={state.open ? "expanded" : "collapsed"}
      data-side={side}
      {...props}
    />
  );
});

SidebarProvider.displayName = "SidebarProvider";

export { SidebarProvider };
