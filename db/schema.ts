import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
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
});

export const creditLedger = pgTable("credit_ledger", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id"),
  reason: varchar("reason", { length: 50 }).notNull(),
  amount: integer("amount").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

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
  title: varchar("title", { length: 255 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  offer: text("offer").notNull(),
  cta: text("cta").notNull(),
  targetAudience: text("target_audience").notNull(),
  brandVoice: text("brand_voice").notNull(),
  platformTarget: varchar("platform_target", { length: 50 }).notNull().default("tiktok"),
  script: text("script").notNull().default(""),
  reviewNotes: text("review_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const storyboards = pgTable("storyboards", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  headline: text("headline").notNull(),
  hook: text("hook").notNull(),
  cta: text("cta").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

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
});

export const generationJobs = pgTable("generation_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  type: jobTypeEnum("type").notNull(),
  status: jobStatusEnum("status").notNull().default("queued"),
  providerJobId: varchar("provider_job_id", { length: 255 }),
  requestPayload: jsonb("request_payload").$type<unknown>(),
  responsePayload: jsonb("response_payload").$type<unknown>(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

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
});

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
});

export const brandAssets = pgTable("brand_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

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
