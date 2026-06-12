import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { AssetType, AvatarPolicyState, AvatarRecord, AvatarSource, BrandAssetRecord } from "@/lib/types";
import { getState } from "./memory";
import { addAuditEvent, mapAvatar, now, revalidateProjectData } from "./helpers";

export async function addBrandAsset(userId: string, projectId: string, input: { type: AssetType; name: string; url: string }) {
  if (!databaseEnabled() || !db) {
    const record: BrandAssetRecord = {
      id: randomUUID(),
      projectId,
      userId,
      type: input.type,
      name: input.name,
      url: input.url,
      createdAt: now(),
    };
    getState().brandAssets.push(record);
    await addAuditEvent(userId, projectId, "asset.added", input);
    return record;
  }
  await ensureDatabase();
  const id = randomUUID();
  await db.insert(schema.brandAssets).values({
    id,
    projectId,
    userId,
    type: input.type,
    name: input.name,
    url: input.url,
    createdAt: new Date(),
  });
  await addAuditEvent(userId, projectId, "asset.added", input);
  revalidateProjectData(userId, projectId);
  return {
    id,
    projectId,
    userId,
    type: input.type,
    name: input.name,
    url: input.url,
    createdAt: now(),
  };
}

export async function saveAvatar(
  userId: string,
  projectId: string,
  input: { sourceType: AvatarSource; imageUrl: string | null; prompt: string | null; policyState: AvatarPolicyState; attested: boolean },
) {
  if (!databaseEnabled() || !db) {
    const state = getState();
    const existing = state.avatars.find((entry) => entry.projectId === projectId);
    if (existing) {
      Object.assign(existing, input);
      return existing;
    }
    const record: AvatarRecord = { id: randomUUID(), projectId, userId, ...input, createdAt: now() };
    state.avatars.push(record);
    await addAuditEvent(userId, projectId, "avatar.saved", input);
    return record;
  }
  await ensureDatabase();
  const existing = await db.query.avatars.findFirst({ where: eq(schema.avatars.projectId, projectId) });
  if (existing) {
    await db.update(schema.avatars).set(input).where(eq(schema.avatars.id, existing.id));
    await addAuditEvent(userId, projectId, "avatar.saved", input);
    revalidateProjectData(userId, projectId);
    return { ...mapAvatar(existing), ...input };
  }
  const id = randomUUID();
  await db.insert(schema.avatars).values({
    id,
    projectId,
    userId,
    sourceType: input.sourceType,
    imageUrl: input.imageUrl,
    prompt: input.prompt,
    policyState: input.policyState,
    attested: input.attested,
    createdAt: new Date(),
  });
  await addAuditEvent(userId, projectId, "avatar.saved", input);
  revalidateProjectData(userId, projectId);
  return { id, projectId, userId, ...input, createdAt: now() };
}
