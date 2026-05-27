"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type ProjectBundle } from "@/lib/types";
import { FieldLabel } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, getLocaleFromPathname, localizePath } from "@/lib/i18n";

export function StoryboardReviewForm({
  projectId,
  initialBundle,
}: {
  projectId: string;
  initialBundle: ProjectBundle;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const [isPending, startTransition] = useTransition();
  const [scenes, setScenes] = useState(initialBundle.scenes);
  const [error, setError] = useState<string | null>(null);
  const storyboard = initialBundle.storyboard;

  const updateScene = (id: string, field: "title" | "narration" | "overlayText" | "visualDirection", value: string) => {
    setScenes((current) =>
      current.map((scene) => (scene.id === id ? { ...scene, [field]: value } : scene))
    );
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/projects/${projectId}/storyboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: storyboard?.headline ?? initialBundle.project.title,
          hook: storyboard?.hook ?? initialBundle.project.offer,
          cta: storyboard?.cta ?? initialBundle.project.cta,
          scenes: scenes.map((scene) => ({
            title: scene.title,
            narration: scene.narration,
            visualDirection: scene.visualDirection,
            overlayText: scene.overlayText,
            durationSeconds: scene.durationSeconds,
          })),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? dictionary.storyboard.saveFailed);
        return;
      }

      const approveResponse = await fetch(`/api/projects/${projectId}/storyboard`, {
        method: "POST",
      });
      const approvePayload = await approveResponse.json();

      if (!approveResponse.ok) {
        setError(approvePayload.error ?? dictionary.storyboard.approveFailed);
        return;
      }

      router.push(localizePath(`/projects/${projectId}`, locale));
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-8">
        {scenes.map((scene, index) => (
          <div key={scene.id} className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-text text-[10px] font-bold text-bg">
                {index + 1}
              </span>
              <h3 className="text-sm font-semibold text-text">Scene {index + 1}</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`scene-title-${scene.id}`} label={dictionary.storyboard.internalTitle} />
                <input
                  id={`scene-title-${scene.id}`}
                  value={scene.title}
                  onChange={(e) => updateScene(scene.id, "title", e.target.value)}
                  className="control-field"
                  placeholder={locale === "ar" ? "مثال: افتتاحية تشد الانتباه" : "e.g. Opening hook"}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor={`scene-narration-${scene.id}`} label={dictionary.storyboard.narration} />
                  <textarea
                    id={`scene-narration-${scene.id}`}
                    rows={3}
                    value={scene.narration}
                    onChange={(e) => updateScene(scene.id, "narration", e.target.value)}
                    className="control-field resize-y text-[13px]"
                    placeholder={locale === "ar" ? "ماذا سيقول الصوت؟" : "What the voiceover says..."}
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor={`scene-visual-${scene.id}`} label={dictionary.storyboard.visualDirection} />
                  <textarea
                    id={`scene-visual-${scene.id}`}
                    rows={3}
                    value={scene.visualDirection}
                    onChange={(e) => updateScene(scene.id, "visualDirection", e.target.value)}
                    className="control-field resize-y text-[13px]"
                    placeholder={locale === "ar" ? "صف المشهد المطلوب..." : "Describe the image..."}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor={`scene-overlay-${scene.id}`} label={dictionary.storyboard.overlayText} />
                <input
                  id={`scene-overlay-${scene.id}`}
                  value={scene.overlayText || ""}
                  onChange={(e) => updateScene(scene.id, "overlayText", e.target.value)}
                  className="control-field"
                  placeholder={locale === "ar" ? "مثال: العرض لفترة محدودة" : "e.g. 50% OFF TODAY"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => router.push(localizePath(`/projects/${projectId}`, locale))}
          className="btn-secondary w-full sm:w-auto"
        >
          {dictionary.storyboard.cancel}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full sm:w-auto"
        >
          {isPending ? dictionary.storyboard.saving : dictionary.storyboard.approve}
        </button>
      </div>
    </form>
  );
}
