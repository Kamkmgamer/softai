import Link from "next/link";
import { Folder, Film, Wallet, Sparkles } from "lucide-react";
import { PageHeader, ButtonLink, StatusBadge, EmptyState } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { getDashboardStats, listProjects } from "@/lib/store";
import { formatCredits, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getAppSession();
  const stats = await getDashboardStats(session.userId);
  const projects = await listProjects(session.userId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        action={
          <ButtonLink href="/projects/new">
            New project
          </ButtonLink>
        }
      />

      {/* Inline stats bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{stats.activeProjects}</strong> active projects
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{stats.completedVideos}</strong> completed videos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] text-text-secondary">
            <strong className="font-medium text-text">{formatCredits(stats.creditBalance)}</strong> credits available
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[0.9375rem] font-semibold text-text">Recent projects</h2>
        
        {projects.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No projects yet"
            description="Create your first ad campaign project to get started."
            action={<ButtonLink href="/projects/new">New project</ButtonLink>}
          />
        ) : (
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
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
                    Updated {formatDate(project.updatedAt)}
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
