import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import * as schema from "@/db/schema";
import { DEFAULT_MONTHLY_CREDITS } from "@/lib/constants";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { DashboardStats, ProjectRecord } from "@/lib/types";
import { cacheTags, mapOutput, mapProject, mapSubscription, STORE_CACHE_REVALIDATE_SECONDS } from "./helpers";
import { listProjects } from "./projects";
import { getCreditBalance, getUserSubscription } from "./credits";
import { listOutputsForUser } from "./outputs";

export async function getDashboardStats(userId: string, existingProjects?: ProjectRecord[]): Promise<DashboardStats> {
  if (!databaseEnabled() || !db) {
    const projects = existingProjects ?? await listProjects(userId);
    const subscription = await getUserSubscription(userId);
    const creditBalance = await getCreditBalance(userId);
    const outputs = await listOutputsForUser(userId);
    return {
      activeProjects: projects.filter((entry) => entry.status !== "completed").length,
      completedVideos: outputs.filter((output) => output.type === "final_video").length,
      creditBalance,
      monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
    };
  }

  await ensureDatabase();

  if (existingProjects) {
    const [subRow, balanceRow, outputRows] = await db.batch([
      db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.userId, userId),
        orderBy: [desc(schema.subscriptions.currentPeriodEnd)],
      }),
      db
        .select({ total: sql<number>`coalesce(sum(${schema.creditLedger.amount}), 0)` })
        .from(schema.creditLedger)
        .where(eq(schema.creditLedger.userId, userId)),
      db.query.outputs.findMany({
        where: and(eq(schema.outputs.userId, userId), isNull(schema.outputs.removedAt)),
      }),
    ]);

    const subscription = subRow ? mapSubscription(subRow) : null;
    const creditBalance = Number(balanceRow[0]?.total ?? 0);
    const outputs = outputRows.map(mapOutput);

    return {
      activeProjects: existingProjects.filter((entry) => entry.status !== "completed").length,
      completedVideos: outputs.filter((output) => output.type === "final_video").length,
      creditBalance,
      monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
    };
  } else {
    const [projectRows, subRow, balanceRow, outputRows] = await db.batch([
      db.query.projects.findMany({
        where: eq(schema.projects.userId, userId),
        orderBy: [desc(schema.projects.updatedAt)],
      }),
      db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.userId, userId),
        orderBy: [desc(schema.subscriptions.currentPeriodEnd)],
      }),
      db
        .select({ total: sql<number>`coalesce(sum(${schema.creditLedger.amount}), 0)` })
        .from(schema.creditLedger)
        .where(eq(schema.creditLedger.userId, userId)),
      db.query.outputs.findMany({
        where: and(eq(schema.outputs.userId, userId), isNull(schema.outputs.removedAt)),
      }),
    ]);

    const projects = projectRows.map(mapProject);
    const subscription = subRow ? mapSubscription(subRow) : null;
    const creditBalance = Number(balanceRow[0]?.total ?? 0);
    const outputs = outputRows.map(mapOutput);

    return {
      activeProjects: projects.filter((entry) => entry.status !== "completed").length,
      completedVideos: outputs.filter((output) => output.type === "final_video").length,
      creditBalance,
      monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
    };
  }
}

export async function getDashboardPageData(userId: string): Promise<{ projects: ProjectRecord[]; stats: DashboardStats }> {
  if (!databaseEnabled() || !db) {
    const projects = await listProjects(userId);
    const subscription = await getUserSubscription(userId);
    const creditBalance = await getCreditBalance(userId);
    const outputs = await listOutputsForUser(userId);

    return {
      projects,
      stats: {
        activeProjects: projects.filter((entry) => entry.status !== "completed").length,
        completedVideos: outputs.filter((output) => output.type === "final_video").length,
        creditBalance,
        monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
      },
    };
  }

  const database = db;
  return unstable_cache(
    async () => {
      await ensureDatabase();
      const [projectRows, subRow, balanceRow, completedVideoRows] = await database.batch([
        database.query.projects.findMany({
          where: eq(schema.projects.userId, userId),
          orderBy: [desc(schema.projects.updatedAt)],
        }),
        database.query.subscriptions.findFirst({
          where: eq(schema.subscriptions.userId, userId),
          orderBy: [desc(schema.subscriptions.currentPeriodEnd)],
        }),
        database
          .select({ total: sql<number>`coalesce(sum(${schema.creditLedger.amount}), 0)` })
          .from(schema.creditLedger)
          .where(eq(schema.creditLedger.userId, userId)),
        database
          .select({ total: sql<number>`count(*)` })
          .from(schema.outputs)
          .where(and(eq(schema.outputs.userId, userId), eq(schema.outputs.type, "final_video"), isNull(schema.outputs.removedAt))),
      ]);

      const projects = projectRows.map(mapProject);
      const subscription = subRow ? mapSubscription(subRow) : null;

      return {
        projects,
        stats: {
          activeProjects: projects.filter((entry) => entry.status !== "completed").length,
          completedVideos: Number(completedVideoRows[0]?.total ?? 0),
          creditBalance: Number(balanceRow[0]?.total ?? 0),
          monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
        },
      };
    },
    ["dashboard-page-data", userId],
    {
      tags: [cacheTags.userDashboard(userId), cacheTags.userProjects(userId), cacheTags.userBilling(userId)],
      revalidate: STORE_CACHE_REVALIDATE_SECONDS,
    },
  )();
}
