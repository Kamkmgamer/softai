import { CustomerPortal } from "@polar-sh/nextjs";
import { getAppSession } from "@/lib/auth";
import { getEnv } from "@/lib/env";
import { getUserSubscription } from "@/lib/store";

const env = getEnv();

export const GET = CustomerPortal({
  accessToken: env.polarAccessToken!,
  server: env.polarServer,
  getExternalCustomerId: async () => {
    const session = await getAppSession();
    const subscription = await getUserSubscription(session.userId);
    return subscription?.polarCustomerId ?? "";
  },
  returnUrl: `${env.appUrl}/billing`,
});
