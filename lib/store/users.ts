import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import { DEFAULT_MONTHLY_CREDITS, DEFAULT_PLAN_NAME } from "@/lib/constants";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { UserRecord } from "@/lib/types";
import { getState } from "./memory";
import { mapUser, now } from "./helpers";

export async function upsertUser(input: Pick<UserRecord, "clerkUserId" | "email" | "name">) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.users.find((user) => user.clerkUserId === input.clerkUserId);
    if (existing) {
      existing.email = input.email;
      existing.name = input.name;
      return existing;
    }
    const created: UserRecord = {
      id: randomUUID(),
      clerkUserId: input.clerkUserId,
      email: input.email,
      name: input.name,
      bannedAt: null,
      createdAt: now(),
    };
    state.users.push(created);
    state.subscriptions.push({
      id: randomUUID(),
      userId: created.id,
      plan: DEFAULT_PLAN_NAME,
      status: "inactive",
      polarCustomerId: null,
      polarSubscriptionId: null,
      currentPeriodEnd: null,
      monthlyCredits: DEFAULT_MONTHLY_CREDITS,
    });
    return created;
  }

  await ensureDatabase();
  const existing = await findUserByClerkId(input.clerkUserId);
  if (existing) {
    await db
      .update(schema.users)
      .set({ email: input.email, name: input.name })
      .where(eq(schema.users.id, existing.id));
    return { ...existing, email: input.email, name: input.name };
  }

  const createdId = randomUUID();
  await db
    .insert(schema.users)
    .values({
      id: createdId,
      clerkUserId: input.clerkUserId,
      email: input.email,
      name: input.name,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.users.clerkUserId,
      set: {
        email: input.email,
        name: input.name,
      },
    });

  const user = await db.query.users.findFirst({
    where: eq(schema.users.clerkUserId, input.clerkUserId),
  });

  if (!user) {
    throw new Error("Failed to upsert application user.");
  }

  const existingSubscription = await db.query.subscriptions.findFirst({
    where: eq(schema.subscriptions.userId, user.id),
  });

  if (!existingSubscription) {
    await db.insert(schema.subscriptions).values({
      id: randomUUID(),
      userId: user.id,
      plan: DEFAULT_PLAN_NAME,
      status: "inactive",
      polarCustomerId: null,
      polarSubscriptionId: null,
      currentPeriodEnd: null,
      monthlyCredits: DEFAULT_MONTHLY_CREDITS,
    });
  }

  return mapUser(user);
}

export async function findUserByClerkId(clerkUserId: string) {
  if (!databaseEnabled() || !db) {
    return getState().users.find((user) => user.clerkUserId === clerkUserId) ?? null;
  }
  await ensureDatabase();
  const row = await db.query.users.findFirst({
    where: eq(schema.users.clerkUserId, clerkUserId),
  });
  return row ? mapUser(row) : null;
}

export async function findUserByEmail(email: string) {
  if (!databaseEnabled() || !db) {
    return getState().users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }
  await ensureDatabase();
  const row = await db.query.users.findFirst({
    where: sql`lower(${schema.users.email}) = lower(${email})`,
  });
  return row ? mapUser(row) : null;
}
