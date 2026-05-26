"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectBundle } from "@/lib/types";

type Props = {
  projectId: string;
  initialBundle: ProjectBundle;
};

export function StoryboardReviewForm({ projectId, initialBundle }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [headline, setHeadline] = useState(initialBundle.storyboard?.headline ?? "");
  const [hook, setHook] = useState(initialBundle.storyboard?.hook ?? "");
  const [cta, setCta] = useState(initialBundle.storyboard?.cta ?? initialBundle.project.cta);
  const [scenes, setScenes] = useState(
    initialBundle.scenes.map((scene) => ({
      title: scene.title,
      narration: scene.narration,
      visualDirection: scene.visualDirection,
      overlayText: scene.overlayText,
      durationSeconds: scene.durationSeconds,
    })),
  );

  function updateScene(index: number, key: keyof (typeof scenes)[number], value: string | number) {
    setScenes((current) =>
      current.map((scene, sceneIndex) =>
        sceneIndex === index ? { ...scene, [key]: value } : scene,
      ),
    );
  }

  async function save() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/projects/${projectId}/storyboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, hook, cta, scenes }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to save storyboard.");
        return;
      }

      router.refresh();
    });
  }

  async function approve() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/projects/${projectId}/storyboard`, {
        method: "POST",
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to approve storyboard.");
        return;
      }

      router.push(`/projects/${projectId}`);
    });
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-[2rem] border border-border bg-white/70 p-6">
        <input
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
          className="rounded-2xl border border-border bg-background px-4 py-3 text-xl font-semibold"
          placeholder="Headline"
        />
        <input
          value={hook}
          onChange={(event) => setHook(event.target.value)}
          className="rounded-2xl border border-border bg-background px-4 py-3"
          placeholder="Hook"
        />
        <input
          value={cta}
          onChange={(event) => setCta(event.target.value)}
          className="rounded-2xl border border-border bg-background px-4 py-3"
          placeholder="CTA"
        />
      </div>

      <div className="grid gap-5">
        {scenes.map((scene, index) => (
          <div key={index} className="grid gap-4 rounded-[2rem] border border-border bg-white/70 p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                Scene {index + 1}
              </p>
              <input
                type="number"
                min={3}
                max={15}
                value={scene.durationSeconds}
                onChange={(event) => updateScene(index, "durationSeconds", Number(event.target.value))}
                className="w-24 rounded-2xl border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <input
              value={scene.title}
              onChange={(event) => updateScene(index, "title", event.target.value)}
              className="rounded-2xl border border-border bg-background px-4 py-3"
              placeholder="Scene title"
            />
            <textarea
              rows={4}
              value={scene.narration}
              onChange={(event) => updateScene(index, "narration", event.target.value)}
              className="rounded-[1.5rem] border border-border bg-background px-4 py-3"
              placeholder="Narration"
            />
            <textarea
              rows={4}
              value={scene.visualDirection}
              onChange={(event) => updateScene(index, "visualDirection", event.target.value)}
              className="rounded-[1.5rem] border border-border bg-background px-4 py-3"
              placeholder="Visual direction"
            />
            <input
              value={scene.overlayText}
              onChange={(event) => updateScene(index, "overlayText", event.target.value)}
              className="rounded-2xl border border-border bg-background px-4 py-3"
              placeholder="Overlay text"
            />
          </div>
        ))}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-full border border-border bg-white/80 px-5 py-3 text-sm font-semibold"
        >
          Save edits
        </button>
        <button
          type="button"
          onClick={approve}
          disabled={isPending}
          className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
        >
          Approve storyboard
        </button>
      </div>
    </div>
  );
}
