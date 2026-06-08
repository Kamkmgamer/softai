import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

export function MarketingFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} Soft-Magic AI
        </p>
        <nav className="flex gap-4">
          <Link
            href={localizePath("/terms", locale)}
            className="text-xs text-text-tertiary transition-colors hover:text-text"
          >
            {dictionary.legal.termsTitle}
          </Link>
          <Link
            href={localizePath("/privacy", locale)}
            className="text-xs text-text-tertiary transition-colors hover:text-text"
          >
            {dictionary.legal.privacyTitle}
          </Link>
          <Link
            href={localizePath("/refund", locale)}
            className="text-xs text-text-tertiary transition-colors hover:text-text"
          >
            {dictionary.legal.refundTitle}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
