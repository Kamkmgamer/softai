import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectActions } from "@/components/project-actions";
import { ProjectAssistantPanel } from "@/components/project-assistant-panel";
import { ProjectInputs } from "@/components/project-inputs";
import { EmptyState, StatusBadge } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getProjectPageData } from "@/lib/store";
import { ArrowUpRight, Clock3, Film, ImageIcon, Layers3, PenLine, Sparkles } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const [{ projectId }, locale, session] = await Promise.all([
    params,
    getRequestLocale(),
    getAppSession(),
  ]);

  const { bundle, conversation, chatMessages } = await getProjectPageData(session.userId, projectId);

  if (!bundle) {
    notFound();
  }

  const storyboardReady = Boolean(bundle.storyboard && bundle.scenes.length > 0);
  const imagesReady = storyboardReady && bundle.scenes.every((scene) => scene.imageUrl);
  const finalVideos = bundle.outputs.filter((output) => output.type === "final_video");
  const assetOutputs = bundle.outputs.filter((output) => output.type !== "final_video");
  const totalDuration = bundle.scenes.reduce((total, scene) => total + scene.durationSeconds, 0);

  return (
    <div className="relative left-1/2 w-[min(1480px,calc(100vw-2.5rem))] -translate-x-1/2 space-y-5 lg:w-[min(1480px,calc(100vw-18rem))]">
      <header className="rounded-[28px] border border-border bg-surface px-5 py-5 shadow-[var(--shadow-sm)] lg:px-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={bundle.project.status} />
              <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-medium capitalize text-text-secondary">{bundle.project.platformTarget}</span>
              <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-medium uppercase text-text-secondary">{bundle.project.language}</span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">Campaign studio</p>
            <h1 className="mt-1 max-w-4xl text-2xl font-semibold tracking-tight text-text text-balance">{bundle.project.title}</h1>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-[20px] bg-bg">
            <StudioStat icon={Layers3} label="Scenes" value={String(bundle.scenes.length)} />
            <StudioStat icon={Clock3} label="Runtime" value={totalDuration ? `${totalDuration}s` : "Pending"} />
            <StudioStat icon={Film} label="Renders" value={String(finalVideos.length)} />
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-5">
          <section className="rounded-[28px] border border-border bg-surface p-4 shadow-[var(--shadow-sm)] lg:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">Storyboard stage</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-text">Scene frames</h2>
              </div>
              <span className="text-[13px] text-text-secondary">{imagesReady ? "Images ready for video render" : "Build the visual sequence before rendering"}</span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {bundle.scenes.length === 0 ? (
                <div className="md:col-span-3">
                  <EmptyState title="No scenes yet" description="Generate a storyboard to see the campaign sequence here." />
                </div>
              ) : (
                bundle.scenes.map((scene) => (
                  <article key={scene.id} className="group min-w-0 overflow-hidden rounded-[22px] bg-bg shadow-[var(--shadow-sm)] ring-1 ring-border/80 transition-[box-shadow] duration-200 hover:shadow-[var(--shadow-md)]">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-surface-sunken">
                      {scene.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={scene.imageUrl} alt={scene.title} className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.025]" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,var(--surface-raised),var(--surface-sunken))] text-text-tertiary">
                          <ImageIcon className="h-7 w-7 opacity-60" />
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Awaiting image</span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[oklch(0.18_0.015_58_/_0.88)] via-[oklch(0.18_0.015_58_/_0.38)] to-transparent p-4 text-bg">
                        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-bg/75">
                          <span>Scene {scene.order}</span>
                          <span>{scene.durationSeconds}s</span>
                        </div>
                        <h3 className="mt-1 text-sm font-semibold leading-tight">{scene.title}</h3>
                        {scene.overlayText ? (
                          <p className="mt-2 line-clamp-2 rounded-full bg-bg/12 px-2.5 py-1 text-xs font-medium text-bg">
                            {scene.overlayText}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="space-y-1.5 px-3.5 py-3">
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-text-secondary">{scene.narration}</p>
                      <p className="line-clamp-2 text-xs leading-relaxed text-text-tertiary">{scene.visualDirection}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-surface p-4 shadow-[var(--shadow-sm)] lg:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">Delivery</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-text">Final outputs</h2>
              </div>
              <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs tabular-nums text-text-tertiary">{bundle.outputs.length}</span>
            </div>

            {bundle.outputs.length === 0 ? (
              <EmptyState title="No outputs" description="Render the video to see deliverables here." />
            ) : (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {finalVideos.map((output) => (
                  <OutputTile key={output.id} title={output.title} type="Final video" url={getRenderableOutputUrl(output.url)} video />
                ))}

                {assetOutputs.map((output) => (
                  <OutputTile key={output.id} title={output.title} type={output.type.replace("_", " ")} url={getRenderableOutputUrl(output.url)} />
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-[28px] border border-border bg-surface p-4 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">Pipeline</p>
                <h2 className="mt-1 text-base font-semibold text-text">Render actions</h2>
              </div>
              <Sparkles className="h-4 w-4 text-accent-text" />
            </div>
            <div className="space-y-2">
              <Link href={localizePath(`/projects/${projectId}/review`, locale)} className="btn btn-secondary w-full justify-start">
                <PenLine className="h-4 w-4" />
                Generate storyboard
              </Link>
              <ProjectActions projectId={projectId} canRenderImages={storyboardReady} canRenderVideo={imagesReady} />
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-surface p-4 shadow-[var(--shadow-sm)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">Studio notes</p>
                <h2 className="mt-1 text-base font-semibold text-text">Project brief</h2>
              </div>
              <Link href={localizePath(`/projects/${projectId}/review`, locale)} className="text-[13px] font-semibold text-accent-text hover:text-accent-hover">Edit</Link>
            </div>

            <div className="mt-4 space-y-3">
              <BriefItem label="Product" value={bundle.project.productName} />
              <BriefItem label="Offer" value={bundle.project.offer} />
              <BriefItem label="CTA" value={bundle.project.cta} />
              <BriefItem label="Audience" value={bundle.project.targetAudience} />
              <BriefItem label="Voice" value={bundle.project.brandVoice} />
              <BriefItem label="Assets" value={`${bundle.assets.length} uploaded`} />
            </div>

            <div className="mt-4 rounded-[20px] bg-bg px-4 py-3 ring-1 ring-border/80">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">Script seed</p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{bundle.project.script}</p>
            </div>
          </section>
        </aside>
      </div>

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
          <ProjectInputs projectId={projectId} />

          {conversation ? (
            <ProjectAssistantPanel
              key={conversation.id}
              conversationId={conversation.id}
              projectLanguage={bundle.project.language}
              initialMessages={chatMessages}
            />
          ) : null}
      </div>
    </div>
  );
}

function StudioStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-l border-border px-4 py-3 first:border-l-0 lg:px-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-text-tertiary ring-1 ring-border/80">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">{label}</p>
        <p className="text-sm font-semibold text-text">{value}</p>
      </div>
    </div>
  );
}

function BriefItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-bg px-4 py-3 ring-1 ring-border/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">{label}</p>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-text">{value}</p>
    </div>
  );
}

function OutputTile({
  title,
  type,
  url,
  video = false,
}: {
  title: string;
  type: string;
  url: string;
  video?: boolean;
}) {
  const canPreviewVideo = video && isBrowserVideoUrl(url);

  return (
    <div className="w-[220px] shrink-0 overflow-hidden rounded-[22px] bg-bg shadow-[var(--shadow-sm)] ring-1 ring-border/80">
      <div className="relative aspect-[4/5] bg-[oklch(0.18_0.015_58)]">
        {canPreviewVideo ? (
          <video src={url} controls preload="metadata" className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center text-bg/80">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg/10">
              <Film className="h-5 w-5" />
            </span>
            <p className="text-xs font-medium leading-relaxed">
              {video ? "Preview unavailable. Open the render in a new tab." : "Campaign asset"}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{title}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">{type}</p>
        </div>
        <a href={url || undefined} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm shrink-0 aria-disabled:pointer-events-none aria-disabled:opacity-50" aria-disabled={!url}>
          {video ? "Open" : "View"}
          {video ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
        </a>
      </div>
    </div>
  );
}

function isBrowserVideoUrl(url: string) {
  if (url.startsWith("data:")) return url.startsWith("data:video/");
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
  return true;
}

function getRenderableOutputUrl(url: string) {
  if (url.startsWith("data:") && url.length > 2_000) return "";
  return url;
}
