"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, getLocaleFromPathname, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(localizePath(`/dashboard?q=${encodeURIComponent(trimmed)}`, locale));
      } else {
        router.push(localizePath("/dashboard", locale));
      }
    },
    [query, router, locale],
  );

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center border-b border-border bg-surface px-4 gap-3 app-hide-on-mobile">
      {/* Search */}
      <form onSubmit={handleSubmit} className="flex flex-1 justify-center">
        <div
          className={cn(
            "flex h-9 w-full max-w-xl items-center gap-2 rounded-full border bg-bg px-3 transition-colors",
            focused ? "border-border-strong shadow-(--shadow-sm)" : "border-border",
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-text-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary"
            placeholder={dictionary.shared.searchApps}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="flex h-5 w-5 items-center justify-center rounded-full text-text-tertiary hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {/* User */}
      <div className="flex items-center gap-2">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </header>
  );
}
