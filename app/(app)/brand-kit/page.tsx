"use client";

import { useEffect, useState } from "react";
import { BrandKitForm } from "@/components/brand-kit-form";
import { AppBackButton } from "@/components/app-back-button";
import type { BrandKitRecord } from "@/lib/types";
import { getDictionary } from "@/lib/dictionaries";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, getLocaleFromPathname } from "@/lib/i18n";

export default function BrandKitPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const [kits, setKits] = useState<BrandKitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brand-kit")
      .then((r) => r.json())
      .then((data) => {
        setKits(data.kits ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeKit = kits[0] ?? null;

  function handleSave(kit: BrandKitRecord) {
    setKits((prev) => {
      const existing = prev.findIndex((k) => k.id === kit.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = kit;
        return next;
      }
      return [kit, ...prev];
    });
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-text-secondary">Loading brand kit...</div>
      </div>
    );
  }

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start gap-3">
          <AppBackButton className="mt-0.5" />
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-text">
              {dictionary.app.brandKit}
            </h1>
            <p className="text-sm text-text-secondary">
              Define your brand identity. It will be applied automatically to all generations.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-(--shadow-sm) lg:p-6">
          <BrandKitForm kit={activeKit} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
