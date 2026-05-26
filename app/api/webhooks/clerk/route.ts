import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { findUserByClerkId, upsertUserSubscription } from "@/lib/store";
import { DEFAULT_MONTHLY_CREDITS, DEFAULT_PLAN_NAME } from "@/lib/constants";

type ClerkBillingStatus = "inactive" | "trialing" | "active" | "past_due" | "canceled";

type ClerkBillingWebhookData = {
  id: string;
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

function normalizeStatus(eventType: string, status?: string | null): ClerkBillingStatus {
  if (eventType === "subscriptionItem.canceled" || eventType === "subscriptionItem.ended") {
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

  if (status === "canceled" || status === "cancelled") {
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

function getMonthlyCredits(plan: string) {
  if (plan === "pro") {
    return 2500;
  }

  if (plan === "growth") {
    return 5000;
  }

  if (plan === "business") {
    return 8500;
  }

  if (plan === "scale") {
    return 12000;
  }

  return DEFAULT_MONTHLY_CREDITS;
}

export async function POST(request: NextRequest) {
  let event: Awaited<ReturnType<typeof verifyWebhook>>;

  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return new Response("Verification failed", { status: 400 });
  }

  if (!billingEvents.has(event.type)) {
    return new Response("OK", { status: 200 });
  }

  const data = event.data as ClerkBillingWebhookData;
  const clerkUserId = data.payer?.user_id;

  if (!clerkUserId) {
    return new Response("OK", { status: 200 });
  }

  const user = await findUserByClerkId(clerkUserId);

  if (!user) {
    return new Response("OK", { status: 200 });
  }

  const firstItem = data.items?.[0];
  const plan = firstItem?.plan?.slug ?? data.plan?.slug ?? DEFAULT_PLAN_NAME;
  const currentPeriodEnd = normalizeDate(
    firstItem?.period?.end ?? firstItem?.current_period_end ?? data.period?.end ?? data.current_period_end,
  );

  await upsertUserSubscription(user.id, {
    clerkPayerId: data.payer?.organization_id ?? data.payer?.user_id ?? null,
    clerkSubscriptionId: event.type.startsWith("subscriptionItem.") ? undefined : data.id,
    plan,
    status: normalizeStatus(event.type, data.status),
    currentPeriodEnd,
    monthlyCredits: getMonthlyCredits(plan),
  });

  return new Response("OK", { status: 200 });
}
