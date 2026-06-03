"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Blocks,
  Clock,
  CreditCard,
  LibraryBig,
  Menu,
  Palette,
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
import { ThemeToggle } from "@/components/theme-toggle";
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
    href: "/history",
    labelKey: "history",
    shortLabel: "History",
    icon: Clock,
    group: "create",
  },
  {
    href: "/brand-kit",
    labelKey: "brandKit",
    shortLabel: "Brand",
    icon: Palette,
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
  const bottomLinks = createLinks.slice(0, 5);

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
        aria-current={active ? "page" : undefined}
        className={cn(
          "sidebar-link group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium",
          active
            ? "bg-accent-soft text-accent-text"
            : "text-text-secondary hover:bg-surface-raised hover:text-text",
        )}
      >
        <Icon className="h-4.25 w-4.25 shrink-0" />
        <span className="min-w-0 truncate">{dictionary.app[link.labelKey]}</span>
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
          "sidebar-link flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium",
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

  function renderBottomLink(link: (typeof links)[number]) {
    const Icon = link.icon;
    const activeHref = link.href.split("#")[0] ?? link.href;
    const active =
      unlocalizedPathname === activeHref ||
      unlocalizedPathname.startsWith(`${activeHref}/`);

    return (
      <Link
        key={link.href}
        href={localizePath(link.href, locale)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "sidebar-link flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-semibold leading-none",
          active
            ? "bg-accent-soft text-accent-text"
            : "text-text-tertiary hover:bg-surface-raised hover:text-text",
        )}
      >
        <Icon className="h-4.5 w-4.5 shrink-0" />
        <span className="max-w-full truncate">{link.shortLabel}</span>
      </Link>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-58 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface lg:px-3 lg:py-3">
        {/* Logo */}
        <Link
          href={localizePath("/dashboard", locale)}
          className="mb-4 flex items-center gap-2.5 rounded-xl border border-border-strong bg-surface-raised px-3 py-2.5 text-text transition-colors hover:bg-accent-soft"
        >
          <div className="grid shrink-0 grid-cols-2 gap-0.5">
            <span className="h-2 w-2 rounded-xs border border-current" />
            <span className="h-2 w-2 rounded-xs border border-current" />
            <span className="h-2 w-2 rounded-xs border border-current" />
            <span className="h-2 w-2 rounded-xs bg-accent" />
          </div>
          <span className="text-sm font-semibold tracking-tight">SoftAI</span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col">
          <div className="space-y-1">{createLinks.map(renderDesktopLink)}</div>
          <div className="mt-auto space-y-1 border-t border-border pt-3">
            {accountLinks.map(renderDesktopLink)}
          </div>
        </nav>

        {/* User */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
          <ThemeToggle />
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
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-1000 border-t border-border bg-surface/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-(--shadow-lg) backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-110 gap-1">
          {bottomLinks.map(renderBottomLink)}
        </div>
      </nav>
    </>
  );
}
