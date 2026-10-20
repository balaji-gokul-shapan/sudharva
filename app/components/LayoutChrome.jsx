"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

const CHROMELESS_PATHS = ["/dedication-register", "/register"];

export default function LayoutChrome({ children }) {
  const pathname = usePathname();
  const hideChrome = CHROMELESS_PATHS.includes(pathname);

  return (
    <>
      {!hideChrome && <Navbar />}

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>

      {!hideChrome && <Footer />}
    </>
  );
}
