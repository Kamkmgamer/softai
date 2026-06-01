import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, databaseEnabled, ensureDatabase } from "@/lib/db";
import type { BrandKitRecord } from "@/lib/types";

function now() {
  return new Date().toISOString();
}

export async function getBrandKits(userId: string): Promise<BrandKitRecord[]> {
  if (!databaseEnabled() || !db) {
    return [];
  }
  await ensureDatabase();
  const rows = await db.query.brandKits.findMany({
    where: eq(schema.brandKits.userId, userId),
    orderBy: (table, { desc }) => [desc(table.updatedAt)],
  });
  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    name: row.name,
    logoUrl: row.logoUrl,
    primaryColor: row.primaryColor,
    secondaryColor: row.secondaryColor,
    fonts: row.fonts as { heading?: string; body?: string } | null,
    toneOfVoice: row.toneOfVoice,
    createdAt: row.createdAt?.toISOString() ?? now(),
    updatedAt: row.updatedAt?.toISOString() ?? now(),
  }));
}

export async function getActiveBrandKit(userId: string): Promise<BrandKitRecord | null> {
  const kits = await getBrandKits(userId);
  return kits[0] ?? null;
}

export async function upsertBrandKit(
  userId: string,
  input: {
    id?: string;
    name: string;
    logoUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    fonts?: { heading?: string; body?: string } | null;
    toneOfVoice?: string | null;
  },
): Promise<BrandKitRecord> {
  if (!databaseEnabled() || !db) {
    const record: BrandKitRecord = {
      id: input.id ?? randomUUID(),
      userId,
      name: input.name,
      logoUrl: input.logoUrl ?? null,
      primaryColor: input.primaryColor ?? null,
      secondaryColor: input.secondaryColor ?? null,
      fonts: input.fonts ?? null,
      toneOfVoice: input.toneOfVoice ?? null,
      createdAt: now(),
      updatedAt: now(),
    };
    return record;
  }
  await ensureDatabase();

  if (input.id) {
    await db
      .update(schema.brandKits)
      .set({
        name: input.name,
        logoUrl: input.logoUrl ?? null,
        primaryColor: input.primaryColor ?? null,
        secondaryColor: input.secondaryColor ?? null,
        fonts: input.fonts ?? null,
        toneOfVoice: input.toneOfVoice ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.brandKits.id, input.id), eq(schema.brandKits.userId, userId)));
  } else {
    const id = randomUUID();
    await db.insert(schema.brandKits).values({
      id,
      userId,
      name: input.name,
      logoUrl: input.logoUrl ?? null,
      primaryColor: input.primaryColor ?? null,
      secondaryColor: input.secondaryColor ?? null,
      fonts: input.fonts ?? null,
      toneOfVoice: input.toneOfVoice ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const kits = await getBrandKits(userId);
  return kits[0]!;
}

export async function deleteBrandKit(userId: string, kitId: string): Promise<void> {
  if (!databaseEnabled() || !db) {
    return;
  }
  await ensureDatabase();
  await db.delete(schema.brandKits).where(and(eq(schema.brandKits.id, kitId), eq(schema.brandKits.userId, userId)));
}
