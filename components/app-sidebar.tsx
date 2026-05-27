"use client";

import type { ComponentType } from "react";
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
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, getLocaleFromPathname, localizePath, stripLocaleFromPathname } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

const links: Array<{
  href: string;
  labelKey: keyof ReturnType<typeof getDictionary>["app"];
  icon: ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}> = [
  { href: "/dashboard", labelKey: "dashboard", icon: FolderKanban },
  { href: "/projects/new", labelKey: "newProject", icon: Sparkles },
  { href: "/library", labelKey: "library", icon: LibraryBig },
  { href: "/billing", labelKey: "billing", icon: Wallet },
  { href: "/settings", labelKey: "settings", icon: Settings },
  { href: "/admin", labelKey: "admin", icon: Shield, adminOnly: true },
];

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const unlocalizedPathname = stripLocaleFromPathname(pathname);
  const visibleLinks = links.filter((link) => !link.adminOnly || isAdmin);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:w-[220px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface lg:py-5">
        {/* Logo */}
        <Link href={localizePath("/dashboard", locale)} className="flex items-center gap-2.5 px-5 mb-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-text text-[11px] font-bold text-bg">
            S
          </div>
          <span className="text-sm font-semibold tracking-tight text-text">SoftAI</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3">
          {visibleLinks.map((link) => {
              const Icon = link.icon;
              const active =
                unlocalizedPathname === link.href || unlocalizedPathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={localizePath(link.href, locale)}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-[7px] text-[13px] font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-accent-text"
                    : "text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                <Icon className="h-[15px] w-[15px] shrink-0" />
                {dictionary.app[link.labelKey]}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border px-5 pt-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Viewport-wide top bar and drawer */}
      <div className="app-mobile-menu fixed inset-x-0 top-0 z-[1000]">
        <div className="flex h-16 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur-md">
          <Link href={localizePath("/dashboard", locale)} className="flex items-center gap-2.5">
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
            <span className="sr-only">{dictionary.app.openNavigation}</span>
            <Menu className="h-4 w-4" />
          </label>
        </div>

        <div className="app-mobile-menu-drawer fixed inset-0 z-[2147483647]">
          <label
            htmlFor="app-mobile-menu-toggle"
            aria-label={dictionary.app.closeNavigation}
            className="absolute inset-0 block bg-text/25"
          />
          <aside className={cn(
            "relative z-[1] flex h-full w-[min(82vw,320px)] flex-col bg-surface px-3 py-4 shadow-[var(--shadow-lg)]",
            locale === "ar" ? "mr-auto border-r border-border" : "ml-auto border-l border-border",
          )}>
            <div className="mb-5 flex items-center justify-between px-2">
              <Link href={localizePath("/dashboard", locale)} className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-text text-[11px] font-bold text-bg">
                  S
                </div>
                <span className="text-sm font-semibold tracking-tight text-text">SoftAI</span>
              </Link>
              <label
                htmlFor="app-mobile-menu-toggle"
                aria-label={dictionary.app.closeNavigation}
                className="btn btn-ghost btn-sm cursor-pointer"
              >
                <X className="h-4 w-4" />
              </label>
            </div>

            <nav className="flex-1 space-y-0.5">
              {visibleLinks.map((link) => {
                  const Icon = link.icon;
                  const active =
                    unlocalizedPathname === link.href || unlocalizedPathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={localizePath(link.href, locale)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-accent-soft text-accent-text"
                        : "text-text-secondary hover:bg-surface-raised hover:text-text",
                    )}
                  >
                    <Icon className="h-[15px] w-[15px] shrink-0" />
                    {dictionary.app[link.labelKey]}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center justify-between gap-3 border-t border-border px-2 pt-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7",
                  },
                }}
              />
              <LanguageSwitcher />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
