import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";

export async function getRequestLocale(): Promise<Locale> {
  const headerList = await headers();
  const headerLocale = headerList.get("x-softai-locale");
  return isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;
}
