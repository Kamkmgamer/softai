import { redirect } from "next/navigation";
import { FolderArchive, Download } from "lucide-react";
import { getAppSession } from "@/lib/auth";
import { listProjects } from "@/lib/store";
import { PageHeader, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function LibraryPage() {
  const session = await getAppSession();
  if (!session) redirect("/sign-in");

  const projects = await listProjects(session.userId);
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description="Your finalized campaigns and rendered exports."
      />

      <div className="space-y-4">
        {completedProjects.length === 0 ? (
          <EmptyState
            icon={FolderArchive}
            title="Your library is empty"
            description="When your video campaigns finish rendering, they will appear here for download."
          />
        ) : (
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
            {completedProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 transition-colors hover:bg-surface-raised">
                <div>
                  <h3 className="text-sm font-medium text-text">{project.title}</h3>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {project.productName} · Completed {formatDate(project.updatedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/projects/${project.id}`}
                    className="btn-secondary btn-sm"
                  >
                    View
                  </a>
                  <button type="button" className="btn-primary btn-sm px-2">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download all</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
