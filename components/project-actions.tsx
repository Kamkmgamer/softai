"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, ImageIcon } from "lucide-react";

const VIDEO_OUTPUT_POLL_INTERVAL_MS = 5_000;
const VIDEO_OUTPUT_POLL_ATTEMPTS = 24;

type Props = {
  projectId: string;
  canRenderImages: boolean;
  canRenderVideo: boolean;
  mode?: "stepwise" | "multi-shot";
};

type OutputSummary = {
  type?: string;
};

export function ProjectActions({ projectId, canRenderImages, canRenderVideo, mode = "stepwise" }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"render-images" | "render-video" | "generate-video" | null>(null);

  async function waitForFinalVideoOutput() {
    for (let attempt = 0; attempt < VIDEO_OUTPUT_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, VIDEO_OUTPUT_POLL_INTERVAL_MS));

      const response = await fetch(`/api/projects/${projectId}/outputs`, { cache: "no-store" });
      if (!response.ok) continue;

      const payload = await response.json().catch(() => null);
      const outputs: OutputSummary[] = Array.isArray(payload?.outputs) ? payload.outputs : [];
      if (outputs.some((output) => output?.type === "final_video")) {
        router.refresh();
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

  async function generateVideo() {
    setError(null);
    setPendingAction("generate-video");

    try {
      if (!canRenderVideo) {
        const imageResponse = await fetch(`/api/projects/${projectId}/render-images`, {
          method: "POST",
        });
        const imagePayload = await imageResponse.json().catch(() => null);
        if (!imageResponse.ok) {
          setError(imagePayload?.error ?? "Failed to render shot images.");
          return;
        }
      }

      const videoResponse = await fetch(`/api/projects/${projectId}/render-video`, {
        method: "POST",
      });
      const videoPayload = await videoResponse.json().catch(() => null);
      if (!videoResponse.ok) {
        setError(videoPayload?.error ?? "Failed to generate video.");
        return;
      }

      router.refresh();
      if (!videoPayload?.url) {
        void waitForFinalVideoOutput();
      }
    } finally {
      setPendingAction(null);
    }
  }

  const isPending = pendingAction !== null;

  if (mode === "multi-shot") {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled={isPending || !canRenderImages}
          onClick={generateVideo}
          className="btn btn-primary w-full justify-start disabled:border-border disabled:bg-surface-sunken disabled:text-text-tertiary"
        >
          <Film className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-start">
            {pendingAction === "generate-video"
              ? canRenderVideo
                ? "Generating video..."
                : "Rendering shots, then generating video..."
              : "Generate video"}
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

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending || !canRenderImages}
        onClick={() => trigger("render-images")}
        className="btn btn-secondary w-full justify-start disabled:bg-surface-sunken"
      >
        <ImageIcon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-start">
          {pendingAction === "render-images" ? "Rendering..." : "Render images"}
        </span>
      </button>

      <button
        type="button"
        disabled={isPending || !canRenderVideo}
        onClick={() => trigger("render-video")}
        className="btn btn-primary w-full justify-start disabled:border-border disabled:bg-surface-sunken disabled:text-text-tertiary"
      >
        <Film className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-start">
          {pendingAction === "render-video" ? "Generating video (this may take up to 2 minutes)..." : "Render video"}
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
