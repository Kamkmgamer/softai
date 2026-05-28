import { cache } from "react";
import { getEnv } from "@/lib/env";
import { findUserByClerkId, upsertUser } from "@/lib/store";

export type AppSession = {
  userId: string;
  clerkUserId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isDemo: boolean;
};

const demoUser = {
  clerkUserId: "demo_clerk_user",
  email: "demo@softai.local",
  name: "Demo User",
};

function getClaimString(claims: unknown, key: string) {
  if (!claims || typeof claims !== "object" || !(key in claims)) return null;
  const value = (claims as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value : null;
}

function getUserIdentityFromClaims(claims: unknown) {
  const claimName =
    getClaimString(claims, "name") ??
    [getClaimString(claims, "first_name"), getClaimString(claims, "last_name")]
      .filter(Boolean)
      .join(" ");

  return {
    email: getClaimString(claims, "email") ?? "unknown@softai.app",
    name: claimName || "SoftAI User",
  };
}

function getUserIdentityFromClerkUser(user: Awaited<ReturnType<typeof import("@clerk/nextjs/server").currentUser>> | null) {
  if (!user) return null;

  const name = user.fullName ?? [user.firstName, user.lastName].filter(Boolean).join(" ");

  return {
    email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "unknown@softai.app",
    name: name || "SoftAI User",
  };
}

async function getDemoSession(): Promise<AppSession> {
  const user = await upsertUser(demoUser);

  return {
    userId: user.id,
    clerkUserId: demoUser.clerkUserId,
    email: demoUser.email,
    name: user.name,
    isAdmin: true,
    isDemo: true,
  };
}

export const getAppSession = cache(async function getAppSession(): Promise<AppSession> {
  const env = getEnv();

  if (!env.clerkPublishableKey || !env.clerkSecretKey) {
    return getDemoSession();
  }

  const clerk = await import("@clerk/nextjs/server");
  const auth = await clerk.auth();

  if (!auth.userId || auth.sessionStatus === "pending" || auth.isAuthenticated === false) {
    throw new Error("Authentication required.");
  }

  const existingUser = await findUserByClerkId(auth.userId);
  const appUser = existingUser ?? await (async () => {
    const clerkUser = await clerk.currentUser().catch(() => null);
    const identity = getUserIdentityFromClerkUser(clerkUser) ?? getUserIdentityFromClaims(auth.sessionClaims);

    return upsertUser({
      clerkUserId: auth.userId,
      email: identity.email,
      name: identity.name,
    });
  })();
  const email = appUser.email;

  return {
    userId: appUser.id,
    clerkUserId: auth.userId,
    email,
    name: appUser.name,
    isAdmin: env.adminEmails.includes(email.toLowerCase()),
    isDemo: false,
  };
});
