import { beforeEach, describe, expect, it } from "vitest";
import {
  claimPolarWebhookEvent,
  getBillingSummary,
  getCreditBalance,
  getUserSubscription,
  markPolarWebhookEventFailed,
  markPolarWebhookEventProcessed,
  upsertUser,
  upsertUserSubscription,
} from "./store";

function resetMemoryStore() {
  delete (globalThis as typeof globalThis & { softaiStore?: unknown }).softaiStore;
}

function getMemoryWebhookEvent(eventId: string) {
  return (globalThis as typeof globalThis & {
    softaiStore?: { polarWebhookEvents: Array<{ eventId: string; createdAt: string }> };
  }).softaiStore?.polarWebhookEvents.find((entry) => entry.eventId === eventId);
}

describe("billing subscription updates", () => {
  beforeEach(() => {
    resetMemoryStore();
  });

  it("grants only the upgrade credit delta and does not double grant repeated updates", async () => {
    const user = await upsertUser({ clerkUserId: "user_test", email: "test@softai.local", name: "Test User" });

    await upsertUserSubscription(user.id, {
      polarCustomerId: "cust_test",
      polarSubscriptionId: "sub_test",
      plan: "pro",
      status: "active",
      monthlyCredits: 2500,
    });

    expect(await getCreditBalance(user.id)).toBe(2500);

    await upsertUserSubscription(user.id, {
      polarCustomerId: "cust_test",
      polarSubscriptionId: "sub_test",
      plan: "pro",
      status: "active",
      monthlyCredits: 2500,
    });

    expect(await getCreditBalance(user.id)).toBe(2500);
  });

  it("does not claw back credits on downgrade or grant credits on cancellation", async () => {
    const user = await upsertUser({ clerkUserId: "user_test", email: "test@softai.local", name: "Test User" });

    await upsertUserSubscription(user.id, {
      polarCustomerId: "cust_test",
      polarSubscriptionId: "sub_test",
      plan: "growth",
      status: "active",
      monthlyCredits: 5000,
    });
    expect(await getCreditBalance(user.id)).toBe(5000);

    await upsertUserSubscription(user.id, {
      polarCustomerId: "cust_test",
      polarSubscriptionId: "sub_test",
      plan: "starter",
      status: "active",
      monthlyCredits: 1000,
    });
    expect(await getCreditBalance(user.id)).toBe(5000);

    await upsertUserSubscription(user.id, {
      polarCustomerId: "cust_test",
      polarSubscriptionId: undefined,
      status: "canceled",
    });

    expect(await getCreditBalance(user.id)).toBe(5000);
    expect(await getUserSubscription(user.id)).toMatchObject({ plan: "starter", status: "canceled", monthlyCredits: 1000 });
  });

  it("returns display plan names in the billing summary", async () => {
    const user = await upsertUser({ clerkUserId: "user_test", email: "test@softai.local", name: "Test User" });

    await upsertUserSubscription(user.id, {
      polarCustomerId: "cust_test",
      plan: "business",
      status: "active",
      monthlyCredits: 8500,
    });

    await expect(getBillingSummary(user.id)).resolves.toMatchObject({ plan: "Business", monthlyCredits: 8500 });
  });

  it("applies credit allowance when auth reconciliation updates the current plan", async () => {
    const user = await upsertUser({ clerkUserId: "user_test", email: "test@softai.local", name: "Test User" });

    await upsertUserSubscription(user.id, {
      polarCustomerId: "cust_test",
      plan: "pro",
      status: "active",
      monthlyCredits: 2500,
    });

    await expect(getUserSubscription(user.id)).resolves.toMatchObject({ plan: "pro", monthlyCredits: 2500 });
    expect(await getCreditBalance(user.id)).toBe(2500);
  });
});

describe("polar webhook idempotency", () => {
  beforeEach(() => {
    resetMemoryStore();
  });

  it("claims each event once after it is processed", async () => {
    await expect(claimPolarWebhookEvent("evt_1", "subscription.active")).resolves.toBe(true);
    await markPolarWebhookEventProcessed("evt_1");
    await expect(claimPolarWebhookEvent("evt_1", "subscription.active")).resolves.toBe(false);
  });

  it("allows failed events to be retried", async () => {
    await expect(claimPolarWebhookEvent("evt_1", "subscription.active")).resolves.toBe(true);
    await markPolarWebhookEventFailed("evt_1", "transient failure");
    await expect(claimPolarWebhookEvent("evt_1", "subscription.active")).resolves.toBe(true);
  });

  it("allows stale processing events to be retried", async () => {
    await expect(claimPolarWebhookEvent("evt_1", "subscription.active")).resolves.toBe(true);
    await expect(claimPolarWebhookEvent("evt_1", "subscription.active")).resolves.toBe(false);

    const event = getMemoryWebhookEvent("evt_1");
    expect(event).toBeDefined();
    event!.createdAt = new Date(Date.now() - 6 * 60 * 1000).toISOString();

    await expect(claimPolarWebhookEvent("evt_1", "subscription.active")).resolves.toBe(true);
  });
});
