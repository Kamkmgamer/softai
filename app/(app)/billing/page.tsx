import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, CalendarClock, CreditCard, Wallet } from "lucide-react";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getBillingSummary } from "@/lib/store";
import { softaiClerkAppearance } from "@/lib/clerk-appearance";
import { AppBackButton } from "@/components/app-back-button";
import { PricingTable } from "@/components/pricing-table";
import { EmptyState, SectionHeader, StatusBadge } from "@/components/ui";
import { formatCredits, formatDate } from "@/lib/utils";

function localizeBillingNote(
  note: string,
  locale: Locale,
  dictionary: ReturnType<typeof getDictionary>,
) {
  if (locale !== "ar") return note;
  const notes: Record<string, string> = {
    "Onboarding credits": dictionary.billing.onboardingCredits,
    "Starter plan monthly grant": dictionary.billing.monthlyGrant,
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

  const {
    balance,
    recentActivity,
    plan,
    monthlyCredits,
    status,
    currentPeriodEnd,
  } = await getBillingSummary(session.userId);

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-start gap-4">
          <AppBackButton className="mt-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              {formatCredits(balance, locale)}{" "}
              {dictionary.billing.availableCredits}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              {dictionary.billing.description}
            </p>
          </div>
          <Link
            href={localizePath("/payments#/billing", locale)}
            className="btn btn-secondary"
          >
            {dictionary.payments.title}
          </Link>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-surface-raised text-text-secondary">
              <Wallet className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-text-tertiary">
              Credits
            </p>
            <p className="mt-1 text-xl font-semibold text-text">
              {formatCredits(balance, locale)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-surface-raised text-text-secondary">
              <CreditCard className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-text-tertiary">
              Plan
            </p>
            <p className="mt-1 text-xl font-semibold text-text">
              {localizePlanName(plan, locale)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-surface-raised text-text-secondary">
              <Activity className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-text-tertiary">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-surface-raised text-text-secondary">
              <CalendarClock className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-text-tertiary">
              {dictionary.billing.monthlyCredits}
            </p>
            <p className="mt-1 text-xl font-semibold text-text">
              {formatCredits(monthlyCredits, locale)}
            </p>
            {currentPeriodEnd ? (
              <p className="mt-1 text-xs text-text-tertiary">
                {dictionary.billing.renews}{" "}
                {formatDate(currentPeriodEnd, locale)}
              </p>
            ) : null}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <SectionHeader title={dictionary.billing.topUpCredits} />
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-sm)">
              <PricingTable
                appearance={softaiClerkAppearance}
                newSubscriptionRedirectUrl={localizePath("/billing", locale)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeader
              title={dictionary.billing.recentActivity}
              count={recentActivity.length}
            />
            {recentActivity.length === 0 ? (
              <EmptyState
                icon={Activity}
                title={dictionary.billing.noActivity}
                description={dictionary.billing.noActivityDescription}
              />
            ) : (
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
                {recentActivity.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-raised"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">
                        {localizeBillingNote(
                          tx.note || tx.reason,
                          locale,
                          dictionary,
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-text-tertiary">
                        {formatDate(tx.createdAt, locale)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[13px] font-semibold tabular-nums ${
                        tx.amount > 0 ? "text-success" : "text-text"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatCredits(tx.amount, locale)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
