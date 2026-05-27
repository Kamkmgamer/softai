"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LibraryBig,
  Menu,
  Settings,
  Shield,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: FolderKanban },
  { href: "/projects/new", label: "New project", icon: Sparkles },
  { href: "/library", label: "Library", icon: LibraryBig },
  { href: "/billing", label: "Billing", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: Shield },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:w-[220px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface lg:py-5">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-5 mb-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-text text-[11px] font-bold text-bg">
            S
          </div>
          <span className="text-sm font-semibold tracking-tight text-text">SoftAI</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-[7px] text-[13px] font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-accent-text"
                    : "text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                <Icon className="h-[15px] w-[15px] shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="mt-auto border-t border-border px-5 pt-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
        </div>
      </aside>

      {/* Viewport-wide top bar and drawer */}
      <div className="app-mobile-menu fixed inset-x-0 top-0 z-[1000]">
        <div className="flex h-16 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur-md">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-text text-[11px] font-bold text-bg">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-text">SoftAI</span>
          </Link>
          <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-text focus-visible:shadow-[var(--focus-ring)]">
            <input
              key={pathname}
              id="app-mobile-menu-toggle"
              type="checkbox"
              className="app-mobile-menu-toggle sr-only"
            />
            <span className="sr-only">Open navigation menu</span>
            <Menu className="h-4 w-4" />
          </label>
        </div>

        <div className="app-mobile-menu-drawer fixed inset-0 z-[2147483647]">
          <label
            htmlFor="app-mobile-menu-toggle"
            aria-label="Close navigation menu"
            className="absolute inset-0 block bg-text/25"
          />
          <aside className="relative z-[1] ml-auto flex h-full w-[min(82vw,320px)] flex-col border-l border-border bg-surface px-3 py-4 shadow-[var(--shadow-lg)]">
            <div className="mb-5 flex items-center justify-between px-2">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-text text-[11px] font-bold text-bg">
                  S
                </div>
                <span className="text-sm font-semibold tracking-tight text-text">SoftAI</span>
              </Link>
              <label
                htmlFor="app-mobile-menu-toggle"
                aria-label="Close navigation menu"
                className="btn btn-ghost btn-sm cursor-pointer"
              >
                <X className="h-4 w-4" />
              </label>
            </div>

            <nav className="flex-1 space-y-0.5">
              {links.map((link) => {
                const Icon = link.icon;
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-accent-soft text-accent-text"
                        : "text-text-secondary hover:bg-surface-raised hover:text-text",
                    )}
                  >
                    <Icon className="h-[15px] w-[15px] shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border px-2 pt-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                  },
                }}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
