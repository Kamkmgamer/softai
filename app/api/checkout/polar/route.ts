import { Checkout } from "@polar-sh/nextjs";
import { getEnv } from "@/lib/env";

const env = getEnv();

export const GET = Checkout({
  accessToken: env.polarAccessToken!,
  successUrl: `${env.appUrl}/dashboard`,
  returnUrl: `${env.appUrl}/billing`,
  server: env.polarServer,
});
