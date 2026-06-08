export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];
export type Direction = "ltr" | "rtl";

export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "softai_locale";

const localeSet = new Set<string>(LOCALES);

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && localeSet.has(value));
}

export function getDirection(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : null;
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname || "/";
  const stripped = pathname.slice(locale.length + 1);
  return stripped.startsWith("/") ? stripped || "/" : `/${stripped}`;
}

export function localizePath(pathname: string, locale: Locale) {
  const cleanPath = stripLocaleFromPathname(pathname);
  return cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
}

export function detectLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const languages = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const language of languages) {
    const primary = language.split("-")[0];
    if (isLocale(primary)) return primary;
  }

  return DEFAULT_LOCALE;
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};
