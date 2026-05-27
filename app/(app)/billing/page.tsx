import { redirect } from "next/navigation";
import { CreditCard, Wallet, Activity } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getBillingSummary } from "@/lib/store";
import { PageHeader, SectionHeader, EmptyState } from "@/components/ui";
import { formatCredits, formatDate } from "@/lib/utils";

function localizeBillingNote(note: string, locale: Locale, dictionary: ReturnType<typeof getDictionary>) {
  if (locale !== "ar") return note;
  const notes: Record<string, string> = {
    "Onboarding credits": dictionary.billing.onboardingCredits,
    "Free plan monthly grant": dictionary.billing.monthlyGrant,
    "Generated starter storyboard": dictionary.billing.starterStoryboard,
    "Storyboard generation": dictionary.billing.storyboardGeneration,
    "Image generation hold": dictionary.billing.imageHold,
    "Image generation hold converted to burn": dictionary.billing.imageBurn,
    "Image generation refund": dictionary.billing.imageRefund,
    "Video generation hold": dictionary.billing.videoHold,
    "Video generation hold converted to burn": dictionary.billing.videoBurn,
    "Video generation refund": dictionary.billing.videoRefund,
    "Admin credit adjustment": dictionary.billing.adminAdjustment,
  };
  if (notes[note]) return notes[note];
  if (note.endsWith(" plan credit upgrade")) {
    return `${localizePlanName(note.replace(" plan credit upgrade", ""), locale)} - ${dictionary.billing.creditUpgrade}`;
  }
  return note;
}

function localizePlanName(plan: string, locale: Locale) {
  if (locale !== "ar") return plan;
  const plans: Record<string, string> = {
    Free: "مجانية",
    Starter: "البداية",
    Pro: "احترافية",
    Growth: "النمو",
    Business: "الأعمال",
    Scale: "التوسع",
  };
  return plans[plan] ?? plan;
}

export default async function BillingPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  const { balance, recentActivity, plan } = await getBillingSummary(session.userId);

  return (
    <div className="space-y-10">
      <PageHeader title={dictionary.billing.title} />

      {/* Inline stats bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{formatCredits(balance, locale)}</strong> {dictionary.billing.availableCredits}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{localizePlanName(plan, locale)}</strong> {dictionary.billing.planActive}
          </span>
        </div>
      </div>

      <section className="space-y-4">
        <SectionHeader title={dictionary.billing.topUpCredits} />
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-sm)]">
          <PricingTable newSubscriptionRedirectUrl={localizePath("/billing", locale)} />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title={dictionary.billing.recentActivity} count={recentActivity.length} />
        {recentActivity.length === 0 ? (
          <EmptyState
            icon={Activity}
            title={dictionary.billing.noActivity}
            description={dictionary.billing.noActivityDescription}
          />
        ) : (
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
            {recentActivity.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-text">{localizeBillingNote(tx.note || tx.reason, locale, dictionary)}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{formatDate(tx.createdAt, locale)}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[13px] font-medium ${
                      tx.amount > 0 ? "text-success" : "text-text"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCredits(tx.amount, locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
