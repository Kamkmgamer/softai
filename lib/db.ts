import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql as drizzleSql } from "drizzle-orm";
import { getEnv } from "@/lib/env";
import * as schema from "@/db/schema";

declare global {
  var softaiDbReady: Promise<void> | undefined;
}

const env = getEnv();
const hasDatabase = Boolean(env.databaseUrl);

const client = hasDatabase ? neon(env.databaseUrl as string) : null;
export const db = hasDatabase && client ? drizzle(client, { schema }) : null;

async function run(statement: string) {
  if (!db) return;
  await db.execute(drizzleSql.raw(statement));
}

export async function ensureDatabase() {
  if (!db) {
    return;
  }

  if (!globalThis.softaiDbReady) {
    globalThis.softaiDbReady = (async () => {
      await run(
        "DO $$ BEGIN CREATE TYPE project_status AS ENUM ('draft','storyboard_ready','review_needed','rendering','completed','failed','blocked'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
      );
      await run(
        "DO $$ BEGIN CREATE TYPE job_type AS ENUM ('storyboard','image','video'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
      );
      await run(
        "DO $$ BEGIN CREATE TYPE job_status AS ENUM ('queued','submitted','processing','completed','failed','refunded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
      );
      await run(
        "DO $$ BEGIN CREATE TYPE output_type AS ENUM ('scene_image','final_video','thumbnail'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
      );
      await run(
        "DO $$ BEGIN CREATE TYPE avatar_policy_state AS ENUM ('self_declared','third_party_declared','ai_generated','flagged'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
      );

      await run(`
        CREATE TABLE IF NOT EXISTS users (
          id uuid PRIMARY KEY,
          clerk_user_id varchar(255) NOT NULL UNIQUE,
          email varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          banned_at timestamptz NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id uuid PRIMARY KEY,
          user_id uuid NOT NULL,
          plan varchar(100) NOT NULL,
          status varchar(50) NOT NULL,
          clerk_payer_id varchar(255) NULL,
          clerk_subscription_id varchar(255) NULL,
          current_period_end timestamptz NULL,
          monthly_credits integer NOT NULL DEFAULT 1000
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS credit_ledger (
          id uuid PRIMARY KEY,
          user_id uuid NOT NULL,
          project_id uuid NULL,
          reason varchar(50) NOT NULL,
          amount integer NOT NULL,
          note text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS clerk_webhook_events (
          id uuid PRIMARY KEY,
          event_id varchar(255) NOT NULL UNIQUE,
          type varchar(100) NOT NULL,
          status varchar(30) NOT NULL,
          error text NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          processed_at timestamptz NULL
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS projects (
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
        );
      `);
      await run("ALTER TABLE projects ADD COLUMN IF NOT EXISTS language varchar(10) NOT NULL DEFAULT 'en';");
      await run(`
        CREATE TABLE IF NOT EXISTS storyboards (
          id uuid PRIMARY KEY,
          project_id uuid NOT NULL,
          headline text NOT NULL,
          hook text NOT NULL,
          cta text NOT NULL,
          status varchar(30) NOT NULL DEFAULT 'draft',
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS scenes (
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
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS generation_jobs (
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
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS outputs (
          id uuid PRIMARY KEY,
          project_id uuid NOT NULL,
          user_id uuid NOT NULL,
          type output_type NOT NULL,
          title varchar(255) NOT NULL,
          url text NOT NULL,
          metadata_tag varchar(255) NOT NULL,
          removed_at timestamptz NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS avatars (
          id uuid PRIMARY KEY,
          project_id uuid NOT NULL,
          user_id uuid NOT NULL,
          source_type varchar(50) NOT NULL,
          image_url text NULL,
          prompt text NULL,
          policy_state avatar_policy_state NOT NULL,
          attested boolean NOT NULL DEFAULT false,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS brand_assets (
          id uuid PRIMARY KEY,
          project_id uuid NOT NULL,
          user_id uuid NOT NULL,
          type varchar(50) NOT NULL,
          name varchar(255) NOT NULL,
          url text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS abuse_reports (
          id uuid PRIMARY KEY,
          reporter_user_id uuid NOT NULL,
          project_id uuid NULL,
          output_id uuid NULL,
          reason text NOT NULL,
          details text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS admin_actions (
          id uuid PRIMARY KEY,
          admin_user_id uuid NOT NULL,
          target_user_id uuid NOT NULL,
          action varchar(50) NOT NULL,
          details text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`
        CREATE TABLE IF NOT EXISTS audit_events (
          id uuid PRIMARY KEY,
          user_id uuid NULL,
          project_id uuid NULL,
          event varchar(100) NOT NULL,
          payload jsonb NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `);
      await run(`ALTER TABLE outputs ADD COLUMN IF NOT EXISTS removed_at timestamptz NULL;`);
      await run(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS clerk_payer_id varchar(255) NULL;`);
      await run(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS clerk_subscription_id varchar(255) NULL;`);
      await run(`ALTER TABLE clerk_webhook_events ADD COLUMN IF NOT EXISTS error text NULL;`);
      await run(`ALTER TABLE clerk_webhook_events ADD COLUMN IF NOT EXISTS processed_at timestamptz NULL;`);
    })();
  }

  await globalThis.softaiDbReady;
}

export function databaseEnabled() {
  return Boolean(db);
}
