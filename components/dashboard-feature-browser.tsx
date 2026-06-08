"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, Search, Wallet } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
} from "@/lib/i18n";
import { cn, formatCredits } from "@/lib/utils";
import {
  type FeatureCategory,
  type FeatureTile,
  type StarterKit,
  categories,
  features,
  starterKits,
  getImplementedFeatures,
} from "@/lib/features";
import { TemplateBrowser } from "@/components/template-browser";
import { templates } from "@/lib/templates";

type DashboardBillingSummary = {
  balance: number;
  plan: string;
};

export function DashboardFeatureBrowser({
  billingSummary,
  initialQuery = "",
}: {
  billingSummary: DashboardBillingSummary;
  initialQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const [activeCategory, setActiveCategory] =
    useState<FeatureCategory>("Starter Kits");
  const [activeStarterKit, setActiveStarterKit] =
    useState<StarterKit>("Film or shorts");
  const [query, setQuery] = useState(initialQuery);

  const implementedFeatures = useMemo(
    () => features.filter((feature) => feature.status === "implemented"),
    [],
  );

  const localizedFeatureMap = (() => {
    const localizedFeatures = getImplementedFeatures(locale);
    const map = new Map<string, FeatureTile>();
    for (const feature of localizedFeatures) {
      map.set(feature.slug, feature);
    }
    return map;
  })();

  const visibleCategories = useMemo(
    () =>
      categories.filter((category) => {
        if (category === "Starter Kits") {
          return implementedFeatures.some((feature) => feature.starterKit);
        }
        return implementedFeatures.some(
          (feature) => feature.category === category,
        );
      }),
    [implementedFeatures],
  );

  const visibleStarterKits = useMemo(
    () =>
      starterKits.filter(
        (kit) =>
          implementedFeatures.some(
            (feature) => feature.starterKit === kit.title,
          ) ||
          templates.some((t) => t.kit === kit.title),
      ),
    [implementedFeatures],
  );

  const visibleFeatures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return implementedFeatures.filter((feature) => {
      const matchesCategory =
        activeCategory === "Starter Kits"
          ? feature.starterKit === activeStarterKit
          : feature.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        feature.title.toLowerCase().includes(normalizedQuery) ||
        feature.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, activeStarterKit, implementedFeatures, query]);

  function openFeature(feature: FeatureTile) {
    router.push(localizePath(feature.appRoute, locale));
  }

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Billing banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-(--shadow-sm)">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <Wallet className="h-4 w-4 text-text-tertiary" />
              <strong className="font-semibold text-text">
                {formatCredits(billingSummary.balance, locale)}
              </strong>
              {dictionary.shared.credits}
            </span>
            <span className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-text-tertiary" />
              <strong className="font-semibold text-text">
                {billingSummary.plan}
              </strong>
              {dictionary.shared.plan}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={localizePath("/billing", locale)}
              className="btn btn-secondary btn-sm"
            >
              {dictionary.app.billing}
            </Link>
            <Link
              href={localizePath("/payments#/billing", locale)}
              className="btn btn-primary btn-sm"
            >
              {dictionary.app.payments}
            </Link>
          </div>
        </div>

        {/* Mobile search (hidden on desktop where TopNav has search) */}
        <div className="lg:hidden">
          <label className="flex h-10.75 items-center gap-2 rounded-xl border border-border-strong bg-surface-raised/80 px-3 text-text-secondary shadow-(--shadow-sm) transition-colors focus-within:border-border-strong">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary"
              placeholder={dictionary.shared.searchApps}
            />
          </label>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-[13px] font-medium text-text-tertiary [scrollbar:none] [&::-webkit-scrollbar]:hidden">
          {visibleCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setActiveCategory(category);
                }}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-1.5 transition-colors hover:text-text focus-visible:shadow-(--focus-ring)",
                  active
                    ? "border-text bg-text text-bg"
                    : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-raised",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Starter kit sub-tabs */}
        {activeCategory === "Starter Kits" ? (
          <div className="flex gap-2 overflow-x-auto pb-1 text-[13px] font-medium text-text-tertiary [scrollbar:none] [&::-webkit-scrollbar]:hidden">
            {visibleStarterKits.map((kit) => {
              const active = kit.title === activeStarterKit;
              return (
                <button
                  key={kit.title}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setActiveStarterKit(kit.title);
                  }}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 transition-colors hover:text-text focus-visible:shadow-(--focus-ring)",
                    active
                      ? "border-accent bg-accent-soft text-accent-text"
                      : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-raised",
                  )}
                >
                  {kit.title}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Template browser (shown for Starter Kits) */}
        {activeCategory === "Starter Kits" ? (
          <TemplateBrowser kit={activeStarterKit} />
        ) : null}

        {/* Feature card grid */}
        {visibleFeatures.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleFeatures.map((feature) => {
              const localized = localizedFeatureMap.get(feature.slug) ?? feature;
              return (
                <button
                  key={feature.slug}
                  type="button"
                  onClick={() => openFeature(feature)}
                  className="group overflow-hidden rounded-xl border border-border bg-surface text-left transition-all hover:border-border-strong hover:shadow-(--shadow-md) focus-visible:shadow-(--focus-ring)"
                >
                  <span className="relative block aspect-video overflow-hidden bg-bg-subtle">
                    <Image
                      src={feature.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {feature.badge ? (
                      <span className="absolute top-2 left-2 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-text">
                        {feature.badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="block px-3.5 py-3">
                    <span className="block text-sm font-semibold text-text">
                      {localized.title}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-text-secondary line-clamp-2">
                      {localized.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-text-secondary">
            {query.trim()
              ? dictionary.shared.noToolsMatch
              : dictionary.shared.noToolsInKit}
          </div>
        )}
      </div>
    </div>
  );
}
