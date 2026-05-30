import { DashboardFeatureBrowser } from "@/components/dashboard-feature-browser";
import { getAppSession } from "@/lib/auth";
import { getBillingSummary } from "@/lib/store";

export default async function DashboardPage() {
  const session = await getAppSession();
  const billingSummary = await getBillingSummary(session.userId);

  return <DashboardFeatureBrowser billingSummary={billingSummary} />;
}
