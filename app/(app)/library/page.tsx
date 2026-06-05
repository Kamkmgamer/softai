import { redirect } from "next/navigation";
import { FolderArchive } from "lucide-react";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { listProjects } from "@/lib/store";
import { PageHeader, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { LibraryDownloadButton } from "@/components/library-download-button";

export default async function LibraryPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  const projects = await listProjects(session.userId);
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title={dictionary.library.title}
          description={dictionary.library.description}
          backButton
        />

        {completedProjects.length === 0 ? (
          <EmptyState
            icon={FolderArchive}
            title={dictionary.library.emptyTitle}
            description={dictionary.library.emptyDescription}
          />
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {completedProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-raised">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-text">{project.title}</h3>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {project.productName} · {dictionary.library.completed} {formatDate(project.updatedAt, locale)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={localizePath(`/projects/${project.id}`, locale)}
                    className="btn btn-secondary btn-sm"
                  >
                    {dictionary.library.view}
                  </a>
                  <LibraryDownloadButton
                    projectId={project.id}
                    label={dictionary.library.downloadAll}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
