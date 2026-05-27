"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MarketingNav({ hasAccess }: { hasAccess: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to prevent weird states
  useEffect(() => {
    const handleResize = () => setMobileMenuOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-text text-[11px] font-bold text-bg">
            S
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-text">SoftAI</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 sm:flex">
          <Link href="/pricing" className="text-sm font-medium text-text-secondary hover:text-text transition-colors">
            Pricing
          </Link>
          {hasAccess ? (
            <Link href="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
              >
                Log in
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="marketing-mobile-menu"
          className="sm:hidden -m-2 p-2 text-text-secondary hover:text-text transition-colors"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div
          id="marketing-mobile-menu"
          className="sm:hidden border-t border-border bg-surface px-6 py-4 shadow-[var(--shadow-sm)]"
        >
          <nav className="flex flex-col gap-4">
            <Link
              href="/pricing"
              className="text-[15px] font-medium text-text-secondary hover:text-text transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 border-t border-border">
              {hasAccess ? (
                <Link
                  href="/dashboard"
                  className="btn-primary w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-in"
                    className="btn-secondary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
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
