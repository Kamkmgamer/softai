"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Blocks,
  CreditCard,
  LibraryBig,
  Menu,
  PlusSquare,
  Settings,
  Shield,
  Wallet,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { getDictionary } from "@/lib/dictionaries";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
  stripLocaleFromPathname,
} from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

const links: Array<{
  href: string;
  labelKey: keyof ReturnType<typeof getDictionary>["app"];
  shortLabel: string;
  icon: ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  group: "create" | "account";
}> = [
  {
    href: "/dashboard",
    labelKey: "dashboard",
    shortLabel: "Apps",
    icon: Blocks,
    group: "create",
  },
  {
    href: "/projects/new",
    labelKey: "newProject",
    shortLabel: "Custom",
    icon: PlusSquare,
    group: "create",
  },
  {
    href: "/library",
    labelKey: "library",
    shortLabel: "Library",
    icon: LibraryBig,
    group: "create",
  },
  {
    href: "/billing",
    labelKey: "billing",
    shortLabel: "Billing",
    icon: Wallet,
    group: "account",
  },
  {
    href: "/payments#/billing",
    labelKey: "payments",
    shortLabel: "Payments",
    icon: CreditCard,
    group: "account",
  },
  {
    href: "/settings",
    labelKey: "settings",
    shortLabel: "Settings",
    icon: Settings,
    group: "account",
  },
  {
    href: "/admin",
    labelKey: "admin",
    shortLabel: "Admin",
    icon: Shield,
    adminOnly: true,
    group: "account",
  },
];

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const unlocalizedPathname = stripLocaleFromPathname(pathname);
  const visibleLinks = links.filter((link) => !link.adminOnly || isAdmin);
  const createLinks = visibleLinks.filter((link) => link.group === "create");
  const accountLinks = visibleLinks.filter((link) => link.group === "account");

  function renderDesktopLink(link: (typeof links)[number]) {
    const Icon = link.icon;
    const activeHref = link.href.split("#")[0] ?? link.href;
    const active =
      unlocalizedPathname === activeHref ||
      unlocalizedPathname.startsWith(`${activeHref}/`);

    return (
      <Link
        key={link.href}
        href={localizePath(link.href, locale)}
        title={dictionary.app[link.labelKey]}
        className={cn(
          "group relative flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold leading-none transition-colors",
          active
            ? "bg-surface-raised text-text"
            : "text-text-secondary hover:bg-surface-raised hover:text-text",
        )}
      >
        {active ? (
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
        ) : null}
        <Icon className="h-4.25 w-4.25 shrink-0" />
        {link.shortLabel}
      </Link>
    );
  }

  function renderMobileLink(link: (typeof links)[number]) {
    const Icon = link.icon;
    const activeHref = link.href.split("#")[0] ?? link.href;
    const active =
      unlocalizedPathname === activeHref ||
      unlocalizedPathname.startsWith(`${activeHref}/`);

    return (
      <Link
        key={link.href}
        href={localizePath(link.href, locale)}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
          active
            ? "bg-accent-soft text-accent-text"
            : "text-text-secondary hover:bg-surface-raised hover:text-text",
        )}
      >
        <Icon className="h-3.75 w-3.75 shrink-0" />
        {dictionary.app[link.labelKey]}
      </Link>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-16 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface lg:py-2">
        {/* Logo */}
        <Link
          href={localizePath("/dashboard", locale)}
          className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-text transition-colors hover:bg-accent-soft"
        >
          <div className="grid grid-cols-2 gap-0.5">
            <span className="h-2 w-2 rounded-xs border border-current" />
            <span className="h-2 w-2 rounded-xs border border-current" />
            <span className="h-2 w-2 rounded-xs border border-current" />
            <span className="h-2 w-2 rounded-xs bg-accent" />
          </div>
          <span className="sr-only">SoftAI</span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col px-1.5">
          <div className="space-y-2">{createLinks.map(renderDesktopLink)}</div>
          <div className="mt-auto space-y-2 border-t border-border pt-3">
            {accountLinks.map(renderDesktopLink)}
          </div>
        </nav>

        {/* User */}
        <div className="mt-auto flex flex-col items-center gap-3 border-t border-border px-2 pt-3">
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
      <div className="app-mobile-menu fixed inset-x-0 top-0 z-1000 lg:hidden">
        <div className="flex h-16 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur-md">
          <Link
            href={localizePath("/dashboard", locale)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-[11px] font-bold text-text">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-text">
              SoftAI
            </span>
          </Link>
          <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-text focus-visible:shadow-(--focus-ring)">
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

        <div className="app-mobile-menu-drawer fixed inset-0 z-2147483647">
          <label
            htmlFor="app-mobile-menu-toggle"
            aria-label={dictionary.app.closeNavigation}
            className="absolute inset-0 block bg-text/25"
          />
          <aside
            className={cn(
              "relative z-1 flex h-full w-[min(82vw,320px)] flex-col bg-surface px-3 py-4 shadow-(--shadow-lg)",
              locale === "ar"
                ? "mr-auto border-r border-border"
                : "ml-auto border-l border-border",
            )}
          >
            <div className="mb-5 flex items-center justify-between px-2">
              <Link
                href={localizePath("/dashboard", locale)}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-text text-[11px] font-bold text-bg">
                  S
                </div>
                <span className="text-sm font-semibold tracking-tight text-text">
                  SoftAI
                </span>
              </Link>
              <label
                htmlFor="app-mobile-menu-toggle"
                aria-label={dictionary.app.closeNavigation}
                className="btn btn-ghost btn-sm cursor-pointer"
              >
                <X className="h-4 w-4" />
              </label>
            </div>

            <nav className="flex-1 space-y-4">
              <div className="space-y-0.5">
                {createLinks.map(renderMobileLink)}
              </div>
              <div className="space-y-0.5 border-t border-border pt-4">
                {accountLinks.map(renderMobileLink)}
              </div>
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
