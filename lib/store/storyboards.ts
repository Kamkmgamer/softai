import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { SceneRecord } from "@/lib/types";
import { getState } from "./memory";
import {
  addAuditEvent,
  mapScene,
  mapStoryboard,
  memoryUpdateProjectStatus,
  now,
  revalidateProjectData,
  revalidateStoreTag,
  cacheTags,
  updateProjectStatus,
} from "./helpers";

export async function saveStoryboard(
  userId: string,
  projectId: string,
  input: { headline: string; hook: string; cta: string; scenes: Array<Pick<SceneRecord, "title" | "narration" | "visualDirection" | "overlayText" | "durationSeconds">> },
) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.storyboards.find((entry) => entry.projectId === projectId);
    const timestamp = now();
    const storyboardId = existing?.id ?? randomUUID();
    if (existing) {
      existing.headline = input.headline;
      existing.hook = input.hook;
      existing.cta = input.cta;
      existing.updatedAt = timestamp;
    } else {
      state.storyboards.push({ id: storyboardId, projectId, headline: input.headline, hook: input.hook, cta: input.cta, status: "draft", createdAt: timestamp, updatedAt: timestamp });
    }
    state.scenes = state.scenes.filter((scene) => scene.projectId !== projectId);
    input.scenes.forEach((scene, index) => {
      state.scenes.push({ id: randomUUID(), storyboardId, projectId, order: index + 1, ...scene, imageUrl: null });
    });
    memoryUpdateProjectStatus(projectId, "review_needed");
    await addAuditEvent(userId, projectId, "storyboard.saved", input);
    return;
  }
  await ensureDatabase();
  const existing = await db.query.storyboards.findFirst({ where: eq(schema.storyboards.projectId, projectId) });
  const storyboardId = existing?.id ?? randomUUID();
  if (existing) {
    await db.update(schema.storyboards).set({
      headline: input.headline,
      hook: input.hook,
      cta: input.cta,
      updatedAt: new Date(),
    }).where(eq(schema.storyboards.id, existing.id));
  } else {
    await db.insert(schema.storyboards).values({
      id: storyboardId,
      projectId,
      headline: input.headline,
      hook: input.hook,
      cta: input.cta,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await db.delete(schema.scenes).where(eq(schema.scenes.projectId, projectId));
  if (input.scenes.length > 0) {
    await db.insert(schema.scenes).values(
      input.scenes.map((scene, index) => ({
        id: randomUUID(),
        storyboardId,
        projectId,
        order: index + 1,
        title: scene.title,
        narration: scene.narration,
        visualDirection: scene.visualDirection,
        overlayText: scene.overlayText,
        durationSeconds: scene.durationSeconds,
        imageUrl: null,
      })),
    );
  }
  await updateProjectStatus(projectId, "review_needed");
  await addAuditEvent(userId, projectId, "storyboard.saved", input);
  revalidateProjectData(userId, projectId);
}

export async function approveStoryboard(userId: string, projectId: string) {
  if (!databaseEnabled() || !db) {
    const storyboard = getState().storyboards.find((entry) => entry.projectId === projectId);
    if (!storyboard) return null;
    storyboard.status = "approved";
    storyboard.updatedAt = now();
    memoryUpdateProjectStatus(projectId, "storyboard_ready");
    await addAuditEvent(userId, projectId, "storyboard.approved", {});
    return storyboard;
  }
  await ensureDatabase();
  const storyboard = await db.query.storyboards.findFirst({ where: eq(schema.storyboards.projectId, projectId) });
  if (!storyboard) return null;
  await db.update(schema.storyboards).set({ status: "approved", updatedAt: new Date() }).where(eq(schema.storyboards.id, storyboard.id));
  await updateProjectStatus(projectId, "storyboard_ready");
  await addAuditEvent(userId, projectId, "storyboard.approved", {});
  revalidateProjectData(userId, projectId);
  return { ...mapStoryboard(storyboard), status: "approved" };
}

export async function saveSceneImage(projectId: string, order: number, imageUrl: string) {
  if (!databaseEnabled() || !db) {
    const scene = getState().scenes.find((entry) => entry.projectId === projectId && entry.order === order);
    if (!scene) return null;
    scene.imageUrl = imageUrl;
    return scene;
  }
  await ensureDatabase();
  const scene = await db.query.scenes.findFirst({
    where: and(eq(schema.scenes.projectId, projectId), eq(schema.scenes.order, order)),
  });
  if (!scene) return null;
  await db.update(schema.scenes).set({ imageUrl }).where(eq(schema.scenes.id, scene.id));
  revalidateStoreTag(cacheTags.project(projectId));
  return { ...mapScene(scene), imageUrl };
}
