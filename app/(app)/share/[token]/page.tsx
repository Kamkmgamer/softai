import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getShareOutputByToken, getThumbnailForProject } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { VideoPlayer } from "@/components/video-player";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  let session;
  try {
    session = await getAppSession();
  } catch {
    return notFound();
  }

  if (!session) {
    return notFound();
  }

  const result = await getShareOutputByToken(token);
  if (!result) {
    return notFound();
  }

  const { output, projectTitle } = result;
  const isVideo = output.type === "final_video";
  const viewUrl = `/api/share/${token}/media`;
  const downloadUrl = `/api/share/${token}/media?download=1`;
  const projectUrl = localizePath(`/projects/${output.projectId}`, locale);
  const poster = isVideo ? await getThumbnailForProject(output.projectId) : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-bg">
      <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-8 lg:px-10 lg:py-12">
        <div className="space-y-1">
          <h1 className="text-[22px] font-semibold tracking-tight text-text">
            {output.title}
          </h1>
          <p className="text-sm text-text-secondary">
            {dictionary.history.from} {projectTitle} · {formatDate(output.createdAt, locale)}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-lg)">
          {isVideo ? (
            <div className="relative aspect-video bg-bg-subtle">
              <VideoPlayer src={viewUrl} poster={poster ?? undefined} />
            </div>
          ) : (
            <div className="relative min-h-80 bg-bg-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewUrl}
                alt={output.title}
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={downloadUrl}
            className="btn btn-primary"
          >
            <Download className="h-4 w-4" />
            {isVideo ? dictionary.library.downloadVideo : dictionary.library.downloadImage}
          </a>
          <a
            href={projectUrl}
            className="btn btn-secondary"
          >
            View project
          </a>
        </div>
      </div>
    </div>
  );
}
