"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

const CHROMELESS_PATHS = [
  "/dedication-register",
  "/register",
  "/login",
  "/users",
  "/users/",
];

export const dynamic = "force-dynamic";

function ChromeInner({ children }) {
  const pathname = usePathname() ?? "";
  const hideChrome =
    CHROMELESS_PATHS.some((p) => {
      // Exact match or the path starts with the pattern
      if (pathname === p) return true;
      // Also match if path starts with pattern (e.g., /users/123 for /users)
      return pathname.startsWith(p);
    });

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

export default function LayoutChrome({ children }) {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </>
      }
    >
      <ChromeInner>{children}</ChromeInner>
    </Suspense>
  );
}
