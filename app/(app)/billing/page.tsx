import { redirect } from "next/navigation";
import { CreditCard, Wallet, Activity } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";
import { getAppSession } from "@/lib/auth";
import { getBillingSummary } from "@/lib/store";
import { PageHeader, SectionHeader, EmptyState } from "@/components/ui";
import { formatCredits, formatDate } from "@/lib/utils";

export default async function BillingPage() {
  const session = await getAppSession();
  if (!session) redirect("/sign-in");

  const { balance, recentActivity, plan } = await getBillingSummary(session.userId);

  return (
    <div className="space-y-10">
      <PageHeader title="Billing" />

      {/* Inline stats bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{formatCredits(balance)}</strong> available credits
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{plan} plan</strong> active
          </span>
        </div>
      </div>

      <section className="space-y-4">
        <SectionHeader title="Top up credits" />
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-sm)]">
          <PricingTable />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Recent activity" count={recentActivity.length} />
        {recentActivity.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="Your credit usage and purchases will appear here."
          />
        ) : (
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
            {recentActivity.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-text">{tx.note || tx.reason}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{formatDate(tx.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[13px] font-medium ${
                      tx.amount > 0 ? "text-success" : "text-text"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCredits(tx.amount)}
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
