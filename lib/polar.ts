import { Polar } from "@polar-sh/sdk";
import { getEnv } from "@/lib/env";

export function getPolarClient() {
  const env = getEnv();

  if (!env.polarAccessToken) {
    return null;
  }

  return new Polar({
    accessToken: env.polarAccessToken,
    server: "production",
  });
}
