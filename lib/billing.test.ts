import { describe, expect, it } from "vitest";
import {
  getBillingPlanDisplayName,
  getMonthlyCreditsForPlan,
  normalizeBillingPlanSlug,
  parseClerkBillingUpdate,
} from "./billing";

describe("billing plans", () => {
  it("normalizes known plan slugs and falls back to no plan", () => {
    expect(normalizeBillingPlanSlug(" PRO ")).toBe("pro");
    expect(normalizeBillingPlanSlug("unknown-plan")).toBe("none");
  });

  it("returns display names and credit amounts", () => {
    expect(getBillingPlanDisplayName("growth")).toBe("Growth");
    expect(getMonthlyCreditsForPlan("scale")).toBe(12000);
    expect(getMonthlyCreditsForPlan("unknown-plan")).toBe(0);
  });
});

describe("parseClerkBillingUpdate", () => {
  it("parses subscription events with payer, plan, status, and period", () => {
    expect(
      parseClerkBillingUpdate("subscription.active", {
        id: "sub_123",
        status: "active",
        payer: { user_id: "user_123" },
        items: [{ plan: { slug: "pro" }, period: { end: "2026-06-01T00:00:00.000Z" } }],
      }),
    ).toEqual({
      clerkUserId: "user_123",
      clerkPayerId: "user_123",
      clerkSubscriptionId: "sub_123",
      plan: "pro",
      status: "active",
      currentPeriodEnd: "2026-06-01T00:00:00.000Z",
      monthlyCredits: 2500,
    });
  });

  it("parses subscription item cancellation without clobbering the current plan", () => {
    expect(
      parseClerkBillingUpdate("subscriptionItem.canceled", {
        id: "subitem_123",
        payer: { user_id: "user_123" },
      }),
    ).toEqual({
      clerkUserId: "user_123",
      clerkPayerId: "user_123",
      clerkSubscriptionId: undefined,
      plan: undefined,
      status: "canceled",
      currentPeriodEnd: null,
      monthlyCredits: undefined,
    });
  });

  it("ignores unsupported events and organization-only billing updates", () => {
    expect(parseClerkBillingUpdate("user.created", { id: "user_123" })).toBeNull();
    expect(parseClerkBillingUpdate("subscription.active", { payer: { organization_id: "org_123" } })).toBeNull();
  });
});
