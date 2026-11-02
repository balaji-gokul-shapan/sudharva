import { createContext, useContext, useEffect, useState } from "react";

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
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp);
    }
  }, [openProp]);

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
    if (onOpenChange) {
      onOpenChange(!open);
    }
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
