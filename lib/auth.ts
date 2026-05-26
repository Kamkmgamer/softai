import { getEnv } from "@/lib/env";

export type AppSession = {
  userId: string;
  clerkUserId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isDemo: boolean;
};

const demoSession: AppSession = {
  userId: "user_demo",
  clerkUserId: "demo_clerk_user",
  email: "demo@softai.local",
  name: "Demo User",
  isAdmin: true,
  isDemo: true,
};

export async function getAppSession(): Promise<AppSession> {
  const env = getEnv();

  if (!env.clerkPublishableKey || !env.clerkSecretKey) {
    return demoSession;
  }

  try {
    const clerk = await import("@clerk/nextjs/server");
    const auth = await clerk.auth();

    if (!auth.userId) {
      return demoSession;
    }

    const client = await clerk.clerkClient();
    const user = await client.users.getUser(auth.userId);
    const email = user.emailAddresses[0]?.emailAddress ?? "unknown@softai.app";

    return {
      userId: auth.userId,
      clerkUserId: auth.userId,
      email,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "SoftAI User",
      isAdmin: env.adminEmails.includes(email.toLowerCase()),
      isDemo: false,
    };
  } catch {
    return demoSession;
  }
}
