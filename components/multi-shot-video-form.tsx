"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ImagePlus, Plus, Trash2, Settings2 } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { cn } from "@/lib/utils";
import { AppBackButton } from "@/components/app-back-button";
import { getDictionary } from "@/lib/dictionaries";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
} from "@/lib/i18n";

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
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const formDict = dictionary.apps._form;
  const appDict = dictionary.apps["multi-shot-video"];
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
          setError(result.error ?? formDict.failedToCreate);
          return;
        }

        router.push(localizePath(`/projects/${result.project.id}`, locale));
      } catch {
        setError(formDict.somethingWrong);
      }
    });
  }

  return (
    <div className="flex min-h-full flex-col lg:h-full lg:min-h-0 lg:flex-row">
      {/* Left panel: inputs */}
      <aside className="flex w-full flex-col border-border bg-surface px-4 py-5 lg:min-h-0 lg:w-116 lg:border-r lg:px-6 lg:py-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <AppBackButton />
            <h1 className="text-[15px] font-semibold text-text">
              {appDict.title}
            </h1>
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
              {formDict.auto}
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
              {formDict.custom}
            </button>
          </div>
        </div>

        {/* Mode content */}
        <div className="lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {mode === "auto" ? (
            <div className="space-y-3 px-1">
              <label className="text-[13px] font-medium text-text">
                {formDict.describeSequence}
              </label>
              <div className="flex min-h-75 flex-col rounded-xl border border-border bg-bg-subtle p-3 transition-colors focus-within:border-border-strong focus-within:shadow-(--focus-ring)">
                <textarea
                  value={autoPrompt}
                  onChange={(e) => setAutoPrompt(e.target.value)}
                  className="min-h-65 flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-text placeholder:text-text-tertiary"
                  placeholder={appDict.autoPlaceholder}
                />
              </div>
              <FirstFrameUpload
                firstFrameUrl={firstFrameUrl}
                uploadMessage={uploadMessage}
                uploadAppearance={uploadAppearance}
                getUploadedUrl={getUploadedUrl}
                formDict={formDict}
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
                  {formDict.shotList}
                </label>
                <button
                  type="button"
                  onClick={addShot}
                  disabled={shots.length >= 5}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" />
                  {formDict.addShot}
                </button>
              </div>

              {shots.map((shot, index) => (
                <div key={shot.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-text-tertiary">
                      {formDict.shot.replace("{n}", String(index + 1))}
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
                        ? appDict.openingShot
                        : index === shots.length - 1
                          ? appDict.finalShot
                          : appDict.describeShot.replace(
                              "{n}",
                              String(index + 1),
                            )
                    }
                  />
                </div>
              ))}
              <FirstFrameUpload
                firstFrameUrl={firstFrameUrl}
                uploadMessage={uploadMessage}
                uploadAppearance={uploadAppearance}
                getUploadedUrl={getUploadedUrl}
                formDict={formDict}
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
        <div className="sticky bottom-18 z-10 -mx-4 mt-4 flex flex-col gap-3 border-t border-border bg-surface px-4 pb-3 pt-3 shadow-(--shadow-lg) lg:static lg:-mx-6 lg:px-6 lg:pb-0 lg:shadow-none">
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
              {dictionary.shared.audio}{" "}
              {audioOn ? formDict.audioOn : formDict.audioOff}
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
            className="btn-primary mx-auto mb-2 block w-full max-w-95 rounded-xl px-5 py-3 text-sm lg:max-w-none"
          >
            {isPending ? formDict.generating : formDict.generate}
          </button>
        </div>
      </aside>

      {/* Right panel: preview/examples */}
      <section className="relative flex min-h-155 flex-1 items-center justify-center px-5 py-12 app-hide-on-mobile lg:px-10">
        <div className="w-full max-w-245 space-y-6 text-center">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tighter text-text sm:text-[32px]">
              {appDict.heroHeading}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {appDict.heroSubtext}
            </p>
          </div>

          <div className="mx-auto overflow-hidden rounded-md border border-border bg-surface shadow-(--shadow-lg)">
            <div className="relative aspect-video bg-bg-subtle">
              <div className="absolute inset-0 flex items-center justify-center text-sm text-text-tertiary">
                {formDict.videoWillAppear}
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
                  {formDict.shot.replace("{n}", String(n))}
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
  formDict,
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
  formDict: Record<string, string>;
  onUploaded: (url: string, name: string) => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-text">
        <ImagePlus className="h-3.5 w-3.5" />
        {formDict.optionalFirstFrame}
      </div>
      <UploadDropzone
        endpoint="brandAssetUploader"
        config={{ mode: "auto" }}
        appearance={uploadAppearance}
        content={{
          label: formDict.dropOrClick,
          allowedContent: formDict.allowedImage,
        }}
        onClientUploadComplete={(files) => {
          const firstFile = files[0];
          if (!firstFile) return;
          const uploadedUrl = getUploadedUrl(firstFile);
          if (!uploadedUrl) {
            onError(formDict.uploadNoUrl);
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
            alt={formDict.firstFrameRef}
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
