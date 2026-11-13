import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  side = "left",
  children,
}) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;

  const setOpen = (nextValue) => {
    const next = typeof nextValue === "function" ? nextValue(open) : nextValue;

    if (!isControlled) {
      setOpenState(next);
    }

    if (onOpenChange) {
      onOpenChange(next);
    }
  };

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        toggleSidebar,
        side,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
