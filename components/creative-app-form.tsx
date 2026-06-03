"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { cn } from "@/lib/utils";
import type { BrandKitRecord } from "@/lib/types";
import { AppBackButton } from "@/components/app-back-button";
import { getDictionary } from "@/lib/dictionaries";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
} from "@/lib/i18n";

type CreativeAppKind = "text-to-image" | "image-editor" | "edit-studio" | "expand-image" | "stylize-image" | "product-reshoot" | "vary-image" | "mockup" | "create-ad" | "batch-social" | "carousel-builder" | "hook-generator" | "platform-resizer" | "lesson-to-video" | "explainer-video" | "whiteboard-animation" | "course-trailer" | "style-transfer" | "surreal-scene" | "visual-remix" | "loop-generator" | "script-to-storyboard" | "ab-variants" | "seasonal-transform";

type CreativeAppFormProps = {
  app: CreativeAppKind;
  title: string;
  description: string;
  placeholder: string;
  presets: readonly string[];
  requiresUpload?: "image" | "video";
  allowUpload?: "image" | "video";
};

const aspectRatios = ["9:16", "1:1", "16:9"];
const durations = ["10s", "15s", "20s"];
const shortDurations = ["5s", "10s", "15s"];
const videoDurations = ["30s", "60s", "90s"];
const trailerDurations = ["15s", "30s", "60s"];
const seasons = ["Summer", "Winter", "Spring", "Fall", "Holiday", "Back to school"];
const batchSocialPlatforms = ["instagram", "tiktok", "linkedin", "twitter", "facebook"];
const hookPlatforms = ["instagram", "tiktok", "youtube"];

export function CreativeAppForm({
  app,
  title,
  description,
  placeholder,
  presets,
  requiresUpload,
  allowUpload,
}: CreativeAppFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const formDict = dictionary.apps._form;
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(presets[0] ?? "Commercial ad");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [duration, setDuration] = useState("10s");
  const [platform, setPlatform] = useState("instagram");
  const [postCount, setPostCount] = useState(5);
  const [slideCount, setSlideCount] = useState(5);
  const [variantCount, setVariantCount] = useState(4);
  const [season, setSeason] = useState("Summer");
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKitRecord | null>(null);

  useEffect(() => {
    fetch("/api/brand-kit")
      .then((r) => r.json())
      .then((data) => setBrandKit(data.kits?.[0] ?? null))
      .catch(() => {});
  }, []);

  const canSubmit = prompt.trim().length >= 10 && (!requiresUpload || sourceUrl);
  const uploadType = requiresUpload ?? allowUpload;
  const uploadLabel = uploadType === "video" ? formDict.dropVideo : formDict.dropImage;
  const uploadedPreviewIsImage = uploadType === "image" && sourceUrl;

  function getUploadedUrl(file: { ufsUrl?: string; url?: string; serverData?: { url?: string } | null }) {
    return file.ufsUrl ?? file.serverData?.url ?? file.url ?? null;
  }

  async function onSubmit() {
    if (!canSubmit) return;
    setError(null);

    const payload = {
      app,
      prompt: prompt.trim(),
      style,
      aspectRatio,
      brandKit: brandKit ? {
        name: brandKit.name,
        primaryColor: brandKit.primaryColor,
        secondaryColor: brandKit.secondaryColor,
        toneOfVoice: brandKit.toneOfVoice,
        fonts: brandKit.fonts,
      } : null,
      ...(app === "image-editor" || app === "expand-image" || app === "stylize-image" || app === "product-reshoot" || app === "vary-image" || app === "mockup" ? { sourceImageUrl: sourceUrl } : null),
      ...(app === "create-ad" && sourceUrl ? { sourceImageUrl: sourceUrl } : null),
      ...(app === "edit-studio" ? { sourceVideoUrl: sourceUrl, duration } : null),
      ...(app === "batch-social" ? { platform, postCount } : null),
      ...(app === "carousel-builder" ? { slideCount } : null),
      ...(app === "hook-generator" ? { platform } : null),
      ...(app === "platform-resizer" ? { sourceImageUrl: sourceUrl, targetPlatform: platform } : null),
      ...(app === "style-transfer" || app === "visual-remix" || app === "seasonal-transform" ? { sourceImageUrl: sourceUrl } : null),
      ...(app === "seasonal-transform" ? { season } : null),
      ...(app === "ab-variants" ? { sourceImageUrl: sourceUrl, variantCount } : null),
      ...(app === "visual-remix" ? { variationCount: variantCount } : null),
      ...(app === "lesson-to-video" || app === "explainer-video" || app === "whiteboard-animation" ? { duration } : null),
      ...(app === "course-trailer" ? { duration } : null),
      ...(app === "loop-generator" ? { duration } : null),
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/apps/creative-projects", {
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
    <div className="min-h-full bg-bg lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[464px_minmax(0,1fr)]">
      <aside className="flex flex-col border-border bg-surface px-4 py-5 lg:min-h-0 lg:border-r lg:px-6 lg:py-8">
        <div className="mb-5 flex items-start gap-3 px-1">
          <AppBackButton className="mt-0.5" />
          <div className="space-y-2">
            <h1 className="text-[15px] font-semibold text-text">{title}</h1>
            {description ? (
              <p className="text-[13px] leading-5 text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="thin-scrollbar space-y-5 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {uploadType ? (
            <div className="space-y-2 px-1">
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-text">
                <UploadCloud className="h-3.5 w-3.5" />
                {requiresUpload ? formDict.sourceRequired : formDict.sourceOptional} {uploadType}
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
                  label: uploadLabel,
                  allowedContent: uploadType === "video" ? formDict.allowedVideo : formDict.allowedImage,
                }}
                onClientUploadComplete={(files) => {
                  const firstFile = files[0];
                  if (!firstFile) return;
                  const uploadedUrl = getUploadedUrl(firstFile);
                  if (!uploadedUrl) {
                    setError(formDict.uploadNoUrl);
                    return;
                  }
                  setSourceUrl(uploadedUrl);
                  setSourceName(firstFile.name);
                  setError(null);
                }}
                onUploadError={(err) => setError(err.message)}
              />
              {uploadedPreviewIsImage ? (
                <div className="overflow-hidden rounded-xl border border-border bg-bg">
                  <Image src={sourceUrl} alt={formDict.sourceRef} width={640} height={360} className="h-32 w-full object-cover" />
                </div>
              ) : sourceName ? (
                <div className="rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-secondary">
                  {formDict.uploaded.replace("{name}", sourceName)}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2 px-1">
            <label className="text-[13px] font-medium text-text">{formDict.describeResult}</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-45 w-full resize-none rounded-xl border border-border bg-bg-subtle px-3 py-3 text-[15px] leading-relaxed text-text placeholder:text-text-tertiary transition-colors focus:border-border-strong focus:shadow-[var(--focus-ring)] lg:min-h-70"
              placeholder={placeholder}
            />
          </div>

          <div className="space-y-2 px-1">
            <p className="text-[13px] font-medium text-text">{formDict.quickTools}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setStyle(preset)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-xs font-semibold transition-colors",
                    style === preset
                      ? "border-accent bg-accent-soft text-accent-text"
                      : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-18 z-10 -mx-4 mt-4 space-y-3 border-t border-border bg-surface px-4 pb-3 pt-3 shadow-(--shadow-lg) lg:static lg:-mx-6 lg:px-6 lg:pb-0 lg:shadow-none">
          <div className="grid gap-2 text-xs font-semibold text-text-secondary sm:grid-cols-3">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={cn(
                  "rounded-md border px-2.5 py-2 transition-colors",
                  aspectRatio === ratio
                    ? "border-accent bg-accent-soft text-accent-text"
                    : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                {ratio}
              </button>
            ))}
            {app === "edit-studio" ? durations.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDuration(option)}
                className={cn(
                  "rounded-md border px-2.5 py-2 transition-colors",
                  duration === option
                    ? "border-accent bg-accent-soft text-accent-text"
                    : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                {option}
              </button>
            )) : null}
            {(app === "lesson-to-video" || app === "explainer-video" || app === "whiteboard-animation") ? videoDurations.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDuration(option)}
                className={cn(
                  "rounded-md border px-2.5 py-2 transition-colors",
                  duration === option
                    ? "border-accent bg-accent-soft text-accent-text"
                    : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                {option}
              </button>
            )) : null}
            {app === "course-trailer" ? trailerDurations.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDuration(option)}
                className={cn(
                  "rounded-md border px-2.5 py-2 transition-colors",
                  duration === option
                    ? "border-accent bg-accent-soft text-accent-text"
                    : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                {option}
              </button>
            )) : null}
            {app === "loop-generator" ? shortDurations.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDuration(option)}
                className={cn(
                  "rounded-md border px-2.5 py-2 transition-colors",
                  duration === option
                    ? "border-accent bg-accent-soft text-accent-text"
                    : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                {option}
              </button>
            )) : null}
          </div>

          {(app === "batch-social" || app === "hook-generator" || app === "platform-resizer") ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-text-tertiary">{formDict.platform}</p>
              <div className="flex flex-wrap gap-1.5">
                {(app === "hook-generator" ? hookPlatforms : batchSocialPlatforms).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-colors capitalize",
                      platform === p
                        ? "border-accent bg-accent-soft text-accent-text"
                        : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {app === "batch-social" ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-text-tertiary">{formDict.posts.replace("{count}", String(postCount))}</p>
              <input
                type="range"
                min={3}
                max={7}
                value={postCount}
                onChange={(e) => setPostCount(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          ) : null}

          {app === "carousel-builder" ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-text-tertiary">{formDict.slides.replace("{count}", String(slideCount))}</p>
              <input
                type="range"
                min={3}
                max={10}
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          ) : null}

          {(app === "ab-variants" || app === "visual-remix") ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-text-tertiary">{formDict.variants.replace("{count}", String(variantCount))}</p>
              <input
                type="range"
                min={2}
                max={6}
                value={variantCount}
                onChange={(e) => setVariantCount(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          ) : null}

          {app === "seasonal-transform" ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-text-tertiary">{formDict.season}</p>
              <div className="flex flex-wrap gap-1.5">
                {seasons.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason(s)}
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                      season === s
                        ? "border-accent bg-accent-soft text-accent-text"
                        : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">{error}</div> : null}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isPending || !canSubmit}
            className="btn-primary mx-auto mb-2 block w-full max-w-95 rounded-xl px-5 py-3 text-sm lg:max-w-none"
          >
            {isPending ? formDict.creating : app === "edit-studio" ? formDict.createEditPlan : formDict.generate}
          </button>
        </div>
      </aside>

      <section className="relative hidden min-h-0 flex-1 overflow-hidden bg-bg-subtle lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,oklch(0.72_0.11_67_/_0.20),transparent_28%),radial-gradient(circle_at_78%_8%,oklch(0.58_0.13_252_/_0.16),transparent_26%)]" />
        <div className="relative mx-auto flex min-h-full max-w-[980px] flex-col justify-center px-5 py-12 lg:px-10" />
      </section>
    </div>
  );
}
