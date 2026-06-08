import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";

export default async function PrivacyPage() {
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
            {legal.privacyTitle}
          </h1>
          <p className="mt-2 text-sm text-text-tertiary">
            {legal.privacyUpdated}
          </p>
          <p className="mt-6 text-[15px] leading-7 text-text-secondary">
            {legal.privacyIntro}
          </p>

          <div className="mt-10 space-y-8">
            {[
              { heading: legal.privacyCollectTitle, body: legal.privacyCollectBody },
              { heading: legal.privacyUseTitle, body: legal.privacyUseBody },
              { heading: legal.privacyShareTitle, body: legal.privacyShareBody },
              { heading: legal.privacySecurityTitle, body: legal.privacySecurityBody },
              { heading: legal.privacyRetentionTitle, body: legal.privacyRetentionBody },
              { heading: legal.privacyRightsTitle, body: legal.privacyRightsBody },
              { heading: legal.privacyCookiesTitle, body: legal.privacyCookiesBody },
              { heading: legal.privacyChangesTitle, body: legal.privacyChangesBody },
              { heading: legal.privacyContactTitle, body: legal.privacyContactBody },
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
