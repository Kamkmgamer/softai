import { randomUUID } from "crypto";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import { SOFTAI_METADATA_TAG } from "@/lib/constants";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { OutputRecord, OutputType, OutputWithProject } from "@/lib/types";
import { getState } from "./memory";
import {
  HISTORY_PAGE_SIZE,
  mapOutput,
  memoryUpdateProjectStatus,
  now,
  revalidateProjectData,
  toIso,
  updateProjectStatus,
} from "./helpers";

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
