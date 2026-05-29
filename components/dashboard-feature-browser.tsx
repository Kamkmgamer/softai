"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type FeatureCategory,
  type FeatureTile,
  type StarterKit,
  categories,
  features,
  modelOptions,
  starterKits,
  getDefaultFeatureForCategory,
} from "@/lib/features";

export function DashboardFeatureBrowser() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] =
    useState<FeatureCategory>("Starter Kits");
  const [activeStarterKit, setActiveStarterKit] =
    useState<StarterKit>("Film or shorts");
  const [query, setQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("multi-shot-video");
  const [selectedModel, setSelectedModel] = useState("Multi-Shot Video");
  const [notice, setNotice] = useState<string | null>(null);

  const visibleFeatures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return features.filter((feature) => {
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
  }, [activeCategory, activeStarterKit, query]);

  const activeFeature =
    visibleFeatures.find((f) => f.slug === selectedFeature) ??
    visibleFeatures.find((f) => f.status === "implemented") ??
    visibleFeatures[0] ??
    features.find((f) => f.slug === "multi-shot-video")!;

  function openFeature(feature: FeatureTile) {
    setSelectedFeature(feature.slug);

    if (feature.status === "implemented") {
      setNotice(null);
      router.push(feature.appRoute);
      return;
    }

    setNotice(
      `${feature.title} is not implemented yet. Multi-Shot Video is available now.`,
    );
  }

  function chooseModel(model: string) {
    setSelectedModel(model);
    if (model !== "Multi-Shot Video") {
      setNotice(
        `${model} is not implemented yet. Multi-Shot Video is available now.`,
      );
      return;
    }
    setNotice(null);
  }

  return (
    <div className="grid h-full min-h-0 overflow-hidden lg:grid-cols-[464px_minmax(0,1fr)]">
      <aside className="min-h-0 overflow-hidden border-border bg-[radial-gradient(circle_at_52%_0%,oklch(0.33_0.055_310_/_0.45),transparent_270px),var(--surface)] px-5 py-8 lg:border-r lg:px-6 lg:py-12">
        <div className="mx-auto flex h-full max-w-[416px] flex-col">
          <div className="space-y-4 px-1">
            <h1 className="text-center text-2xl font-semibold text-text">
              What do you want to create?
            </h1>
            <label className="flex h-[43px] items-center gap-2 rounded-xl border border-border-strong bg-surface-raised/80 px-3 text-text-secondary shadow-[var(--shadow-sm)] transition-colors focus-within:border-border-strong">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary"
                placeholder="Search apps and tools"
              />
            </label>
          </div>

          <div className="mt-14 flex gap-2 overflow-x-auto border-b border-border/60 pb-px text-[13px] font-medium text-text-tertiary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
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
                    setNotice(null);
                  }}
                  className={cn(
                    "shrink-0 rounded-t-lg border-b px-2.5 pb-2 pt-1 transition-colors hover:text-text focus-visible:shadow-[var(--focus-ring)]",
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

          {notice ? (
            <div
              role="status"
              className="mt-4 rounded-xl border border-border bg-surface-raised px-3 py-2 text-[13px] font-medium text-text-secondary"
            >
              {notice}
            </div>
          ) : null}

          <div className="thin-scrollbar mt-5 flex-1 space-y-3 overflow-y-auto pr-2">
            {activeCategory === "Starter Kits" ? (
              starterKits.map((kit) => {
                const Icon = kit.icon;
                const active = kit.title === activeStarterKit;
                const defaultFeature = getDefaultFeatureForCategory(
                  "Starter Kits",
                  kit.title,
                );
                return (
                  <button
                    key={kit.title}
                    type="button"
                    onClick={() => {
                      setActiveStarterKit(kit.title);
                      setSelectedFeature(defaultFeature.slug);
                      setNotice(null);
                    }}
                    className={cn(
                      "group grid w-full grid-cols-[72px_1fr] gap-4 rounded-2xl border p-1.5 text-left transition-colors focus-visible:shadow-[var(--focus-ring)]",
                      active
                        ? "border-border-strong bg-surface-raised/85"
                        : "border-transparent hover:border-border hover:bg-surface-raised/70",
                    )}
                  >
                    <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-surface-raised text-text-secondary ring-1 ring-border transition-colors group-hover:text-text">
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
              })
            ) : visibleFeatures.length ? (
              visibleFeatures.map((feature) => {
                const active = feature.slug === activeFeature.slug;
                return (
                  <button
                    key={feature.slug}
                    type="button"
                    onClick={() => openFeature(feature)}
                    className={cn(
                      "group grid w-full grid-cols-[72px_1fr] gap-4 rounded-2xl border p-1.5 text-left transition-colors focus-visible:shadow-[var(--focus-ring)]",
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
                      className="h-[72px] w-[72px] rounded-2xl object-cover ring-1 ring-border"
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
                      {feature.status !== "implemented" ? (
                        <span className="mt-2 inline-flex rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-text-tertiary">
                          Not implemented
                        </span>
                      ) : null}
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

      <section className="min-h-0 overflow-hidden bg-bg px-5 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto flex h-full max-w-[980px] flex-col justify-center gap-6">
          <div>
            <h2 className="text-[28px] font-semibold text-text sm:text-[32px]">
              {activeFeature.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-text-secondary">
              {activeFeature.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {modelOptions.map((model) => {
                const active = model === selectedModel;
                return (
                  <button
                    key={model}
                    type="button"
                    aria-pressed={active}
                    onClick={() => chooseModel(model)}
                    style={active ? { color: "oklch(0.08 0.006 260)" } : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:shadow-[var(--focus-ring)]",
                      active
                        ? "bg-text"
                        : "bg-surface-raised text-text-secondary hover:bg-surface-sunken hover:text-text",
                    )}
                  >
                    {model}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => openFeature(activeFeature)}
            className="block w-full overflow-hidden rounded-md border border-border bg-surface text-left shadow-[var(--shadow-lg)] transition-colors hover:border-border-strong focus-visible:shadow-[var(--focus-ring)]"
          >
            <span className="relative block aspect-[16/9]">
              <Image
                src={activeFeature.image}
                alt={`${activeFeature.title} preview`}
                fill
                priority
                sizes="(min-width: 1024px) 980px, 100vw"
                className="object-cover"
              />
              <span className="absolute inset-x-0 top-0 h-1 bg-success" />
              <span className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-bg/80 px-3 py-2 text-xs font-medium text-text backdrop-blur">
                <Wand2 className="h-3.5 w-3.5" />
                {activeFeature.status === "implemented"
                  ? "Open generator"
                  : "Not implemented yet"}
              </span>
            </span>
          </button>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => openFeature(activeFeature)}
              className="btn btn-primary"
            >
              {activeFeature.status === "implemented"
                ? `Open ${activeFeature.title}`
                : "Not implemented yet"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
