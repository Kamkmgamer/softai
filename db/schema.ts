import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "storyboard_ready",
  "review_needed",
  "rendering",
  "completed",
  "failed",
  "blocked",
]);

export const jobTypeEnum = pgEnum("job_type", ["storyboard", "image", "video"]);
export const jobStatusEnum = pgEnum("job_status", [
  "queued",
  "submitted",
  "processing",
  "completed",
  "failed",
  "refunded",
]);

export const outputTypeEnum = pgEnum("output_type", [
  "scene_image",
  "final_video",
  "thumbnail",
]);

export const providerStatusEnum = pgEnum("provider_status", ["active", "degraded", "disabled"]);

export const avatarPolicyStateEnum = pgEnum("avatar_policy_state", [
  "self_declared",
  "third_party_declared",
  "ai_generated",
  "flagged",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  bannedAt: timestamp("banned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  plan: varchar("plan", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  clerkPayerId: varchar("clerk_payer_id", { length: 255 }),
  clerkSubscriptionId: varchar("clerk_subscription_id", { length: 255 }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  monthlyCredits: integer("monthly_credits").notNull().default(1000),
}, (table) => [
  index("subscriptions_user_period_idx").on(table.userId, table.currentPeriodEnd),
  index("subscriptions_clerk_subscription_idx").on(table.clerkSubscriptionId),
]);

export const creditLedger = pgTable("credit_ledger", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id"),
  reason: varchar("reason", { length: 50 }).notNull(),
  amount: integer("amount").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("credit_ledger_user_created_idx").on(table.userId, table.createdAt),
]);

export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id"),
  title: varchar("title", { length: 255 }).notNull(),
  mode: varchar("mode", { length: 50 }).notNull().default("project_campaign"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("chat_conversations_user_project_mode_unique").on(table.userId, table.projectId, table.mode),
]);

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<unknown>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("chat_messages_conversation_created_idx").on(table.conversationId, table.createdAt),
]);

export const clerkWebhookEvents = pgTable("clerk_webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: varchar("event_id", { length: 255 }).notNull().unique(),
  type: varchar("type", { length: 100 }).notNull(),
  status: varchar("status", { length: 30 }).notNull(),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  status: projectStatusEnum("status").notNull().default("draft"),
  kind: varchar("kind", { length: 50 }).notNull().default("campaign_ad"),
  title: varchar("title", { length: 255 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  offer: text("offer").notNull(),
  cta: text("cta").notNull(),
  targetAudience: text("target_audience").notNull(),
  brandVoice: text("brand_voice").notNull(),
  platformTarget: varchar("platform_target", { length: 50 }).notNull().default("tiktok"),
  language: varchar("language", { length: 10 }).notNull().default("en"),
  script: text("script").notNull().default(""),
  metadata: jsonb("metadata").$type<unknown>(),
  reviewNotes: text("review_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("projects_user_updated_idx").on(table.userId, table.updatedAt),
]);

export const storyboards = pgTable("storyboards", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  headline: text("headline").notNull(),
  hook: text("hook").notNull(),
  cta: text("cta").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("storyboards_project_idx").on(table.projectId),
]);

export const scenes = pgTable("scenes", {
  id: uuid("id").defaultRandom().primaryKey(),
  storyboardId: uuid("storyboard_id").notNull(),
  projectId: uuid("project_id").notNull(),
  order: integer("order").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  narration: text("narration").notNull(),
  visualDirection: text("visual_direction").notNull(),
  overlayText: text("overlay_text").notNull(),
  durationSeconds: integer("duration_seconds").notNull().default(5),
  imageUrl: text("image_url"),
}, (table) => [
  index("scenes_project_order_idx").on(table.projectId, table.order),
]);

export const generationJobs = pgTable("generation_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  type: jobTypeEnum("type").notNull(),
  status: jobStatusEnum("status").notNull().default("queued"),
  providerKey: varchar("provider_key", { length: 100 }),
  modelKey: varchar("model_key", { length: 255 }),
  providerJobId: varchar("provider_job_id", { length: 255 }),
  costEstimate: integer("cost_estimate"),
  attempts: integer("attempts").notNull().default(0),
  requestPayload: jsonb("request_payload").$type<unknown>(),
  responsePayload: jsonb("response_payload").$type<unknown>(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("generation_jobs_project_created_idx").on(table.projectId, table.createdAt),
  index("generation_jobs_provider_job_idx").on(table.providerJobId),
]);

export const aiProviders = pgTable("ai_providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerKey: varchar("provider_key", { length: 100 }).notNull().unique(),
  status: providerStatusEnum("status").notNull().default("active"),
  supportedCapabilities: jsonb("supported_capabilities").$type<string[]>().notNull().default([]),
  config: jsonb("config").$type<unknown>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const aiModels = pgTable("ai_models", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerKey: varchar("provider_key", { length: 100 }).notNull(),
  modelKey: varchar("model_key", { length: 255 }).notNull(),
  capability: varchar("capability", { length: 50 }).notNull(),
  costUnit: varchar("cost_unit", { length: 50 }),
  maxDurationSeconds: integer("max_duration_seconds"),
  maxResolution: varchar("max_resolution", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("ai_models_provider_model_unique").on(table.providerKey, table.modelKey),
  index("ai_models_capability_idx").on(table.capability),
]);

export const providerEvents = pgTable("provider_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerKey: varchar("provider_key", { length: 100 }).notNull(),
  modelKey: varchar("model_key", { length: 255 }),
  generationJobId: uuid("generation_job_id"),
  capability: varchar("capability", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  latencyMs: integer("latency_ms"),
  retryCount: integer("retry_count").notNull().default(0),
  errorCode: varchar("error_code", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("provider_events_provider_created_idx").on(table.providerKey, table.createdAt),
  index("provider_events_job_idx").on(table.generationJobId),
]);

export const outputs = pgTable("outputs", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  type: outputTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url").notNull(),
  metadataTag: varchar("metadata_tag", { length: 255 }).notNull(),
  removedAt: timestamp("removed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("outputs_user_removed_type_idx").on(table.userId, table.removedAt, table.type),
  index("outputs_project_removed_created_idx").on(table.projectId, table.removedAt, table.createdAt),
]);

export const avatars = pgTable("avatars", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  sourceType: varchar("source_type", { length: 50 }).notNull(),
  imageUrl: text("image_url"),
  prompt: text("prompt"),
  policyState: avatarPolicyStateEnum("policy_state").notNull(),
  attested: boolean("attested").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("avatars_project_created_idx").on(table.projectId, table.createdAt),
]);

export const brandAssets = pgTable("brand_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("brand_assets_project_created_idx").on(table.projectId, table.createdAt),
]);

export const abuseReports = pgTable("abuse_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterUserId: uuid("reporter_user_id").notNull(),
  projectId: uuid("project_id"),
  outputId: uuid("output_id"),
  reason: text("reason").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminActions = pgTable("admin_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminUserId: uuid("admin_user_id").notNull(),
  targetUserId: uuid("target_user_id").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  projectId: uuid("project_id"),
  event: varchar("event", { length: 100 }).notNull(),
  payload: jsonb("payload").$type<unknown>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const shareTokens = pgTable("share_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  outputId: uuid("output_id").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  createdBy: uuid("created_by").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("share_tokens_output_idx").on(table.outputId),
]);

export const brandKits = pgTable("brand_kits", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color", { length: 7 }),
  secondaryColor: varchar("secondary_color", { length: 7 }),
  fonts: jsonb("fonts").$type<{ heading?: string; body?: string }>(),
  toneOfVoice: varchar("tone_of_voice", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("brand_kits_user_idx").on(table.userId),
]);
