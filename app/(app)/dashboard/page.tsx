import Link from "next/link";
import { Folder, Film, Wallet, Sparkles } from "lucide-react";
import { PageHeader, ButtonLink, StatusBadge, EmptyState } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, isLocale, localizePath } from "@/lib/i18n";
import { getDashboardPageData } from "@/lib/store";
import { formatCredits, formatDate } from "@/lib/utils";

export default async function DashboardPage({
  params,
}: {
  params?: Promise<{ lang?: string }>;
}) {
  const routeParams = params ? await params : null;
  const locale = isLocale(routeParams?.lang) ? routeParams.lang : DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const session = await getAppSession();

  const { projects, stats } = await getDashboardPageData(session.userId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={dictionary.app.dashboard}
        action={
          <ButtonLink href={localizePath("/projects/new", locale)}>
            {dictionary.app.newProject}
          </ButtonLink>
        }
      />

      {/* Inline stats bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{stats.activeProjects}</strong> {dictionary.dashboard.activeProjects}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{stats.completedVideos}</strong> {dictionary.dashboard.completedVideos}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{formatCredits(stats.creditBalance, locale)}</strong> {dictionary.dashboard.creditsAvailable}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[0.9375rem] font-semibold text-text">{dictionary.dashboard.recentProjects}</h2>
        
        {projects.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={dictionary.dashboard.noProjects}
            description={dictionary.dashboard.noProjectsDescription}
            action={<ButtonLink href={localizePath("/projects/new", locale)}>{dictionary.app.newProject}</ButtonLink>}
          />
        ) : (
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={localizePath(`/projects/${project.id}`, locale)}
                className="group flex flex-col gap-3 p-4 transition-colors hover:bg-surface-raised sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-text group-hover:text-accent-hover transition-colors">
                      {project.title}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    {project.productName} · {project.offer}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-tertiary">
                    {dictionary.dashboard.updated} {formatDate(project.updatedAt, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
