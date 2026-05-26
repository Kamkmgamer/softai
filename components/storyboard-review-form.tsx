"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type ProjectBundle } from "@/lib/types";
import { FieldLabel } from "@/components/ui";

export function StoryboardReviewForm({
  projectId,
  initialBundle,
}: {
  projectId: string;
  initialBundle: ProjectBundle;
}) {
  const router = useRouter();
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
        setError(payload.error ?? "Failed to save storyboard.");
        return;
      }

      const approveResponse = await fetch(`/api/projects/${projectId}/storyboard`, {
        method: "POST",
      });
      const approvePayload = await approveResponse.json();

      if (!approveResponse.ok) {
        setError(approvePayload.error ?? "Failed to approve storyboard.");
        return;
      }

      router.push(`/projects/${projectId}`);
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
                <FieldLabel htmlFor={`scene-title-${scene.id}`} label="Internal title" />
                <input
                  id={`scene-title-${scene.id}`}
                  value={scene.title}
                  onChange={(e) => updateScene(scene.id, "title", e.target.value)}
                  className="control-field"
                  placeholder="e.g. Opening hook"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor={`scene-narration-${scene.id}`} label="Narration (TTS)" />
                  <textarea
                    id={`scene-narration-${scene.id}`}
                    rows={3}
                    value={scene.narration}
                    onChange={(e) => updateScene(scene.id, "narration", e.target.value)}
                    className="control-field resize-y text-[13px]"
                    placeholder="What the voiceover says..."
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor={`scene-visual-${scene.id}`} label="Visual direction" />
                  <textarea
                    id={`scene-visual-${scene.id}`}
                    rows={3}
                    value={scene.visualDirection}
                    onChange={(e) => updateScene(scene.id, "visualDirection", e.target.value)}
                    className="control-field resize-y text-[13px]"
                    placeholder="Describe the image..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor={`scene-overlay-${scene.id}`} label="Text overlay (optional)" />
                <input
                  id={`scene-overlay-${scene.id}`}
                  value={scene.overlayText || ""}
                  onChange={(e) => updateScene(scene.id, "overlayText", e.target.value)}
                  className="control-field"
                  placeholder="e.g. 50% OFF TODAY"
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
          onClick={() => router.push(`/projects/${projectId}`)}
          className="btn-secondary w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full sm:w-auto"
        >
          {isPending ? "Saving..." : "Approve and save"}
        </button>
      </div>
    </form>
  );
}
