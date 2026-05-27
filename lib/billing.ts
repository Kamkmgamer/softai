import { DEFAULT_MONTHLY_CREDITS, DEFAULT_PLAN_NAME } from "@/lib/constants";
import type { SubscriptionRecord } from "@/lib/types";

export const BILLING_PLANS = [
  { slug: "free_user", name: "Free", monthlyCredits: DEFAULT_MONTHLY_CREDITS },
  { slug: "starter", name: "Starter", monthlyCredits: DEFAULT_MONTHLY_CREDITS },
  { slug: "pro", name: "Pro", monthlyCredits: 2500 },
  { slug: "growth", name: "Growth", monthlyCredits: 5000 },
  { slug: "business", name: "Business", monthlyCredits: 8500 },
  { slug: "scale", name: "Scale", monthlyCredits: 12000 },
] as const;

export type BillingPlanSlug = (typeof BILLING_PLANS)[number]["slug"];

const planBySlug = new Map(BILLING_PLANS.map((plan) => [plan.slug, plan]));
const billingEvents = new Set([
  "subscription.created",
  "subscription.updated",
  "subscription.active",
  "subscription.pastDue",
  "subscriptionItem.active",
  "subscriptionItem.updated",
  "subscriptionItem.canceled",
  "subscriptionItem.pastDue",
  "subscriptionItem.ended",
  "subscriptionItem.expired",
]);

type ClerkBillingWebhookData = {
  id?: string | null;
  status?: string | null;
  payer?: {
    user_id?: string | null;
    organization_id?: string | null;
  } | null;
  items?: Array<{
    plan?: {
      slug?: string | null;
    } | null;
    period?: {
      end?: string | number | Date | null;
    } | null;
    current_period_end?: string | number | Date | null;
  }>;
  plan?: {
    slug?: string | null;
  } | null;
  period?: {
    end?: string | number | Date | null;
  } | null;
  current_period_end?: string | number | Date | null;
};

export type ClerkBillingUpdate = {
  clerkUserId: string;
  clerkPayerId: string;
  clerkSubscriptionId?: string | null;
  plan?: BillingPlanSlug;
  status: SubscriptionRecord["status"];
  currentPeriodEnd?: string | null;
  monthlyCredits?: number;
};

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

export function resolveCurrentBillingPlan(has: ((params: { plan: string }) => boolean) | undefined) {
  if (!has) {
    return null;
  }

  for (const plan of [...BILLING_PLANS].reverse()) {
    if (has({ plan: plan.slug })) {
      return plan;
    }
  }

  return null;
}

export function isClerkBillingEvent(eventType: string) {
  return billingEvents.has(eventType);
}

function normalizeStatus(eventType: string, status?: string | null): SubscriptionRecord["status"] {
  if (eventType === "subscriptionItem.canceled" || eventType === "subscriptionItem.ended" || eventType === "subscriptionItem.expired") {
    return "canceled";
  }

  if (eventType === "subscription.pastDue" || eventType === "subscriptionItem.pastDue") {
    return "past_due";
  }

  if (eventType === "subscription.active" || eventType === "subscriptionItem.active") {
    return "active";
  }

  if (status === "past_due" || status === "pastDue") {
    return "past_due";
  }

  if (status === "canceled" || status === "cancelled" || status === "expired") {
    return "canceled";
  }

  if (status === "active" || status === "trialing") {
    return status;
  }

  return "inactive";
}

function normalizeDate(value: string | number | Date | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function parseClerkBillingUpdate(eventType: string, data: ClerkBillingWebhookData): ClerkBillingUpdate | null {
  if (!isClerkBillingEvent(eventType)) {
    return null;
  }

  const clerkUserId = data.payer?.user_id;
  if (!clerkUserId) {
    return null;
  }

  const firstItem = data.items?.[0];
  const rawPlan = firstItem?.plan?.slug ?? data.plan?.slug;
  const plan = isKnownBillingPlanSlug(rawPlan) ? normalizeBillingPlanSlug(rawPlan) : undefined;
  const currentPeriodEnd = normalizeDate(
    firstItem?.period?.end ?? firstItem?.current_period_end ?? data.period?.end ?? data.current_period_end,
  );
  const status = normalizeStatus(eventType, data.status);

  return {
    clerkUserId,
    clerkPayerId: data.payer?.organization_id ?? clerkUserId,
    clerkSubscriptionId: eventType.startsWith("subscriptionItem.") ? undefined : data.id ?? null,
    plan,
    status,
    currentPeriodEnd,
    monthlyCredits: plan && (status === "active" || status === "trialing") ? getMonthlyCreditsForPlan(plan) : undefined,
  };
}
