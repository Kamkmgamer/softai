import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { isClerkBillingEvent, parseClerkBillingUpdate } from "@/lib/billing";
import {
  claimClerkWebhookEvent,
  findUserByClerkId,
  markClerkWebhookEventFailed,
  markClerkWebhookEventProcessed,
  upsertUserSubscription,
} from "@/lib/store";

export async function POST(request: NextRequest) {
  let event: Awaited<ReturnType<typeof verifyWebhook>>;

  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return new Response("Verification failed", { status: 400 });
  }

  if (!isClerkBillingEvent(event.type)) {
    return new Response("OK", { status: 200 });
  }

  const dataWithId = event.data as { id?: string | null };
  const eventId = request.headers.get("svix-id") ?? `${event.type}:${dataWithId.id ?? request.headers.get("svix-timestamp") ?? "unknown"}`;
  const claimed = await claimClerkWebhookEvent(eventId, event.type);

  if (!claimed) {
    return new Response("OK", { status: 200 });
  }

  try {
    const billingUpdate = parseClerkBillingUpdate(event.type, event.data);

    if (!billingUpdate) {
      await markClerkWebhookEventProcessed(eventId);
      return new Response("OK", { status: 200 });
    }

    const user = await findUserByClerkId(billingUpdate.clerkUserId);

    if (!user) {
      await markClerkWebhookEventProcessed(eventId);
      return new Response("OK", { status: 200 });
    }

    await upsertUserSubscription(user.id, {
      clerkPayerId: billingUpdate.clerkPayerId,
      clerkSubscriptionId: billingUpdate.clerkSubscriptionId,
      plan: billingUpdate.plan,
      status: billingUpdate.status,
      currentPeriodEnd: billingUpdate.currentPeriodEnd,
      monthlyCredits: billingUpdate.monthlyCredits,
    });

    await markClerkWebhookEventProcessed(eventId);
  } catch (error) {
    await markClerkWebhookEventFailed(eventId, error instanceof Error ? error.message : "Unknown webhook processing error");
    throw error;
  }

  return new Response("OK", { status: 200 });
}
