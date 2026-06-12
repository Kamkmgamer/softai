import { randomUUID } from "crypto";
import { and, asc, desc, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { ChatConversationRecord, ChatMessageRecord } from "@/lib/types";
import { getState } from "./memory";
import {
  addAuditEvent,
  getProjectTitle,
  mapChatConversation,
  mapChatMessage,
  now,
  projectBelongsToUser,
} from "./helpers";

export async function getOrCreateProjectChatConversation(userId: string, projectId: string) {
  const ownershipValid = await projectBelongsToUser(userId, projectId);
  if (!ownershipValid) return null;

  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.chatConversations.find((entry) => entry.userId === userId && entry.projectId === projectId && entry.mode === "project_campaign");
    if (existing) return existing;

    const timestamp = now();
    const conversation: ChatConversationRecord = {
      id: randomUUID(),
      userId,
      projectId,
      title: `${getState().projects.find((p) => p.id === projectId)?.title ?? projectId} assistant`,
      mode: "project_campaign",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    state.chatConversations.unshift(conversation);
    await addAuditEvent(userId, projectId, "chat.conversation.created", { conversationId: conversation.id });
    return conversation;
  }

  await ensureDatabase();
  const existing = await db.query.chatConversations.findFirst({
    where: and(eq(schema.chatConversations.userId, userId), eq(schema.chatConversations.projectId, projectId), eq(schema.chatConversations.mode, "project_campaign")),
    orderBy: [desc(schema.chatConversations.updatedAt)],
  });
  if (existing) return mapChatConversation(existing);

  const title = await getProjectTitle(userId, projectId);
  const id = randomUUID();
  await db.insert(schema.chatConversations).values({
    id,
    userId,
    projectId,
    title: `${title ?? projectId} assistant`,
    mode: "project_campaign",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoNothing({
    target: [schema.chatConversations.userId, schema.chatConversations.projectId, schema.chatConversations.mode],
  });

  const conversation = await db.query.chatConversations.findFirst({
    where: and(eq(schema.chatConversations.userId, userId), eq(schema.chatConversations.projectId, projectId), eq(schema.chatConversations.mode, "project_campaign")),
  });

  if (!conversation) {
    throw new Error("Failed to create project chat conversation.");
  }

  if (conversation.id === id) {
    await addAuditEvent(userId, projectId, "chat.conversation.created", { conversationId: id });
  }

  return mapChatConversation(conversation);
}

export async function getChatConversation(userId: string, conversationId: string) {
  if (!databaseEnabled() || !db) {
    return getState().chatConversations.find((entry) => entry.id === conversationId && entry.userId === userId) ?? null;
  }

  await ensureDatabase();
  const row = await db.query.chatConversations.findFirst({
    where: and(eq(schema.chatConversations.id, conversationId), eq(schema.chatConversations.userId, userId)),
  });
  return row ? mapChatConversation(row) : null;
}

export async function listChatMessages(userId: string, conversationId: string, options?: { skipOwnershipCheck?: boolean }) {
  if (!options?.skipOwnershipCheck) {
    const conversation = await getChatConversation(userId, conversationId);
    if (!conversation) return [];
  }

  if (!databaseEnabled() || !db) {
    return getState().chatMessages
      .filter((entry) => entry.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  await ensureDatabase();
  const rows = await db.query.chatMessages.findMany({
    where: eq(schema.chatMessages.conversationId, conversationId),
    orderBy: [asc(schema.chatMessages.createdAt)],
  });
  return rows.map(mapChatMessage);
}

export async function createChatMessage(
  userId: string,
  input: Pick<ChatMessageRecord, "conversationId" | "role" | "content"> & { metadata?: unknown },
) {
  const conversation = await getChatConversation(userId, input.conversationId);
  if (!conversation) return null;

  if (!databaseEnabled() || !db) {
    const timestamp = now();
    const message: ChatMessageRecord = {
      id: randomUUID(),
      conversationId: input.conversationId,
      userId,
      role: input.role,
      content: input.content,
      metadata: input.metadata ?? null,
      createdAt: timestamp,
    };
    getState().chatMessages.push(message);
    conversation.updatedAt = timestamp;
    return message;
  }

  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.chatMessages).values({
    id,
    conversationId: input.conversationId,
    userId,
    role: input.role,
    content: input.content,
    metadata: input.metadata ?? null,
    createdAt: new Date(),
  });
  await db.update(schema.chatConversations).set({ updatedAt: new Date() }).where(eq(schema.chatConversations.id, input.conversationId));
  return { id, conversationId: input.conversationId, userId, role: input.role, content: input.content, metadata: input.metadata ?? null, createdAt: now() };
}

export async function deleteChatMessage(userId: string, messageId: string) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const initialLength = state.chatMessages.length;
    state.chatMessages = state.chatMessages.filter((entry) => entry.id !== messageId || entry.userId !== userId);
    return state.chatMessages.length !== initialLength;
  }

  await ensureDatabase();
  const deleted = await db
    .delete(schema.chatMessages)
    .where(and(eq(schema.chatMessages.id, messageId), eq(schema.chatMessages.userId, userId)))
    .returning({ id: schema.chatMessages.id });

  return deleted.length > 0;
}
