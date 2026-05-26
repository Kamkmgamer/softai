"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LibraryBig,
  Settings,
  Shield,
  Sparkles,
  Wallet,
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
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-[220px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface lg:py-5">
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

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 backdrop-blur-md px-2 py-1.5 lg:hidden">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors",
                active
                  ? "text-accent-text"
                  : "text-text-tertiary",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{link.label.split(" ").pop()}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
