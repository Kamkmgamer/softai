"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="space-y-3">
      <button
        type="button"
        disabled={isPending || !canRenderImages}
        onClick={() => trigger("render-images")}
        className="btn w-full justify-start border border-border bg-surface text-text hover:bg-surface-raised disabled:bg-surface-sunken"
      >
        <span className="flex-1 text-left">
          {pendingAction === "render-images" ? "Rendering..." : "Render images"}
        </span>
      </button>

      <button
        type="button"
        disabled={isPending || !canRenderVideo}
        onClick={() => trigger("render-video")}
        className="btn w-full justify-start border border-border bg-text text-bg hover:bg-accent-hover disabled:border-border disabled:bg-surface-sunken disabled:text-text-tertiary"
      >
        <span className="flex-1 text-left">
          {pendingAction === "render-video" ? "Rendering..." : "Render video"}
        </span>
      </button>

      {error ? (
        <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">
          {error}
        </div>
      ) : null}
    </div>
  );
}
