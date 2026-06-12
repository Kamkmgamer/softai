import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type {
  AbuseReportRecord,
  AdminActionRecord,
  AssetType,
  AuditEventRecord,
  AvatarRecord,
  AvatarSource,
  BrandAssetRecord,
  ChatConversationRecord,
  ChatMessageRecord,
  CreditLedgerRecord,
  GenerationJobRecord,
  OutputRecord,
  ProjectRecord,
  ProjectStatus,
  SceneRecord,
  StoryboardRecord,
  SubscriptionRecord,
  UserRecord,
} from "@/lib/types";
import { getState } from "./memory";

export const now = () => new Date().toISOString();

export const POLAR_WEBHOOK_PROCESSING_TIMEOUT_MS = 5 * 60 * 1000;
export const STORE_CACHE_REVALIDATE_SECONDS = 60;
export const HISTORY_PAGE_SIZE = 20;

export const cacheTags = {
  userProjects: (userId: string) => `user:${userId}:projects`,
  userDashboard: (userId: string) => `user:${userId}:dashboard`,
  userBilling: (userId: string) => `user:${userId}:billing`,
  project: (projectId: string) => `project:${projectId}`,
  conversation: (conversationId: string) => `conversation:${conversationId}`,
};

export function revalidateStoreTag(tag: string) {
  try {
    revalidateTag(tag, { expire: 0 });
  } catch {
    // Some tests and scripts call store functions outside a Next request scope.
  }
}

export function revalidateUserData(userId: string) {
  revalidateStoreTag(cacheTags.userProjects(userId));
  revalidateStoreTag(cacheTags.userDashboard(userId));
  revalidateStoreTag(cacheTags.userBilling(userId));
}

export function revalidateProjectData(userId: string, projectId: string) {
  revalidateUserData(userId);
  revalidateStoreTag(cacheTags.project(projectId));
}

export function isStalePolarWebhookClaim(createdAt: string | Date) {
  return Date.now() - new Date(createdAt).getTime() > POLAR_WEBHOOK_PROCESSING_TIMEOUT_MS;
}

export function toIso(value: string | Date | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function memoryUpdateProjectStatus(projectId: string, status: ProjectStatus) {
  const state = getState();
  const project = state.projects.find((entry) => entry.id === projectId);
  if (project) {
    project.status = status;
    project.updatedAt = now();
  }
}

export function memoryAddAuditEvent(userId: string | null, projectId: string | null, event: string, payload: unknown) {
  getState().auditEvents.unshift({
    id: randomUUID(),
    userId,
    projectId,
    event,
    payload,
    createdAt: now(),
  });
}

export async function addAuditEvent(userId: string | null, projectId: string | null, event: string, payload: unknown) {
  if (!databaseEnabled() || !db) {
    memoryAddAuditEvent(userId, projectId, event, payload);
    return;
  }
  await ensureDatabase();
  await db.insert(schema.auditEvents).values({
    id: randomUUID(),
    userId,
    projectId,
    event,
    payload,
    createdAt: new Date(),
  });
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  if (!databaseEnabled() || !db) {
    memoryUpdateProjectStatus(projectId, status);
    return;
  }
  await ensureDatabase();
  await db
    .update(schema.projects)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.projects.id, projectId));
}

export async function projectBelongsToUser(userId: string, projectId: string): Promise<boolean> {
  if (!databaseEnabled() || !db) {
    return getState().projects.some((p) => p.id === projectId && p.userId === userId);
  }
  await ensureDatabase();
  const row = await db.query.projects.findFirst({
    columns: { id: true },
    where: and(eq(schema.projects.id, projectId), eq(schema.projects.userId, userId)),
  });
  return Boolean(row);
}

export async function getProjectTitle(userId: string, projectId: string): Promise<string | null> {
  if (!databaseEnabled() || !db) {
    return getState().projects.find((p) => p.id === projectId && p.userId === userId)?.title ?? null;
  }
  await ensureDatabase();
  const row = await db.query.projects.findFirst({
    columns: { title: true },
    where: and(eq(schema.projects.id, projectId), eq(schema.projects.userId, userId)),
  });
  return row?.title ?? null;
}

export function generateShareToken(): string {
  return randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "").slice(0, 8);
}

/* ─── Map functions ──────────────────────────────────────── */

export function mapUser(row: typeof schema.users.$inferSelect): UserRecord {
  return {
    id: row.id,
    clerkUserId: row.clerkUserId,
    email: row.email,
    name: row.name,
    bannedAt: toIso(row.bannedAt),
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapSubscription(row: typeof schema.subscriptions.$inferSelect): SubscriptionRecord {
  return {
    id: row.id,
    userId: row.userId,
    plan: row.plan,
    status: row.status as SubscriptionRecord["status"],
    polarCustomerId: row.polarCustomerId,
    polarSubscriptionId: row.polarSubscriptionId,
    currentPeriodEnd: toIso(row.currentPeriodEnd),
    monthlyCredits: row.monthlyCredits,
  };
}

export function mapCredit(row: typeof schema.creditLedger.$inferSelect): CreditLedgerRecord {
  return {
    id: row.id,
    userId: row.userId,
    projectId: row.projectId,
    reason: row.reason as CreditLedgerRecord["reason"],
    amount: row.amount,
    note: row.note,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapChatConversation(row: typeof schema.chatConversations.$inferSelect): ChatConversationRecord {
  return {
    id: row.id,
    userId: row.userId,
    projectId: row.projectId,
    title: row.title,
    mode: row.mode as ChatConversationRecord["mode"],
    createdAt: toIso(row.createdAt) ?? now(),
    updatedAt: toIso(row.updatedAt) ?? now(),
  };
}

export function mapChatMessage(row: typeof schema.chatMessages.$inferSelect): ChatMessageRecord {
  return {
    id: row.id,
    conversationId: row.conversationId,
    userId: row.userId,
    role: row.role as ChatMessageRecord["role"],
    content: row.content,
    metadata: row.metadata,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapProject(row: typeof schema.projects.$inferSelect): ProjectRecord {
  return {
    id: row.id,
    userId: row.userId,
    status: row.status,
    kind: (row.kind as ProjectRecord["kind"]) ?? "campaign_ad",
    title: row.title,
    productName: row.productName,
    offer: row.offer,
    cta: row.cta,
    targetAudience: row.targetAudience,
    brandVoice: row.brandVoice,
    platformTarget: row.platformTarget as ProjectRecord["platformTarget"],
    language: row.language as ProjectRecord["language"],
    script: row.script,
    metadata: row.metadata ?? null,
    reviewNotes: row.reviewNotes,
    createdAt: toIso(row.createdAt) ?? now(),
    updatedAt: toIso(row.updatedAt) ?? now(),
  };
}

export function mapAsset(row: typeof schema.brandAssets.$inferSelect): BrandAssetRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    userId: row.userId,
    type: row.type as AssetType,
    name: row.name,
    url: row.url,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapAvatar(row: typeof schema.avatars.$inferSelect): AvatarRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    userId: row.userId,
    sourceType: row.sourceType as AvatarSource,
    imageUrl: row.imageUrl,
    prompt: row.prompt,
    policyState: row.policyState,
    attested: row.attested,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapStoryboard(row: typeof schema.storyboards.$inferSelect): StoryboardRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    headline: row.headline,
    hook: row.hook,
    cta: row.cta,
    status: row.status as StoryboardRecord["status"],
    createdAt: toIso(row.createdAt) ?? now(),
    updatedAt: toIso(row.updatedAt) ?? now(),
  };
}

export function mapScene(row: typeof schema.scenes.$inferSelect): SceneRecord {
  return {
    id: row.id,
    storyboardId: row.storyboardId,
    projectId: row.projectId,
    order: row.order,
    title: row.title,
    narration: row.narration,
    visualDirection: row.visualDirection,
    overlayText: row.overlayText,
    durationSeconds: row.durationSeconds,
    imageUrl: row.imageUrl,
  };
}

export function mapJob(row: typeof schema.generationJobs.$inferSelect): GenerationJobRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    userId: row.userId,
    type: row.type,
    status: row.status,
    providerKey: row.providerKey,
    modelKey: row.modelKey,
    providerJobId: row.providerJobId,
    costEstimate: row.costEstimate,
    attempts: row.attempts,
    requestPayload: row.requestPayload,
    responsePayload: row.responsePayload,
    errorMessage: row.errorMessage,
    createdAt: toIso(row.createdAt) ?? now(),
    updatedAt: toIso(row.updatedAt) ?? now(),
  };
}

export function mapOutput(row: typeof schema.outputs.$inferSelect): OutputRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    userId: row.userId,
    type: row.type,
    title: row.title,
    url: row.url,
    metadataTag: row.metadataTag,
    removedAt: toIso(row.removedAt),
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapReport(row: typeof schema.abuseReports.$inferSelect): AbuseReportRecord {
  return {
    id: row.id,
    reporterUserId: row.reporterUserId,
    projectId: row.projectId,
    outputId: row.outputId,
    reason: row.reason,
    details: row.details,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapAdminAction(row: typeof schema.adminActions.$inferSelect): AdminActionRecord {
  return {
    id: row.id,
    adminUserId: row.adminUserId,
    targetUserId: row.targetUserId,
    action: row.action as AdminActionRecord["action"],
    details: row.details,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

export function mapAuditEvent(row: typeof schema.auditEvents.$inferSelect): AuditEventRecord {
  return {
    id: row.id,
    userId: row.userId,
    projectId: row.projectId,
    event: row.event,
    payload: row.payload,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}
