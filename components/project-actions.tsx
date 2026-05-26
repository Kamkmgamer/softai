"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, ImageIcon } from "lucide-react";

type Props = {
  projectId: string;
  canRenderImages: boolean;
  canRenderVideo: boolean;
};

export function ProjectActions({ projectId, canRenderImages, canRenderVideo }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"render-images" | "render-video" | null>(null);

  async function trigger(path: "render-images" | "render-video") {
    setError(null);
    setPendingAction(path);

    try {
      const response = await fetch(`/api/projects/${projectId}/${path}`, {
        method: "POST",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error ?? "Action failed.");
        return;
      }

      router.refresh();
    } finally {
      setPendingAction(null);
    }
  }

  const isPending = pendingAction !== null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          disabled={isPending || !canRenderImages}
          onClick={() => trigger("render-images")}
          className="rounded-2xl border border-border bg-card p-5 text-left transition hover:border-accent hover:bg-accent-soft/35 focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImageIcon className="h-5 w-5 text-accent-strong" />
          <h3 className="mt-4 font-semibold">Render scene images</h3>
          <p className="mt-1 text-sm leading-6 text-muted">
            {canRenderImages ? "Creates supporting visuals for each approved scene." : "Approve a storyboard before rendering images."}
          </p>
        </button>
        <button
          type="button"
          disabled={isPending || !canRenderVideo}
          onClick={() => trigger("render-video")}
          className="rounded-2xl border border-border bg-card p-5 text-left transition hover:border-accent hover:bg-accent-soft/35 focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Film className="h-5 w-5 text-accent-strong" />
          <h3 className="mt-4 font-semibold">Render final video</h3>
          <p className="mt-1 text-sm leading-6 text-muted">
            {canRenderVideo ? "Submits the 9:16 ad to the async video pipeline." : "Render scene images before the final video."}
          </p>
        </button>
      </div>
      {error ? <p className="rounded-xl border border-danger/25 bg-[oklch(0.95_0.035_27)] px-4 py-3 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
