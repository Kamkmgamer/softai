"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
} from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export function MarketingNav({ hasAccess }: { hasAccess: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);

  // Close mobile menu on resize to prevent weird states
  useEffect(() => {
    const handleResize = () => setMobileMenuOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-6">
        <Link
          href={localizePath("/", locale)}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-text text-[11px] font-bold text-bg">
            S
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-text">
            Soft-Magic AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="flex items-center gap-6 app-hide-on-mobile">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href={localizePath("/features", locale)}
            className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
          >
            {dictionary.shared.features}
          </Link>
          <Link
            href={localizePath("/pricing", locale)}
            className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
          >
            {dictionary.shared.pricing}
          </Link>
          {hasAccess ? (
            <Link
              href={localizePath("/dashboard", locale)}
              className="btn btn-primary"
            >
              {dictionary.app.dashboard}
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={localizePath("/sign-in", locale)}
                className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
              >
                {dictionary.shared.logIn}
              </Link>
              <Link
                href={localizePath("/sign-up", locale)}
                className="btn btn-primary"
              >
                {dictionary.shared.signUp}
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="marketing-mobile-menu"
          className="app-hide-on-desktop -m-2 p-2 text-text-secondary hover:text-text transition-colors"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="sr-only">{dictionary.app.openNavigation}</span>
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div
          id="marketing-mobile-menu"
          className="app-hide-on-desktop border-t border-border bg-surface px-6 py-4 shadow-(--shadow-sm)"
        >
          <nav className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <LanguageSwitcher className="w-fit" />
              <ThemeToggle />
            </div>
            <Link
              href={localizePath("/features", locale)}
              className="text-[15px] font-medium text-text-secondary hover:text-text transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dictionary.shared.features}
            </Link>
            <Link
              href={localizePath("/pricing", locale)}
              className="text-[15px] font-medium text-text-secondary hover:text-text transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dictionary.shared.pricing}
            </Link>
            <div className="pt-4 border-t border-border">
              {hasAccess ? (
                <Link
                  href={localizePath("/dashboard", locale)}
                  className="btn btn-primary w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {dictionary.shared.dashboard}
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href={localizePath("/sign-in", locale)}
                    className="btn btn-secondary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dictionary.shared.logIn}
                  </Link>
                  <Link
                    href={localizePath("/sign-up", locale)}
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dictionary.shared.signUp}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
