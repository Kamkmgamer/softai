import { redirect } from "next/navigation";
import { DashboardFeatureBrowser } from "@/components/dashboard-feature-browser";
import { getAppSession } from "@/lib/auth";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getBillingSummary, hasActiveSubscription } from "@/lib/store";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const session = await getAppSession();
  const locale = await getRequestLocale();
  const params = await searchParams;

  const hasSub = await hasActiveSubscription(session.userId);
  if (!hasSub) {
    redirect(localizePath("/onboarding", locale));
  }

  const billingSummary = await getBillingSummary(session.userId);

  return (
    <DashboardFeatureBrowser
      billingSummary={billingSummary}
      initialQuery={params.q ?? ""}
    />
  );
}
