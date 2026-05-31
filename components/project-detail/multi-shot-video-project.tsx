import Image from "next/image";
import Link from "next/link";
import { Clock3, Layers3, Play, Volume2 } from "lucide-react";
import { ProjectActions } from "@/components/project-actions";
import { StatusBadge } from "@/components/ui";
import { VideoPlayer } from "@/components/video-player";
import { mediaAssets } from "@/lib/features";
import type { ProjectBundle } from "@/lib/types";

type Props = {
  projectId: string;
  bundle: ProjectBundle;
};

type MultiShotMetadata = {
  mode?: "auto" | "custom";
  aspectRatio?: string;
  resolution?: string;
  duration?: string;
  audioOn?: boolean;
  firstFrameUrl?: string | null;
};

function getMultiShotMetadata(value: unknown): MultiShotMetadata {
  if (!value || typeof value !== "object") return {};
  return value as MultiShotMetadata;
}

export function MultiShotVideoProject({ projectId, bundle }: Props) {
  const metadata = getMultiShotMetadata(bundle.project.metadata);
  const storyboardReady = Boolean(
    bundle.storyboard && bundle.scenes.length > 0,
  );
  const imagesReady =
    storyboardReady && bundle.scenes.every((scene) => scene.imageUrl);
  const finalVideo = bundle.outputs.find(
    (output) => output.type === "final_video",
  );
  const firstFrameUrl =
    metadata.firstFrameUrl ??
    bundle.assets.find((asset) => asset.name === "First frame reference")
      ?.url ??
    null;
  const posterUrl =
    bundle.scenes.find((scene) => scene.imageUrl)?.imageUrl ??
    firstFrameUrl ??
    mediaAssets.socialShoot;
  const totalDuration = bundle.scenes.reduce(
    (total, scene) => total + scene.durationSeconds,
    0,
  );

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] bg-bg lg:min-h-dvh lg:grid-cols-[464px_1fr]">
      <aside className="flex min-h-0 flex-col border-border bg-surface px-5 py-6 lg:border-r lg:px-4 lg:py-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="text-sm text-text-secondary">
            <Link href="/dashboard" className="hover:text-text transition-colors">
              Apps
            </Link>{" "}
            <span className="text-text-tertiary">/</span>{" "}
            <strong className="font-semibold text-text">
              Multi-Shot Video
            </strong>
          </div>
          <StatusBadge status={bundle.project.status} />
        </div>

        <div className="mt-5 space-y-2 px-1">
          <p className="text-[13px] font-medium text-text">Your prompt</p>
          <div className="flex min-h-65 flex-col rounded-xl border border-border bg-bg-subtle p-3">
            <p className="flex-1 whitespace-pre-wrap text-[15px] leading-relaxed text-text-secondary">
              {bundle.project.script}
            </p>
          </div>
        </div>

        <div className="thin-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto px-1 pr-2">
          <BriefRow
            label="Mode"
            value={metadata.mode === "custom" ? "Custom shots" : "Auto"}
          />
          <BriefRow label="Aspect" value={metadata.aspectRatio ?? "16:9"} />
          <BriefRow label="Resolution" value={metadata.resolution ?? "720p"} />
          <BriefRow
            label="Duration"
            value={metadata.duration ?? `${totalDuration || 10}s`}
          />
          {bundle.storyboard ? (
            <>
              <BriefRow label="Headline" value={bundle.storyboard.headline} />
              <BriefRow label="Hook" value={bundle.storyboard.hook} />
            </>
          ) : null}
          {firstFrameUrl ? (
            <div className="overflow-hidden rounded-xl border border-border bg-bg">
              <Image
                src={firstFrameUrl}
                alt="First frame reference"
                width={640}
                height={360}
                className="h-32 w-full object-cover"
              />
              <p className="px-3 py-2 text-xs font-medium text-text-secondary">
                First frame reference
              </p>
            </div>
          ) : null}
        </div>

        <div className="-mx-4 mt-4 border-t border-border bg-surface px-4 pt-3">
          <div className="mb-3 flex flex-wrap justify-end gap-2 text-xs font-semibold text-text-secondary">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
              <Layers3 className="h-3.5 w-3.5" />
              {bundle.scenes.length || 3} shots
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {metadata.duration ?? `${totalDuration || 10}s`}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
              <Volume2 className="h-3.5 w-3.5" />
              {metadata.audioOn ? "On" : "Off"}
            </span>
          </div>
          <ProjectActions
            projectId={projectId}
            canRenderImages={storyboardReady}
            canRenderVideo={imagesReady}
            mode="multi-shot"
          />
        </div>
      </aside>

      <section className="relative flex min-h-155 items-center justify-center px-5 py-12 lg:px-10">
        <div className="w-full max-w-245 space-y-6 text-center">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tighter text-text sm:text-[32px]">
              {bundle.project.title}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {finalVideo
                ? "Your generated video is ready."
                : "Generate the connected shots as one video."}
            </p>
          </div>

          <div className="mx-auto overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-lg)">
            <div className="relative aspect-video bg-bg-subtle">
              {finalVideo?.url ? (
                <VideoPlayer
                  src={`/api/projects/${projectId}/outputs/${finalVideo.id}/media`}
                  poster={posterUrl}
                />
              ) : (
                <>
                  <Image
                    src={posterUrl}
                    alt="Generated video preview"
                    fill
                    sizes="(min-width: 1024px) 980px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-text/25 text-text backdrop-blur">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mx-auto flex max-w-190 gap-2 overflow-hidden">
            {(bundle.scenes.length
              ? bundle.scenes
              : [
                  { id: "empty-1", title: "Shot 1", imageUrl: null },
                  { id: "empty-2", title: "Shot 2", imageUrl: null },
                  { id: "empty-3", title: "Shot 3", imageUrl: null },
                ]
            ).map((scene, index) => (
              <div
                key={scene.id}
                className="relative h-20 flex-1 overflow-hidden rounded-lg border border-border bg-surface"
              >
                {scene.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold text-text-tertiary">
                    Shot {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg px-3 py-2.5 ring-1 ring-border">
      <p className="text-xs font-medium text-text-tertiary">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-text">
        {value}
      </p>
    </div>
  );
}
