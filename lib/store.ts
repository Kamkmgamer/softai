import { randomUUID } from "crypto";
import { CREDIT_COSTS, DEFAULT_MONTHLY_CREDITS, DEFAULT_PLAN_NAME, SOFTAI_METADATA_TAG } from "@/lib/constants";
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
        polarCustomerId: null,
        polarSubscriptionId: null,
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

function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const state = getState();
  const project = state.projects.find((entry) => entry.id === projectId);
  if (project) {
    project.status = status;
    project.updatedAt = now();
  }
}

function addAuditEvent(userId: string | null, projectId: string | null, event: string, payload: unknown) {
  const state = getState();
  state.auditEvents.unshift({
    id: randomUUID(),
    userId,
    projectId,
    event,
    payload,
    createdAt: now(),
  });
}

export function upsertUser(input: Pick<UserRecord, "clerkUserId" | "email" | "name">) {
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
    polarCustomerId: null,
    polarSubscriptionId: null,
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

export function findUserByClerkId(clerkUserId: string) {
  return getState().users.find((user) => user.clerkUserId === clerkUserId) ?? null;
}

export function getDashboardStats(userId: string): DashboardStats {
  const state = getState();
  const projects = state.projects.filter((entry) => entry.userId === userId);
  const subscription = getUserSubscription(userId);

  return {
    activeProjects: projects.filter((entry) => entry.status !== "completed").length,
    completedVideos: state.outputs.filter((output) => output.userId === userId && output.type === "final_video").length,
    creditBalance: getCreditBalance(userId),
    monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
  };
}

export function listProjects(userId: string) {
  return getState()
    .projects.filter((entry) => entry.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProjectBundle(userId: string, projectId: string): ProjectBundle | null {
  const state = getState();
  const project = state.projects.find((entry) => entry.id === projectId && entry.userId === userId);

  if (!project) {
    return null;
  }

  const storyboard = state.storyboards.find((entry) => entry.projectId === projectId) ?? null;

  return {
    project,
    assets: state.brandAssets.filter((entry) => entry.projectId === projectId),
    avatar: state.avatars.find((entry) => entry.projectId === projectId) ?? null,
    storyboard,
    scenes: state.scenes
      .filter((entry) => entry.projectId === projectId)
      .sort((a, b) => a.order - b.order),
    jobs: state.generationJobs.filter((entry) => entry.projectId === projectId),
    outputs: state.outputs.filter((entry) => entry.projectId === projectId && !entry.removedAt),
  };
}

export function createProject(
  userId: string,
  input: Pick<
    ProjectRecord,
    "title" | "productName" | "offer" | "cta" | "targetAudience" | "brandVoice" | "platformTarget" | "script"
  >,
) {
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
  addAuditEvent(userId, project.id, "project.created", input);
  return project;
}

export function addBrandAsset(
  userId: string,
  projectId: string,
  input: { type: AssetType; name: string; url: string },
) {
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
  addAuditEvent(userId, projectId, "asset.added", input);
  return record;
}

export function saveAvatar(
  userId: string,
  projectId: string,
  input: {
    sourceType: AvatarSource;
    imageUrl: string | null;
    prompt: string | null;
    policyState: AvatarPolicyState;
    attested: boolean;
  },
) {
  const state = getState();
  const existing = state.avatars.find((entry) => entry.projectId === projectId);

  if (existing) {
    existing.sourceType = input.sourceType;
    existing.imageUrl = input.imageUrl;
    existing.prompt = input.prompt;
    existing.policyState = input.policyState;
    existing.attested = input.attested;
    return existing;
  }

  const record: AvatarRecord = {
    id: randomUUID(),
    projectId,
    userId,
    sourceType: input.sourceType,
    imageUrl: input.imageUrl,
    prompt: input.prompt,
    policyState: input.policyState,
    attested: input.attested,
    createdAt: now(),
  };
  state.avatars.push(record);
  addAuditEvent(userId, projectId, "avatar.saved", input);
  return record;
}

export function saveStoryboard(
  userId: string,
  projectId: string,
  input: {
    headline: string;
    hook: string;
    cta: string;
    scenes: Array<
      Pick<SceneRecord, "title" | "narration" | "visualDirection" | "overlayText" | "durationSeconds">
    >;
  },
) {
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
    state.storyboards.push({
      id: storyboardId,
      projectId,
      headline: input.headline,
      hook: input.hook,
      cta: input.cta,
      status: "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  state.scenes = state.scenes.filter((scene) => scene.projectId !== projectId);
  input.scenes.forEach((scene, index) => {
    state.scenes.push({
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
    });
  });

  updateProjectStatus(projectId, "review_needed");
  addAuditEvent(userId, projectId, "storyboard.saved", input);
}

export function approveStoryboard(userId: string, projectId: string) {
  const storyboard = getState().storyboards.find((entry) => entry.projectId === projectId);
  if (!storyboard) return null;
  storyboard.status = "approved";
  storyboard.updatedAt = now();
  updateProjectStatus(projectId, "storyboard_ready");
  addAuditEvent(userId, projectId, "storyboard.approved", {});
  return storyboard;
}

export function createGenerationJob(
  userId: string,
  projectId: string,
  input: {
    type: JobType;
    status: JobStatus;
    providerJobId?: string | null;
    requestPayload: unknown;
    responsePayload?: unknown;
    errorMessage?: string | null;
  },
) {
  const job: GenerationJobRecord = {
    id: randomUUID(),
    projectId,
    userId,
    type: input.type,
    status: input.status,
    providerJobId: input.providerJobId ?? null,
    requestPayload: input.requestPayload,
    responsePayload: input.responsePayload ?? null,
    errorMessage: input.errorMessage ?? null,
    createdAt: now(),
    updatedAt: now(),
  };
  getState().generationJobs.unshift(job);
  return job;
}

export function updateGenerationJob(
  jobId: string,
  patch: Partial<Pick<GenerationJobRecord, "status" | "responsePayload" | "errorMessage" | "providerJobId">>,
) {
  const job = getState().generationJobs.find((entry) => entry.id === jobId);
  if (!job) return null;
  Object.assign(job, patch, { updatedAt: now() });
  return job;
}

export function saveSceneImage(projectId: string, order: number, imageUrl: string) {
  const scene = getState().scenes.find((entry) => entry.projectId === projectId && entry.order === order);
  if (!scene) return null;
  scene.imageUrl = imageUrl;
  return scene;
}

export function createOutput(
  userId: string,
  projectId: string,
  input: { type: OutputType; title: string; url: string; metadataTag?: string },
) {
  const output: OutputRecord = {
    id: randomUUID(),
    projectId,
    userId,
    type: input.type,
    title: input.title,
    url: input.url,
    metadataTag: input.metadataTag ?? SOFTAI_METADATA_TAG,
    removedAt: null,
    createdAt: now(),
  };

  getState().outputs.unshift(output);
  if (input.type === "final_video") {
    updateProjectStatus(projectId, "completed");
  }
  return output;
}

export function createAbuseReport(
  reporterUserId: string,
  input: Pick<AbuseReportRecord, "projectId" | "outputId" | "reason" | "details">,
) {
  const report: AbuseReportRecord = {
    id: randomUUID(),
    reporterUserId,
    ...input,
    createdAt: now(),
  };
  getState().abuseReports.unshift(report);
  addAuditEvent(reporterUserId, input.projectId, "abuse.reported", input);
  return report;
}

export function createAdminAction(
  adminUserId: string,
  input: Pick<AdminActionRecord, "targetUserId" | "action" | "details">,
) {
  const record: AdminActionRecord = {
    id: randomUUID(),
    adminUserId,
    ...input,
    createdAt: now(),
  };
  getState().adminActions.unshift(record);
  addAuditEvent(adminUserId, null, `admin.${input.action}`, input);
  return record;
}

export function banUser(targetUserId: string) {
  const user = getState().users.find((entry) => entry.id === targetUserId);
  if (user) {
    user.bannedAt = now();
  }
  return user;
}

export function getRecentAdminData() {
  const state = getState();
  return {
    reports: state.abuseReports.slice(0, 10),
    actions: state.adminActions.slice(0, 10),
    auditEvents: state.auditEvents.slice(0, 15),
    users: state.users,
    outputs: state.outputs,
  };
}

export function takedownOutput(outputId: string) {
  const output = getState().outputs.find((entry) => entry.id === outputId);
  if (output) {
    output.removedAt = now();
  }
  return output;
}

export function getCreditBalance(userId: string) {
  return getState()
    .creditLedger.filter((entry) => entry.userId === userId)
    .reduce((total, entry) => total + entry.amount, 0);
}

export function getUserSubscription(userId: string) {
  return getState().subscriptions.find((entry) => entry.userId === userId) ?? null;
}

export function addCreditEvent(
  userId: string,
  input: {
    projectId?: string | null;
    reason: CreditLedgerRecord["reason"];
    amount: number;
    note: string;
  },
) {
  const record: CreditLedgerRecord = {
    id: randomUUID(),
    userId,
    projectId: input.projectId ?? null,
    reason: input.reason,
    amount: input.amount,
    note: input.note,
    createdAt: now(),
  };

  getState().creditLedger.unshift(record);
  return record;
}

export function getCreditHistory(userId: string) {
  return getState()
    .creditLedger.filter((entry) => entry.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBillingSummary(userId: string) {
  const subscription = getUserSubscription(userId);
  return {
    plan: subscription?.plan ?? DEFAULT_PLAN_NAME,
    status: subscription?.status ?? "trialing",
    monthlyCredits: subscription?.monthlyCredits ?? DEFAULT_MONTHLY_CREDITS,
    balance: getCreditBalance(userId),
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
    recentActivity: getCreditHistory(userId).slice(0, 8),
    summaryLabel: `${formatCredits(getCreditBalance(userId))} credits available`,
  };
}
