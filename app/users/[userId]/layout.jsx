"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
   const resolvedParams = use(params);  // 
  const userId = getUserId(resolvedParams);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    console.log(userId,"userId");
    
  const url = (href) =>
    href
      ? `/users/${encodeURIComponent(userId)}${href}`
      : `/users/${encodeURIComponent(userId)}`;

  const isActive = (href) => {
    const target = url(href);
    return href === "" ? pathname === target : pathname?.startsWith(target);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex w-full">
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
          className={`fixed top-0 z-40 flex h-screen w-72 flex-col border-r border-border bg-card/80 backdrop-blur transition-transform duration-300 ease-out lg:static lg:z-auto lg:flex lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!sidebarOpen}
        >
          <div className="flex h-20 items-center border-b border-border px-6">
            <Link
              href="/"
              aria-label="Sudharva Marathon home"
              className="inline-flex w-fit flex-col items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <Image
                src="/image/cta/logo.png"
                alt="Sudharva Marathon"
                width={190}
                height={49}
                priority
                className="h-auto w-32 sm:w-40"
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

          <nav className="space-y-1 p-4">
            {navigation.map(({ label, href, icon: Icon }) => {
              const targetUrl = url(href);
              const active = isActive(href);
              console.log(targetUrl,"targetUrl");
              

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
        </aside>

        <main className="min-w-0 flex-1">
          <div className="max-w-5xl lg:max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function UserLayout({ children, params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <UserLayoutInner children={children} params={params} />
    </Suspense>
  );
}
