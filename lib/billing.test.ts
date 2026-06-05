import { describe, expect, it } from "vitest";
import {
  getBillingPlanDisplayName,
  getMonthlyCreditsForPlan,
  normalizeBillingPlanSlug,
  planSlugFromProductId,
  getPolarProductId,
  parsePolarSubscriptionEvent,
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

describe("Polar product ID mapping", () => {
  it("maps plan slugs to Polar product IDs", () => {
    expect(getPolarProductId("starter")).toBe("592a9cdb-3179-4f50-be49-39bd4f86362c");
    expect(getPolarProductId("pro")).toBe("4d4e3511-259e-45c2-8a58-a5972596faa3");
    expect(getPolarProductId("none")).toBeNull();
  });

  it("maps Polar product IDs to plan slugs", () => {
    expect(planSlugFromProductId("592a9cdb-3179-4f50-be49-39bd4f86362c")).toBe("starter");
    expect(planSlugFromProductId("4d4e3511-259e-45c2-8a58-a5972596faa3")).toBe("pro");
    expect(planSlugFromProductId("unknown-id")).toBeNull();
  });
});

describe("parsePolarSubscriptionEvent", () => {
  it("parses a subscription event with all fields", () => {
    expect(
      parsePolarSubscriptionEvent({
        id: "sub_123",
        status: "active",
        customer_id: "cust_123",
        product_id: "4d4e3511-259e-45c2-8a58-a5972596faa3",
        current_period_end: "2026-06-01T00:00:00.000Z",
      }),
    ).toEqual({
      polarCustomerId: "cust_123",
      polarSubscriptionId: "sub_123",
      plan: "pro",
      status: "active",
      currentPeriodEnd: "2026-06-01T00:00:00.000Z",
      monthlyCredits: 2500,
    });
  });

  it("parses a canceled subscription", () => {
    expect(
      parsePolarSubscriptionEvent({
        id: "sub_123",
        status: "canceled",
        customer_id: "cust_123",
        product_id: "4d4e3511-259e-45c2-8a58-a5972596faa3",
        current_period_end: "2026-06-01T00:00:00.000Z",
      }),
    ).toEqual({
      polarCustomerId: "cust_123",
      polarSubscriptionId: "sub_123",
      plan: "pro",
      status: "canceled",
      currentPeriodEnd: "2026-06-01T00:00:00.000Z",
      monthlyCredits: undefined,
    });
  });

  it("returns null when customer_id is missing", () => {
    expect(
      parsePolarSubscriptionEvent({
        id: "sub_123",
        status: "active",
        customer_id: null,
        product_id: "4d4e3511-259e-45c2-8a58-a5972596faa3",
      }),
    ).toBeNull();
  });

  it("returns null when subscription id is missing", () => {
    expect(
      parsePolarSubscriptionEvent({
        id: null,
        status: "active",
        customer_id: "cust_123",
        product_id: "4d4e3511-259e-45c2-8a58-a5972596faa3",
      }),
    ).toBeNull();
  });

  it("maps unknown product IDs to undefined plan", () => {
    const result = parsePolarSubscriptionEvent({
      id: "sub_123",
      status: "active",
      customer_id: "cust_123",
      product_id: "unknown-product-id",
    });
    expect(result?.plan).toBeUndefined();
    expect(result?.monthlyCredits).toBeUndefined();
  });
});
