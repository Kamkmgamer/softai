export type ProjectStatus =
  | "draft"
  | "storyboard_ready"
  | "review_needed"
  | "rendering"
  | "completed"
  | "failed"
  | "blocked";

export type JobType = "storyboard" | "image" | "video";
export type JobStatus =
  | "queued"
  | "submitted"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export type OutputType = "scene_image" | "final_video" | "thumbnail";
export type AvatarPolicyState =
  | "self_declared"
  | "third_party_declared"
  | "ai_generated"
  | "flagged";

export type SubscriptionStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export type AssetType = "logo" | "product_image" | "reference_image";
export type AvatarSource = "single_photo" | "ai_person";
export type CreditReason =
  | "grant"
  | "storyboard_burn"
  | "chat_hold"
  | "chat_burn"
  | "image_hold"
  | "image_burn"
  | "video_hold"
  | "video_burn"
  | "refund"
  | "admin_adjustment";

export type UserRecord = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  bannedAt: string | null;
  createdAt: string;
};

export type SubscriptionRecord = {
  id: string;
  userId: string;
  plan: string;
  status: SubscriptionStatus;
  clerkPayerId: string | null;
  clerkSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  monthlyCredits: number;
};

export type CreditLedgerRecord = {
  id: string;
  userId: string;
  projectId: string | null;
  reason: CreditReason;
  amount: number;
  note: string;
  createdAt: string;
};

export type ChatRole = "user" | "assistant" | "system";

export type ChatConversationRecord = {
  id: string;
  userId: string;
  projectId: string | null;
  title: string;
  mode: "project_campaign" | "general";
  createdAt: string;
  updatedAt: string;
};

export type ChatMessageRecord = {
  id: string;
  conversationId: string;
  userId: string;
  role: ChatRole;
  content: string;
  metadata: unknown;
  createdAt: string;
};

export type ProjectKind =
  | "campaign_ad"
  | "multi_shot_video"
  | "image_to_video"
  | "text_to_image"
  | "image_edit"
  | "video_edit"
  | "mockup"
  | "create_ad";

export type ProjectRecord = {
  id: string;
  userId: string;
  status: ProjectStatus;
  kind: ProjectKind;
  title: string;
  productName: string;
  offer: string;
  cta: string;
  targetAudience: string;
  brandVoice: string;
  platformTarget: "tiktok" | "instagram" | "youtube";
  language: "en" | "ar";
  script: string;
  metadata: unknown;
  reviewNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type BrandAssetRecord = {
  id: string;
  projectId: string;
  userId: string;
  type: AssetType;
  name: string;
  url: string;
  createdAt: string;
};

export type AvatarRecord = {
  id: string;
  projectId: string;
  userId: string;
  sourceType: AvatarSource;
  imageUrl: string | null;
  prompt: string | null;
  policyState: AvatarPolicyState;
  attested: boolean;
  createdAt: string;
};

export type StoryboardRecord = {
  id: string;
  projectId: string;
  headline: string;
  hook: string;
  cta: string;
  status: "draft" | "approved";
  createdAt: string;
  updatedAt: string;
};

export type SceneRecord = {
  id: string;
  storyboardId: string;
  projectId: string;
  order: number;
  title: string;
  narration: string;
  visualDirection: string;
  overlayText: string;
  durationSeconds: number;
  imageUrl: string | null;
};

export type GenerationJobRecord = {
  id: string;
  projectId: string;
  userId: string;
  type: JobType;
  status: JobStatus;
  providerKey: string | null;
  modelKey: string | null;
  providerJobId: string | null;
  costEstimate: number | null;
  attempts: number;
  requestPayload: unknown;
  responsePayload: unknown;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OutputRecord = {
  id: string;
  projectId: string;
  userId: string;
  type: OutputType;
  title: string;
  url: string;
  metadataTag: string;
  removedAt: string | null;
  createdAt: string;
};

export type AbuseReportRecord = {
  id: string;
  reporterUserId: string;
  projectId: string | null;
  outputId: string | null;
  reason: string;
  details: string;
  createdAt: string;
};

export type AdminActionRecord = {
  id: string;
  adminUserId: string;
  targetUserId: string;
  action: "ban_user" | "takedown_output" | "credit_adjustment";
  details: string;
  createdAt: string;
};

export type AuditEventRecord = {
  id: string;
  userId: string | null;
  projectId: string | null;
  event: string;
  payload: unknown;
  createdAt: string;
};

export type ProjectBundle = {
  project: ProjectRecord;
  assets: BrandAssetRecord[];
  avatar: AvatarRecord | null;
  storyboard: StoryboardRecord | null;
  scenes: SceneRecord[];
  jobs: GenerationJobRecord[];
  outputs: OutputRecord[];
};

export type DashboardStats = {
  activeProjects: number;
  completedVideos: number;
  creditBalance: number;
  monthlyCredits: number;
};
