import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";

export default async function TermsPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const legal = dictionary.legal;
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;
  const backHref = localizePath("/", locale);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <MarketingNav hasAccess={hasAccess} />

      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-[clamp(3rem,6vw,5rem)]">
          <Link
            href={backHref}
            className="mb-8 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text"
          >
            &larr; Back
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            {legal.termsTitle}
          </h1>
          <p className="mt-2 text-sm text-text-tertiary">
            {legal.termsUpdated}
          </p>
          <p className="mt-6 text-[15px] leading-7 text-text-secondary">
            {legal.termsIntro}
          </p>

          <div className="mt-10 space-y-8">
            {[
              { heading: legal.termsAcceptTitle, body: legal.termsAcceptBody },
              { heading: legal.termsAccountTitle, body: legal.termsAccountBody },
              { heading: legal.termsCreditTitle, body: legal.termsCreditBody },
              { heading: legal.termsAiTitle, body: legal.termsAiBody },
              { heading: legal.termsUseTitle, body: legal.termsUseBody },
              { heading: legal.termsIpTitle, body: legal.termsIpBody },
              { heading: legal.termsLiabilityTitle, body: legal.termsLiabilityBody },
              { heading: legal.termsChangesTitle, body: legal.termsChangesBody },
              { heading: legal.termsContactTitle, body: legal.termsContactBody },
            ].map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-text">
                  {section.heading}
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-text-secondary">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>
      </main>

      <MarketingFooter locale={locale} />
    </div>
  );
}
