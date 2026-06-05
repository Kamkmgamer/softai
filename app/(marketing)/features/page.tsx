import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clapperboard } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import {
  getImplementedFeatures,
  starterKits,
  type FeatureTile,
  type StarterKit,
} from "@/lib/features";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";

const audienceMap: Record<StarterKit, string> = {
  "Film or shorts": "marketingAudience",
  Marketing: "marketingAudience",
  Social: "socialAudience",
  "Educational content": "educationAudience",
  "Experimental art": "artAudience",
} as const;

function groupedByKit(
  implemented: FeatureTile[],
): Array<{ kit: StarterKit; features: FeatureTile[] }> {
  const map = new Map<StarterKit, FeatureTile[]>();
  for (const f of implemented) {
    if (f.starterKit) {
      const list = map.get(f.starterKit) ?? [];
      list.push(f);
      map.set(f.starterKit, list);
    }
  }
  return starterKits
    .filter((sk) => map.has(sk.title))
    .map((sk) => ({ kit: sk.title, features: map.get(sk.title)! }));
}

export default async function FeaturesPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const fp = dictionary.featuresPage;
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;

  const implemented = getImplementedFeatures(locale);
  const grouped = groupedByKit(implemented);

  const standalone = implemented.filter((f) => !f.starterKit);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text selection:bg-accent-soft selection:text-text">
      <MarketingNav hasAccess={hasAccess} />

      <main id="main-content" className="flex-1 overflow-hidden">
        <section className="mx-auto max-w-300 px-6 pt-[clamp(4rem,8vw,7rem)] pb-[clamp(2rem,4vw,4rem)]">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
              {fp.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[17px] leading-8 text-text-secondary">
              {fp.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localizePath(
                  hasAccess ? "/dashboard" : "/sign-up",
                  locale,
                )}
                className="btn btn-primary px-5 py-3 text-sm"
              >
                {hasAccess ? dictionary.marketing.dashboardCta : fp.cta}
                <ArrowRight className="h-4 w-4 rtl-flip-x" />
              </Link>
              <Link
                href={localizePath("/pricing", locale)}
                className="btn btn-secondary px-5 py-3 text-sm"
              >
                {fp.pricingCta}
              </Link>
            </div>
          </div>
        </section>

        {grouped.map(({ kit, features: kitFeatures }) => {
          const kitDef = starterKits.find((sk) => sk.title === kit);
          const Icon = kitDef?.icon ?? Clapperboard;
          const audienceKey = audienceMap[kit] as keyof typeof fp;
          const audienceText = fp[audienceKey] ?? "";

          return (
            <section
              key={kit}
              className="border-y border-border bg-surface py-[clamp(2.5rem,5vw,4rem)]"
            >
              <div className="mx-auto max-w-300 px-6">
                <div className="mb-8 flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-text">
                      {kit}
                    </h2>
                    <p className="text-sm text-text-secondary">
                      {fp.forLabel} {audienceText}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 stagger-children">
                  {kitFeatures.map((feature) => (
                    <Link
                      key={feature.slug}
                      href={localizePath(feature.appRoute, locale)}
                      className="group overflow-hidden rounded-xl border border-border bg-bg transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:-translate-y-0.5 hover:shadow-(--shadow-md) focus-visible:shadow-(--focus-ring)"
                    >
                      <div className="relative h-36 bg-bg-subtle">
                        <Image
                          src={feature.image}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                        />
                        {feature.badge && (
                          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-text">
                            {feature.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
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
              </div>
            </section>
          );
        })}

        {standalone.length > 0 && (
          <section className="py-[clamp(2.5rem,5vw,4rem)]">
            <div className="mx-auto max-w-300 px-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold tracking-tight text-text">
                  Standalone tools
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {fp.forLabel} {fp.imageAudience}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 stagger-children">
                {standalone.map((feature) => (
                  <Link
                    key={feature.slug}
                    href={localizePath(feature.appRoute, locale)}
                    className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:-translate-y-0.5 hover:shadow-(--shadow-md) focus-visible:shadow-(--focus-ring)"
                  >
                    <div className="relative h-36 bg-bg-subtle">
                      <Image
                        src={feature.image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                      {feature.badge && (
                        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-text">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
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
            </div>
          </section>
        )}

        <section className="border-t border-border bg-surface py-[clamp(3rem,5vw,5rem)]">
          <div className="mx-auto max-w-300 px-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              {dictionary.marketing.featuresTitle}
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={localizePath(
                  hasAccess ? "/dashboard" : "/sign-up",
                  locale,
                )}
                className="btn btn-primary px-5 py-3 text-sm"
              >
                {hasAccess ? dictionary.marketing.dashboardCta : fp.cta}
                <ArrowRight className="h-4 w-4 rtl-flip-x" />
              </Link>
              <Link
                href={localizePath("/pricing", locale)}
                className="btn btn-secondary px-5 py-3 text-sm"
              >
                {fp.pricingCta}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
