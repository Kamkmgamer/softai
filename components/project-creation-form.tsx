"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ImagePlus, SlidersHorizontal, Volume2 } from "lucide-react";
import { FieldLabel } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { AppBackButton } from "@/components/app-back-button";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
} from "@/lib/i18n";

const initialState = {
  title: "",
  productName: "",
  offer: "",
  cta: "",
  targetAudience: "",
  brandVoice: "",
  platformTarget: "tiktok",
  language: "en" as "en" | "ar",
  script: "",
};

export function ProjectCreationForm() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ ...initialState, language: locale });
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
        setError(payload.error ?? dictionary.projectForm.unableToCreate);
        return;
      }

      router.push(localizePath(`/projects/${payload.project.id}`, locale));
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex min-h-[calc(100dvh-2rem)] flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <AppBackButton />
          <h1 className="text-[15px] font-semibold text-text">Multi-Shot Video</h1>
        </div>
        <div className="rounded-md bg-bg p-0.5 text-xs font-semibold text-text-secondary ring-1 ring-border">
          <span className="inline-flex rounded-sm bg-surface-raised px-3 py-1.5 text-text">
            Auto
          </span>
          <span className="inline-flex px-3 py-1.5">Custom</span>
        </div>
      </div>

      <div className="space-y-2 px-1">
        <FieldLabel
          htmlFor="script-seed"
          label="Describe your story"
          required
        />
        <div className="flex min-h-90 flex-col rounded-xl border border-border bg-bg-subtle p-3 transition-colors focus-within:border-border-strong focus-within:shadow-(--focus-ring)">
          <textarea
            id="script-seed"
            required
            value={form.script}
            onChange={(event) => update("script", event.target.value)}
            className="min-h-75 flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-text placeholder:text-text-tertiary"
            placeholder="A lone astronaut walks across a vast red desert under a pink sky. She stops, kneels, and picks up a glowing object half-buried in the sand. Close-up on her face as she looks up, a massive structure emerges from the dust on the horizon."
          />
          <button
            type="button"
            className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            First frame of video
          </button>
        </div>
      </div>

      <div className="thin-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="project-title"
              label={dictionary.projectForm.title}
              required
            />
            <input
              id="project-title"
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              className="control-field"
              placeholder={dictionary.projectForm.titlePlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="product-name"
              label={dictionary.projectForm.productName}
              required
            />
            <input
              id="product-name"
              required
              value={form.productName}
              onChange={(event) => update("productName", event.target.value)}
              className="control-field"
              placeholder={dictionary.projectForm.productNamePlaceholder}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="offer"
              label={dictionary.projectForm.offer}
              required
            />
            <input
              id="offer"
              required
              value={form.offer}
              onChange={(event) => update("offer", event.target.value)}
              className="control-field"
              placeholder={dictionary.projectForm.offerPlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="cta"
              label={dictionary.projectForm.cta}
              required
            />
            <input
              id="cta"
              required
              value={form.cta}
              onChange={(event) => update("cta", event.target.value)}
              className="control-field"
              placeholder={dictionary.projectForm.ctaPlaceholder}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="target-audience"
              label={dictionary.projectForm.targetAudience}
              required
            />
            <input
              id="target-audience"
              required
              value={form.targetAudience}
              onChange={(event) => update("targetAudience", event.target.value)}
              className="control-field"
              placeholder={dictionary.projectForm.targetAudiencePlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="brand-voice"
              label={dictionary.projectForm.brandVoice}
              required
            />
            <input
              id="brand-voice"
              required
              value={form.brandVoice}
              onChange={(event) => update("brandVoice", event.target.value)}
              className="control-field"
              placeholder={dictionary.projectForm.brandVoicePlaceholder}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <FieldLabel
            htmlFor="platform-target"
            label={dictionary.projectForm.platformFormat}
          />
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
      </div>

      {error ? (
        <div className="rounded-md bg-danger-soft p-3 text-[13px] text-danger">
          {error}
        </div>
      ) : null}

      <div className="-mx-4 mt-auto flex flex-col gap-4 border-t border-border bg-surface px-4 pb-0 pt-3">
        <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold text-text-secondary">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
            <Volume2 className="h-3.5 w-3.5" />
            On
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            9:16
          </span>
          <span className="inline-flex rounded-md border border-border bg-bg px-2.5 py-1.5">
            720p
          </span>
          <span className="inline-flex rounded-md border border-border bg-bg px-2.5 py-1.5">
            10s
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary ml-auto w-full rounded-xl px-5 py-3 text-sm sm:w-auto"
        >
          {isPending ? dictionary.projectForm.creating : "Generate"}
        </button>
      </div>
    </form>
  );
}
