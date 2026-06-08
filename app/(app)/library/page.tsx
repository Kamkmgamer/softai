import { redirect } from "next/navigation";
import {
  Clapperboard,
  FolderArchive,
  Image as ImageIcon,
  Megaphone,
  Palette,
  Pen,
  Video,
} from "lucide-react";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { listProjects } from "@/lib/store";
import { PageHeader, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { LibraryDownloadButton } from "@/components/library-download-button";

const kindIcons: Record<string, typeof Clapperboard> = {
  multi_shot_video: Video,
  image_to_video: Clapperboard,
  text_to_image: ImageIcon,
  image_edit: Pen,
  mockup: Palette,
  create_ad: Megaphone,
};

function KindIcon({ kind }: { kind: string }) {
  const Icon = kindIcons[kind] ?? FolderArchive;
  return <Icon className="h-5 w-5" />;
}

export default async function LibraryPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  const projects = await listProjects(session.userId);
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {completedProjects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-border-strong hover:shadow-(--shadow-md)"
              >
                <div className="flex aspect-video items-center justify-center bg-bg-subtle text-text-tertiary">
                  <KindIcon kind={project.kind} />
                </div>
                <div className="space-y-2 px-3.5 py-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                      {project.productName}
                    </p>
                  </div>
                  <p className="text-[11px] text-text-tertiary">
                    {dictionary.library.completed} {formatDate(project.updatedAt, locale)}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={localizePath(`/projects/${project.id}`, locale)}
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      {dictionary.library.view}
                    </a>
                    <LibraryDownloadButton
                      projectId={project.id}
                      label={dictionary.library.downloadAll}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
