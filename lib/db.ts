import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getEnv } from "@/lib/env";
import * as schema from "@/db/schema";

declare global {
  var softaiDbReady: Promise<void> | undefined;
}

const env = getEnv();
const hasDatabase = Boolean(env.databaseUrl);

export const neonSql = hasDatabase ? neon(env.databaseUrl as string) : null;
export const db = hasDatabase && neonSql ? drizzle(neonSql, { schema }) : null;

export async function ensureDatabase() {
  if (!db || !neonSql) {
    return;
  }

  if (!globalThis.softaiDbReady) {
    const ready = (async () => {
      const sql = neonSql!;
      const indexCheck = await sql`
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'chat_conversations_user_project_mode_unique'
      `;
      const hasIndex = indexCheck.length > 0;

      if (!hasIndex) {
        // Use neonSql.transaction() to batch all DDL into a SINGLE HTTP
        // round-trip. Previously these were 25+ sequential await run() calls,
        // each a separate HTTP request costing ~200-500ms each. The neon
        // serverless driver's .transaction() method pipelines multiple
        // queries into one HTTP request.
        await sql.transaction([
          sql`DO $$ BEGIN CREATE TYPE project_status AS ENUM ('draft','storyboard_ready','review_needed','rendering','completed','failed','blocked'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
          sql`DO $$ BEGIN CREATE TYPE job_type AS ENUM ('storyboard','image','video'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
          sql`DO $$ BEGIN CREATE TYPE job_status AS ENUM ('queued','submitted','processing','completed','failed','refunded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
          sql`DO $$ BEGIN CREATE TYPE output_type AS ENUM ('scene_image','final_video','thumbnail'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
          sql`DO $$ BEGIN CREATE TYPE avatar_policy_state AS ENUM ('self_declared','third_party_declared','ai_generated','flagged'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

          sql`CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY,
            clerk_user_id varchar(255) NOT NULL UNIQUE,
            email varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            banned_at timestamptz NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS subscriptions (
            id uuid PRIMARY KEY,
            user_id uuid NOT NULL,
            plan varchar(100) NOT NULL,
            status varchar(50) NOT NULL,
            clerk_payer_id varchar(255) NULL,
            clerk_subscription_id varchar(255) NULL,
            current_period_end timestamptz NULL,
            monthly_credits integer NOT NULL DEFAULT 1000
          )`,
          sql`CREATE TABLE IF NOT EXISTS credit_ledger (
            id uuid PRIMARY KEY,
            user_id uuid NOT NULL,
            project_id uuid NULL,
            reason varchar(50) NOT NULL,
            amount integer NOT NULL,
            note text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS chat_conversations (
            id uuid PRIMARY KEY,
            user_id uuid NOT NULL,
            project_id uuid NULL,
            title varchar(255) NOT NULL,
            mode varchar(50) NOT NULL DEFAULT 'project_campaign',
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS chat_messages (
            id uuid PRIMARY KEY,
            conversation_id uuid NOT NULL,
            user_id uuid NOT NULL,
            role varchar(20) NOT NULL,
            content text NOT NULL,
            metadata jsonb NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS clerk_webhook_events (
            id uuid PRIMARY KEY,
            event_id varchar(255) NOT NULL UNIQUE,
            type varchar(100) NOT NULL,
            status varchar(30) NOT NULL,
            error text NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            processed_at timestamptz NULL
          )`,
          sql`CREATE TABLE IF NOT EXISTS projects (
            id uuid PRIMARY KEY,
            user_id uuid NOT NULL,
            status project_status NOT NULL DEFAULT 'draft',
            title varchar(255) NOT NULL,
            product_name varchar(255) NOT NULL,
            offer text NOT NULL,
            cta text NOT NULL,
            target_audience text NOT NULL,
            brand_voice text NOT NULL,
            platform_target varchar(50) NOT NULL DEFAULT 'tiktok',
            language varchar(10) NOT NULL DEFAULT 'en',
            script text NOT NULL DEFAULT '',
            review_notes text NOT NULL DEFAULT '',
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS storyboards (
            id uuid PRIMARY KEY,
            project_id uuid NOT NULL,
            headline text NOT NULL,
            hook text NOT NULL,
            cta text NOT NULL,
            status varchar(30) NOT NULL DEFAULT 'draft',
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS scenes (
            id uuid PRIMARY KEY,
            storyboard_id uuid NOT NULL,
            project_id uuid NOT NULL,
            "order" integer NOT NULL,
            title varchar(255) NOT NULL,
            narration text NOT NULL,
            visual_direction text NOT NULL,
            overlay_text text NOT NULL,
            duration_seconds integer NOT NULL DEFAULT 5,
            image_url text NULL
          )`,
          sql`CREATE TABLE IF NOT EXISTS generation_jobs (
            id uuid PRIMARY KEY,
            project_id uuid NOT NULL,
            user_id uuid NOT NULL,
            type job_type NOT NULL,
            status job_status NOT NULL DEFAULT 'queued',
            provider_job_id varchar(255) NULL,
            request_payload jsonb NULL,
            response_payload jsonb NULL,
            error_message text NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS outputs (
            id uuid PRIMARY KEY,
            project_id uuid NOT NULL,
            user_id uuid NOT NULL,
            type output_type NOT NULL,
            title varchar(255) NOT NULL,
            url text NOT NULL,
            metadata_tag varchar(255) NOT NULL,
            removed_at timestamptz NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS avatars (
            id uuid PRIMARY KEY,
            project_id uuid NOT NULL,
            user_id uuid NOT NULL,
            source_type varchar(50) NOT NULL,
            image_url text NULL,
            prompt text NULL,
            policy_state avatar_policy_state NOT NULL,
            attested boolean NOT NULL DEFAULT false,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS brand_assets (
            id uuid PRIMARY KEY,
            project_id uuid NOT NULL,
            user_id uuid NOT NULL,
            type varchar(50) NOT NULL,
            name varchar(255) NOT NULL,
            url text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS abuse_reports (
            id uuid PRIMARY KEY,
            reporter_user_id uuid NOT NULL,
            project_id uuid NULL,
            output_id uuid NULL,
            reason text NOT NULL,
            details text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS admin_actions (
            id uuid PRIMARY KEY,
            admin_user_id uuid NOT NULL,
            target_user_id uuid NOT NULL,
            action varchar(50) NOT NULL,
            details text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
          sql`CREATE TABLE IF NOT EXISTS audit_events (
            id uuid PRIMARY KEY,
            user_id uuid NULL,
            project_id uuid NULL,
            event varchar(100) NOT NULL,
            payload jsonb NULL,
            created_at timestamptz NOT NULL DEFAULT now()
          )`,
        ]);

        // ALTER TABLE and migration queries — batch into a second transaction
        await sql.transaction([
          sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS language varchar(10) NOT NULL DEFAULT 'en'`,
          sql`ALTER TABLE outputs ADD COLUMN IF NOT EXISTS removed_at timestamptz NULL`,
          sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS clerk_payer_id varchar(255) NULL`,
          sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS clerk_subscription_id varchar(255) NULL`,
          sql`ALTER TABLE clerk_webhook_events ADD COLUMN IF NOT EXISTS error text NULL`,
          sql`ALTER TABLE clerk_webhook_events ADD COLUMN IF NOT EXISTS processed_at timestamptz NULL`,
        ]);

        // Deduplicate chat conversations and create unique constraint
        await sql.transaction([
          sql`
            WITH ranked AS (
              SELECT
                id,
                first_value(id) OVER (PARTITION BY user_id, project_id, mode ORDER BY updated_at DESC, created_at DESC, id) AS keep_id,
                row_number() OVER (PARTITION BY user_id, project_id, mode ORDER BY updated_at DESC, created_at DESC, id) AS duplicate_rank
              FROM chat_conversations
              WHERE project_id IS NOT NULL
            )
            UPDATE chat_messages
            SET conversation_id = ranked.keep_id
            FROM ranked
            WHERE chat_messages.conversation_id = ranked.id
              AND ranked.duplicate_rank > 1
          `,
          sql`
            WITH ranked AS (
              SELECT
                id,
                row_number() OVER (PARTITION BY user_id, project_id, mode ORDER BY updated_at DESC, created_at DESC, id) AS duplicate_rank
              FROM chat_conversations
              WHERE project_id IS NOT NULL
            )
            DELETE FROM chat_conversations
            USING ranked
            WHERE chat_conversations.id = ranked.id
              AND ranked.duplicate_rank > 1
          `,
          sql`
            CREATE UNIQUE INDEX IF NOT EXISTS chat_conversations_user_project_mode_unique
            ON chat_conversations (user_id, project_id, mode)
          `,
        ]);
      }

      await sql.transaction([
        sql`CREATE INDEX IF NOT EXISTS subscriptions_user_period_idx ON subscriptions (user_id, current_period_end)`,
        sql`CREATE INDEX IF NOT EXISTS subscriptions_clerk_subscription_idx ON subscriptions (clerk_subscription_id)`,
        sql`CREATE INDEX IF NOT EXISTS credit_ledger_user_created_idx ON credit_ledger (user_id, created_at)`,
        sql`CREATE INDEX IF NOT EXISTS chat_messages_conversation_created_idx ON chat_messages (conversation_id, created_at)`,
        sql`CREATE INDEX IF NOT EXISTS projects_user_updated_idx ON projects (user_id, updated_at)`,
        sql`CREATE INDEX IF NOT EXISTS storyboards_project_idx ON storyboards (project_id)`,
        sql`CREATE INDEX IF NOT EXISTS scenes_project_order_idx ON scenes (project_id, "order")`,
        sql`CREATE INDEX IF NOT EXISTS generation_jobs_project_created_idx ON generation_jobs (project_id, created_at)`,
        sql`CREATE INDEX IF NOT EXISTS generation_jobs_provider_job_idx ON generation_jobs (provider_job_id)`,
        sql`CREATE INDEX IF NOT EXISTS outputs_user_removed_type_idx ON outputs (user_id, removed_at, type)`,
        sql`CREATE INDEX IF NOT EXISTS outputs_project_removed_created_idx ON outputs (project_id, removed_at, created_at)`,
        sql`CREATE INDEX IF NOT EXISTS avatars_project_created_idx ON avatars (project_id, created_at)`,
        sql`CREATE INDEX IF NOT EXISTS brand_assets_project_created_idx ON brand_assets (project_id, created_at)`,
      ]);
    })();
    const retryableReady = ready.catch((error) => {
      if (globalThis.softaiDbReady === retryableReady) {
        delete globalThis.softaiDbReady;
      }
      throw error;
    });
    globalThis.softaiDbReady = retryableReady;
  }

  await globalThis.softaiDbReady;
}

export function databaseEnabled() {
  return Boolean(db);
}
