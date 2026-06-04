import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brush,
  CheckCircle2,
  ImageIcon,
  Layers3,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { getImplementedFeatures, mediaAssets } from "@/lib/features";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";

export default async function MarketingPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const marketing = dictionary.marketing;
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;
  const implementedFeatures = getImplementedFeatures(locale).slice(0, 6);

  const workflowSteps = [
    {
      title: marketing.workflow.step1Title,
      description: marketing.workflow.step1Description,
    },
    {
      title: marketing.workflow.step2Title,
      description: marketing.workflow.step2Description,
    },
    {
      title: marketing.workflow.step3Title,
      description: marketing.workflow.step3Description,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text selection:bg-accent-soft selection:text-text">
      <MarketingNav hasAccess={hasAccess} />

      <main className="flex-1 overflow-hidden">
        <section className="mx-auto grid max-w-300 gap-10 px-6 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(560px,1fr)] lg:items-center lg:py-24">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
              {marketing.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[17px] leading-8 text-text-secondary">
              {marketing.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localizePath(
                  hasAccess ? "/dashboard" : "/sign-up",
                  locale,
                )}
                className="btn btn-primary px-5 py-3 text-sm"
              >
                {hasAccess ? marketing.dashboardCta : marketing.startCta}
                <ArrowRight className="h-4 w-4 rtl-flip-x" />
              </Link>
              <Link
                href={localizePath("/pricing", locale)}
                className="btn btn-secondary px-5 py-3 text-sm"
              >
                {marketing.pricingCta}
              </Link>
            </div>
            <div className="mt-8 grid max-w-xl gap-2 text-sm text-text-secondary sm:grid-cols-3">
              {[
                marketing.trustBadges.productAwarePrompts,
                marketing.trustBadges.implementedToolsOnly,
                marketing.trustBadges.creditsVisibleInApp,
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-3 shadow-(--shadow-lg) animate-scale-in">
            <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
              <div className="relative min-h-92 overflow-hidden rounded-xl bg-bg-subtle">
                <Image
                  src={mediaAssets.campaignWall}
                  alt={marketing.heroImageAlt}
                  fill
                  sizes="(min-width: 1024px) 620px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-bg/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-surface/95 p-4 shadow-(--shadow-sm)">
                  <p className="text-lg font-semibold tracking-tight text-text">
                    {marketing.heroOverlay.headline}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    {marketing.heroOverlay.tags}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  [
                    mediaAssets.productPhoto,
                    marketing.heroThumbnails.referenceProduct,
                  ],
                  [
                    mediaAssets.studioBottle,
                    marketing.heroThumbnails.studioLighting,
                  ],
                  [
                    mediaAssets.socialShoot,
                    marketing.heroThumbnails.shortVideoCut,
                  ],
                ].map(([src, label]) => (
                  <div
                    key={label}
                    className="relative min-h-28 overflow-hidden rounded-xl border border-border bg-bg-subtle"
                  >
                    <Image
                      src={src}
                      alt={label}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent" />
                    <p className="absolute inset-x-3 bottom-3 text-xs font-semibold text-text">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface py-16">
          <div className="mx-auto grid max-w-300 gap-10 px-6 lg:grid-cols-[360px_1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-text">
                {marketing.howTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {marketing.howDescription}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3 stagger-children">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-border bg-bg px-4 py-5 hover-lift"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-text">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-300 px-6 py-16 lg:py-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-text">
                {marketing.tools.heading}
              </h2>
            </div>
            <Link
              href={localizePath("/dashboard", locale)}
              className="btn btn-secondary"
            >
              {marketing.tools.browseCta}
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 stagger-children">
            {implementedFeatures.map((feature) => (
              <Link
                key={feature.slug}
                href={localizePath(feature.appRoute, locale)}
                className="group overflow-hidden rounded-xl border border-border bg-surface transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:-translate-y-0.5 hover:shadow-(--shadow-md) focus-visible:shadow-(--focus-ring)"
              >
                <div className="relative h-42 bg-bg-subtle">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-raised text-text-secondary ring-1 ring-border">
                    {feature.category === "Video" ? (
                      <Layers3 className="h-4 w-4" />
                    ) : feature.slug === "text-to-image" ? (
                      <Brush className="h-4 w-4" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-text">
                    {feature.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
