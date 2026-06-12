import { randomUUID } from "crypto";
import { and, eq, isNull } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { OutputRecord, ShareTokenRecord } from "@/lib/types";
import { getState } from "./memory";
import { generateShareToken, mapOutput, now } from "./helpers";

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
