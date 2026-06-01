"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
} from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const defaultClassName =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-text focus-visible:shadow-(--focus-ring)";

export function AppBackButton({
  className,
  label = "Back to dashboard",
}: {
  className?: string;
  label?: string;
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;

  return (
    <Link
      href={localizePath("/dashboard", locale)}
      className={cn(defaultClassName, className)}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Link>
  );
}