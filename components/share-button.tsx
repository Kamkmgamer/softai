"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, Loader2, X } from "lucide-react";

type Props = {
  outputId: string;
  label?: string;
};

type ShareState = "idle" | "loading" | "done" | "error";

export function ShareButton({ outputId, label }: Props) {
  const [state, setState] = useState<ShareState>("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-select the URL when done state renders
  useEffect(() => {
    if (state === "done" && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [state]);

  async function createShareLink() {
    setState("loading");
    try {
      const res = await fetch(`/api/outputs/${outputId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresInDays }),
      });
      if (!res.ok) throw new Error("Failed to create share link");
      const data = await res.json();
      setShareUrl(data.shareUrl);
      setState("done");
      setShowConfig(false);
    } catch {
      setState("error");
    }
  }

  function handleCopy() {
    if (!shareUrl) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.select();
    // Try clipboard API, then fallback
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        },
        () => {
          // Clipboard API failed, text is selected for manual Ctrl+C
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        },
      );
    } else {
      // No clipboard API, text is already selected
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function close() {
    setState("idle");
    setShareUrl(null);
    setCopied(false);
    setShowConfig(false);
  }

  if (state === "done" && shareUrl) {
    return (
      <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-border bg-surface p-3 shadow-(--shadow-lg)">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-text">Share link</p>
          <button type="button" onClick={close} className="text-text-tertiary hover:text-text">
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="flex gap-1.5">
          <input
            ref={inputRef}
            type="text"
            readOnly
            value={shareUrl}
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 truncate rounded-md border border-border bg-bg px-2 py-1 text-xs text-text-secondary"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text"
          >
            {copied ? <Check className="h-3 w-3 text-success" /> : "Copy"}
          </button>
        </div>

        <p className="mt-1.5 text-[11px] text-text-tertiary">
          Link is selected — press Ctrl+C to copy
        </p>
      </div>
    );
  }

  if (showConfig) {
    return (
      <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-surface p-3 shadow-(--shadow-lg)">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-text">Share settings</p>
          <button type="button" onClick={close} className="text-text-tertiary hover:text-text">
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <label className="text-[11px] text-text-tertiary">Expires:</label>
          <select
            value={expiresInDays ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setExpiresInDays(val ? Number(val) : null);
            }}
            className="rounded-md border border-border bg-bg px-1.5 py-0.5 text-[11px] text-text-secondary"
          >
            <option value="">Never</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </select>
        </div>

        <button
          type="button"
          onClick={createShareLink}
          disabled={state === "loading"}
          className="btn btn-primary w-full text-xs"
        >
          {state === "loading" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Create link"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowConfig(true)}
        className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text"
      >
        <Link2 className="h-3 w-3" />
        {label ?? "Share"}
      </button>
    </div>
  );
}
