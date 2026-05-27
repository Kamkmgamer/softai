"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FieldLabel } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, getLocaleFromPathname, localizePath } from "@/lib/i18n";

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
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="project-title" label={dictionary.projectForm.title} required />
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
            <FieldLabel htmlFor="product-name" label={dictionary.projectForm.productName} required />
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="offer" label={dictionary.projectForm.offer} required />
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
            <FieldLabel htmlFor="cta" label={dictionary.projectForm.cta} required />
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="target-audience" label={dictionary.projectForm.targetAudience} required />
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
            <FieldLabel htmlFor="brand-voice" label={dictionary.projectForm.brandVoice} required />
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
          <FieldLabel htmlFor="platform-target" label={dictionary.projectForm.platformFormat} />
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
            label={dictionary.projectForm.scriptSeed}
            hint={dictionary.projectForm.scriptHint}
            required
          />
          <textarea
            id="script-seed"
            required
            rows={4}
            value={form.script}
            onChange={(event) => update("script", event.target.value)}
            className="control-field resize-y"
            placeholder={dictionary.projectForm.scriptPlaceholder}
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
          {isPending ? dictionary.projectForm.creating : dictionary.projectForm.create}
        </button>
      </div>
    </form>
  );
}
