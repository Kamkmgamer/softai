import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date | null | undefined, locale = "en") {
  if (!value) return "Not set";

  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatCredits(value: number, locale = "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US").format(value);
}
