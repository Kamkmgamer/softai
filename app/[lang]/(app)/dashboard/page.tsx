import DashboardPage from "@/app/(app)/dashboard/page";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default function LocalizedDashboardPage({ searchParams }: Props) {
  return <DashboardPage searchParams={searchParams} />;
}
