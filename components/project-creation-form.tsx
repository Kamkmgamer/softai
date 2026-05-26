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
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel label="Project title" hint="Internal name for your campaign." />
          <input
            required
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3"
            placeholder="Summer launch push"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel label="Product name" hint="What you are selling in the ad." />
          <input
            required
            value={form.productName}
            onChange={(event) => update("productName", event.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3"
            placeholder="Glow Serum"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel label="Offer" hint="The deal or value proposition." />
          <input
            required
            value={form.offer}
            onChange={(event) => update("offer", event.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3"
            placeholder="Buy one, get one free"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel label="CTA" hint="How the viewer should act." />
          <input
            required
            value={form.cta}
            onChange={(event) => update("cta", event.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3"
            placeholder="Shop now"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel label="Target audience" hint="Who the ad is for." />
          <input
            required
            value={form.targetAudience}
            onChange={(event) => update("targetAudience", event.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3"
            placeholder="busy founders running Shopify stores"
          />
        </div>
        <div className="space-y-2">
          <FieldLabel label="Brand voice" hint="Tone for the script and visuals." />
          <input
            required
            value={form.brandVoice}
            onChange={(event) => update("brandVoice", event.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3"
            placeholder="clean, energetic, confident"
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel label="Platform target" hint="Format destination for the final render." />
        <select
          value={form.platformTarget}
          onChange={(event) => update("platformTarget", event.target.value)}
          className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3"
        >
          <option value="tiktok">TikTok / Reels</option>
          <option value="instagram">Instagram Stories</option>
          <option value="youtube">YouTube Shorts</option>
        </select>
      </div>

      <div className="space-y-2">
        <FieldLabel
          label="Script seed"
          hint="Paste your rough sales script or the core message you want the storyboard to build from."
        />
        <textarea
          required
          rows={6}
          value={form.script}
          onChange={(event) => update("script", event.target.value)}
          className="w-full rounded-[1.5rem] border border-border bg-white/70 px-4 py-3"
          placeholder="Stop wasting money on ad shoots. Use your product photos and one script to launch vertical ads this week."
        />
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <button
        disabled={isPending}
        className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create project"}
      </button>
    </form>
  );
}
