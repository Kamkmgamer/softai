import { MarketingNav } from "@/components/marketing-nav";
import { PricingCards } from "@/components/pricing-table";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { getRequestLocale } from "@/lib/server-locale";

export default async function PricingPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const pricing = dictionary.pricing;
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MarketingNav hasAccess={hasAccess} />

      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-[clamp(4rem,8vw,8rem)]">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl text-balance">
              {pricing.title}
            </h1>
            <p className="mt-4 text-text-secondary">
              {pricing.subtitle}
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <PricingCards />
          </div>

          <div className="mx-auto mt-20 max-w-2xl">
            <h2 className="text-xl font-semibold text-text mb-6 text-center">
              {pricing.creditEconomics}
            </h2>
            <div className="rounded-lg border border-border bg-surface overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-border bg-surface-raised text-xs font-medium text-text-secondary">
                  <tr>
                    <th className="px-5 py-3">{pricing.action}</th>
                    <th className="px-5 py-3 text-right">{pricing.cost}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-surface-raised transition-colors">
                    <td className="px-5 py-3 font-medium text-text">
                      {pricing.generateStoryboard}
                    </td>
                    <td className="px-5 py-3 text-right text-text-secondary">
                      {pricing.storyboardCost}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-raised transition-colors">
                    <td className="px-5 py-3 font-medium text-text">
                      {pricing.renderVideo}
                    </td>
                    <td className="px-5 py-3 text-right text-text-secondary">
                      {pricing.videoCost}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
