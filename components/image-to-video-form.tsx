"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Film, ImagePlus, LinkIcon } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { cn } from "@/lib/utils";

type FrameMode = "first_frame" | "first_last_frames";
type FrameSlot = "first" | "last";

const aspectRatios = ["16:9", "9:16", "1:1"];
const durations = ["5s", "10s", "15s"];
const resolutions = ["720p", "1080p"];

export function ImageToVideoForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<FrameMode>("first_frame");
  const [prompt, setPrompt] = useState("");
  const [firstFrameUrl, setFirstFrameUrl] = useState("");
  const [lastFrameUrl, setLastFrameUrl] = useState("");
  const [firstFrameName, setFirstFrameName] = useState<string | null>(null);
  const [lastFrameName, setLastFrameName] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("5s");
  const [resolution, setResolution] = useState("720p");
  const [error, setError] = useState<string | null>(null);

  const needsLastFrame = mode === "first_last_frames";
  const canSubmit =
    prompt.trim().length >= 10 &&
    isValidUrl(firstFrameUrl) &&
    (!needsLastFrame || isValidUrl(lastFrameUrl));

  async function onSubmit() {
    if (!canSubmit) return;
    setError(null);

    const payload = {
      app: "image-to-video" as const,
      prompt: prompt.trim(),
      firstFrameUrl: firstFrameUrl.trim(),
      lastFrameUrl: needsLastFrame ? lastFrameUrl.trim() : null,
      aspectRatio,
      duration,
      resolution,
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/apps/video-projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setError(result?.error ?? "Failed to generate video.");
          return;
        }

        router.push(`/projects/${result.project.id}`);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  function updateFrame(slot: FrameSlot, url: string, name?: string | null) {
    if (slot === "first") {
      setFirstFrameUrl(url);
      setFirstFrameName(name ?? null);
    } else {
      setLastFrameUrl(url);
      setLastFrameName(name ?? null);
    }
    setError(null);
  }

  return (
    <div className="grid h-full min-h-0 bg-bg lg:grid-cols-[464px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col border-border bg-surface px-5 py-6 lg:border-r lg:px-6 lg:py-8">
        <div className="mb-5 space-y-3 px-1">
          <div className="text-sm text-text-secondary">
            Apps <span className="text-text-tertiary">/</span>{" "}
            <strong className="font-semibold text-text">Image to Video</strong>
          </div>
          <p className="text-[13px] leading-5 text-text-secondary">
            Start from a pasted or uploaded image, or lock both start and end
            frames so the AI only creates the motion between them.
          </p>
        </div>

        <div className="thin-scrollbar flex-1 space-y-5 overflow-y-auto pr-1">
          <div className="grid gap-2 px-1 text-xs font-semibold text-text-secondary sm:grid-cols-2">
            <ModeButton
              active={mode === "first_frame"}
              title="First frame"
              description="Animate from one image"
              onClick={() => setMode("first_frame")}
            />
            <ModeButton
              active={mode === "first_last_frames"}
              title="First + last"
              description="Fill the in-between"
              onClick={() => setMode("first_last_frames")}
            />
          </div>

          <FrameInput
            label="First frame"
            value={firstFrameUrl}
            uploadedName={firstFrameName}
            onChange={(url, name) => updateFrame("first", url, name)}
            onError={setError}
          />

          {needsLastFrame ? (
            <FrameInput
              label="Last frame"
              value={lastFrameUrl}
              uploadedName={lastFrameName}
              onChange={(url, name) => updateFrame("last", url, name)}
              onError={setError}
            />
          ) : null}

          <div className="space-y-2 px-1">
            <label className="text-[13px] font-medium text-text">
              Motion direction
            </label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-50 w-full resize-none rounded-xl border border-border bg-bg-subtle px-3 py-3 text-[15px] leading-relaxed text-text placeholder:text-text-tertiary transition-colors focus:border-border-strong focus:shadow-[var(--focus-ring)]"
              placeholder={
                needsLastFrame
                  ? "A smooth premium camera move connects the first product photo to the final hero angle, with subtle light sweeps and no product distortion."
                  : "The camera slowly pushes in, condensation glints on the bottle, background light drifts softly, product remains sharp and unchanged."
              }
            />
          </div>
        </div>

        <div className="-mx-5 mt-4 space-y-3 border-t border-border bg-surface px-5 pt-3 lg:-mx-6 lg:px-6">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                Aspect Ratio
              </span>
              <div className="flex gap-1 rounded-xl border border-border bg-bg p-1">
                {aspectRatios.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAspectRatio(option)}
                    className={cn(
                      "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors",
                      aspectRatio === option
                        ? "bg-surface-raised text-text shadow-(--shadow-sm)"
                        : "text-text-secondary hover:text-text",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                Duration
              </span>
              <div className="flex gap-1 rounded-xl border border-border bg-bg p-1">
                {durations.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDuration(option)}
                    className={cn(
                      "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors",
                      duration === option
                        ? "bg-surface-raised text-text shadow-(--shadow-sm)"
                        : "text-text-secondary hover:text-text",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                Resolution
              </span>
              <div className="flex gap-1 rounded-xl border border-border bg-bg p-1">
                {resolutions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setResolution(option)}
                    className={cn(
                      "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors",
                      resolution === option
                        ? "bg-surface-raised text-text shadow-(--shadow-sm)"
                        : "text-text-secondary hover:text-text",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isPending || !canSubmit}
            className="btn-primary mb-2 w-full rounded-xl px-5 py-3 text-sm"
          >
            {isPending ? "Generating..." : "Generate video"}
          </button>
        </div>
      </aside>

      <section className="relative min-h-155 overflow-hidden bg-bg-subtle px-5 py-12 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,oklch(0.72_0.11_67_/_0.18),transparent_30%),radial-gradient(circle_at_88%_18%,oklch(0.58_0.13_252_/_0.18),transparent_28%)]" />
        <div className="relative mx-auto flex min-h-full max-w-245 flex-col justify-center space-y-8">
          <div>
            <h1 className="max-w-170 text-[34px] font-semibold tracking-tighter text-text sm:text-[48px]">
              Turn a still image into motion without losing the source frame.
            </h1>
            <p className="mt-3 max-w-145 text-sm leading-6 text-text-secondary">
              Use a product shot as the opening frame, or upload a beginning
              and ending frame for controlled interpolation.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <PreviewCard label="First frame" imageUrl={firstFrameUrl} />
            <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-(--shadow-md) lg:flex">
              {needsLastFrame ? <ArrowRight className="h-4 w-4" /> : <Film className="h-4 w-4" />}
            </div>
            <PreviewCard label={needsLastFrame ? "Last frame" : "Generated motion"} imageUrl={needsLastFrame ? lastFrameUrl : null} />
          </div>
        </div>
      </section>
    </div>
  );
}

function ModeButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-3 text-left transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent-text"
          : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
      )}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="mt-1 block text-[11px] font-medium opacity-75">
        {description}
      </span>
    </button>
  );
}

function FrameInput({
  label,
  value,
  uploadedName,
  onChange,
  onError,
}: {
  label: string;
  value: string;
  uploadedName: string | null;
  onChange: (url: string, name?: string | null) => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="space-y-2 px-1">
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-text">
        <ImagePlus className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-subtle px-3 py-2 focus-within:border-border-strong focus-within:shadow-[var(--focus-ring)]">
        <LinkIcon className="h-3.5 w-3.5 text-text-tertiary" />
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value, null)}
          className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-text-tertiary"
          placeholder="Paste image URL"
        />
      </div>
      <UploadDropzone
        endpoint="mediaReferenceUploader"
        config={{ mode: "auto" }}
        appearance={{
          container: {
            border: "1px dashed var(--border)",
            background: "var(--bg-subtle)",
            padding: "0.75rem",
            borderRadius: "0.75rem",
            cursor: "pointer",
          },
          label: { color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600 },
          allowedContent: { color: "var(--text-tertiary)", fontSize: "0.6875rem" },
          button: { display: "none" },
        }}
        content={{
          label: "Drop image here, or click to choose",
          allowedContent: "PNG, JPG, or WebP up to 8MB",
        }}
        onClientUploadComplete={(files) => {
          const file = files[0];
          if (!file) return;
          const uploadedUrl = file.ufsUrl ?? file.serverData?.url ?? file.url ?? null;
          if (!uploadedUrl) {
            onError("Upload completed, but no URL returned.");
            return;
          }
          onChange(uploadedUrl, file.name);
        }}
        onUploadError={(error) => onError(error.message)}
      />
      {isValidUrl(value) ? (
        <div className="overflow-hidden rounded-xl border border-border bg-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="h-32 w-full object-cover"
          />
          {uploadedName ? (
            <p className="px-3 py-2 text-xs font-medium text-text-secondary">
              {uploadedName} uploaded
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}


function PreviewCard({ label, imageUrl }: { label: string; imageUrl: string | null }) {
  const validImageUrl = imageUrl && isValidUrl(imageUrl) ? imageUrl : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-lg)">
      <div className="relative aspect-video bg-bg">
        {validImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={validImageUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-text-tertiary">
            {label}
          </div>
        )}
      </div>
      <p className="px-4 py-3 text-xs font-semibold text-text-secondary">
        {label}
      </p>
    </div>
  );
}

function isValidUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
