"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, Film, ImagePlus, LinkIcon } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { cn } from "@/lib/utils";
import { AppBackButton } from "@/components/app-back-button";
import { getDictionary } from "@/lib/dictionaries";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
} from "@/lib/i18n";

type FrameMode = "first_frame" | "first_last_frames";
type FrameSlot = "first" | "last";

const aspectRatios = ["16:9", "9:16", "1:1"];
const durations = ["5s", "10s", "15s"];
const resolutions = ["720p", "1080p"];

export function ImageToVideoForm() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const formDict = dictionary.apps._form;
  const appDict = dictionary.apps["image-to-video"];
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
          setError(result?.error ?? formDict.failedToGenerate);
          return;
        }

        router.push(localizePath(`/projects/${result.project.id}`, locale));
      } catch {
        setError(formDict.somethingWrong);
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
    <div className="min-h-full bg-bg lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[464px_minmax(0,1fr)]">
      <aside className="flex flex-col border-border bg-surface px-4 py-5 lg:min-h-0 lg:border-r lg:px-6 lg:py-8">
        <div className="mb-5 flex items-start gap-3 px-1">
          <AppBackButton className="mt-0.5" />
          <div className="space-y-2">
            <h1 className="text-[15px] font-semibold text-text">{appDict.title}</h1>
            <p className="text-[13px] leading-5 text-text-secondary">
              {appDict.description}
            </p>
          </div>
        </div>

        <div className="thin-scrollbar space-y-5 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          <div className="grid gap-2 px-1 text-xs font-semibold text-text-secondary sm:grid-cols-2">
            <ModeButton
              active={mode === "first_frame"}
              title={appDict.firstFrameMode}
              description={appDict.firstFrameModeDesc}
              onClick={() => setMode("first_frame")}
            />
            <ModeButton
              active={mode === "first_last_frames"}
              title={appDict.firstLastMode}
              description={appDict.firstLastModeDesc}
              onClick={() => setMode("first_last_frames")}
            />
          </div>

          <FrameInput
            label={formDict.firstFrame}
            value={firstFrameUrl}
            uploadedName={firstFrameName}
            dict={dictionary}
            onChange={(url, name) => updateFrame("first", url, name)}
            onError={setError}
          />

          {needsLastFrame ? (
            <FrameInput
              label={formDict.lastFrame}
              value={lastFrameUrl}
              uploadedName={lastFrameName}
              dict={dictionary}
              onChange={(url, name) => updateFrame("last", url, name)}
              onError={setError}
            />
          ) : null}

          <div className="space-y-2 px-1">
            <label className="text-[13px] font-medium text-text">
              {formDict.motionDirection}
            </label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-50 w-full resize-none rounded-xl border border-border bg-bg-subtle px-3 py-3 text-[15px] leading-relaxed text-text placeholder:text-text-tertiary transition-colors focus:border-border-strong focus:shadow-[var(--focus-ring)]"
              placeholder={
                needsLastFrame
                  ? appDict.motionPlaceholderDual
                  : appDict.motionPlaceholderSingle
              }
            />
          </div>
        </div>

        <div className="sticky bottom-18 z-10 -mx-4 mt-4 space-y-3 border-t border-border bg-surface px-4 pb-3 pt-3 shadow-(--shadow-lg) lg:static lg:-mx-6 lg:px-6 lg:pb-0 lg:shadow-none">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                {formDict.aspectRatio}
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
                {formDict.duration}
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
                {formDict.resolution}
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
            className="btn-primary mx-auto mb-2 block w-full max-w-95 rounded-xl px-5 py-3 text-sm lg:max-w-none"
          >
            {isPending ? formDict.generating : formDict.generateVideo}
          </button>
        </div>
      </aside>

      <section className="relative min-h-0 flex-1 overflow-y-auto bg-bg-subtle px-5 py-12 app-hide-on-mobile lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,oklch(0.72_0.11_67_/_0.18),transparent_30%),radial-gradient(circle_at_88%_18%,oklch(0.58_0.13_252_/_0.18),transparent_28%)]" />
        <div className="relative mx-auto flex min-h-full max-w-245 flex-col justify-center space-y-8">
          <div>
            <h1 className="max-w-170 text-[34px] font-semibold tracking-tighter text-text sm:text-[48px]">
              {appDict.heroHeading}
            </h1>
            <p className="mt-3 max-w-145 text-sm leading-6 text-text-secondary">
              {appDict.heroSubtext}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <PreviewCard label={formDict.firstFrame} imageUrl={firstFrameUrl} />
            <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-(--shadow-md) app-hide-on-mobile lg:flex">
              {needsLastFrame ? <ArrowRight className="h-4 w-4" /> : <Film className="h-4 w-4" />}
            </div>
            <PreviewCard label={needsLastFrame ? formDict.lastFrame : formDict.generatedMotion} imageUrl={needsLastFrame ? lastFrameUrl : null} />
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
  dict,
  onChange,
  onError,
}: {
  label: string;
  value: string;
  uploadedName: string | null;
  dict: { apps: { _form: Record<string, string> } };
  onChange: (url: string, name?: string | null) => void;
  onError: (message: string) => void;
}) {
  const formDict = dict.apps._form;
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
          placeholder={formDict.pasteImageUrl}
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
          label: formDict.dropOrClick,
          allowedContent: formDict.allowedImage,
        }}
        onClientUploadComplete={(files) => {
          const file = files[0];
          if (!file) return;
          const uploadedUrl = file.ufsUrl ?? file.serverData?.url ?? file.url ?? null;
          if (!uploadedUrl) {
            onError(formDict.uploadNoUrl);
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
              {formDict.uploaded.replace("{name}", uploadedName)}
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
