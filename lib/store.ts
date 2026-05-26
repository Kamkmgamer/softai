import { randomUUID } from "crypto";
import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import { CREDIT_COSTS, DEFAULT_MONTHLY_CREDITS, DEFAULT_PLAN_NAME, SOFTAI_METADATA_TAG } from "@/lib/constants";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type {
  AbuseReportRecord,
  AdminActionRecord,
  AssetType,
  AuditEventRecord,
  AvatarPolicyState,
  AvatarRecord,
  AvatarSource,
  BrandAssetRecord,
  CreditLedgerRecord,
  DashboardStats,
  GenerationJobRecord,
  JobStatus,
  JobType,
  OutputRecord,
  OutputType,
  ProjectBundle,
  ProjectRecord,
  ProjectStatus,
  SceneRecord,
  StoryboardRecord,
  SubscriptionRecord,
  UserRecord,
} from "@/lib/types";
import { formatCredits } from "@/lib/utils";

type DatabaseState = {
  users: UserRecord[];
  subscriptions: SubscriptionRecord[];
  creditLedger: CreditLedgerRecord[];
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
};

declare global {
  var softaiStore: DatabaseState | undefined;
}

const now = () => new Date().toISOString();

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
        plan: DEFAULT_PLAN_NAME,
        status: "active",
        clerkPayerId: null,
        clerkSubscriptionId: null,
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        monthlyCredits: DEFAULT_MONTHLY_CREDITS,
      },
    ],
    creditLedger: [
      {
        id: "credit_demo_1",
        userId,
        projectId: null,
        reason: "grant",
        amount: DEFAULT_MONTHLY_CREDITS,
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
    projects: [
      {
        id: projectId,
        userId,
        status: "storyboard_ready",
        title: "Launch Week Ad",
        productName: "SoftAI Studio",
        offer: "20% off first campaign",
        cta: "Start your first ad today",
        targetAudience: "local ecommerce owners",
        brandVoice: "bold, direct, optimistic",
        platformTarget: "tiktok",
        script: "Stop paying agencies to learn what converts. Launch a vertical ad in minutes.",
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
        narration: "Stop paying for slow creative. Launch your next ad with SoftAI Studio.",
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
  };
}

function getState() {
  if (!globalThis.softaiStore) {
    globalThis.softaiStore = createSeedStore();
  }
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

function mapProject(row: typeof schema.projects.$inferSelect): ProjectRecord {
  return {
    id: row.id,
    userId: row.userId,
    status: row.status,
    title: row.title,
    productName: row.productName,
    offer: row.offer,
    cta: row.cta,
    targetAudience: row.targetAudience,
    brandVoice: row.brandVoice,
    platformTarget: row.platformTarget as ProjectRecord["platformTarget"],
    script: row.script,
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
    providerJobId: row.providerJobId,
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
      status: "trialing",
      clerkPayerId: null,
      clerkSubscriptionId: null,
      currentPeriodEnd: null,
      monthlyCredits: DEFAULT_MONTHLY_CREDITS,
    });
    state.creditLedger.push({
      id: randomUUID(),
      userId: created.id,
      projectId: null,
      reason: "grant",
      amount: DEFAULT_MONTHLY_CREDITS,
      note: "Onboarding credits",
      createdAt: now(),
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
      status: "trialing",
      clerkPayerId: null,
      clerkSubscriptionId: null,
      currentPeriodEnd: null,
      monthlyCredits: DEFAULT_MONTHLY_CREDITS,
    });
    await db.insert(schema.creditLedger).values({
      id: randomUUID(),
      userId: user.id,
      projectId: null,
      reason: "grant",
      amount: DEFAULT_MONTHLY_CREDITS,
      note: "Onboarding credits",
      createdAt: new Date(),
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

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [projects, subscription, creditBalance, outputs] = await Promise.all([
    listProjects(userId),
    getUserSubscription(userId),
    getCreditBalance(userId),
    listOutputsForUser(userId),
  ]);
  return {
    activeProjects: projects.filter((entry) => entry.status !== "completed").length,
    completedVideos: outputs.filter((output) => output.type === "final_video").length,
    creditBalance,
    monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
  };
}

async function listOutputsForUser(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState().outputs.filter((output) => output.userId === userId && !output.removedAt);
  }
  await ensureDatabase();
  const rows = await db.query.outputs.findMany({
    where: and(eq(schema.outputs.userId, userId), isNull(schema.outputs.removedAt)),
  });
  return rows.map(mapOutput);
}

export async function listProjects(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState()
      .projects.filter((entry) => entry.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  await ensureDatabase();
  const rows = await db.query.projects.findMany({
    where: eq(schema.projects.userId, userId),
    orderBy: [desc(schema.projects.updatedAt)],
  });
  return rows.map(mapProject);
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

  await ensureDatabase();
  const project = await db.query.projects.findFirst({
    where: and(eq(schema.projects.id, projectId), eq(schema.projects.userId, userId)),
  });
  if (!project) return null;

  const [assets, avatar, storyboard, scenes, jobs, outputs] = await Promise.all([
    db.query.brandAssets.findMany({ where: eq(schema.brandAssets.projectId, projectId), orderBy: [desc(schema.brandAssets.createdAt)] }),
    db.query.avatars.findFirst({ where: eq(schema.avatars.projectId, projectId), orderBy: [desc(schema.avatars.createdAt)] }),
    db.query.storyboards.findFirst({ where: eq(schema.storyboards.projectId, projectId) }),
    db.query.scenes.findMany({ where: eq(schema.scenes.projectId, projectId), orderBy: [asc(schema.scenes.order)] }),
    db.query.generationJobs.findMany({ where: eq(schema.generationJobs.projectId, projectId), orderBy: [desc(schema.generationJobs.createdAt)] }),
    db.query.outputs.findMany({
      where: and(eq(schema.outputs.projectId, projectId), isNull(schema.outputs.removedAt)),
      orderBy: [desc(schema.outputs.createdAt)],
    }),
  ]);

  return {
    project: mapProject(project),
    assets: assets.map(mapAsset),
    avatar: avatar ? mapAvatar(avatar) : null,
    storyboard: storyboard ? mapStoryboard(storyboard) : null,
    scenes: scenes.map(mapScene),
    jobs: jobs.map(mapJob),
    outputs: outputs.map(mapOutput),
  };
}

export async function createProject(
  userId: string,
  input: Pick<ProjectRecord, "title" | "productName" | "offer" | "cta" | "targetAudience" | "brandVoice" | "platformTarget" | "script">,
) {
  if (!databaseEnabled() || !db) {
    const createdAt = now();
    const project: ProjectRecord = {
      id: randomUUID(),
      userId,
      status: "draft",
      title: input.title,
      productName: input.productName,
      offer: input.offer,
      cta: input.cta,
      targetAudience: input.targetAudience,
      brandVoice: input.brandVoice,
      platformTarget: input.platformTarget,
      script: input.script,
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
    title: input.title,
    productName: input.productName,
    offer: input.offer,
    cta: input.cta,
    targetAudience: input.targetAudience,
    brandVoice: input.brandVoice,
    platformTarget: input.platformTarget,
    script: input.script,
    reviewNotes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await addAuditEvent(userId, id, "project.created", input);
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
  return { ...mapStoryboard(storyboard), status: "approved" };
}

export async function createGenerationJob(
  userId: string,
  projectId: string,
  input: { type: JobType; status: JobStatus; providerJobId?: string | null; requestPayload: unknown; responsePayload?: unknown; errorMessage?: string | null },
) {
  if (!databaseEnabled() || !db) {
    const job: GenerationJobRecord = {
      id: randomUUID(), projectId, userId, type: input.type, status: input.status,
      providerJobId: input.providerJobId ?? null, requestPayload: input.requestPayload,
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
    providerJobId: input.providerJobId ?? null,
    requestPayload: input.requestPayload,
    responsePayload: input.responsePayload ?? null,
    errorMessage: input.errorMessage ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    id, projectId, userId, type: input.type, status: input.status,
    providerJobId: input.providerJobId ?? null, requestPayload: input.requestPayload,
    responsePayload: input.responsePayload ?? null, errorMessage: input.errorMessage ?? null,
    createdAt: now(), updatedAt: now(),
  };
}

export async function updateGenerationJob(
  jobId: string,
  patch: Partial<Pick<GenerationJobRecord, "status" | "responsePayload" | "errorMessage" | "providerJobId">>,
) {
  if (!databaseEnabled() || !db) {
    const job = getState().generationJobs.find((entry) => entry.id === jobId);
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: now() });
    return job;
  }
  await ensureDatabase();
  const existing = await db.query.generationJobs.findFirst({ where: eq(schema.generationJobs.id, jobId) });
  if (!existing) return null;
  await db.update(schema.generationJobs).set({ ...patch, updatedAt: new Date() }).where(eq(schema.generationJobs.id, jobId));
  return { ...mapJob(existing), ...patch, updatedAt: now() };
}

export async function updateGenerationJobByProviderJobId(
  providerJobId: string,
  patch: Partial<Pick<GenerationJobRecord, "status" | "responsePayload" | "errorMessage">>,
) {
  if (!databaseEnabled() || !db) {
    const job = getState().generationJobs.find((entry) => entry.providerJobId === providerJobId);
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: now() });
    return job;
  }
  await ensureDatabase();
  const existing = await db.query.generationJobs.findFirst({
    where: eq(schema.generationJobs.providerJobId, providerJobId),
  });
  if (!existing) return null;
  await db.update(schema.generationJobs).set({ ...patch, updatedAt: new Date() }).where(eq(schema.generationJobs.id, existing.id));
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
  return { id, projectId, userId, type: input.type, title: input.title, url: input.url, metadataTag: input.metadataTag ?? SOFTAI_METADATA_TAG, removedAt: null, createdAt: now() };
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

export async function upsertUserSubscription(
  userId: string,
  input: { clerkPayerId: string | null; clerkSubscriptionId?: string | null; plan: string; status: SubscriptionRecord["status"]; currentPeriodEnd?: string | null; monthlyCredits?: number },
) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing =
      state.subscriptions.find((entry) => input.clerkSubscriptionId !== null && entry.clerkSubscriptionId === input.clerkSubscriptionId) ??
      state.subscriptions.find((entry) => entry.userId === userId);
    if (existing) {
      existing.clerkPayerId = input.clerkPayerId;
      existing.clerkSubscriptionId = input.clerkSubscriptionId === undefined ? existing.clerkSubscriptionId : input.clerkSubscriptionId;
      existing.plan = input.plan;
      existing.status = input.status;
      existing.currentPeriodEnd = input.currentPeriodEnd ?? existing.currentPeriodEnd;
      existing.monthlyCredits = input.monthlyCredits ?? existing.monthlyCredits;
      return existing;
    }
    const created: SubscriptionRecord = {
      id: randomUUID(), userId, plan: input.plan, status: input.status, clerkPayerId: input.clerkPayerId,
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
    await db.update(schema.subscriptions).set({
      clerkPayerId: input.clerkPayerId,
      clerkSubscriptionId: input.clerkSubscriptionId === undefined ? existing.clerkSubscriptionId : input.clerkSubscriptionId,
      plan: input.plan,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ? new Date(input.currentPeriodEnd) : existing.currentPeriodEnd,
      monthlyCredits: input.monthlyCredits ?? existing.monthlyCredits,
    }).where(eq(schema.subscriptions.id, existing.id));
    return {
      ...mapSubscription(existing),
      clerkPayerId: input.clerkPayerId,
      clerkSubscriptionId: input.clerkSubscriptionId === undefined ? existing.clerkSubscriptionId : input.clerkSubscriptionId ?? null,
      plan: input.plan,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ?? toIso(existing.currentPeriodEnd),
      monthlyCredits: input.monthlyCredits ?? existing.monthlyCredits,
    };
  }
  const id = randomUUID();
  await db.insert(schema.subscriptions).values({
    id, userId, plan: input.plan, status: input.status, clerkPayerId: input.clerkPayerId,
    clerkSubscriptionId: input.clerkSubscriptionId ?? null,
    currentPeriodEnd: input.currentPeriodEnd ? new Date(input.currentPeriodEnd) : null,
    monthlyCredits: input.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
  });
  return {
    id, userId, plan: input.plan, status: input.status, clerkPayerId: input.clerkPayerId,
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
  const [subscription, balance, recentActivity] = await Promise.all([
    getUserSubscription(userId),
    getCreditBalance(userId),
    getCreditHistory(userId),
  ]);
  return {
    plan: subscription?.plan ?? DEFAULT_PLAN_NAME,
    status: subscription?.status ?? "trialing",
    monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
    balance,
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
    recentActivity: recentActivity.slice(0, 8),
    summaryLabel: `${formatCredits(balance)} credits available`,
  };
}
