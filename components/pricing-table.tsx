"use client";

import { CreditCard } from "lucide-react";
import { BILLING_PLANS, getPolarProductId } from "@/lib/billing";

const DISPLAY_PLANS = BILLING_PLANS.filter((p) => p.slug !== "none");

const PLAN_PRICES: Record<string, number> = {
  starter: 20,
  pro: 50,
  growth: 100,
  business: 150,
  scale: 200,
};

function formatCreditsShort(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export function PricingCards({
  redirectUrl,
  currentPlan,
}: {
  redirectUrl?: string;
  currentPlan?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DISPLAY_PLANS.map((plan) => {
        const productId = getPolarProductId(plan.slug);
        const price = PLAN_PRICES[plan.slug] ?? 0;
        const isCurrent = currentPlan === plan.slug;

        return (
          <div
            key={plan.slug}
            className={`relative flex flex-col rounded-2xl border bg-surface p-5 transition-shadow hover:shadow-[var(--shadow-md)] ${
              isCurrent ? "border-accent ring-2 ring-accent/20" : "border-border"
            }`}
          >
            {isCurrent && (
              <span className="absolute -top-3 left-4 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
                Current
              </span>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-text">{plan.name}</h3>
              <p className="mt-1 text-sm text-text-secondary">
                {formatCreditsShort(plan.monthlyCredits)} credits/mo
              </p>
            </div>
            <div className="mb-5">
              <span className="text-3xl font-bold text-text">${price}</span>
              <span className="text-sm text-text-tertiary">/mo</span>
            </div>
            <a
              href={`/api/checkout/polar?products=${productId}${redirectUrl ? `&success=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="btn btn-primary mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm"
            >
              <CreditCard className="h-4 w-4" />
              {isCurrent ? "Manage" : "Subscribe"}
            </a>
          </div>
        );
      })}
    </div>
  );
}
