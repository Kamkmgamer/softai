"use client";

import { useEffect, useState } from "react";
import { BrandKitForm } from "@/components/brand-kit-form";
import type { BrandKitRecord } from "@/lib/types";

export default function BrandKitPage() {
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
    <div className="mx-auto max-w-2xl px-5 py-8">
      <BrandKitForm kit={activeKit} onSave={handleSave} />
    </div>
  );
}
