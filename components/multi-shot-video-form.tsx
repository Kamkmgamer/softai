"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Plus, Trash2, Settings2 } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { cn } from "@/lib/utils";

type Mode = "auto" | "custom";

type Shot = {
  id: string;
  prompt: string;
};

const defaultShots: Shot[] = [
  { id: "shot-1", prompt: "" },
  { id: "shot-2", prompt: "" },
  { id: "shot-3", prompt: "" },
];

export function MultiShotVideoForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Mode>("auto");
  const [autoPrompt, setAutoPrompt] = useState("");
  const [shots, setShots] = useState<Shot[]>(defaultShots);
  const [error, setError] = useState<string | null>(null);
  const [firstFrameUrl, setFirstFrameUrl] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("10s");
  const [resolution, setResolution] = useState("720p");
  const [audioOn, setAudioOn] = useState(false);

  const aspectRatios = ["16:9", "9:16", "1:1"];
  const durations = ["10s", "15s", "20s"];
  const resolutions = ["720p", "1080p"];

  function cycleAspectRatio() {
    setAspectRatio((current) => {
      const idx = aspectRatios.indexOf(current);
      return aspectRatios[(idx + 1) % aspectRatios.length];
    });
  }

  function cycleDuration() {
    setDuration((current) => {
      const idx = durations.indexOf(current);
      return durations[(idx + 1) % durations.length];
    });
  }

  function cycleResolution() {
    setResolution((current) => {
      const idx = resolutions.indexOf(current);
      return resolutions[(idx + 1) % resolutions.length];
    });
  }

  function getUploadedUrl(file: {
    ufsUrl?: string;
    url?: string;
    serverData?: { url?: string } | null;
  }) {
    return file.ufsUrl ?? file.serverData?.url ?? file.url ?? null;
  }

  const uploadAppearance = {
    container: {
      border: "1px dashed var(--border)",
      background: "var(--surface)",
      padding: "0.75rem",
      borderRadius: "0.75rem",
      cursor: "pointer",
    },
    label: {
      color: "var(--text-secondary)",
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    allowedContent: { color: "var(--text-tertiary)", fontSize: "0.6875rem" },
    button: { display: "none" },
  };

  function addShot() {
    if (shots.length >= 5) return;
    const num = shots.length + 1;
    setShots((s) => [...s, { id: `shot-${num}`, prompt: "" }]);
  }

  function removeShot(id: string) {
    if (shots.length <= 2) return;
    setShots((s) => s.filter((shot) => shot.id !== id));
  }

  function updateShot(id: string, prompt: string) {
    setShots((s) =>
      s.map((shot) => (shot.id === id ? { ...shot, prompt } : shot)),
    );
  }

  function canSubmit(): boolean {
    if (mode === "auto") return autoPrompt.trim().length >= 10;
    return shots.every((s) => s.prompt.trim().length >= 4);
  }

  async function onSubmit() {
    setError(null);
    if (!canSubmit()) return;

    const payload =
      mode === "auto"
        ? {
            mode: "auto" as const,
            prompt: autoPrompt.trim(),
            firstFrameUrl,
            aspectRatio,
            duration,
            resolution,
            audioOn,
          }
        : {
            mode: "custom" as const,
            shots: shots.map((s, i) => ({
              order: i + 1,
              prompt: s.prompt.trim(),
            })),
            firstFrameUrl,
            aspectRatio,
            duration,
            resolution,
            audioOn,
          };

    startTransition(async () => {
      try {
        const response = await fetch("/api/apps/multi-shot-video/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? "Failed to create project.");
          return;
        }

        router.push(`/projects/${result.project.id}`);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      {/* Left panel: inputs */}
      <aside className="flex min-h-0 w-full flex-col border-border bg-surface px-5 py-6 lg:w-116 lg:border-r lg:px-6 lg:py-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3 px-1">
          <div className="text-sm text-text-secondary">
            Apps <span className="text-text-tertiary">/</span>{" "}
            <strong className="font-semibold text-text">
              Multi-Shot Video
            </strong>
          </div>
          <div className="rounded-md bg-bg p-0.5 text-xs font-semibold text-text-secondary ring-1 ring-border">
            <button
              type="button"
              onClick={() => setMode("auto")}
              className={cn(
                "rounded-sm px-3 py-1.5 transition-colors",
                mode === "auto"
                  ? "bg-surface-raised text-text"
                  : "hover:text-text",
              )}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setMode("custom")}
              className={cn(
                "rounded-sm px-3 py-1.5 transition-colors",
                mode === "custom"
                  ? "bg-surface-raised text-text"
                  : "hover:text-text",
              )}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Mode content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {mode === "auto" ? (
            <div className="space-y-3 px-1">
              <label className="text-[13px] font-medium text-text">
                Describe your sequence
              </label>
              <div className="flex min-h-75 flex-col rounded-xl border border-border bg-bg-subtle p-3 transition-colors focus-within:border-border-strong focus-within:shadow-(--focus-ring)">
                <textarea
                  value={autoPrompt}
                  onChange={(e) => setAutoPrompt(e.target.value)}
                  className="min-h-65 flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-text placeholder:text-text-tertiary"
                  placeholder="A lone astronaut walks across a vast red desert under a pink sky. She stops, kneels, and picks up a glowing object half-buried in the sand. Close-up on her face as she looks up, a massive structure emerges from the dust on the horizon."
                />
              </div>
              <FirstFrameUpload
                firstFrameUrl={firstFrameUrl}
                uploadMessage={uploadMessage}
                uploadAppearance={uploadAppearance}
                getUploadedUrl={getUploadedUrl}
                onUploaded={(url, name) => {
                  setFirstFrameUrl(url);
                  setUploadMessage(`${name} uploaded as first frame.`);
                  setError(null);
                }}
                onError={(message) => setError(message)}
              />
            </div>
          ) : (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-text">
                  Shot list
                </label>
                <button
                  type="button"
                  onClick={addShot}
                  disabled={shots.length >= 5}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" />
                  Add shot
                </button>
              </div>

              {shots.map((shot, index) => (
                <div key={shot.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-text-tertiary">
                      Shot {index + 1}
                    </label>
                    {shots.length > 2 ? (
                      <button
                        type="button"
                        onClick={() => removeShot(shot.id)}
                        className="text-text-tertiary transition-colors hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                  <textarea
                    rows={3}
                    value={shot.prompt}
                    onChange={(e) => updateShot(shot.id, e.target.value)}
                    className="w-full resize-none rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-[14px] leading-relaxed text-text placeholder:text-text-tertiary transition-colors focus:border-border-strong focus:shadow-(--focus-ring)"
                    placeholder={
                      index === 0
                        ? "Opening shot: the character enters the scene..."
                        : index === shots.length - 1
                          ? "Final shot: the reveal, the payoff..."
                          : `Describe shot ${index + 1}...`
                    }
                  />
                </div>
              ))}
              <FirstFrameUpload
                firstFrameUrl={firstFrameUrl}
                uploadMessage={uploadMessage}
                uploadAppearance={uploadAppearance}
                getUploadedUrl={getUploadedUrl}
                onUploaded={(url, name) => {
                  setFirstFrameUrl(url);
                  setUploadMessage(`${name} uploaded as first frame.`);
                  setError(null);
                }}
                onError={(message) => setError(message)}
              />
            </div>
          )}
        </div>

        {/* Bottom bar: settings + generate */}
        <div className="-mx-5 mt-4 flex flex-col gap-3 border-t border-border bg-surface px-5 pb-0 pt-3 lg:-mx-6 lg:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary">
            <span
               className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 transition-colors hover:border-border-strong hover:bg-surface-raised"
              onClick={cycleAspectRatio}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") cycleAspectRatio();
              }}
              role="button"
              tabIndex={0}
            >
              <Settings2 className="h-3.5 w-3.5" />
              {aspectRatio}
            </span>
            <span
               className="inline-flex cursor-pointer rounded-md border border-border bg-bg px-2.5 py-1.5 transition-colors hover:border-border-strong hover:bg-surface-raised"
              onClick={cycleDuration}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") cycleDuration();
              }}
              role="button"
              tabIndex={0}
            >
              {duration}
            </span>
            <span
               className="inline-flex cursor-pointer rounded-md border border-border bg-bg px-2.5 py-1.5 transition-colors hover:border-border-strong hover:bg-surface-raised"
              onClick={cycleResolution}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") cycleResolution();
              }}
              role="button"
              tabIndex={0}
            >
              {resolution}
            </span>
            <span
              className={cn(
                "inline-flex cursor-pointer rounded-md border px-2.5 py-1.5 transition-colors",
                audioOn
                  ? "border-border-strong bg-surface-raised text-text"
                  : "border-border bg-bg",
              )}
              onClick={() => setAudioOn(!audioOn)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setAudioOn(!audioOn);
              }}
              role="switch"
              aria-checked={audioOn}
              tabIndex={0}
            >
              Audio {audioOn ? "On" : "Off"}
            </span>
          </div>

          {error ? (
            <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isPending || !canSubmit()}
            className="btn-primary mb-2 w-full rounded-xl px-5 py-3 text-sm"
          >
            {isPending ? "Generating..." : "Generate"}
          </button>
        </div>
      </aside>

      {/* Right panel: preview/examples */}
      <section className="relative flex min-h-155 flex-1 items-center justify-center px-5 py-12 lg:px-10">
        <div className="w-full max-w-245 space-y-6 text-center">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tighter text-text sm:text-[32px]">
              Multi-Shot Video
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Write a simple prompt, get a multiple shots video.
            </p>
          </div>

          <div className="mx-auto overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-lg)">
            <div className="relative aspect-video bg-bg-subtle">
              <div className="absolute inset-0 flex items-center justify-center text-sm text-text-tertiary">
                Your generated video will appear here
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent" />
            </div>
          </div>

          <div className="mx-auto flex max-w-190 gap-2 overflow-hidden">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="relative h-20 flex-1 overflow-hidden rounded-lg border border-border bg-surface"
              >
                <div className="flex h-full items-center justify-center text-xs font-semibold text-text-tertiary">
                  Shot {n}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FirstFrameUpload({
  firstFrameUrl,
  uploadMessage,
  uploadAppearance,
  getUploadedUrl,
  onUploaded,
  onError,
}: {
  firstFrameUrl: string | null;
  uploadMessage: string | null;
  uploadAppearance: Record<string, unknown>;
  getUploadedUrl: (file: {
    ufsUrl?: string;
    url?: string;
    serverData?: { url?: string } | null;
  }) => string | null;
  onUploaded: (url: string, name: string) => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-text">
        <ImagePlus className="h-3.5 w-3.5" />
        Optional first frame
      </div>
      <UploadDropzone
        endpoint="brandAssetUploader"
        config={{ mode: "auto" }}
        appearance={uploadAppearance}
        content={{
          label: "Drop image here, or click to choose",
          allowedContent: "PNG, JPG, or WebP up to 8MB",
        }}
        onClientUploadComplete={(files) => {
          const firstFile = files[0];
          if (!firstFile) return;
          const uploadedUrl = getUploadedUrl(firstFile);
          if (!uploadedUrl) {
            onError("Upload completed, but no URL returned.");
            return;
          }
          onUploaded(uploadedUrl, firstFile.name);
        }}
        onUploadError={(err) => onError(err.message)}
      />
      {firstFrameUrl ? (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <Image
            src={firstFrameUrl}
            alt="First frame reference"
            width={640}
            height={360}
            className="h-28 w-full object-cover"
          />
        </div>
      ) : null}
      {uploadMessage ? (
        <div className="rounded-md bg-success-soft px-3 py-2 text-xs font-medium text-success">
          {uploadMessage}
        </div>
      ) : null}
    </div>
  );
}
