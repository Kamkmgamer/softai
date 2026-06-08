import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clapperboard,
  Image as ImageIcon,
  Layers3,
  Megaphone,
  Palette,
  Pen,
  Share2,
  Shield,
  Video,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { getImplementedFeatures, mediaAssets } from "@/lib/features";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";

const categoryIcons = {
  Video,
  Image: ImageIcon,
  Audio: Camera,
  Custom: Pen,
  Models: Layers3,
} as const;

export default async function MarketingPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const marketing = dictionary.marketing;
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;
  const implementedFeatures = getImplementedFeatures(locale);

  const uniqueCategories = [...new Set(implementedFeatures.map((f) => f.category))];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text selection:bg-accent-soft selection:text-text">
      <MarketingNav hasAccess={hasAccess} />

      <main id="main-content" className="flex-1 overflow-hidden">
        {/* ─── Hero ───────────────────────────────────────── */}
        <section className="relative mx-auto max-w-7xl px-6 pt-[clamp(4rem,8vw,8rem)] pb-[clamp(3rem,6vw,5rem)]">
          <div className="mx-auto max-w-3xl text-center animate-slide-up">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              {marketing.heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-7 text-text-secondary">
              {marketing.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={localizePath(hasAccess ? "/dashboard" : "/sign-up", locale)}
                className="btn btn-primary px-6 py-3 text-sm"
              >
                {hasAccess ? marketing.dashboardCta : marketing.startCta}
                <ArrowRight className="h-4 w-4 rtl-flip-x" />
              </Link>
              <Link
                href={localizePath("/pricing", locale)}
                className="btn btn-secondary px-6 py-3 text-sm"
              >
                {marketing.pricingCta}
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mx-auto mt-14 max-w-5xl animate-scale-in">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-lg)">
              <div className="relative aspect-video">
                <Image
                  src={mediaAssets.campaignWall}
                  alt={marketing.heroImageAlt}
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-bg/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-3 max-sm:flex-col sm:bottom-6 sm:left-6 sm:right-auto">
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/90 px-4 py-3 shadow-(--shadow-sm)">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                      <Megaphone className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{marketing.heroOverlay.headline}</p>
                      <p className="text-xs text-text-secondary">{marketing.heroOverlay.tags}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Metrics bar ────────────────────────────────── */}
        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-border px-6 py-8">
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                <Camera className="h-4.5 w-4.5" />
              </div>
              <p className="mt-2 text-sm font-semibold text-text">{marketing.statSpeed}</p>
              <p className="text-xs text-text-tertiary">Generate in seconds</p>
            </div>
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                <Share2 className="h-4.5 w-4.5" />
              </div>
              <p className="mt-2 text-sm font-semibold text-text">{marketing.statFormat}</p>
              <p className="text-xs text-text-tertiary">TikTok, Reels, YouTube, and more</p>
            </div>
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <p className="mt-2 text-sm font-semibold text-text">{marketing.statControl}</p>
              <p className="text-xs text-text-tertiary">Your brand kit, your voice</p>
            </div>
          </div>
        </section>

        {/* ─── How it works ───────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-[clamp(3rem,6vw,5rem)]">
          <div className="mb-10 max-w-lg">
            <h2 className="text-3xl font-semibold tracking-tight text-text">
              {marketing.howTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-text-secondary">
              {marketing.howDescription}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: 1,
                title: marketing.workflow.step1Title,
                description: marketing.workflow.step1Description,
                icon: Camera,
                image: mediaAssets.editDesk,
              },
              {
                step: 2,
                title: marketing.workflow.step2Title,
                description: marketing.workflow.step2Description,
                icon: Pen,
                image: mediaAssets.productWorkspace,
              },
              {
                step: 3,
                title: marketing.workflow.step3Title,
                description: marketing.workflow.step3Description,
                icon: Clapperboard,
                image: mediaAssets.socialShoot,
              },
            ].map((item) => (
              <div key={item.step} className="group overflow-hidden rounded-xl border border-border bg-surface">
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-subtle">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-text text-xs font-bold text-bg">
                    {item.step}
                  </span>
                </div>
                <div className="px-5 py-4">
                  <h3 className="text-base font-semibold text-text">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-text-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Tools by category ──────────────────────────── */}
        <section id="tools" className="border-y border-border bg-surface">
          <div className="mx-auto max-w-5xl px-6 py-[clamp(3rem,6vw,5rem)]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-text">
                  {marketing.tools.heading}
                </h2>
                <p className="mt-2 text-[15px] text-text-secondary">
                  {implementedFeatures.length} tools across {uniqueCategories.length} categories
                </p>
              </div>
              <Link
                href={localizePath("/features", locale)}
                className="btn btn-secondary"
              >
                {marketing.tools.browseCta}
                <ArrowRight className="h-3.5 w-3.5 rtl-flip-x" />
              </Link>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {uniqueCategories.map((cat) => {
                const Icon = categoryIcons[cat] ?? Layers3;
                const count = implementedFeatures.filter((f) => f.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-2 rounded-full border border-border bg-bg px-3.5 py-1.5 text-sm font-medium text-text-secondary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat}
                    <span className="text-xs text-text-tertiary">({count})</span>
                  </div>
                );
              })}
            </div>

            {/* Feature grid - show top 8 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {implementedFeatures.slice(0, 8).map((feature) => (
                <Link
                  key={feature.slug}
                  href={localizePath(feature.appRoute, locale)}
                  className="group overflow-hidden rounded-xl border border-border bg-bg transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:-translate-y-0.5 hover:shadow-(--shadow-md) focus-visible:shadow-(--focus-ring)"
                >
                  <div className="relative aspect-video overflow-hidden bg-bg-subtle">
                    <Image
                      src={feature.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                    {feature.badge ? (
                      <span className="absolute top-2 left-2 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-text">
                        {feature.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="px-3.5 py-3">
                    <h3 className="text-sm font-semibold text-text">{feature.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Value props ────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-[clamp(3rem,6vw,5rem)]">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: marketing.storyboardTitle,
                description: marketing.storyboardDescription,
                icon: Megaphone,
                image: mediaAssets.studioBottle,
              },
              {
                title: marketing.avatarsTitle,
                description: marketing.avatarsDescription,
                icon: Palette,
                image: mediaAssets.packaging,
              },
              {
                title: marketing.safetyTitle,
                description: marketing.safetyDescription,
                icon: Shield,
                image: mediaAssets.apparel,
              },
            ].map((item) => (
              <div key={item.title} className="group overflow-hidden rounded-xl border border-border bg-surface">
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-subtle">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-text/20 text-text">
                    <item.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="px-5 py-4">
                  <h3 className="text-base font-semibold text-text">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-text-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Final CTA ─────────────────────────────────── */}
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-3xl px-6 py-[clamp(3rem,6vw,5rem)] text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl text-balance">
              Start creating in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-text-secondary">
              Join thousands of small business owners who save hours every week with AI-powered creative tools.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={localizePath(hasAccess ? "/dashboard" : "/sign-up", locale)}
                className="btn btn-primary px-6 py-3 text-sm"
              >
                {hasAccess ? marketing.dashboardCta : marketing.startCta}
                <ArrowRight className="h-4 w-4 rtl-flip-x" />
              </Link>
              <Link
                href={localizePath("/pricing", locale)}
                className="btn btn-secondary px-6 py-3 text-sm"
              >
                {marketing.pricingCta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter locale={locale} />
    </div>
  );
}
