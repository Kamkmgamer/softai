"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Film, ImageIcon } from "lucide-react";

export function ProjectActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function trigger(path: string) {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/projects/${projectId}/${path}`, {
        method: "POST",
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Action failed.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => trigger("render-images")}
          className="rounded-[1.5rem] border border-border bg-white/70 p-5 text-left transition hover:border-accent disabled:opacity-60"
        >
          <ImageIcon className="h-5 w-5 text-accent-strong" />
          <h3 className="mt-4 font-semibold">Render scene images</h3>
          <p className="mt-1 text-sm leading-6 text-muted">Creates supporting visuals for each approved scene.</p>
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => trigger("render-video")}
          className="rounded-[1.5rem] border border-border bg-white/70 p-5 text-left transition hover:border-accent disabled:opacity-60"
        >
          <Film className="h-5 w-5 text-accent-strong" />
          <h3 className="mt-4 font-semibold">Render final video</h3>
          <p className="mt-1 text-sm leading-6 text-muted">Submits the 9:16 ad to the async video pipeline.</p>
        </button>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
