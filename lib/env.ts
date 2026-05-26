const requiredEnvNames = [
  "OPENROUTER_API_KEY",
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "UPLOADTHING_TOKEN",
  "POLAR_ACCESS_TOKEN",
  "POLAR_WEBHOOK_SECRET",
] as const;

export function getEnv() {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    databaseUrl: process.env.DATABASE_URL,
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    uploadThingToken: process.env.UPLOADTHING_TOKEN,
    polarAccessToken: process.env.POLAR_ACCESS_TOKEN,
    polarWebhookSecret: process.env.POLAR_WEBHOOK_SECRET,
    polarOrganizationToken: process.env.POLAR_ORGANIZATION_TOKEN,
    adminEmails: (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  };
}

export function getMissingRequiredEnv() {
  return requiredEnvNames.filter((name) => !process.env[name]);
}
