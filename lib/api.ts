import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { getAppSession } from "@/lib/auth";
import { findUserByClerkId, upsertUser } from "@/lib/store";

export async function requireAppUser() {
  const session = await getAppSession();
  const existing =
    (await findUserByClerkId(session.clerkUserId)) ??
    (await upsertUser({
      clerkUserId: session.clerkUserId,
      email: session.email,
      name: session.name,
    }));

  if (existing.bannedAt) {
    throw new Error("This account has been banned.");
  }

  return existing;
}

export async function requireAdminUser() {
  const session = await getAppSession();
  const user = await requireAppUser();

  if (!session.isAdmin) {
    throw new Error("Admin access required.");
  }

  return user;
}

export async function readJson<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}

export function apiSuccess(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function apiError(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Unknown error";
  const responseStatus = message === "Authentication required." ? 401 : status;
  return NextResponse.json({ error: message }, { status: responseStatus });
}
