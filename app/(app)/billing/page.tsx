import { PricingTable } from "@clerk/nextjs";
import { Card, PageHeader, Pill } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { getBillingSummary } from "@/lib/store";
import { formatCredits, formatDate } from "@/lib/utils";

export default async function BillingPage() {
  const session = await getAppSession();
  const billing = getBillingSummary(session.userId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Billing"
        title="Credits and subscription state."
        description="Clerk Billing manages checkout and subscriptions. The app keeps a local entitlement view and credit ledger for generation controls."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] p-6">
          <Pill>{billing.plan}</Pill>
          <p className="mt-4 text-4xl font-semibold">{formatCredits(billing.balance)}</p>
          <p className="mt-2 text-sm text-muted">credits available</p>
          <div className="mt-6 grid gap-3 text-sm text-muted">
            <p>Status: {billing.status}</p>
            <p>Monthly credits: {formatCredits(billing.monthlyCredits)}</p>
            <p>Current period end: {formatDate(billing.currentPeriodEnd)}</p>
          </div>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Recent credit activity</h2>
          <div className="mt-6 space-y-3">
            {billing.recentActivity.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-[1.5rem] border border-border bg-white/70 p-4">
                <div>
                  <p className="font-semibold">{event.note}</p>
                  <p className="text-sm text-muted">{event.reason}</p>
                </div>
                <p className={event.amount >= 0 ? "text-success" : "text-foreground"}>
                  {event.amount > 0 ? "+" : ""}
                  {formatCredits(event.amount)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="rounded-[2rem] p-6">
        <h2 className="mb-6 text-xl font-semibold">Manage plan</h2>
        <PricingTable />
      </Card>
    </div>
  );
}
