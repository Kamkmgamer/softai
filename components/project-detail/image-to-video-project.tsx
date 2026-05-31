import { ArrowRight, Clock3, Film, Gauge, Play } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { VideoPlayer } from "@/components/video-player";
import { mediaAssets } from "@/lib/features";
import type { ProjectBundle } from "@/lib/types";

type Props = {
  projectId: string;
  bundle: ProjectBundle;
};

type ImageToVideoMetadata = {
  mode?: "first_frame" | "first_last_frames";
  firstFrameUrl?: string;
  lastFrameUrl?: string | null;
  aspectRatio?: string;
  duration?: string;
  resolution?: string;
};

function getMetadata(value: unknown): ImageToVideoMetadata {
  if (!value || typeof value !== "object") return {};
  return value as ImageToVideoMetadata;
}

export function ImageToVideoProject({ projectId, bundle }: Props) {
  const metadata = getMetadata(bundle.project.metadata);
  const firstFrameUrl =
    metadata.firstFrameUrl ??
    bundle.assets.find((asset) => asset.name === "First frame reference")?.url ??
    bundle.scenes[0]?.imageUrl ??
    null;
  const lastFrameUrl =
    metadata.lastFrameUrl ??
    bundle.assets.find((asset) => asset.name === "Last frame reference")?.url ??
    bundle.scenes[1]?.imageUrl ??
    null;
  const finalVideo = bundle.outputs.find((output) => output.type === "final_video");
  const posterUrl = firstFrameUrl ?? mediaAssets.socialShoot;
  const hasLastFrame = Boolean(lastFrameUrl);

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] bg-bg lg:min-h-dvh lg:grid-cols-[464px_1fr]">
      <aside className="flex min-h-0 flex-col border-border bg-surface px-5 py-6 lg:border-r lg:px-4 lg:py-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="text-sm text-text-secondary">
            Apps <span className="text-text-tertiary">/</span>{" "}
            <strong className="font-semibold text-text">Image to Video</strong>
          </div>
          <StatusBadge status={bundle.project.status} />
        </div>

        <div className="mt-5 space-y-2 px-1">
          <p className="text-[13px] font-medium text-text">Motion prompt</p>
          <div className="flex min-h-44 flex-col rounded-xl border border-border bg-bg-subtle p-3">
            <p className="flex-1 whitespace-pre-wrap text-[15px] leading-relaxed text-text-secondary">
              {bundle.project.script}
            </p>
          </div>
        </div>

        <div className="thin-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto px-1 pr-2">
          <BriefRow
            label="Mode"
            value={hasLastFrame ? "First + last frames" : "First frame"}
          />
          <BriefRow label="Aspect" value={metadata.aspectRatio ?? "16:9"} />
          <BriefRow label="Duration" value={metadata.duration ?? "5s"} />
          <BriefRow label="Resolution" value={metadata.resolution ?? "720p"} />

          <FrameCard label="First frame reference" imageUrl={firstFrameUrl} />
          {hasLastFrame ? (
            <FrameCard label="Last frame reference" imageUrl={lastFrameUrl} />
          ) : null}
        </div>

        <div className="-mx-4 mt-4 border-t border-border bg-surface px-4 pt-3">
          <div className="mb-3 flex flex-wrap justify-end gap-2 text-xs font-semibold text-text-secondary">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
              <Film className="h-3.5 w-3.5" />
              {hasLastFrame ? "Interpolation" : "Animation"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {metadata.duration ?? "5s"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
              <Gauge className="h-3.5 w-3.5" />
              {metadata.resolution ?? "720p"}
            </span>
          </div>
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
                ? "Your frame-bound video is ready."
                : "Generation has been submitted. The video will appear here when ready."}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={posterUrl}
                    alt="Video preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-text/25 text-text backdrop-blur">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mx-auto grid max-w-190 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <Thumbnail label="First" imageUrl={firstFrameUrl} />
            <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-tertiary sm:flex">
              <ArrowRight className="h-4 w-4" />
            </div>
            <Thumbnail label={hasLastFrame ? "Last" : "Generated"} imageUrl={lastFrameUrl} />
          </div>
        </div>
      </section>
    </div>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg px-3 py-2.5 ring-1 ring-border">
      <p className="text-xs font-medium text-text-tertiary">{label}</p>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-text">
        {value}
      </p>
    </div>
  );
}

function FrameCard({ label, imageUrl }: { label: string; imageUrl: string | null }) {
  if (!imageUrl) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={label}
        className="h-32 w-full object-cover"
      />
      <p className="px-3 py-2 text-xs font-medium text-text-secondary">
        {label}
      </p>
    </div>
  );
}

function Thumbnail({ label, imageUrl }: { label: string; imageUrl: string | null }) {
  return (
    <div className="relative h-20 overflow-hidden rounded-lg border border-border bg-surface">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-xs font-semibold text-text-tertiary">
          {label}
        </div>
      )}
    </div>
  );
}
