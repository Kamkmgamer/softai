"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Blocks,
  Clock,
  CreditCard,
  ChevronsLeft,
  ChevronsRight,
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
    shortLabel: "New",
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
    href: "/api/portal/polar",
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

function SidebarTooltip({
  children,
  label,
  collapsed,
}: {
  children: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const open = useCallback(() => {
    if (!collapsed) return;
    timeoutRef.current = setTimeout(() => setShow(true), 400);
  }, [collapsed]);

  const close = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!collapsed) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      {show ? (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-text px-2.5 py-1.5 text-xs font-medium text-bg shadow-(--shadow-md) animate-fade-in">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const unlocalizedPathname = stripLocaleFromPathname(pathname);
  const visibleLinks = links.filter((link) => !link.adminOnly || isAdmin);
  const createLinks = visibleLinks.filter((link) => link.group === "create");
  const accountLinks = visibleLinks.filter((link) => link.group === "account");
  const bottomLinks = createLinks.slice(0, 5);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("softai-sidebar-collapsed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("softai-sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  function renderDesktopLink(link: (typeof links)[number]) {
    const Icon = link.icon;
    const activeHref = link.href.split("#")[0] ?? link.href;
    const active =
      unlocalizedPathname === activeHref ||
      unlocalizedPathname.startsWith(`${activeHref}/`);

    const linkContent = (
      <Link
        key={link.href}
        href={localizePath(link.href, locale)}
        title={collapsed ? dictionary.app[link.labelKey] : undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          "sidebar-link group flex items-center gap-2.5 rounded-lg py-2 text-[13px] font-medium",
          collapsed ? "justify-center px-2" : "px-3",
          active
            ? "bg-accent-soft text-accent-text"
            : "text-text-secondary hover:bg-surface-raised hover:text-text",
        )}
      >
        <Icon className="h-4.25 w-4.25 shrink-0" />
        <span
          className={cn(
            "min-w-0 truncate transition-opacity duration-200",
            collapsed && "hidden w-0 opacity-0",
            !collapsed && "opacity-100",
          )}
        >
          {dictionary.app[link.labelKey]}
        </span>
      </Link>
    );

    return (
      <SidebarTooltip
        key={link.href}
        label={dictionary.app[link.labelKey]}
        collapsed={collapsed}
      >
        {linkContent}
      </SidebarTooltip>
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
        <span className="leading-none">{link.shortLabel}</span>
      </Link>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 flex h-dvh shrink-0 flex-col border-r border-border bg-surface px-3 py-3 transition-[width] duration-200 app-hide-on-mobile",
          collapsed ? "w-18" : "w-60",
        )}
      >
        {/* Logo + toggle */}
        <div
          className={cn(
            "mb-4 flex items-center gap-2.5",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          <Link
            href={localizePath("/dashboard", locale)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border border-border-strong bg-surface-raised text-text transition-colors hover:bg-accent-soft",
              collapsed ? "h-9 w-9 justify-center px-0" : "px-3 py-2.5",
            )}
          >
            {collapsed ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-text">
                S
              </div>
            ) : (
              <Image
                src="/logo.png"
                alt="Soft-Magic AI"
                width={100}
                height={50}
                className="shrink-0 rounded-md"
                style={{ width: "auto", height: "auto" }}
              />
            )}
          </Link>
          {!collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-raised hover:text-text"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col">
          <div className="space-y-1">{createLinks.map(renderDesktopLink)}</div>
          <div className="mt-auto space-y-1 border-t border-border pt-3">
            {accountLinks.map(renderDesktopLink)}
          </div>
        </nav>

        {/* Expand button + User */}
        <div
          className={cn(
            "mt-3 flex items-center border-t border-border pt-3",
            collapsed ? "flex-col gap-2" : "justify-between gap-2",
          )}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-raised hover:text-text"
              aria-label="Expand sidebar"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          ) : null}
          <div
            className={cn("flex items-center gap-2", collapsed && "flex-col")}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-7 w-7",
                },
              }}
            />
            {!collapsed ? (
              <>
                <ThemeToggle />
                <LanguageSwitcher />
              </>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Viewport-wide top bar and drawer */}
      <div className="app-mobile-menu fixed inset-x-0 top-0 z-1000 app-hide-on-desktop">
        <div className="flex h-16 items-center justify-between border-b border-border bg-surface px-5">
          <Link
            href={localizePath("/dashboard", locale)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-[11px] font-bold text-text">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-text">
              Soft-Magic AI
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
                  Soft-Magic AI
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

      <nav className="fixed inset-x-0 bottom-0 z-1000 flex border-t border-border bg-surface px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-(--shadow-lg) app-hide-on-desktop">
        <div className="mx-auto flex max-w-110 gap-1">
          {bottomLinks.map(renderBottomLink)}
        </div>
      </nav>
    </>
  );
}
