"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

type OutputSummary = {
  id: string;
  title: string;
  type: string;
};

type Props = {
  projectId: string;
  label: string;
};

export function LibraryDownloadButton({ projectId, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownloadAll() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/outputs`);
      if (!res.ok) {
        setError(true);
        return;
      }
      const data = await res.json();
      const outputs: OutputSummary[] = data.outputs ?? [];

      for (const output of outputs) {
        const link = document.createElement("a");
        link.href = `/api/projects/${projectId}/outputs/${output.id}/download`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDownloadAll}
        disabled={loading}
        className="btn btn-primary btn-sm px-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="sr-only">{label}</span>
      </button>
      {error ? (
        <span className="absolute -bottom-6 right-0 whitespace-nowrap text-[11px] text-danger">
          Download failed, try again
        </span>
      ) : null}
    </div>
  );
}
