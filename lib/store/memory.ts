import { CREDIT_COSTS } from "@/lib/constants";
import type {
  AbuseReportRecord,
  AdminActionRecord,
  AuditEventRecord,
  AvatarRecord,
  BrandAssetRecord,
  ChatConversationRecord,
  ChatMessageRecord,
  CreditLedgerRecord,
  GenerationJobRecord,
  OutputRecord,
  ProjectRecord,
  SceneRecord,
  ShareTokenRecord,
  StoryboardRecord,
  SubscriptionRecord,
  UserRecord,
} from "@/lib/types";

export type PolarWebhookEventRecord = {
  id: string;
  eventId: string;
  type: string;
  status: "processing" | "processed" | "failed";
  error: string | null;
  createdAt: string;
  processedAt: string | null;
};

export type DatabaseState = {
  users: UserRecord[];
  subscriptions: SubscriptionRecord[];
  polarWebhookEvents: PolarWebhookEventRecord[];
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
        plan: "starter",
        status: "active",
        polarCustomerId: null,
        polarSubscriptionId: null,
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        monthlyCredits: 1000,
      },
    ],
    polarWebhookEvents: [],
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

export function getState(): DatabaseState {
  if (!globalThis.softaiStore) {
    globalThis.softaiStore = createSeedStore();
  }
  globalThis.softaiStore.chatConversations ??= [];
  globalThis.softaiStore.chatMessages ??= [];
  globalThis.softaiStore.shareTokens ??= [];
  return globalThis.softaiStore;
}
