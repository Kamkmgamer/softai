import { getAppSession } from "@/lib/auth";
import { getRequestLocale } from "@/lib/server-locale";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { hasActiveSubscription } from "@/lib/store";
import { redirect } from "next/navigation";
import { localizePath } from "@/lib/i18n";

export default async function OnboardingPage() {
  const session = await getAppSession();
  const locale = await getRequestLocale();
  const hasSub = await hasActiveSubscription(session.userId);

  if (hasSub) {
    redirect(localizePath("/dashboard", locale));
  }

  return <OnboardingFlow />;
}
