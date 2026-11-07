"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, use, useState } from "react";
import {
  LayoutDashboardIcon,
  UserIcon,
  Calendar01Icon,
  ShoppingBag01Icon,
  Clock01Icon,
  Menu01Icon,
  Cancel01Icon,
} from "@animateicons/react/huge";
import Image from "next/image";
import { RunnerRegistrationProvider } from "./data/registerInfo";
import { useAppDispatch } from "@/store/hooks";
import { clearAuthSession } from "@/store/slices/users/userRefreshTokenSlice";
import { logout } from "@/store/slices/users/userLoginSlice";
import { clearRegistrationDraft } from "@/store/slices/registration/registrationDraftSlice";
import { resetCreateRegistrationState } from "@/store/slices/registration/createRegistrationSlice";
import { persistor } from "@/store/store";
const getUserId = (params) => params?.userId ?? "";
const navigation = [
  { label: "Dashboard", href: "", icon: LayoutDashboardIcon },
  { label: "My Profile", href: "/profile", icon: UserIcon },
  { label: "My Events", href: "/events", icon: Calendar01Icon },
//   { label: "My Orders", href: "/orders", icon: ShoppingBag01Icon },
  { label: "Timeline", href: "/timeline", icon: Clock01Icon },
];

function UserLayoutInner({ children, params }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resolvedParams = use(params);
  const userId = getUserId(resolvedParams);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
    
  const url = (href) =>
    href
      ? `/users/${encodeURIComponent(userId)}${href}`
      : `/users/${encodeURIComponent(userId)}`;

  const isActive = (href) => {
    const target = url(href);
    return href === "" ? pathname === target : pathname?.startsWith(target);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      dispatch(logout());
      dispatch(clearAuthSession());
      dispatch(clearRegistrationDraft());
      dispatch(resetCreateRegistrationState());
      await persistor.purge();
      await persistor.flush();
       router.replace("/login");
    } finally {
      setSidebarOpen(false);
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full w-full">
        {/* Mobile hamburger button */}
        <button
          className="fixed top-2 left-2 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu01Icon size={24} className="text-foreground" />
        </button>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar - shown on desktop, slides in on mobile */}
        <aside
          className={`fixed top-0 z-40 flex h-screen w-72 flex-col border-r border-border bg-card/80 backdrop-blur transition-transform duration-300 ease-out lg:static lg:z-auto lg:h-full lg:flex lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!sidebarOpen}
        >
          <div className="flex h-20 items-center border-b border-border px-6">
            <Link
              href="/"
              aria-label="Sudharva Marathon home"
              className="inline-flex w-fit flex-col items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <Image
                src="/image/cta/logo.png"
                alt="Sudharva Marathon"
                width={190}
                height={49}
                priority
                className="h-auto w-32 sm:w-40"
                style={{ height: "auto" }}
              />
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink">
                Run against Diabetes.
              </span>
            </Link>

            <button
              className="ml-auto flex h-8 w-8 items-center justify-center rounded hover:bg-muted lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            >
              <Cancel01Icon size={20} className="text-foreground" />
            </button>
          </div>

          <div className="border-b border-border px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Runner Workspace
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Manage profile, events, orders, and race timeline.
            </p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map(({ label, href, icon: Icon }) => {
              const targetUrl = url(href);
              const active = isActive(href);

              return (
                <Link
                  key={label}
                  href={targetUrl}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/12 text-primary shadow-sm"
                      : "text-ink-soft hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={20}
                    className="shrink-0 transition-transform duration-300 group-hover:scale-105"
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-border p-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        <main id="users-main-scroll" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:max-w-7xl lg:p-8">
            <RunnerRegistrationProvider userId={userId}>
              {children}
            </RunnerRegistrationProvider>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function UserLayout({ children, params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <UserLayoutInner params={params}>{children}</UserLayoutInner>
    </Suspense>
  );
}
