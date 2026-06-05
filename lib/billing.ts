import { DEFAULT_PLAN_NAME } from "@/lib/constants";
import type { SubscriptionRecord } from "@/lib/types";
import polarProducts from "@/polar-products.json";

export const BILLING_PLANS = [
  { slug: "none", name: "No Plan", monthlyCredits: 0 },
  { slug: "starter", name: "Starter", monthlyCredits: 1000 },
  { slug: "pro", name: "Pro", monthlyCredits: 2500 },
  { slug: "growth", name: "Growth", monthlyCredits: 5000 },
  { slug: "business", name: "Business", monthlyCredits: 8500 },
  { slug: "scale", name: "Scale", monthlyCredits: 12000 },
] as const;

export type BillingPlanSlug = (typeof BILLING_PLANS)[number]["slug"];

const planBySlug = new Map(BILLING_PLANS.map((plan) => [plan.slug, plan]));

const productIdToPlan = new Map<string, BillingPlanSlug>(
  Object.entries(polarProducts).map(([slug, id]) => [id, slug as BillingPlanSlug]),
);

export function normalizeBillingPlanSlug(plan: string | null | undefined): BillingPlanSlug {
  const slug = plan?.trim().toLowerCase();

  if (slug && planBySlug.has(slug as BillingPlanSlug)) {
    return slug as BillingPlanSlug;
  }

  return DEFAULT_PLAN_NAME.toLowerCase() as BillingPlanSlug;
}

export function isKnownBillingPlanSlug(plan: string | null | undefined): plan is BillingPlanSlug {
  const slug = plan?.trim().toLowerCase();
  return Boolean(slug && planBySlug.has(slug as BillingPlanSlug));
}

export function getBillingPlan(plan: string | null | undefined) {
  return planBySlug.get(normalizeBillingPlanSlug(plan)) ?? BILLING_PLANS[0];
}

export function getMonthlyCreditsForPlan(plan: string | null | undefined) {
  return getBillingPlan(plan).monthlyCredits;
}

export function getBillingPlanDisplayName(plan: string | null | undefined) {
  return getBillingPlan(plan).name;
}

export function getPolarProductId(plan: string | null | undefined): string | null {
  const slug = normalizeBillingPlanSlug(plan);
  if (slug === "none") return null;
  return polarProducts[slug as keyof typeof polarProducts] ?? null;
}

export function planSlugFromProductId(productId: string): BillingPlanSlug | null {
  return productIdToPlan.get(productId) ?? null;
}

export type PolarSubscriptionUpdate = {
  polarCustomerId: string;
  polarSubscriptionId: string;
  plan?: BillingPlanSlug;
  status: SubscriptionRecord["status"];
  currentPeriodEnd?: string | null;
  monthlyCredits?: number;
};

function normalizeDate(value: string | number | Date | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizePolarStatus(status: string | null | undefined): SubscriptionRecord["status"] {
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "past_due") return "past_due";
  if (status === "canceled" || status === "revoked") return "canceled";
  if (status === "incomplete" || status === "incomplete_expired") return "inactive";
  return "inactive";
}

export function parsePolarSubscriptionEvent(data: {
  id?: string | null;
  status?: string | null;
  customer_id?: string | null;
  current_period_end?: string | null;
  product_id?: string | null;
}): PolarSubscriptionUpdate | null {
  const polarCustomerId = data.customer_id;
  if (!polarCustomerId) return null;

  const polarSubscriptionId = data.id;
  if (!polarSubscriptionId) return null;

  const productId = data.product_id;
  const plan = productId ? planSlugFromProductId(productId) ?? undefined : undefined;

  const status = normalizePolarStatus(data.status);
  const currentPeriodEnd = normalizeDate(data.current_period_end);

  return {
    polarCustomerId,
    polarSubscriptionId,
    plan,
    status,
    currentPeriodEnd,
    monthlyCredits: plan && (status === "active" || status === "trialing") ? getMonthlyCreditsForPlan(plan) : undefined,
  };
}
