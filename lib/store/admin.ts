import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { AbuseReportRecord, AdminActionRecord } from "@/lib/types";
import { getState } from "./memory";
import {
  addAuditEvent,
  mapAdminAction,
  mapAuditEvent,
  mapOutput,
  mapReport,
  mapUser,
  now,
} from "./helpers";

export async function createAbuseReport(reporterUserId: string, input: Pick<AbuseReportRecord, "projectId" | "outputId" | "reason" | "details">) {
  if (!databaseEnabled() || !db) {
    const report: AbuseReportRecord = { id: randomUUID(), reporterUserId, ...input, createdAt: now() };
    getState().abuseReports.unshift(report);
    await addAuditEvent(reporterUserId, input.projectId, "abuse.reported", input);
    return report;
  }
  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.abuseReports).values({
    id, reporterUserId, projectId: input.projectId ?? null, outputId: input.outputId ?? null,
    reason: input.reason, details: input.details, createdAt: new Date(),
  });
  await addAuditEvent(reporterUserId, input.projectId, "abuse.reported", input);
  return { id, reporterUserId, ...input, projectId: input.projectId ?? null, outputId: input.outputId ?? null, createdAt: now() };
}

export async function createAdminAction(adminUserId: string, input: Pick<AdminActionRecord, "targetUserId" | "action" | "details">) {
  if (!databaseEnabled() || !db) {
    const record: AdminActionRecord = { id: randomUUID(), adminUserId, ...input, createdAt: now() };
    getState().adminActions.unshift(record);
    await addAuditEvent(adminUserId, null, `admin.${input.action}`, input);
    return record;
  }
  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.adminActions).values({
    id, adminUserId, targetUserId: input.targetUserId, action: input.action, details: input.details, createdAt: new Date(),
  });
  await addAuditEvent(adminUserId, null, `admin.${input.action}`, input);
  return { id, adminUserId, ...input, createdAt: now() };
}

export async function banUser(targetUserId: string) {
  if (!databaseEnabled() || !db) {
    const user = getState().users.find((entry) => entry.id === targetUserId);
    if (user) user.bannedAt = now();
    return user ?? null;
  }
  await ensureDatabase();
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, targetUserId) });
  if (!user) return null;
  await db.update(schema.users).set({ bannedAt: new Date() }).where(eq(schema.users.id, targetUserId));
  return { ...mapUser(user), bannedAt: now() };
}

export async function getRecentAdminData() {
  if (!databaseEnabled() || !db) {
    const state = getState();
    return {
      reports: state.abuseReports.slice(0, 10),
      actions: state.adminActions.slice(0, 10),
      auditEvents: state.auditEvents.slice(0, 15),
      users: state.users,
      outputs: state.outputs,
    };
  }
  await ensureDatabase();
  const [reports, actions, auditEvents, users, outputs] = await Promise.all([
    db.query.abuseReports.findMany({ orderBy: [desc(schema.abuseReports.createdAt)], limit: 10 }),
    db.query.adminActions.findMany({ orderBy: [desc(schema.adminActions.createdAt)], limit: 10 }),
    db.query.auditEvents.findMany({ orderBy: [desc(schema.auditEvents.createdAt)], limit: 15 }),
    db.query.users.findMany({ orderBy: [desc(schema.users.createdAt)] }),
    db.query.outputs.findMany({ orderBy: [desc(schema.outputs.createdAt)] }),
  ]);
  return {
    reports: reports.map(mapReport),
    actions: actions.map(mapAdminAction),
    auditEvents: auditEvents.map(mapAuditEvent),
    users: users.map(mapUser),
    outputs: outputs.map(mapOutput),
  };
}
