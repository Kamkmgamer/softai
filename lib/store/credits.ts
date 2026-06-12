import { randomUUID } from "crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import * as schema from "@/db/schema";
import { DEFAULT_MONTHLY_CREDITS, DEFAULT_PLAN_NAME } from "@/lib/constants";
import { getBillingPlanDisplayName } from "@/lib/billing";
import { db, databaseEnabled, ensureDatabase, neonSql } from "@/lib/db";
import type { CreditLedgerRecord, SubscriptionRecord } from "@/lib/types";
import { formatCredits } from "@/lib/utils";
import { getState } from "./memory";
import {
  cacheTags,
  isStalePolarWebhookClaim,
  mapCredit,
  mapSubscription,
  now,
  revalidateUserData,
  STORE_CACHE_REVALIDATE_SECONDS,
  toIso,
} from "./helpers";

export async function getCreditBalance(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState().creditLedger.filter((entry) => entry.userId === userId).reduce((total, entry) => total + entry.amount, 0);
  }
  await ensureDatabase();
  const [result] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.creditLedger.amount}), 0)` })
    .from(schema.creditLedger)
    .where(eq(schema.creditLedger.userId, userId));
  return Number(result?.total ?? 0);
}

export async function getUserSubscription(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState().subscriptions.find((entry) => entry.userId === userId) ?? null;
  }
  await ensureDatabase();
  const row = await db.query.subscriptions.findFirst({
    where: eq(schema.subscriptions.userId, userId),
    orderBy: [desc(schema.subscriptions.currentPeriodEnd)],
  });
  return row ? mapSubscription(row) : null;
}

export async function hasActiveSubscription(userId: string) {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;
  return (
    subscription.plan !== DEFAULT_PLAN_NAME &&
    (subscription.status === "active" || subscription.status === "trialing")
  );
}

export async function claimPolarWebhookEvent(eventId: string, type: string) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.polarWebhookEvents.find((entry) => entry.eventId === eventId);

    if (existing?.status === "processed") {
      return false;
    }

    if (existing?.status === "processing" && !isStalePolarWebhookClaim(existing.createdAt)) {
      return false;
    }

    if (existing?.status === "failed") {
      existing.status = "processing";
      existing.error = null;
      return true;
    }

    if (existing?.status === "processing") {
      existing.error = null;
      return true;
    }

    state.polarWebhookEvents.push({
      id: randomUUID(),
      eventId,
      type,
      status: "processing",
      error: null,
      createdAt: now(),
      processedAt: null,
    });
    return true;
  }

  await ensureDatabase();
  const [inserted] = await db
    .insert(schema.polarWebhookEvents)
    .values({ id: randomUUID(), eventId, type, status: "processing", createdAt: new Date() })
    .onConflictDoNothing()
    .returning({ id: schema.polarWebhookEvents.id });

  if (inserted) {
    return true;
  }

  const existing = await db.query.polarWebhookEvents.findFirst({
    where: eq(schema.polarWebhookEvents.eventId, eventId),
  });

  if (existing?.status === "processed") {
    return false;
  }

  if (existing?.status === "processing" && !isStalePolarWebhookClaim(existing.createdAt)) {
    return false;
  }

  await db
    .update(schema.polarWebhookEvents)
    .set({ status: "processing", error: null, processedAt: null })
    .where(eq(schema.polarWebhookEvents.eventId, eventId));
  return true;
}

export async function markPolarWebhookEventProcessed(eventId: string) {
  if (!databaseEnabled() || !db) {
    const existing = getState().polarWebhookEvents.find((entry) => entry.eventId === eventId);
    if (existing) {
      existing.status = "processed";
      existing.error = null;
      existing.processedAt = now();
    }
    return;
  }

  await ensureDatabase();
  await db
    .update(schema.polarWebhookEvents)
    .set({ status: "processed", error: null, processedAt: new Date() })
    .where(eq(schema.polarWebhookEvents.eventId, eventId));
}

export async function markPolarWebhookEventFailed(eventId: string, error: string) {
  if (!databaseEnabled() || !db) {
    const existing = getState().polarWebhookEvents.find((entry) => entry.eventId === eventId);
    if (existing) {
      existing.status = "failed";
      existing.error = error;
      existing.processedAt = null;
    }
    return;
  }

  await ensureDatabase();
  await db
    .update(schema.polarWebhookEvents)
    .set({ status: "failed", error, processedAt: null })
    .where(eq(schema.polarWebhookEvents.eventId, eventId));
}

export async function upsertUserSubscription(
  userId: string,
  input: { polarCustomerId: string | null; polarSubscriptionId?: string | null; plan?: string; status: SubscriptionRecord["status"]; currentPeriodEnd?: string | null; monthlyCredits?: number },
) {
  const shouldGrantUpgradeCredits = (existingMonthlyCredits: number, nextStatus: SubscriptionRecord["status"]) =>
    (nextStatus === "active" || nextStatus === "trialing") &&
    input.monthlyCredits !== undefined &&
    input.monthlyCredits > existingMonthlyCredits;

  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing =
      state.subscriptions.find((entry) => input.polarSubscriptionId !== null && entry.polarSubscriptionId === input.polarSubscriptionId) ??
      state.subscriptions.find((entry) => entry.userId === userId);
    if (existing) {
      const upgradeCreditDelta = shouldGrantUpgradeCredits(existing.monthlyCredits, input.status)
        ? (input.monthlyCredits as number) - existing.monthlyCredits
        : 0;
      existing.polarCustomerId = input.polarCustomerId;
      existing.polarSubscriptionId = input.polarSubscriptionId === undefined ? existing.polarSubscriptionId : input.polarSubscriptionId;
      existing.plan = input.plan ?? existing.plan;
      existing.status = input.status;
      existing.currentPeriodEnd = input.currentPeriodEnd ?? existing.currentPeriodEnd;
      existing.monthlyCredits = input.monthlyCredits ?? existing.monthlyCredits;
      if (upgradeCreditDelta > 0) {
        state.creditLedger.unshift({
          id: randomUUID(),
          userId,
          projectId: null,
          reason: "grant",
          amount: upgradeCreditDelta,
          note: `${getBillingPlanDisplayName(input.plan ?? existing.plan)} plan credit upgrade`,
          createdAt: now(),
        });
      }
      return existing;
    }
    const created: SubscriptionRecord = {
      id: randomUUID(), userId, plan: input.plan ?? DEFAULT_PLAN_NAME, status: input.status, polarCustomerId: input.polarCustomerId,
      polarSubscriptionId: input.polarSubscriptionId ?? null, currentPeriodEnd: input.currentPeriodEnd ?? null,
      monthlyCredits: input.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
    };
    state.subscriptions.push(created);
    return created;
  }
  await ensureDatabase();
  let existing = null;
  if (input.polarSubscriptionId !== undefined && input.polarSubscriptionId !== null) {
    existing = await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.polarSubscriptionId, input.polarSubscriptionId),
    });
  }
  if (!existing) {
    existing = await db.query.subscriptions.findFirst({ where: eq(schema.subscriptions.userId, userId) });
  }
  if (existing) {
    const updateValues = {
      polarCustomerId: input.polarCustomerId,
      polarSubscriptionId: input.polarSubscriptionId === undefined ? existing.polarSubscriptionId : input.polarSubscriptionId,
      plan: input.plan ?? existing.plan,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ? new Date(input.currentPeriodEnd) : existing.currentPeriodEnd,
      monthlyCredits: input.monthlyCredits ?? existing.monthlyCredits,
    };
    let upgradeCreditDelta = 0;

    if (shouldGrantUpgradeCredits(existing.monthlyCredits, input.status)) {
      const [updated] = await db
        .update(schema.subscriptions)
        .set(updateValues)
        .where(and(eq(schema.subscriptions.id, existing.id), eq(schema.subscriptions.monthlyCredits, existing.monthlyCredits)))
        .returning({ id: schema.subscriptions.id });

      if (updated) {
        upgradeCreditDelta = (input.monthlyCredits as number) - existing.monthlyCredits;
      } else {
        await db.update(schema.subscriptions).set(updateValues).where(eq(schema.subscriptions.id, existing.id));
      }
    } else {
      await db.update(schema.subscriptions).set(updateValues).where(eq(schema.subscriptions.id, existing.id));
    }

    if (upgradeCreditDelta > 0) {
      await db.insert(schema.creditLedger).values({
        id: randomUUID(),
        userId,
        projectId: null,
        reason: "grant",
        amount: upgradeCreditDelta,
        note: `${getBillingPlanDisplayName(input.plan ?? existing.plan)} plan credit upgrade`,
        createdAt: new Date(),
      });
    }
    revalidateUserData(userId);
    return {
      ...mapSubscription(existing),
      polarCustomerId: input.polarCustomerId,
      polarSubscriptionId: input.polarSubscriptionId === undefined ? existing.polarSubscriptionId : input.polarSubscriptionId ?? null,
      plan: input.plan ?? existing.plan,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ?? toIso(existing.currentPeriodEnd),
      monthlyCredits: input.monthlyCredits ?? existing.monthlyCredits,
    };
  }
  const id = randomUUID();
  await db.insert(schema.subscriptions).values({
    id, userId, plan: input.plan ?? DEFAULT_PLAN_NAME, status: input.status, polarCustomerId: input.polarCustomerId,
    polarSubscriptionId: input.polarSubscriptionId ?? null,
    currentPeriodEnd: input.currentPeriodEnd ? new Date(input.currentPeriodEnd) : null,
    monthlyCredits: input.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
  });
  revalidateUserData(userId);
  return {
    id, userId, plan: input.plan ?? DEFAULT_PLAN_NAME, status: input.status, polarCustomerId: input.polarCustomerId,
    polarSubscriptionId: input.polarSubscriptionId ?? null, currentPeriodEnd: input.currentPeriodEnd ?? null,
    monthlyCredits: input.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
  };
}

export async function addCreditEvent(
  userId: string,
  input: { projectId?: string | null; reason: CreditLedgerRecord["reason"]; amount: number; note: string },
) {
  if (!databaseEnabled() || !db) {
    const record: CreditLedgerRecord = { id: randomUUID(), userId, projectId: input.projectId ?? null, reason: input.reason, amount: input.amount, note: input.note, createdAt: now() };
    getState().creditLedger.unshift(record);
    return record;
  }
  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.creditLedger).values({
    id,
    userId,
    projectId: input.projectId ?? null,
    reason: input.reason,
    amount: input.amount,
    note: input.note,
    createdAt: new Date(),
  });
  revalidateUserData(userId);
  return { id, userId, projectId: input.projectId ?? null, reason: input.reason, amount: input.amount, note: input.note, createdAt: now() };
}

export async function addCreditEventIfSufficient(
  userId: string,
  input: { projectId?: string | null; reason: CreditLedgerRecord["reason"]; amount: number; note: string },
) {
  if (input.amount >= 0) {
    return addCreditEvent(userId, input);
  }

  if (!databaseEnabled() || !db || !neonSql) {
    const balance = await getCreditBalance(userId);
    if (balance + input.amount < 0) {
      throw new Error(`Insufficient credits. Required ${Math.abs(input.amount)}, available ${balance}.`);
    }
    const record: CreditLedgerRecord = { id: randomUUID(), userId, projectId: input.projectId ?? null, reason: input.reason, amount: input.amount, note: input.note, createdAt: now() };
    getState().creditLedger.unshift(record);
    return record;
  }

  await ensureDatabase();
  const id = randomUUID();
  const requiredCredits = Math.abs(input.amount);
  const [, insertedRows] = await neonSql.transaction((tx) => [
    tx`select pg_advisory_xact_lock(hashtext(${userId}))`,
    tx`
      insert into credit_ledger (id, user_id, project_id, reason, amount, note, created_at)
      select ${id}::uuid, ${userId}::uuid, ${input.projectId ?? null}::uuid, ${input.reason}, ${input.amount}, ${input.note}, now()
      where (select coalesce(sum(amount), 0) from credit_ledger where user_id = ${userId}::uuid) >= ${requiredCredits}
      returning id
    `,
  ]);

  if (insertedRows.length === 0) {
    const balance = await getCreditBalance(userId);
    throw new Error(`Insufficient credits. Required ${requiredCredits}, available ${balance}.`);
  }

  revalidateUserData(userId);
  return { id, userId, projectId: input.projectId ?? null, reason: input.reason, amount: input.amount, note: input.note, createdAt: now() };
}

export async function getCreditHistory(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState().creditLedger.filter((entry) => entry.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  await ensureDatabase();
  const rows = await db.query.creditLedger.findMany({
    where: eq(schema.creditLedger.userId, userId),
    orderBy: [desc(schema.creditLedger.createdAt)],
  });
  return rows.map(mapCredit);
}

export async function getBillingSummary(userId: string) {
  const getSummary = async () => {
    const [subscription, balance, recentActivity] = await Promise.all([
      getUserSubscription(userId),
      getCreditBalance(userId),
      getCreditHistory(userId),
    ]);
    return {
      plan: getBillingPlanDisplayName(subscription?.plan ?? DEFAULT_PLAN_NAME),
      status: subscription?.status ?? "trialing",
      monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
      balance,
      currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
      recentActivity: recentActivity.slice(0, 8),
      summaryLabel: `${formatCredits(balance)} credits available`,
    };
  };

  if (!databaseEnabled() || !db) {
    return getSummary();
  }

  return unstable_cache(getSummary, ["billing-summary", userId], {
    tags: [cacheTags.userBilling(userId)],
    revalidate: STORE_CACHE_REVALIDATE_SECONDS,
  })();
}
