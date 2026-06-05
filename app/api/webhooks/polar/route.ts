import { Webhooks } from "@polar-sh/nextjs";
import type { WebhookSubscriptionCreatedPayload } from "@polar-sh/sdk/models/components/webhooksubscriptioncreatedpayload";
import type { WebhookSubscriptionUpdatedPayload } from "@polar-sh/sdk/models/components/webhooksubscriptionupdatedpayload";
import type { WebhookSubscriptionCanceledPayload } from "@polar-sh/sdk/models/components/webhooksubscriptioncanceledpayload";
import type { WebhookSubscriptionRevokedPayload } from "@polar-sh/sdk/models/components/webhooksubscriptionrevokedpayload";
import type { WebhookSubscriptionActivePayload } from "@polar-sh/sdk/models/components/webhooksubscriptionactivepayload";
import type { WebhookSubscriptionUncanceledPayload } from "@polar-sh/sdk/models/components/webhooksubscriptionuncanceledpayload";
import {
  claimPolarWebhookEvent,
  findUserByEmail,
  markPolarWebhookEventFailed,
  markPolarWebhookEventProcessed,
  upsertUserSubscription,
} from "@/lib/store";
import { parsePolarSubscriptionEvent } from "@/lib/billing";

function extractEmail(data: { customer?: { email?: string | null } | null }): string | null {
  return data.customer?.email ?? null;
}

async function handleSubscriptionEvent(
  eventType: string,
  data: {
    id?: string | null;
    status?: string | null;
    customerId?: string | null;
    productId?: string | null;
    currentPeriodEnd?: Date | null;
    customer?: { email?: string | null } | null;
  },
  eventId: string,
) {
  const claimed = await claimPolarWebhookEvent(eventId, eventType);
  if (!claimed) return;

  try {
    const email = extractEmail(data);
    if (!email) {
      await markPolarWebhookEventProcessed(eventId);
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      await markPolarWebhookEventProcessed(eventId);
      return;
    }

    const billingUpdate = parsePolarSubscriptionEvent({
      id: data.id,
      status: data.status,
      customer_id: data.customerId,
      product_id: data.productId,
      current_period_end: data.currentPeriodEnd?.toISOString() ?? null,
    });

    if (!billingUpdate) {
      await markPolarWebhookEventProcessed(eventId);
      return;
    }

    await upsertUserSubscription(user.id, {
      polarCustomerId: billingUpdate.polarCustomerId,
      polarSubscriptionId: billingUpdate.polarSubscriptionId,
      plan: billingUpdate.plan,
      status: billingUpdate.status,
      currentPeriodEnd: billingUpdate.currentPeriodEnd,
      monthlyCredits: billingUpdate.monthlyCredits,
    });

    await markPolarWebhookEventProcessed(eventId);
  } catch (error) {
    await markPolarWebhookEventFailed(eventId, error instanceof Error ? error.message : "Unknown webhook processing error");
    throw error;
  }
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onSubscriptionCreated: async (payload: WebhookSubscriptionCreatedPayload) => {
    const eventId = `sub_created_${payload.data.id}_${payload.timestamp.getTime()}`;
    await handleSubscriptionEvent("subscription.created", payload.data, eventId);
  },
  onSubscriptionUpdated: async (payload: WebhookSubscriptionUpdatedPayload) => {
    const eventId = `sub_updated_${payload.data.id}_${payload.timestamp.getTime()}`;
    await handleSubscriptionEvent("subscription.updated", payload.data, eventId);
  },
  onSubscriptionActive: async (payload: WebhookSubscriptionActivePayload) => {
    const eventId = `sub_active_${payload.data.id}_${payload.timestamp.getTime()}`;
    await handleSubscriptionEvent("subscription.active", payload.data, eventId);
  },
  onSubscriptionCanceled: async (payload: WebhookSubscriptionCanceledPayload) => {
    const eventId = `sub_canceled_${payload.data.id}_${payload.timestamp.getTime()}`;
    await handleSubscriptionEvent("subscription.canceled", payload.data, eventId);
  },
  onSubscriptionRevoked: async (payload: WebhookSubscriptionRevokedPayload) => {
    const eventId = `sub_revoked_${payload.data.id}_${payload.timestamp.getTime()}`;
    await handleSubscriptionEvent("subscription.revoked", payload.data, eventId);
  },
  onSubscriptionUncanceled: async (payload: WebhookSubscriptionUncanceledPayload) => {
    const eventId = `sub_uncanceled_${payload.data.id}_${payload.timestamp.getTime()}`;
    await handleSubscriptionEvent("subscription.uncanceled", payload.data, eventId);
  },
});
