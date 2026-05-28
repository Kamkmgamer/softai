"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { DEFAULT_LOCALE, getLocaleFromPathname, localizePath } from "@/lib/i18n";

export function AuthControls() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;

  if (!isLoaded) {
    return <div className="h-8 w-20 animate-pulse rounded bg-surface-raised" />;
  }

  if (isSignedIn) {
    return (
      <Link href={localizePath("/dashboard", locale)} className="btn-primary">
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={localizePath("/sign-in", locale)}
        className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
      >
        Log in
      </Link>
      <Link href={localizePath("/sign-up", locale)} className="btn-primary">
        Sign up
      </Link>
    </div>
  );
}
