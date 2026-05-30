"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { cn } from "@/lib/utils";

type CreativeAppKind = "text-to-image" | "image-editor" | "edit-studio" | "expand-image" | "stylize-image" | "product-reshoot";

type CreativeAppFormProps = {
  app: CreativeAppKind;
  title: string;
  eyebrow: string;
  description: string;
  placeholder: string;
  presets: string[];
  requiresUpload?: "image" | "video";
};

const aspectRatios = ["9:16", "1:1", "16:9"];
const durations = ["10s", "15s", "20s"];

export function CreativeAppForm({
  app,
  title,
  placeholder,
  presets,
  requiresUpload,
}: CreativeAppFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(presets[0] ?? "Commercial ad");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [duration, setDuration] = useState("10s");
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = prompt.trim().length >= 10 && (!requiresUpload || sourceUrl);
  const uploadLabel = requiresUpload === "video" ? "Drop source video here" : "Drop source image here";
  const uploadedPreviewIsImage = requiresUpload === "image" && sourceUrl;

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
      ...(app === "image-editor" || app === "expand-image" || app === "stylize-image" || app === "product-reshoot" ? { sourceImageUrl: sourceUrl } : null),
      ...(app === "edit-studio" ? { sourceVideoUrl: sourceUrl, duration } : null),
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
    <div className="grid h-full min-h-0 bg-bg lg:grid-cols-[464px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col border-border bg-surface px-5 py-6 lg:border-r lg:px-6 lg:py-8">
        <div className="mb-5 flex items-center justify-between gap-3 px-1">
          <div className="text-sm text-text-secondary">
            Apps <span className="text-text-tertiary">/</span>{" "}
            <strong className="font-semibold text-text">{title}</strong>
          </div>
        </div>

        <div className="thin-scrollbar flex-1 space-y-5 overflow-y-auto pr-1">
          {requiresUpload ? (
            <div className="space-y-2 px-1">
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-text">
                <UploadCloud className="h-3.5 w-3.5" />
                Source {requiresUpload}
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
                  allowedContent: requiresUpload === "video" ? "MP4/WebM up to 64MB" : "PNG, JPG, or WebP up to 8MB",
                }}
                onClientUploadComplete={(files) => {
                  const firstFile = files[0];
                  if (!firstFile) return;
                  const uploadedUrl = getUploadedUrl(firstFile);
                  if (!uploadedUrl) {
                    setError("Upload completed, but no URL returned.");
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
                  <Image src={sourceUrl} alt="Source reference" width={640} height={360} className="h-32 w-full object-cover" />
                </div>
              ) : sourceName ? (
                <div className="rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-secondary">
                  {sourceName} uploaded
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2 px-1">
            <label className="text-[13px] font-medium text-text">Describe the result</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-[280px] w-full resize-none rounded-xl border border-border bg-bg-subtle px-3 py-3 text-[15px] leading-relaxed text-text placeholder:text-text-tertiary transition-colors focus:border-border-strong focus:shadow-[var(--focus-ring)]"
              placeholder={placeholder}
            />
          </div>

          <div className="space-y-2 px-1">
            <p className="text-[13px] font-medium text-text">Quick tools</p>
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

        <div className="-mx-5 mt-4 space-y-3 border-t border-border bg-surface px-5 pt-3 lg:-mx-6 lg:px-6">
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
          </div>

          {error ? <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">{error}</div> : null}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isPending || !canSubmit}
            className="btn-primary mb-2 w-full rounded-xl px-5 py-3 text-sm"
          >
            {isPending ? "Creating..." : app === "edit-studio" ? "Create edit plan" : "Generate"}
          </button>
        </div>
      </aside>

      <section className="relative min-h-0 flex-1 overflow-hidden bg-bg-subtle">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,oklch(0.72_0.11_67_/_0.20),transparent_28%),radial-gradient(circle_at_78%_8%,oklch(0.58_0.13_252_/_0.16),transparent_26%)]" />
        <div className="relative mx-auto flex min-h-full max-w-[980px] flex-col justify-center px-5 py-12 lg:px-10" />
      </section>
    </div>
  );
}
