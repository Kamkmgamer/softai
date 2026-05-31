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
  mediaAssets,
  starterKits,
  getDefaultFeatureForCategory,
} from "@/lib/features";

type DashboardBillingSummary = {
  balance: number;
  plan: string;
};

export function DashboardFeatureBrowser({
  billingSummary,
}: {
  billingSummary: DashboardBillingSummary;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const [activeCategory, setActiveCategory] =
    useState<FeatureCategory>("Starter Kits");
  const [activeStarterKit, setActiveStarterKit] =
    useState<StarterKit>("Film or shorts");
  const [query, setQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("multi-shot-video");

  const implementedFeatures = useMemo(
    () => features.filter((feature) => feature.status === "implemented"),
    [],
  );

  const visibleCategories = useMemo(
    () =>
      categories.filter((category) => {
        if (category === "Starter Kits") {
          return implementedFeatures.some((feature) => feature.starterKit);
        }
        return implementedFeatures.some((feature) => feature.category === category);
      }),
    [implementedFeatures],
  );

  const visibleStarterKits = useMemo(
    () =>
      starterKits.filter((kit) =>
        implementedFeatures.some((feature) => feature.starterKit === kit.title),
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

  const activeFeature =
    visibleFeatures.find((f) => f.slug === selectedFeature) ??
    visibleFeatures[0] ??
    implementedFeatures.find((f) => f.slug === "multi-shot-video")!;

  function openFeature(feature: FeatureTile) {
    setSelectedFeature(feature.slug);
    router.push(feature.appRoute);
  }

  return (
    <div className="grid h-full min-h-0 overflow-hidden lg:grid-cols-[464px_minmax(0,1fr)]">
      <aside className="min-h-0 overflow-hidden border-border bg-[radial-gradient(circle_at_52%_0%,oklch(0.33_0.055_310/0.45),transparent_270px),var(--surface)] px-5 py-8 lg:border-r lg:px-6 lg:py-12">
        <div className="mx-auto flex h-full max-w-104 flex-col">
          <div className="space-y-4 px-1">
            <h1 className="text-center text-2xl font-semibold text-text">
              What do you want to create?
            </h1>
            <label className="flex h-10.75 items-center gap-2 rounded-xl border border-border-strong bg-surface-raised/80 px-3 text-text-secondary shadow-(--shadow-sm) transition-colors focus-within:border-border-strong">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary"
                placeholder="Search apps and tools"
              />
            </label>
          </div>

          <div className="mt-14 flex gap-2 overflow-x-auto border-b border-border/60 pb-px text-[13px] font-medium text-text-tertiary [scrollbar:none] [&::-webkit-scrollbar]:hidden">
            {visibleCategories.map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setActiveCategory(category);
                    const next = getDefaultFeatureForCategory(
                      category,
                      activeStarterKit,
                    );
                    setSelectedFeature(next.slug);
                  }}
                  className={cn(
                    "shrink-0 rounded-t-lg border-b px-2.5 pb-2 pt-1 transition-colors hover:text-text focus-visible:shadow-(--focus-ring)",
                    active
                      ? "border-text text-text"
                      : "border-transparent text-text-tertiary hover:border-border-strong",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="thin-scrollbar mt-5 flex-1 space-y-3 overflow-y-auto pr-2">
            {activeCategory === "Starter Kits" ? (
              <>
                {visibleStarterKits.map((kit) => {
                  const Icon = kit.icon;
                  const active = kit.title === activeStarterKit;
                  return (
                    <button
                      key={kit.title}
                      type="button"
                      onClick={() => {
                        setActiveStarterKit(kit.title);
                        const next = getDefaultFeatureForCategory(
                          "Starter Kits",
                          kit.title,
                        );
                        setSelectedFeature(next.slug);
                      }}
                      className={cn(
                        "group grid w-full grid-cols-[72px_1fr] gap-4 rounded-2xl border p-1.5 text-left transition-colors focus-visible:shadow-(--focus-ring)",
                        active
                          ? "border-border-strong bg-surface-raised/85"
                          : "border-transparent hover:border-border hover:bg-surface-raised/70",
                      )}
                    >
                      <span className="flex h-18 w-18 items-center justify-center rounded-2xl bg-surface-raised text-text-secondary ring-1 ring-border transition-colors group-hover:text-text">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 self-center">
                        <span className="flex items-center gap-2 text-sm font-semibold text-text">
                          {kit.title}
                        </span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-text-secondary">
                          {kit.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
                {visibleFeatures.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                      Tools in this kit
                    </p>
                    {visibleFeatures.map((feature) => {
                      const active = feature.slug === selectedFeature;
                      return (
                        <button
                          key={feature.slug}
                          type="button"
                          onClick={() => setSelectedFeature(feature.slug)}
                          className={cn(
                            "group grid w-full grid-cols-[72px_1fr] gap-4 rounded-2xl border p-1.5 text-left transition-colors focus-visible:shadow-(--focus-ring)",
                            active
                              ? "border-border-strong bg-surface-raised/85"
                              : "border-transparent hover:border-border hover:bg-surface-raised/70",
                          )}
                        >
                          <Image
                            src={feature.image}
                            alt=""
                            width={96}
                            height={96}
                            className="h-18 w-18 rounded-2xl object-cover ring-1 ring-border"
                          />
                          <span className="min-w-0 self-center">
                            <span className="flex items-center gap-2 text-sm font-semibold text-text">
                              {feature.title}
                              {feature.badge ? (
                                <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-text">
                                  {feature.badge}
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-1 block text-[13px] leading-relaxed text-text-secondary">
                              {feature.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-surface px-4 py-6 text-sm text-text-secondary">
                    No tools in this kit yet.
                  </div>
                )}
              </>
            ) : visibleFeatures.length ? (
              visibleFeatures.map((feature) => {
                const active = feature.slug === activeFeature.slug;
                return (
                  <button
                    key={feature.slug}
                    type="button"
                    onClick={() => openFeature(feature)}
                    className={cn(
                      "group grid w-full grid-cols-[72px_1fr] gap-4 rounded-2xl border p-1.5 text-left transition-colors focus-visible:shadow-(--focus-ring)",
                      active
                        ? "border-border-strong bg-surface-raised/85"
                        : "border-transparent hover:border-border hover:bg-surface-raised/70",
                    )}
                  >
                    <Image
                      src={feature.image}
                      alt=""
                      width={96}
                      height={96}
                      className="h-18 w-18 rounded-2xl object-cover ring-1 ring-border"
                    />
                    <span className="min-w-0 self-center">
                      <span className="flex items-center gap-2 text-sm font-semibold text-text">
                        {feature.title}
                        {feature.badge ? (
                          <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-text">
                            {feature.badge}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-text-secondary">
                        {feature.description}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-border bg-surface px-4 py-6 text-sm text-text-secondary">
                No tools match that search.
              </div>
            )}
          </div>

          <div className="h-4 shrink-0" />
        </div>
      </aside>

      <section className="min-h-0 overflow-y-auto bg-bg px-5 py-8 lg:px-10 lg:py-8">
        <div className="mx-auto flex min-h-full max-w-245 flex-col justify-center gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-3 shadow-(--shadow-sm)">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-text-secondary">
              <span className="inline-flex items-center gap-2">
                <Wallet className="h-4 w-4 text-text-tertiary" />
                <strong className="font-semibold text-text">
                  {formatCredits(billingSummary.balance, locale)}
                </strong>
                credits
              </span>
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-text-tertiary" />
                <strong className="font-semibold text-text">
                  {billingSummary.plan}
                </strong>
                plan
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

          <div>
            <h2 className="text-[28px] font-semibold text-text sm:text-[32px]">
              {activeFeature.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-text-secondary">
              {activeFeature.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openFeature(activeFeature)}
            className="block w-full overflow-hidden rounded-md border border-border bg-surface text-left shadow-(--shadow-lg) transition-colors hover:border-border-strong focus-visible:shadow-(--focus-ring)"
          >
            <span className="relative block aspect-video">
              <video
                src={mediaAssets.videoPreview}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 top-0 h-1 bg-success" />
              <span className="absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-md bg-bg/85 px-3 py-2 text-xs font-medium text-text ring-1 ring-border">
                Open generator
              </span>
            </span>
          </button>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => openFeature(activeFeature)}
              className="btn btn-primary"
            >
              Open {activeFeature.title}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
