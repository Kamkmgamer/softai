import { getEnv } from "@/lib/env";
import { resolveCurrentBillingPlan } from "@/lib/billing";
import { upsertUser, upsertUserSubscription } from "@/lib/store";

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

export async function getAppSession(): Promise<AppSession> {
  const env = getEnv();

  if (!env.clerkPublishableKey || !env.clerkSecretKey) {
    return getDemoSession();
  }

  try {
    const clerk = await import("@clerk/nextjs/server");
    const auth = await clerk.auth();

    if (!auth.userId) {
      throw new Error("Authentication required.");
    }

    const client = await clerk.clerkClient();
    const user = await client.users.getUser(auth.userId);
    const email = user.emailAddresses[0]?.emailAddress ?? "unknown@softai.app";
    const appUser = await upsertUser({
      clerkUserId: auth.userId,
      email,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "SoftAI User",
    });
    const billingPlan = resolveCurrentBillingPlan(auth.has);

    if (billingPlan) {
      await upsertUserSubscription(appUser.id, {
        clerkPayerId: auth.userId,
        plan: billingPlan.slug,
        status: "active",
        monthlyCredits: billingPlan.monthlyCredits,
      });
    }

    return {
      userId: appUser.id,
      clerkUserId: auth.userId,
      email,
      name: appUser.name,
      isAdmin: env.adminEmails.includes(email.toLowerCase()),
      isDemo: false,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required.") {
      throw error;
    }

    throw new Error("Unable to resolve authenticated user.");
  }
}
