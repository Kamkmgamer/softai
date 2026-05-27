import DashboardPage from "@/app/(app)/dashboard/page";

export default function LocalizedDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <DashboardPage params={params} />;
}
