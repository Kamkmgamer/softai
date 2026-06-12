import { randomUUID } from "crypto";
import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { ChatConversationRecord, ChatMessageRecord, ProjectBundle, ProjectKind, ProjectRecord } from "@/lib/types";
import { getState } from "./memory";
import {
  addAuditEvent,
  cacheTags,
  mapAsset,
  mapAvatar,
  mapChatConversation,
  mapChatMessage,
  mapOutput,
  mapProject,
  mapScene,
  mapStoryboard,
  now,
  revalidateUserData,
  STORE_CACHE_REVALIDATE_SECONDS,
} from "./helpers";
import { getOrCreateProjectChatConversation, listChatMessages } from "./chat";

export async function listProjects(userId: string) {
  if (!databaseEnabled() || !db) {
    return getState()
      .projects.filter((entry) => entry.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  const database = db;
  return unstable_cache(
    async () => {
      await ensureDatabase();
      const rows = await database.query.projects.findMany({
        where: eq(schema.projects.userId, userId),
        orderBy: [desc(schema.projects.updatedAt)],
      });
      return rows.map(mapProject);
    },
    ["user-projects", userId],
    { tags: [cacheTags.userProjects(userId)], revalidate: STORE_CACHE_REVALIDATE_SECONDS },
  )();
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

  const database = db;
  await ensureDatabase();
  const [project, assets, avatar, storyboard, scenes, outputs] = await database.batch([
    database.query.projects.findFirst({
      where: and(eq(schema.projects.id, projectId), eq(schema.projects.userId, userId)),
    }),
    database.query.brandAssets.findMany({
      where: eq(schema.brandAssets.projectId, projectId),
      orderBy: [desc(schema.brandAssets.createdAt)],
    }),
    database.query.avatars.findFirst({
      where: eq(schema.avatars.projectId, projectId),
      orderBy: [desc(schema.avatars.createdAt)],
    }),
    database.query.storyboards.findFirst({
      where: eq(schema.storyboards.projectId, projectId),
    }),
    database.query.scenes.findMany({
      where: eq(schema.scenes.projectId, projectId),
      orderBy: [asc(schema.scenes.order)],
    }),
    database.query.outputs.findMany({
      where: and(eq(schema.outputs.projectId, projectId), isNull(schema.outputs.removedAt)),
      orderBy: [desc(schema.outputs.createdAt)],
    }),
  ]);

  if (!project) return null;

  return {
    project: mapProject(project),
    assets: assets.map(mapAsset),
    avatar: avatar ? mapAvatar(avatar) : null,
    storyboard: storyboard ? mapStoryboard(storyboard) : null,
    scenes: scenes.map(mapScene),
    jobs: [],
    outputs: outputs.map(mapOutput),
  };
}

export async function getProjectPageData(userId: string, projectId: string): Promise<{
  bundle: ProjectBundle | null;
  conversation: ChatConversationRecord | null;
  chatMessages: ChatMessageRecord[];
}> {
  const bundle = await getProjectBundle(userId, projectId);

  if (!bundle) {
    return { bundle: null, conversation: null, chatMessages: [] };
  }

  if (!databaseEnabled() || !db) {
    const conversation = await getOrCreateProjectChatConversation(userId, projectId);
    const chatMessages = conversation ? await listChatMessages(userId, conversation.id) : [];
    return { bundle, conversation, chatMessages };
  }

  const database = db;
  await ensureDatabase();

  const [conversationRow, chatMessageRows] = await database.batch([
    database.query.chatConversations.findFirst({
      where: and(
        eq(schema.chatConversations.projectId, projectId),
        eq(schema.chatConversations.userId, userId),
        eq(schema.chatConversations.mode, "project_campaign")
      ),
      orderBy: [desc(schema.chatConversations.updatedAt)],
    }),
    database.query.chatMessages.findMany({
      where: sql`${schema.chatMessages.conversationId} IN (${
        database
          .select({ id: schema.chatConversations.id })
          .from(schema.chatConversations)
          .where(
            and(
              eq(schema.chatConversations.projectId, projectId),
              eq(schema.chatConversations.userId, userId),
              eq(schema.chatConversations.mode, "project_campaign")
            )
          )
      })`,
      orderBy: [asc(schema.chatMessages.createdAt)],
    }),
  ]);

  let conversation: ChatConversationRecord | null = null;
  let chatMessages: ChatMessageRecord[] = [];

  if (conversationRow) {
    conversation = mapChatConversation(conversationRow);
    chatMessages = chatMessageRows.map(mapChatMessage);
  } else {
    conversation = await getOrCreateProjectChatConversation(userId, projectId);
  }

  return { bundle, conversation, chatMessages };
}

export async function createProject(
  userId: string,
  input: Pick<ProjectRecord, "title" | "productName" | "offer" | "cta" | "targetAudience" | "brandVoice" | "platformTarget" | "language" | "script"> & { kind?: ProjectKind; metadata?: unknown },
) {
  const kind = input.kind ?? "campaign_ad";
  const metadata = input.metadata ?? null;

  if (!databaseEnabled() || !db) {
    const createdAt = now();
    const project: ProjectRecord = {
      id: randomUUID(),
      userId,
      status: "draft",
      kind,
      title: input.title,
      productName: input.productName,
      offer: input.offer,
      cta: input.cta,
      targetAudience: input.targetAudience,
      brandVoice: input.brandVoice,
      platformTarget: input.platformTarget,
      language: input.language,
      script: input.script,
      metadata,
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
    kind,
    title: input.title,
    productName: input.productName,
    offer: input.offer,
    cta: input.cta,
    targetAudience: input.targetAudience,
    brandVoice: input.brandVoice,
    platformTarget: input.platformTarget,
    language: input.language,
    script: input.script,
    metadata,
    reviewNotes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await addAuditEvent(userId, id, "project.created", input);
  revalidateUserData(userId);
  const project = await db.query.projects.findFirst({ where: eq(schema.projects.id, id) });
  return mapProject(project!);
}
