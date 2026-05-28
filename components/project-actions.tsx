"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const VIDEO_OUTPUT_POLL_INTERVAL_MS = 5_000;
const VIDEO_OUTPUT_POLL_ATTEMPTS = 24;

type Props = {
  projectId: string;
  canRenderImages: boolean;
  canRenderVideo: boolean;
};

type OutputSummary = {
  type?: string;
};

export function ProjectActions({ projectId, canRenderImages, canRenderVideo }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"render-images" | "render-video" | null>(null);

  async function waitForFinalVideoOutput() {
    for (let attempt = 0; attempt < VIDEO_OUTPUT_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, VIDEO_OUTPUT_POLL_INTERVAL_MS));

      const response = await fetch(`/api/projects/${projectId}/outputs`, { cache: "no-store" });
      if (!response.ok) continue;

      const payload = await response.json().catch(() => null);
      const outputs: OutputSummary[] = Array.isArray(payload?.outputs) ? payload.outputs : [];
      if (outputs.some((output) => output?.type === "final_video")) {
        router.refresh();
      if (path === "render-video" && !payload?.url) {
        void waitForFinalVideoOutput();
      }
        return;
      }
    }
  }

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
      if (path === "render-video" && !payload?.url) {
        void waitForFinalVideoOutput();
      }
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
        <span className="flex-1 text-start">
          {pendingAction === "render-images" ? "Rendering..." : "Render images"}
        </span>
      </button>

      <button
        type="button"
        disabled={isPending || !canRenderVideo}
        onClick={() => trigger("render-video")}
        className="btn w-full justify-start border border-border bg-text text-bg hover:bg-accent-hover disabled:border-border disabled:bg-surface-sunken disabled:text-text-tertiary"
      >
        <span className="flex-1 text-start">
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
