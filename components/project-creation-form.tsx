"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FieldLabel } from "@/components/ui";

const initialState = {
  title: "",
  productName: "",
  offer: "",
  cta: "",
  targetAudience: "",
  brandVoice: "",
  platformTarget: "tiktok",
  script: "",
};

export function ProjectCreationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof initialState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to create project.");
        return;
      }

      router.push(`/projects/${payload.project.id}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="project-title" label="Project title" required />
            <input
              id="project-title"
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              className="control-field"
              placeholder="e.g. Summer launch push"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="product-name" label="Product name" required />
            <input
              id="product-name"
              required
              value={form.productName}
              onChange={(event) => update("productName", event.target.value)}
              className="control-field"
              placeholder="e.g. Glow Serum"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="offer" label="Offer" required />
            <input
              id="offer"
              required
              value={form.offer}
              onChange={(event) => update("offer", event.target.value)}
              className="control-field"
              placeholder="e.g. Buy one, get one free"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="cta" label="Call to action" required />
            <input
              id="cta"
              required
              value={form.cta}
              onChange={(event) => update("cta", event.target.value)}
              className="control-field"
              placeholder="e.g. Shop now"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="target-audience" label="Target audience" required />
            <input
              id="target-audience"
              required
              value={form.targetAudience}
              onChange={(event) => update("targetAudience", event.target.value)}
              className="control-field"
              placeholder="e.g. busy founders"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="brand-voice" label="Brand voice" required />
            <input
              id="brand-voice"
              required
              value={form.brandVoice}
              onChange={(event) => update("brandVoice", event.target.value)}
              className="control-field"
              placeholder="e.g. clean, energetic"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="platform-target" label="Platform format" />
          <select
            id="platform-target"
            value={form.platformTarget}
            onChange={(event) => update("platformTarget", event.target.value)}
            className="control-field bg-surface"
          >
            <option value="tiktok">TikTok / Reels (9:16)</option>
            <option value="instagram">Instagram Stories (9:16)</option>
            <option value="youtube">YouTube Shorts (9:16)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <FieldLabel
            htmlFor="script-seed"
            label="Script seed"
            hint="Paste your rough sales script or core message."
            required
          />
          <textarea
            id="script-seed"
            required
            rows={4}
            value={form.script}
            onChange={(event) => update("script", event.target.value)}
            className="control-field resize-y"
            placeholder="Introduce the problem, present the product, and give the offer..."
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end pt-2 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full sm:w-auto"
        >
          {isPending ? "Creating project..." : "Create project"}
        </button>
      </div>
    </form>
  );
}
