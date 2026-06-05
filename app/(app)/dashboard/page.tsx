import { redirect } from "next/navigation";
import { DashboardFeatureBrowser } from "@/components/dashboard-feature-browser";
import { getAppSession } from "@/lib/auth";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getBillingSummary, hasActiveSubscription } from "@/lib/store";

export default async function DashboardPage() {
  const session = await getAppSession();
  const locale = await getRequestLocale();

  const hasSub = await hasActiveSubscription(session.userId);
  if (!hasSub) {
    redirect(localizePath("/onboarding", locale));
  }

  const billingSummary = await getBillingSummary(session.userId);

  return <DashboardFeatureBrowser billingSummary={billingSummary} />;
}
