import { randomUUID } from "crypto";
import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import * as schema from "@/db/schema";
import { CREDIT_COSTS, DEFAULT_MONTHLY_CREDITS, DEFAULT_PLAN_NAME, SOFTAI_METADATA_TAG } from "@/lib/constants";
import { getBillingPlanDisplayName } from "@/lib/billing";
import { db, databaseEnabled, ensureDatabase, neonSql } from "@/lib/db";
import type {
  AbuseReportRecord,
  AdminActionRecord,
  AssetType,
  AuditEventRecord,
  AvatarPolicyState,
  AvatarRecord,
  AvatarSource,
  BrandAssetRecord,
  ChatConversationRecord,
  ChatMessageRecord,
  CreditLedgerRecord,
  DashboardStats,
  GenerationJobRecord,
  JobStatus,
  JobType,
  OutputRecord,
  OutputType,
  OutputWithProject,
  ProjectBundle,
  ProjectKind,
  ProjectRecord,
  ProjectStatus,
  SceneRecord,
  ShareTokenRecord,
  StoryboardRecord,
  SubscriptionRecord,
  UserRecord,
} from "@/lib/types";
import { formatCredits } from "@/lib/utils";

type DatabaseState = {
  users: UserRecord[];
  subscriptions: SubscriptionRecord[];
  clerkWebhookEvents: ClerkWebhookEventRecord[];
  creditLedger: CreditLedgerRecord[];
  chatConversations: ChatConversationRecord[];
  chatMessages: ChatMessageRecord[];
  projects: ProjectRecord[];
  brandAssets: BrandAssetRecord[];
  avatars: AvatarRecord[];
  storyboards: StoryboardRecord[];
  scenes: SceneRecord[];
  generationJobs: GenerationJobRecord[];
  outputs: OutputRecord[];
  abuseReports: AbuseReportRecord[];
  adminActions: AdminActionRecord[];
  auditEvents: AuditEventRecord[];
  shareTokens: ShareTokenRecord[];
};

type ClerkWebhookEventRecord = {
  id: string;
  eventId: string;
  type: string;
  status: "processing" | "processed" | "failed";
  error: string | null;
  createdAt: string;
  processedAt: string | null;
};

declare global {
  var softaiStore: DatabaseState | undefined;
}

const now = () => new Date().toISOString();
const CLERK_WEBHOOK_PROCESSING_TIMEOUT_MS = 5 * 60 * 1000;
const STORE_CACHE_REVALIDATE_SECONDS = 60;

const cacheTags = {
  userProjects: (userId: string) => `user:${userId}:projects`,
  userDashboard: (userId: string) => `user:${userId}:dashboard`,
  userBilling: (userId: string) => `user:${userId}:billing`,
  project: (projectId: string) => `project:${projectId}`,
  conversation: (conversationId: string) => `conversation:${conversationId}`,
};

function revalidateStoreTag(tag: string) {
  try {
    revalidateTag(tag, { expire: 0 });
  } catch {
    // Some tests and scripts call store functions outside a Next request scope.
  }
}

function revalidateUserData(userId: string) {
  revalidateStoreTag(cacheTags.userProjects(userId));
  revalidateStoreTag(cacheTags.userDashboard(userId));
  revalidateStoreTag(cacheTags.userBilling(userId));
}

function revalidateProjectData(userId: string, projectId: string) {
  revalidateUserData(userId);
  revalidateStoreTag(cacheTags.project(projectId));
}

function isStaleClerkWebhookClaim(createdAt: string | Date) {
  return Date.now() - new Date(createdAt).getTime() > CLERK_WEBHOOK_PROCESSING_TIMEOUT_MS;
}

function toIso(value: string | Date | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function createSeedStore(): DatabaseState {
  const createdAt = now();
  const userId = "user_demo";
  const projectId = "project_demo_1";
  const storyboardId = "storyboard_demo_1";

  return {
    users: [
      {
        id: userId,
        clerkUserId: "demo_clerk_user",
        email: "demo@softai.local",
        name: "Demo User",
        bannedAt: null,
        createdAt,
      },
    ],
    subscriptions: [
      {
        id: "sub_demo_1",
        userId,
        plan: "starter",
        status: "active",
        clerkPayerId: null,
        clerkSubscriptionId: null,
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        monthlyCredits: 1000,
      },
    ],
    clerkWebhookEvents: [],
    creditLedger: [
      {
        id: "credit_demo_1",
        userId,
        projectId: null,
        reason: "grant",
        amount: 1000,
        note: "Starter plan monthly grant",
        createdAt,
      },
      {
        id: "credit_demo_2",
        userId,
        projectId,
        reason: "storyboard_burn",
        amount: -CREDIT_COSTS.storyboard,
        note: "Generated starter storyboard",
        createdAt,
      },
    ],
    chatConversations: [
      {
        id: "chat_demo_1",
        userId,
        projectId,
        title: "Launch Week Ad assistant",
        mode: "project_campaign",
        createdAt,
        updatedAt: createdAt,
      },
    ],
    chatMessages: [
      {
        id: "chat_message_demo_1",
        conversationId: "chat_demo_1",
        userId,
        role: "assistant",
        content: "Ask me to improve the hook, rewrite the offer, generate ad angles, or tighten the script for this campaign.",
        metadata: null,
        createdAt,
      },
    ],
    projects: [
      {
        id: projectId,
        userId,
        status: "storyboard_ready",
        kind: "campaign_ad",
        title: "Launch Week Ad",
        productName: "Soft-Magic AI Studio",
        offer: "20% off first campaign",
        cta: "Start your first ad today",
        targetAudience: "local ecommerce owners",
        brandVoice: "bold, direct, optimistic",
        platformTarget: "tiktok",
        language: "en",
        script: "Stop paying agencies to learn what converts. Launch a vertical ad in minutes.",
        metadata: null,
        reviewNotes: "",
        createdAt,
        updatedAt: createdAt,
      },
    ],
    brandAssets: [
      {
        id: "asset_demo_1",
        projectId,
        userId,
        type: "logo",
        name: "Primary logo",
        url: "https://placehold.co/200x200/f3e2cf/121212.png?text=Logo",
        createdAt,
      },
      {
        id: "asset_demo_2",
        projectId,
        userId,
        type: "product_image",
        name: "Product hero",
        url: "https://placehold.co/720x1280/f9d2ac/121212.png?text=Product+Shot",
        createdAt,
      },
    ],
    avatars: [
      {
        id: "avatar_demo_1",
        projectId,
        userId,
        sourceType: "single_photo",
        imageUrl: "https://placehold.co/512x512/f5c7b8/171717.png?text=Avatar",
        prompt: null,
        policyState: "self_declared",
        attested: true,
        createdAt,
      },
    ],
    storyboards: [
      {
        id: storyboardId,
        projectId,
        headline: "Make ad videos before your competitors finish briefing an agency",
        hook: "20% off first campaign",
        cta: "Start your first ad today",
        status: "draft",
        createdAt,
        updatedAt: createdAt,
      },
    ],
    scenes: [
      {
        id: "scene_demo_1",
        storyboardId,
        projectId,
        order: 1,
        title: "Open with urgency",
        narration: "Stop paying for slow creative. Launch your next ad with Soft-Magic AI Studio.",
        visualDirection: "Talking-head opener with confident expression and warm orange kinetic typography.",
        overlayText: "Launch in minutes",
        durationSeconds: 5,
        imageUrl: "https://placehold.co/720x1280/fce6d2/121212.png?text=Scene+1",
      },
      {
        id: "scene_demo_2",
        storyboardId,
        projectId,
        order: 2,
        title: "Show the product payoff",
        narration: "Turn brand assets and one script into an ad your team can actually ship this week.",
        visualDirection: "Product montage with collage transitions and textured background panels.",
        overlayText: "Brand assets to ad",
        durationSeconds: 6,
        imageUrl: "https://placehold.co/720x1280/f7d1b5/121212.png?text=Scene+2",
      },
      {
        id: "scene_demo_3",
        storyboardId,
        projectId,
        order: 3,
        title: "Offer and CTA",
        narration: "Get 20 percent off your first campaign and start your first ad today.",
        visualDirection: "Final offer lockup with product close-up, CTA button styling, and bright accent glow.",
        overlayText: "20% off first campaign",
        durationSeconds: 5,
        imageUrl: "https://placehold.co/720x1280/efbb8e/121212.png?text=Scene+3",
      },
    ],
    generationJobs: [],
    outputs: [],
    abuseReports: [],
    adminActions: [],
    auditEvents: [],
    shareTokens: [],
  };
}

function getState() {
  if (!globalThis.softaiStore) {
    globalThis.softaiStore = createSeedStore();
  }
  globalThis.softaiStore.chatConversations ??= [];
  globalThis.softaiStore.chatMessages ??= [];
  globalThis.softaiStore.shareTokens ??= [];
  return globalThis.softaiStore;
}

function memoryUpdateProjectStatus(projectId: string, status: ProjectStatus) {
  const state = getState();
  const project = state.projects.find((entry) => entry.id === projectId);
  if (project) {
    project.status = status;
    project.updatedAt = now();
  }
}

function memoryAddAuditEvent(userId: string | null, projectId: string | null, event: string, payload: unknown) {
  getState().auditEvents.unshift({
    id: randomUUID(),
    userId,
    projectId,
    event,
    payload,
    createdAt: now(),
  });
}

function mapUser(row: typeof schema.users.$inferSelect): UserRecord {
  return {
    id: row.id,
    clerkUserId: row.clerkUserId,
    email: row.email,
    name: row.name,
    bannedAt: toIso(row.bannedAt),
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

function mapSubscription(row: typeof schema.subscriptions.$inferSelect): SubscriptionRecord {
  return {
    id: row.id,
    userId: row.userId,
    plan: row.plan,
    status: row.status as SubscriptionRecord["status"],
    clerkPayerId: row.clerkPayerId,
    clerkSubscriptionId: row.clerkSubscriptionId,
    currentPeriodEnd: toIso(row.currentPeriodEnd),
    monthlyCredits: row.monthlyCredits,
  };
}

function mapCredit(row: typeof schema.creditLedger.$inferSelect): CreditLedgerRecord {
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

function mapChatConversation(row: typeof schema.chatConversations.$inferSelect): ChatConversationRecord {
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

function mapChatMessage(row: typeof schema.chatMessages.$inferSelect): ChatMessageRecord {
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

function mapProject(row: typeof schema.projects.$inferSelect): ProjectRecord {
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

function mapAsset(row: typeof schema.brandAssets.$inferSelect): BrandAssetRecord {
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

function mapAvatar(row: typeof schema.avatars.$inferSelect): AvatarRecord {
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

function mapStoryboard(row: typeof schema.storyboards.$inferSelect): StoryboardRecord {
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

function mapScene(row: typeof schema.scenes.$inferSelect): SceneRecord {
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

function mapJob(row: typeof schema.generationJobs.$inferSelect): GenerationJobRecord {
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

function mapOutput(row: typeof schema.outputs.$inferSelect): OutputRecord {
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

function mapReport(row: typeof schema.abuseReports.$inferSelect): AbuseReportRecord {
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

function mapAdminAction(row: typeof schema.adminActions.$inferSelect): AdminActionRecord {
  return {
    id: row.id,
    adminUserId: row.adminUserId,
    targetUserId: row.targetUserId,
    action: row.action as AdminActionRecord["action"],
    details: row.details,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

function mapAuditEvent(row: typeof schema.auditEvents.$inferSelect): AuditEventRecord {
  return {
    id: row.id,
    userId: row.userId,
    projectId: row.projectId,
    event: row.event,
    payload: row.payload,
    createdAt: toIso(row.createdAt) ?? now(),
  };
}

async function addAuditEvent(userId: string | null, projectId: string | null, event: string, payload: unknown) {
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

async function updateProjectStatus(projectId: string, status: ProjectStatus) {
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
      clerkPayerId: null,
      clerkSubscriptionId: null,
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
      clerkPayerId: null,
      clerkSubscriptionId: null,
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

export async function listOutputsForUser(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState().outputs.filter((output) => output.userId === userId && !output.removedAt);
  }
  await ensureDatabase();
  const rows = await db.query.outputs.findMany({
    where: and(eq(schema.outputs.userId, userId), isNull(schema.outputs.removedAt)),
  });
  return rows.map(mapOutput);
}

const HISTORY_PAGE_SIZE = 20;

export async function getGenerationHistory(
  userId: string,
  opts?: { type?: OutputType; before?: string },
): Promise<{ items: OutputWithProject[]; nextCursor: string | null }> {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const outputs = state.outputs
      .filter((entry) => entry.userId === userId && !entry.removedAt)
      .filter((entry) => (opts?.type ? entry.type === opts.type : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const filtered = opts?.before
      ? outputs.filter((entry) => entry.createdAt < opts.before!)
      : outputs;

    const items = filtered.slice(0, HISTORY_PAGE_SIZE);
    const nextCursor = filtered.length > HISTORY_PAGE_SIZE
      ? filtered[HISTORY_PAGE_SIZE - 1].createdAt
      : null;

    const projectIds = [...new Set(items.map((o) => o.projectId))];
    const projectMap = new Map<string, { title: string; kind: string }>();
    for (const pid of projectIds) {
      const project = state.projects.find((p) => p.id === pid);
      if (project) {
        projectMap.set(pid, { title: project.title, kind: project.kind });
      }
    }

    return {
      items: items.map((o) => ({
        ...o,
        projectTitle: projectMap.get(o.projectId)?.title ?? "Unknown project",
        projectKind: projectMap.get(o.projectId)?.kind ?? "campaign_ad",
      })),
      nextCursor,
    };
  }

  await ensureDatabase();
  const conditions = [
    eq(schema.outputs.userId, userId),
    isNull(schema.outputs.removedAt),
    ...(opts?.type ? [eq(schema.outputs.type, opts.type)] : []),
    ...(opts?.before ? [sql`${schema.outputs.createdAt} < ${new Date(opts.before)}`] : []),
  ];

  const rows = await db.query.outputs.findMany({
    where: and(...conditions),
    orderBy: [desc(schema.outputs.createdAt)],
    limit: HISTORY_PAGE_SIZE + 1,
  });

  const hasMore = rows.length > HISTORY_PAGE_SIZE;
  const items = hasMore ? rows.slice(0, HISTORY_PAGE_SIZE) : rows;
  const nextCursor = hasMore ? toIso(items[items.length - 1].createdAt) : null;

  const projectIds = [...new Set(items.map((r) => r.projectId))];
  const projectRows = projectIds.length > 0
    ? await db.query.projects.findMany({
        where: sql`${schema.projects.id} IN ${projectIds}`,
        columns: { id: true, title: true, kind: true },
      })
    : [];
  const projectMap = new Map(projectRows.map((p) => [p.id, { title: p.title, kind: p.kind }]));

  return {
    items: items.map((row) => ({
      ...mapOutput(row),
      projectTitle: projectMap.get(row.projectId)?.title ?? "Unknown project",
      projectKind: projectMap.get(row.projectId)?.kind ?? "campaign_ad",
    })),
    nextCursor,
  };
}

export async function listProjects(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState()
      .projects.filter((entry) => entry.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  const database = db;
  return unstable_cache(
    async () => {
      await ensureDatabase();
      const rows = await database.query.projects.findMany({
        where: eq(schema.projects.userId, userId),
        orderBy: [desc(schema.projects.updatedAt)],
      });
      return rows.map(mapProject);
    },
    ["user-projects", userId],
    { tags: [cacheTags.userProjects(userId)], revalidate: STORE_CACHE_REVALIDATE_SECONDS },
  )();
}

export async function getProjectBundle(userId: string, projectId: string): Promise<ProjectBundle | null> {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const project = state.projects.find((entry) => entry.id === projectId && entry.userId === userId);
    if (!project) return null;
    const storyboard = state.storyboards.find((entry) => entry.projectId === projectId) ?? null;
    return {
      project,
      assets: state.brandAssets.filter((entry) => entry.projectId === projectId),
      avatar: state.avatars.find((entry) => entry.projectId === projectId) ?? null,
      storyboard,
      scenes: state.scenes.filter((entry) => entry.projectId === projectId).sort((a, b) => a.order - b.order),
      jobs: state.generationJobs.filter((entry) => entry.projectId === projectId),
      outputs: state.outputs.filter((entry) => entry.projectId === projectId && !entry.removedAt),
    };
  }

  const database = db;
  await ensureDatabase();
  const [project, assets, avatar, storyboard, scenes, outputs] = await database.batch([
    database.query.projects.findFirst({
      where: and(eq(schema.projects.id, projectId), eq(schema.projects.userId, userId)),
    }),
    database.query.brandAssets.findMany({
      where: eq(schema.brandAssets.projectId, projectId),
      orderBy: [desc(schema.brandAssets.createdAt)],
    }),
    database.query.avatars.findFirst({
      where: eq(schema.avatars.projectId, projectId),
      orderBy: [desc(schema.avatars.createdAt)],
    }),
    database.query.storyboards.findFirst({
      where: eq(schema.storyboards.projectId, projectId),
    }),
    database.query.scenes.findMany({
      where: eq(schema.scenes.projectId, projectId),
      orderBy: [asc(schema.scenes.order)],
    }),
    database.query.outputs.findMany({
      where: and(eq(schema.outputs.projectId, projectId), isNull(schema.outputs.removedAt)),
      orderBy: [desc(schema.outputs.createdAt)],
    }),
  ]);

  if (!project) return null;

  return {
    project: mapProject(project),
    assets: assets.map(mapAsset),
    avatar: avatar ? mapAvatar(avatar) : null,
    storyboard: storyboard ? mapStoryboard(storyboard) : null,
    scenes: scenes.map(mapScene),
    jobs: [],
    outputs: outputs.map(mapOutput),
  };
}

export async function getProjectPageData(userId: string, projectId: string): Promise<{
  bundle: ProjectBundle | null;
  conversation: ChatConversationRecord | null;
  chatMessages: ChatMessageRecord[];
}> {
  const bundle = await getProjectBundle(userId, projectId);

  if (!bundle) {
    return { bundle: null, conversation: null, chatMessages: [] };
  }

  if (!databaseEnabled() || !db) {
    const conversation = await getOrCreateProjectChatConversation(userId, projectId);
    const chatMessages = conversation ? await listChatMessages(userId, conversation.id) : [];
    return { bundle, conversation, chatMessages };
  }

  const database = db;
  await ensureDatabase();

  const [conversationRow, chatMessageRows] = await database.batch([
    database.query.chatConversations.findFirst({
      where: and(
        eq(schema.chatConversations.projectId, projectId),
        eq(schema.chatConversations.userId, userId),
        eq(schema.chatConversations.mode, "project_campaign")
      ),
      orderBy: [desc(schema.chatConversations.updatedAt)],
    }),
    database.query.chatMessages.findMany({
      where: sql`${schema.chatMessages.conversationId} IN (${
        database
          .select({ id: schema.chatConversations.id })
          .from(schema.chatConversations)
          .where(
            and(
              eq(schema.chatConversations.projectId, projectId),
              eq(schema.chatConversations.userId, userId),
              eq(schema.chatConversations.mode, "project_campaign")
            )
          )
      })`,
      orderBy: [asc(schema.chatMessages.createdAt)],
    }),
  ]);

  let conversation: ChatConversationRecord | null = null;
  let chatMessages: ChatMessageRecord[] = [];

  if (conversationRow) {
    conversation = mapChatConversation(conversationRow);
    chatMessages = chatMessageRows.map(mapChatMessage);
  } else {
    conversation = await getOrCreateProjectChatConversation(userId, projectId);
  }

  return { bundle, conversation, chatMessages };
}

export async function createProject(
  userId: string,
  input: Pick<ProjectRecord, "title" | "productName" | "offer" | "cta" | "targetAudience" | "brandVoice" | "platformTarget" | "language" | "script"> & { kind?: ProjectKind; metadata?: unknown },
) {
  const kind = input.kind ?? "campaign_ad";
  const metadata = input.metadata ?? null;

  if (!databaseEnabled() || !db) {
    const createdAt = now();
    const project: ProjectRecord = {
      id: randomUUID(),
      userId,
      status: "draft",
      kind,
      title: input.title,
      productName: input.productName,
      offer: input.offer,
      cta: input.cta,
      targetAudience: input.targetAudience,
      brandVoice: input.brandVoice,
      platformTarget: input.platformTarget,
      language: input.language,
      script: input.script,
      metadata,
      reviewNotes: "",
      createdAt,
      updatedAt: createdAt,
    };
    getState().projects.unshift(project);
    await addAuditEvent(userId, project.id, "project.created", input);
    return project;
  }

  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.projects).values({
    id,
    userId,
    status: "draft",
    kind,
    title: input.title,
    productName: input.productName,
    offer: input.offer,
    cta: input.cta,
    targetAudience: input.targetAudience,
    brandVoice: input.brandVoice,
    platformTarget: input.platformTarget,
    language: input.language,
    script: input.script,
    metadata,
    reviewNotes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await addAuditEvent(userId, id, "project.created", input);
  revalidateUserData(userId);
  const project = await db.query.projects.findFirst({ where: eq(schema.projects.id, id) });
  return mapProject(project!);
}

export async function addBrandAsset(userId: string, projectId: string, input: { type: AssetType; name: string; url: string }) {
  if (!databaseEnabled() || !db) {
    const record: BrandAssetRecord = {
      id: randomUUID(),
      projectId,
      userId,
      type: input.type,
      name: input.name,
      url: input.url,
      createdAt: now(),
    };
    getState().brandAssets.push(record);
    await addAuditEvent(userId, projectId, "asset.added", input);
    return record;
  }
  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.brandAssets).values({
    id,
    projectId,
    userId,
    type: input.type,
    name: input.name,
    url: input.url,
    createdAt: new Date(),
  });
  await addAuditEvent(userId, projectId, "asset.added", input);
  revalidateProjectData(userId, projectId);
  return {
    id,
    projectId,
    userId,
    type: input.type,
    name: input.name,
    url: input.url,
    createdAt: now(),
  };
}

export async function saveAvatar(
  userId: string,
  projectId: string,
  input: { sourceType: AvatarSource; imageUrl: string | null; prompt: string | null; policyState: AvatarPolicyState; attested: boolean },
) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.avatars.find((entry) => entry.projectId === projectId);
    if (existing) {
      Object.assign(existing, input);
      return existing;
    }
    const record: AvatarRecord = { id: randomUUID(), projectId, userId, ...input, createdAt: now() };
    state.avatars.push(record);
    await addAuditEvent(userId, projectId, "avatar.saved", input);
    return record;
  }
  await ensureDatabase();
  const existing = await db.query.avatars.findFirst({ where: eq(schema.avatars.projectId, projectId) });
  if (existing) {
    await db.update(schema.avatars).set(input).where(eq(schema.avatars.id, existing.id));
    await addAuditEvent(userId, projectId, "avatar.saved", input);
    revalidateProjectData(userId, projectId);
    return { ...mapAvatar(existing), ...input };
  }
  const id = randomUUID();
  await db.insert(schema.avatars).values({
    id,
    projectId,
    userId,
    sourceType: input.sourceType,
    imageUrl: input.imageUrl,
    prompt: input.prompt,
    policyState: input.policyState,
    attested: input.attested,
    createdAt: new Date(),
  });
  await addAuditEvent(userId, projectId, "avatar.saved", input);
  revalidateProjectData(userId, projectId);
  return { id, projectId, userId, ...input, createdAt: now() };
}

export async function saveStoryboard(
  userId: string,
  projectId: string,
  input: { headline: string; hook: string; cta: string; scenes: Array<Pick<SceneRecord, "title" | "narration" | "visualDirection" | "overlayText" | "durationSeconds">> },
) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.storyboards.find((entry) => entry.projectId === projectId);
    const timestamp = now();
    const storyboardId = existing?.id ?? randomUUID();
    if (existing) {
      existing.headline = input.headline;
      existing.hook = input.hook;
      existing.cta = input.cta;
      existing.updatedAt = timestamp;
    } else {
      state.storyboards.push({ id: storyboardId, projectId, headline: input.headline, hook: input.hook, cta: input.cta, status: "draft", createdAt: timestamp, updatedAt: timestamp });
    }
    state.scenes = state.scenes.filter((scene) => scene.projectId !== projectId);
    input.scenes.forEach((scene, index) => {
      state.scenes.push({ id: randomUUID(), storyboardId, projectId, order: index + 1, ...scene, imageUrl: null });
    });
    memoryUpdateProjectStatus(projectId, "review_needed");
    await addAuditEvent(userId, projectId, "storyboard.saved", input);
    return;
  }
  await ensureDatabase();
  const existing = await db.query.storyboards.findFirst({ where: eq(schema.storyboards.projectId, projectId) });
  const storyboardId = existing?.id ?? randomUUID();
  if (existing) {
    await db.update(schema.storyboards).set({
      headline: input.headline,
      hook: input.hook,
      cta: input.cta,
      updatedAt: new Date(),
    }).where(eq(schema.storyboards.id, existing.id));
  } else {
    await db.insert(schema.storyboards).values({
      id: storyboardId,
      projectId,
      headline: input.headline,
      hook: input.hook,
      cta: input.cta,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await db.delete(schema.scenes).where(eq(schema.scenes.projectId, projectId));
  if (input.scenes.length > 0) {
    await db.insert(schema.scenes).values(
      input.scenes.map((scene, index) => ({
        id: randomUUID(),
        storyboardId,
        projectId,
        order: index + 1,
        title: scene.title,
        narration: scene.narration,
        visualDirection: scene.visualDirection,
        overlayText: scene.overlayText,
        durationSeconds: scene.durationSeconds,
        imageUrl: null,
      })),
    );
  }
  await updateProjectStatus(projectId, "review_needed");
  await addAuditEvent(userId, projectId, "storyboard.saved", input);
  revalidateProjectData(userId, projectId);
}

export async function approveStoryboard(userId: string, projectId: string) {
  if (!databaseEnabled() || !db) {
    const storyboard = getState().storyboards.find((entry) => entry.projectId === projectId);
    if (!storyboard) return null;
    storyboard.status = "approved";
    storyboard.updatedAt = now();
    memoryUpdateProjectStatus(projectId, "storyboard_ready");
    await addAuditEvent(userId, projectId, "storyboard.approved", {});
    return storyboard;
  }
  await ensureDatabase();
  const storyboard = await db.query.storyboards.findFirst({ where: eq(schema.storyboards.projectId, projectId) });
  if (!storyboard) return null;
  await db.update(schema.storyboards).set({ status: "approved", updatedAt: new Date() }).where(eq(schema.storyboards.id, storyboard.id));
  await updateProjectStatus(projectId, "storyboard_ready");
  await addAuditEvent(userId, projectId, "storyboard.approved", {});
  revalidateProjectData(userId, projectId);
  return { ...mapStoryboard(storyboard), status: "approved" };
}

export async function createGenerationJob(
  userId: string,
  projectId: string,
  input: {
    type: JobType;
    status: JobStatus;
    providerKey?: string | null;
    modelKey?: string | null;
    providerJobId?: string | null;
    costEstimate?: number | null;
    attempts?: number;
    requestPayload: unknown;
    responsePayload?: unknown;
    errorMessage?: string | null;
  },
) {
  if (!databaseEnabled() || !db) {
    const job: GenerationJobRecord = {
      id: randomUUID(), projectId, userId, type: input.type, status: input.status,
      providerKey: input.providerKey ?? null, modelKey: input.modelKey ?? null,
      providerJobId: input.providerJobId ?? null, costEstimate: input.costEstimate ?? null,
      attempts: input.attempts ?? 0, requestPayload: input.requestPayload,
      responsePayload: input.responsePayload ?? null, errorMessage: input.errorMessage ?? null,
      createdAt: now(), updatedAt: now(),
    };
    getState().generationJobs.unshift(job);
    return job;
  }
  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.generationJobs).values({
    id,
    projectId,
    userId,
    type: input.type,
    status: input.status,
    providerKey: input.providerKey ?? null,
    modelKey: input.modelKey ?? null,
    providerJobId: input.providerJobId ?? null,
    costEstimate: input.costEstimate ?? null,
    attempts: input.attempts ?? 0,
    requestPayload: input.requestPayload,
    responsePayload: input.responsePayload ?? null,
    errorMessage: input.errorMessage ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  revalidateProjectData(userId, projectId);
  return {
    id, projectId, userId, type: input.type, status: input.status,
    providerKey: input.providerKey ?? null, modelKey: input.modelKey ?? null,
    providerJobId: input.providerJobId ?? null, costEstimate: input.costEstimate ?? null,
    attempts: input.attempts ?? 0, requestPayload: input.requestPayload,
    responsePayload: input.responsePayload ?? null, errorMessage: input.errorMessage ?? null,
    createdAt: now(), updatedAt: now(),
  };
}

export async function updateGenerationJob(
  jobId: string,
  patch: Partial<Pick<GenerationJobRecord, "status" | "responsePayload" | "errorMessage" | "providerJobId" | "providerKey" | "modelKey" | "costEstimate" | "attempts">>,
  opts?: { onlyIfStatus?: JobStatus[] },
) {
  if (!databaseEnabled() || !db) {
    const job = getState().generationJobs.find((entry) => entry.id === jobId);
    if (!job) return null;
    if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(job.status)) return null;
    Object.assign(job, patch, { updatedAt: now() });
    return job;
  }
  await ensureDatabase();
  const existing = await db.query.generationJobs.findFirst({ where: eq(schema.generationJobs.id, jobId) });
  if (!existing) return null;
  if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(existing.status as JobStatus)) return null;
  await db.update(schema.generationJobs).set({ ...patch, updatedAt: new Date() }).where(eq(schema.generationJobs.id, jobId));
  revalidateProjectData(existing.userId, existing.projectId);
  return { ...mapJob(existing), ...patch, updatedAt: now() };
}

export async function updateGenerationJobByProviderJobId(
  providerJobId: string,
  patch: Partial<Pick<GenerationJobRecord, "status" | "responsePayload" | "errorMessage">>,
  opts?: { onlyIfStatus?: JobStatus[] },
) {
  if (!databaseEnabled() || !db) {
    const job = getState().generationJobs.find((entry) => entry.providerJobId === providerJobId);
    if (!job) return null;
    if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(job.status)) return null;
    Object.assign(job, patch, { updatedAt: now() });
    return job;
  }
  await ensureDatabase();
  const existing = await db.query.generationJobs.findFirst({
    where: eq(schema.generationJobs.providerJobId, providerJobId),
  });
  if (!existing) return null;
  if (opts?.onlyIfStatus && !opts.onlyIfStatus.includes(existing.status as JobStatus)) return null;
  await db.update(schema.generationJobs).set({ ...patch, updatedAt: new Date() }).where(eq(schema.generationJobs.id, existing.id));
  revalidateProjectData(existing.userId, existing.projectId);
  return { ...mapJob(existing), ...patch, updatedAt: now() };
}

export async function saveSceneImage(projectId: string, order: number, imageUrl: string) {
  if (!databaseEnabled() || !db) {
    const scene = getState().scenes.find((entry) => entry.projectId === projectId && entry.order === order);
    if (!scene) return null;
    scene.imageUrl = imageUrl;
    return scene;
  }
  await ensureDatabase();
  const scene = await db.query.scenes.findFirst({
    where: and(eq(schema.scenes.projectId, projectId), eq(schema.scenes.order, order)),
  });
  if (!scene) return null;
  await db.update(schema.scenes).set({ imageUrl }).where(eq(schema.scenes.id, scene.id));
  revalidateStoreTag(cacheTags.project(projectId));
  return { ...mapScene(scene), imageUrl };
}

export async function createOutput(
  userId: string,
  projectId: string,
  input: { type: OutputType; title: string; url: string; metadataTag?: string },
) {
  if (!databaseEnabled() || !db) {
    const output: OutputRecord = {
      id: randomUUID(), projectId, userId, type: input.type, title: input.title, url: input.url,
      metadataTag: input.metadataTag ?? SOFTAI_METADATA_TAG, removedAt: null, createdAt: now(),
    };
    getState().outputs.unshift(output);
    if (input.type === "final_video") memoryUpdateProjectStatus(projectId, "completed");
    return output;
  }
  await ensureDatabase();
  const existing = await db.query.outputs.findFirst({
    where: and(eq(schema.outputs.projectId, projectId), eq(schema.outputs.type, input.type), eq(schema.outputs.url, input.url)),
  });
  if (existing) return mapOutput(existing);
  const id = randomUUID();
  await db.insert(schema.outputs).values({
    id, projectId, userId, type: input.type, title: input.title, url: input.url,
    metadataTag: input.metadataTag ?? SOFTAI_METADATA_TAG, removedAt: null, createdAt: new Date(),
  });
  if (input.type === "final_video") await updateProjectStatus(projectId, "completed");
  revalidateProjectData(userId, projectId);
  return { id, projectId, userId, type: input.type, title: input.title, url: input.url, metadataTag: input.metadataTag ?? SOFTAI_METADATA_TAG, removedAt: null, createdAt: now() };
}

export async function updateOutputUrl(outputId: string, url: string): Promise<OutputRecord | null> {
  if (!databaseEnabled() || !db) {
    const output = getState().outputs.find((entry) => entry.id === outputId && !entry.removedAt);
    if (!output) return null;
    output.url = url;
    revalidateProjectData(output.userId, output.projectId);
    return output;
  }

  await ensureDatabase();
  const existing = await db.query.outputs.findFirst({
    where: and(eq(schema.outputs.id, outputId), isNull(schema.outputs.removedAt)),
  });
  if (!existing) return null;

  await db.update(schema.outputs).set({ url }).where(eq(schema.outputs.id, outputId));
  revalidateProjectData(existing.userId, existing.projectId);
  return { ...mapOutput(existing), url };
}

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

function generateShareToken(): string {
  return randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "").slice(0, 8);
}

export async function createShareToken(
  userId: string,
  outputId: string,
  expiresAt?: Date | null,
): Promise<ShareTokenRecord | null> {
  const token = generateShareToken();
  const id = randomUUID();

  if (!databaseEnabled() || !db) {
    const state = getState();
    const output = state.outputs.find((o) => o.id === outputId && o.userId === userId && !o.removedAt);
    if (!output) return null;

    const record: ShareTokenRecord = {
      id,
      outputId,
      createdBy: userId,
      token,
      expiresAt: expiresAt?.toISOString() ?? null,
      createdAt: now(),
    };
    state.shareTokens.unshift(record);
    return record;
  }

  await ensureDatabase();
  const output = await db.query.outputs.findFirst({
    where: and(eq(schema.outputs.id, outputId), eq(schema.outputs.userId, userId), isNull(schema.outputs.removedAt)),
  });
  if (!output) return null;

  await db.insert(schema.shareTokens).values({
    id,
    outputId,
    createdBy: userId,
    token,
    expiresAt: expiresAt ?? null,
    createdAt: new Date(),
  });

  return {
    id,
    outputId,
    createdBy: userId,
    token,
    expiresAt: expiresAt?.toISOString() ?? null,
    createdAt: now(),
  };
}

export async function getShareOutputByToken(token: string): Promise<{
  output: OutputRecord;
  projectTitle: string;
  projectKind: string;
} | null> {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const shareToken = state.shareTokens.find((s) => s.token === token);
    if (!shareToken) return null;
    if (shareToken.expiresAt && new Date(shareToken.expiresAt) < new Date()) return null;

    const output = state.outputs.find((o) => o.id === shareToken.outputId && !o.removedAt);
    if (!output) return null;

    const project = state.projects.find((p) => p.id === output.projectId);
    return {
      output,
      projectTitle: project?.title ?? "Unknown project",
      projectKind: project?.kind ?? "campaign_ad",
    };
  }

  await ensureDatabase();
  const shareRow = await db.query.shareTokens.findFirst({
    where: eq(schema.shareTokens.token, token),
  });
  if (!shareRow) return null;
  if (shareRow.expiresAt && new Date(shareRow.expiresAt) < new Date()) return null;

  const outputRow = await db.query.outputs.findFirst({
    where: and(eq(schema.outputs.id, shareRow.outputId), isNull(schema.outputs.removedAt)),
  });
  if (!outputRow) return null;

  const projectRow = await db.query.projects.findFirst({
    where: eq(schema.projects.id, outputRow.projectId),
    columns: { title: true, kind: true },
  });

  return {
    output: mapOutput(outputRow),
    projectTitle: projectRow?.title ?? "Unknown project",
    projectKind: projectRow?.kind ?? "campaign_ad",
  };
}

export async function getThumbnailForProject(projectId: string): Promise<string | null> {
  if (!databaseEnabled() || !db) {
    const thumb = getState().outputs.find((o) => o.projectId === projectId && o.type === "thumbnail" && !o.removedAt);
    return thumb?.url ?? null;
  }
  await ensureDatabase();
  const thumb = await db.query.outputs.findFirst({
    where: and(
      eq(schema.outputs.projectId, projectId),
      eq(schema.outputs.type, "thumbnail"),
      isNull(schema.outputs.removedAt)
    ),
  });
  return thumb?.url ?? null;
}

async function projectBelongsToUser(userId: string, projectId: string): Promise<boolean> {
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

async function getProjectTitle(userId: string, projectId: string): Promise<string | null> {
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

export async function getOrCreateProjectChatConversation(userId: string, projectId: string) {
  const ownershipValid = await projectBelongsToUser(userId, projectId);
  if (!ownershipValid) return null;

  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.chatConversations.find((entry) => entry.userId === userId && entry.projectId === projectId && entry.mode === "project_campaign");
    if (existing) return existing;

    const timestamp = now();
    const conversation: ChatConversationRecord = {
      id: randomUUID(),
      userId,
      projectId,
      title: `${getState().projects.find((p) => p.id === projectId)?.title ?? projectId} assistant`,
      mode: "project_campaign",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    state.chatConversations.unshift(conversation);
    await addAuditEvent(userId, projectId, "chat.conversation.created", { conversationId: conversation.id });
    return conversation;
  }

  await ensureDatabase();
  const existing = await db.query.chatConversations.findFirst({
    where: and(eq(schema.chatConversations.userId, userId), eq(schema.chatConversations.projectId, projectId), eq(schema.chatConversations.mode, "project_campaign")),
    orderBy: [desc(schema.chatConversations.updatedAt)],
  });
  if (existing) return mapChatConversation(existing);

  const title = await getProjectTitle(userId, projectId);
  const id = randomUUID();
  await db.insert(schema.chatConversations).values({
    id,
    userId,
    projectId,
    title: `${title ?? projectId} assistant`,
    mode: "project_campaign",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoNothing({
    target: [schema.chatConversations.userId, schema.chatConversations.projectId, schema.chatConversations.mode],
  });

  const conversation = await db.query.chatConversations.findFirst({
    where: and(eq(schema.chatConversations.userId, userId), eq(schema.chatConversations.projectId, projectId), eq(schema.chatConversations.mode, "project_campaign")),
  });

  if (!conversation) {
    throw new Error("Failed to create project chat conversation.");
  }

  if (conversation.id === id) {
    await addAuditEvent(userId, projectId, "chat.conversation.created", { conversationId: id });
  }

  return mapChatConversation(conversation);
}

export async function getChatConversation(userId: string, conversationId: string) {
  if (!databaseEnabled() || !db) {
    return getState().chatConversations.find((entry) => entry.id === conversationId && entry.userId === userId) ?? null;
  }

  await ensureDatabase();
  const row = await db.query.chatConversations.findFirst({
    where: and(eq(schema.chatConversations.id, conversationId), eq(schema.chatConversations.userId, userId)),
  });
  return row ? mapChatConversation(row) : null;
}

export async function listChatMessages(userId: string, conversationId: string, options?: { skipOwnershipCheck?: boolean }) {
  if (!options?.skipOwnershipCheck) {
    const conversation = await getChatConversation(userId, conversationId);
    if (!conversation) return [];
  }

  if (!databaseEnabled() || !db) {
    return getState().chatMessages
      .filter((entry) => entry.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  await ensureDatabase();
  const rows = await db.query.chatMessages.findMany({
    where: eq(schema.chatMessages.conversationId, conversationId),
    orderBy: [asc(schema.chatMessages.createdAt)],
  });
  return rows.map(mapChatMessage);
}

export async function createChatMessage(
  userId: string,
  input: Pick<ChatMessageRecord, "conversationId" | "role" | "content"> & { metadata?: unknown },
) {
  const conversation = await getChatConversation(userId, input.conversationId);
  if (!conversation) return null;

  if (!databaseEnabled() || !db) {
    const timestamp = now();
    const message: ChatMessageRecord = {
      id: randomUUID(),
      conversationId: input.conversationId,
      userId,
      role: input.role,
      content: input.content,
      metadata: input.metadata ?? null,
      createdAt: timestamp,
    };
    getState().chatMessages.push(message);
    conversation.updatedAt = timestamp;
    return message;
  }

  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.chatMessages).values({
    id,
    conversationId: input.conversationId,
    userId,
    role: input.role,
    content: input.content,
    metadata: input.metadata ?? null,
    createdAt: new Date(),
  });
  await db.update(schema.chatConversations).set({ updatedAt: new Date() }).where(eq(schema.chatConversations.id, input.conversationId));
  return { id, conversationId: input.conversationId, userId, role: input.role, content: input.content, metadata: input.metadata ?? null, createdAt: now() };
}

export async function deleteChatMessage(userId: string, messageId: string) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const initialLength = state.chatMessages.length;
    state.chatMessages = state.chatMessages.filter((entry) => entry.id !== messageId || entry.userId !== userId);
    return state.chatMessages.length !== initialLength;
  }

  await ensureDatabase();
  const deleted = await db
    .delete(schema.chatMessages)
    .where(and(eq(schema.chatMessages.id, messageId), eq(schema.chatMessages.userId, userId)))
    .returning({ id: schema.chatMessages.id });

  return deleted.length > 0;
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

export async function takedownOutput(outputId: string) {
  if (!databaseEnabled() || !db) {
    const output = getState().outputs.find((entry) => entry.id === outputId);
    if (output) output.removedAt = now();
    return output ?? null;
  }
  await ensureDatabase();
  const output = await db.query.outputs.findFirst({ where: eq(schema.outputs.id, outputId) });
  if (!output) return null;
  await db.update(schema.outputs).set({ removedAt: new Date() }).where(eq(schema.outputs.id, outputId));
  revalidateProjectData(output.userId, output.projectId);
  return { ...mapOutput(output), removedAt: now() };
}

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

export async function claimClerkWebhookEvent(eventId: string, type: string) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.clerkWebhookEvents.find((entry) => entry.eventId === eventId);

    if (existing?.status === "processed") {
      return false;
    }

    if (existing?.status === "processing" && !isStaleClerkWebhookClaim(existing.createdAt)) {
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

    state.clerkWebhookEvents.push({
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
    .insert(schema.clerkWebhookEvents)
    .values({ id: randomUUID(), eventId, type, status: "processing", createdAt: new Date() })
    .onConflictDoNothing()
    .returning({ id: schema.clerkWebhookEvents.id });

  if (inserted) {
    return true;
  }

  const existing = await db.query.clerkWebhookEvents.findFirst({
    where: eq(schema.clerkWebhookEvents.eventId, eventId),
  });

  if (existing?.status === "processed") {
    return false;
  }

  if (existing?.status === "processing" && !isStaleClerkWebhookClaim(existing.createdAt)) {
    return false;
  }

  await db
    .update(schema.clerkWebhookEvents)
    .set({ status: "processing", error: null, processedAt: null })
    .where(eq(schema.clerkWebhookEvents.eventId, eventId));
  return true;
}

export async function markClerkWebhookEventProcessed(eventId: string) {
  if (!databaseEnabled() || !db) {
    const existing = getState().clerkWebhookEvents.find((entry) => entry.eventId === eventId);
    if (existing) {
      existing.status = "processed";
      existing.error = null;
      existing.processedAt = now();
    }
    return;
  }

  await ensureDatabase();
  await db
    .update(schema.clerkWebhookEvents)
    .set({ status: "processed", error: null, processedAt: new Date() })
    .where(eq(schema.clerkWebhookEvents.eventId, eventId));
}

export async function markClerkWebhookEventFailed(eventId: string, error: string) {
  if (!databaseEnabled() || !db) {
    const existing = getState().clerkWebhookEvents.find((entry) => entry.eventId === eventId);
    if (existing) {
      existing.status = "failed";
      existing.error = error;
      existing.processedAt = null;
    }
    return;
  }

  await ensureDatabase();
  await db
    .update(schema.clerkWebhookEvents)
    .set({ status: "failed", error, processedAt: null })
    .where(eq(schema.clerkWebhookEvents.eventId, eventId));
}

export async function upsertUserSubscription(
  userId: string,
  input: { clerkPayerId: string | null; clerkSubscriptionId?: string | null; plan?: string; status: SubscriptionRecord["status"]; currentPeriodEnd?: string | null; monthlyCredits?: number },
) {
  const shouldGrantUpgradeCredits = (existingMonthlyCredits: number, nextStatus: SubscriptionRecord["status"]) =>
    (nextStatus === "active" || nextStatus === "trialing") &&
    input.monthlyCredits !== undefined &&
    input.monthlyCredits > existingMonthlyCredits;

  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing =
      state.subscriptions.find((entry) => input.clerkSubscriptionId !== null && entry.clerkSubscriptionId === input.clerkSubscriptionId) ??
      state.subscriptions.find((entry) => entry.userId === userId);
    if (existing) {
      const upgradeCreditDelta = shouldGrantUpgradeCredits(existing.monthlyCredits, input.status)
        ? (input.monthlyCredits as number) - existing.monthlyCredits
        : 0;
      existing.clerkPayerId = input.clerkPayerId;
      existing.clerkSubscriptionId = input.clerkSubscriptionId === undefined ? existing.clerkSubscriptionId : input.clerkSubscriptionId;
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
      id: randomUUID(), userId, plan: input.plan ?? DEFAULT_PLAN_NAME, status: input.status, clerkPayerId: input.clerkPayerId,
      clerkSubscriptionId: input.clerkSubscriptionId ?? null, currentPeriodEnd: input.currentPeriodEnd ?? null,
      monthlyCredits: input.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
    };
    state.subscriptions.push(created);
    return created;
  }
  await ensureDatabase();
  let existing = null;
  if (input.clerkSubscriptionId !== undefined && input.clerkSubscriptionId !== null) {
    existing = await db.query.subscriptions.findFirst({
      where: eq(schema.subscriptions.clerkSubscriptionId, input.clerkSubscriptionId),
    });
  }
  if (!existing) {
    existing = await db.query.subscriptions.findFirst({ where: eq(schema.subscriptions.userId, userId) });
  }
  if (existing) {
    const updateValues = {
      clerkPayerId: input.clerkPayerId,
      clerkSubscriptionId: input.clerkSubscriptionId === undefined ? existing.clerkSubscriptionId : input.clerkSubscriptionId,
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
      clerkPayerId: input.clerkPayerId,
      clerkSubscriptionId: input.clerkSubscriptionId === undefined ? existing.clerkSubscriptionId : input.clerkSubscriptionId ?? null,
      plan: input.plan ?? existing.plan,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ?? toIso(existing.currentPeriodEnd),
      monthlyCredits: input.monthlyCredits ?? existing.monthlyCredits,
    };
  }
  const id = randomUUID();
  await db.insert(schema.subscriptions).values({
    id, userId, plan: input.plan ?? DEFAULT_PLAN_NAME, status: input.status, clerkPayerId: input.clerkPayerId,
    clerkSubscriptionId: input.clerkSubscriptionId ?? null,
    currentPeriodEnd: input.currentPeriodEnd ? new Date(input.currentPeriodEnd) : null,
    monthlyCredits: input.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
  });
  revalidateUserData(userId);
  return {
    id, userId, plan: input.plan ?? DEFAULT_PLAN_NAME, status: input.status, clerkPayerId: input.clerkPayerId,
    clerkSubscriptionId: input.clerkSubscriptionId ?? null, currentPeriodEnd: input.currentPeriodEnd ?? null,
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
