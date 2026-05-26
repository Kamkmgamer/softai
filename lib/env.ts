const requiredEnvNames = [
  "OPENROUTER_API_KEY",
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SIGNING_SECRET",
  "UPLOADTHING_TOKEN",
] as const;

export function getEnv() {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    openRouterWebhookSecret: process.env.OPENROUTER_WEBHOOK_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    clerkWebhookSigningSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    uploadThingToken: process.env.UPLOADTHING_TOKEN,
    adminEmails: (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  };
}

export function getMissingRequiredEnv() {
  return requiredEnvNames.filter((name) => !process.env[name]);
}
