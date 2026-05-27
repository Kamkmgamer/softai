import { MarketingNav } from "@/components/marketing-nav";
import { PricingTable } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";

export default async function PricingPage() {
  const session = await getAppSession().catch(() => null);
  const hasAccess = session !== null;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MarketingNav hasAccess={hasAccess} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20 lg:py-32">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl text-balance">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-text-secondary">
              Pay for the credits you need. No hidden fees.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-sm)]">
            <PricingTable newSubscriptionRedirectUrl="/billing" />
          </div>

          <div className="mx-auto mt-20 max-w-2xl">
            <h2 className="text-xl font-semibold text-text mb-6 text-center">Credit economics</h2>
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-border bg-surface-raised text-xs font-medium text-text-secondary">
                  <tr>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-surface-raised transition-colors">
                    <td className="px-5 py-3 font-medium text-text">Generate storyboard</td>
                    <td className="px-5 py-3 text-right text-text-secondary">100 credits</td>
                  </tr>
                  <tr className="hover:bg-surface-raised transition-colors">
                    <td className="px-5 py-3 font-medium text-text">Render final video</td>
                    <td className="px-5 py-3 text-right text-text-secondary">500 credits</td>
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
