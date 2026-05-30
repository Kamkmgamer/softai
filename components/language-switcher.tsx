"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localeNames,
  localizePath,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const activeLocale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;

  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-md border border-border bg-surface p-1 text-xs shadow-(--shadow-sm)",
        className,
      )}
    >
      {(["en", "ar"] as Locale[]).map((locale) => (
        <Link
          key={locale}
          href={localizePath(pathname, locale)}
          className={cn(
            "grid h-7 min-w-16 place-items-center rounded-[calc(var(--radius-md)-2px)] px-2.5 font-medium leading-none transition-colors",
            activeLocale === locale
              ? "bg-accent-soft text-accent-text ring-1 ring-accent/20"
              : "text-text-secondary hover:bg-surface-raised hover:text-text",
          )}
        >
          <span
            className={cn(
              "block leading-none",
              locale === "ar" && "-translate-y-px",
            )}
          >
            {localeNames[locale]}
          </span>
        </Link>
      ))}
    </div>
  );
}
