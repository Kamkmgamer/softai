import { DashboardFeatureBrowser } from "@/components/dashboard-feature-browser";
import { DEFAULT_LOCALE, isLocale, localizePath } from "@/lib/i18n";

export default async function DashboardPage({
  params,
}: {
  params?: Promise<{ lang?: string }>;
}) {
  const routeParams = params ? await params : null;
  const locale = isLocale(routeParams?.lang) ? routeParams.lang : DEFAULT_LOCALE;

  return (
    <DashboardFeatureBrowser
      newProjectHref={localizePath("/projects/new", locale)}
    />
  );
}
