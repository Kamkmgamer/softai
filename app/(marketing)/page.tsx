import Link from "next/link";
import Image from "next/image";
import { ImageIcon, ShieldCheck, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { cn } from "@/lib/utils";

export default async function MarketingPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const marketing = dictionary.marketing;
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;

  return (
    <div className="flex min-h-screen flex-col bg-bg selection:bg-accent-soft selection:text-text">
      <MarketingNav hasAccess={hasAccess} />

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center rounded-md border border-accent/20 bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent-text">
                {marketing.eyebrow}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[4rem] lg:leading-[1.1] text-balance">
                {marketing.heroTitle}
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-xl text-pretty leading-relaxed">
                {marketing.heroDescription}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href={localizePath(hasAccess ? "/dashboard" : "/sign-up", locale)} className="btn-primary px-7 py-3.5 text-[15px]">
                  {hasAccess ? marketing.dashboardCta : marketing.startCta}
                </Link>
                <Link href={localizePath("/pricing", locale)} className="btn-secondary px-7 py-3.5 text-[15px]">
                  {marketing.pricingCta}
                </Link>
              </div>
            </div>
            
            <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
              <div className="relative rounded-2xl border border-border/50 bg-surface/50 p-2 shadow-2xl backdrop-blur-xl">
                <div className="overflow-hidden rounded-xl border border-border">
                  <Image 
                    src="/hero-mockup.png" 
                    alt={marketing.heroImageAlt} 
                    width={1200} 
                    height={800}
                    className="w-full object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-x-10 -inset-y-10 -z-10 bg-gradient-to-tr from-accent/20 via-transparent to-transparent blur-3xl opacity-50" />
            </div>
          </div>
        </section>

        {/* Social Proof / Stats Bar */}
        <section className="border-y border-border bg-surface py-10">
          <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-12 px-6 text-center sm:gap-24 lg:justify-start lg:text-start">
            <div className="min-w-[120px]">
              <p className="text-3xl font-semibold tracking-tight text-text">10x</p>
              <p className="mt-1.5 text-sm font-medium text-text-secondary">{marketing.statSpeed}</p>
            </div>
            <div className="min-w-[120px]">
              <p className="text-3xl font-semibold tracking-tight text-text">9:16</p>
              <p className="mt-1.5 text-sm font-medium text-text-secondary">{marketing.statFormat}</p>
            </div>
            <div className="min-w-[120px]">
              <p className="text-3xl font-semibold tracking-tight text-text">100%</p>
              <p className="mt-1.5 text-sm font-medium text-text-secondary">{marketing.statControl}</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-[1200px] px-6 py-24 lg:py-32">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">{marketing.howTitle}</h2>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {marketing.howDescription}
            </p>
          </div>
          
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24 items-center">
            <div className="space-y-12">
              <div className="relative ps-12">
                <div className={cn("absolute top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-text shadow-[var(--shadow-sm)]", locale === "ar" ? "right-0" : "left-0")}>
                  1
                </div>
                <h3 className="text-lg font-medium text-text">{marketing.stepBriefTitle}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {marketing.stepBriefDescription}
                </p>
              </div>
              
              <div className="relative ps-12">
                <div className={cn("absolute top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-text shadow-[var(--shadow-sm)]", locale === "ar" ? "right-0" : "left-0")}>
                  2
                </div>
                <h3 className="text-lg font-medium text-text">{marketing.stepReviewTitle}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {marketing.stepReviewDescription}
                </p>
              </div>
              
              <div className="relative ps-12">
                <div className={cn("absolute top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-text shadow-[var(--shadow-sm)]", locale === "ar" ? "right-0" : "left-0")}>
                  3
                </div>
                <h3 className="text-lg font-medium text-text">{marketing.stepRenderTitle}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {marketing.stepRenderDescription}
                </p>
              </div>
            </div>
            
            <div className="relative w-full">
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-2 shadow-xl">
                <div className="overflow-hidden rounded-md border border-border">
                  <Image 
                    src="/storyboard-feature.png" 
                    alt={marketing.storyboardImageAlt} 
                    width={800} 
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-surface-raised py-24 lg:py-32">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="mb-12 text-3xl font-semibold tracking-tight text-text sm:text-4xl text-center lg:text-start">{marketing.featuresTitle}</h2>
            
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-text ring-1 ring-accent/20">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium tracking-tight text-text">{marketing.storyboardTitle}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                  {marketing.storyboardDescription}
                </p>
                <div className="mt-8 overflow-hidden rounded-lg border border-border">
                  <Image 
                    src="/rendering-feature.png" 
                    alt={marketing.renderingImageAlt} 
                    width={800} 
                    height={400}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-8">
                <div className="flex-1 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-[var(--shadow-sm)]">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary ring-1 ring-border">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-text">{marketing.safetyTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {marketing.safetyDescription}
                  </p>
                </div>
                
                <div className="flex-1 rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-[var(--shadow-sm)]">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary ring-1 ring-border">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-text">{marketing.avatarsTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {marketing.avatarsDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
