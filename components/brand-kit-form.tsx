"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Palette } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";
import { cn } from "@/lib/utils";
import type { BrandKitRecord } from "@/lib/types";

const fontOptions = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Playfair Display",
  "Raleway",
  "Oswald",
  "Lato",
  "Merriweather",
];

const toneOptions = [
  "Professional",
  "Friendly",
  "Bold",
  "Luxurious",
  "Playful",
  "Minimal",
  "Energetic",
  "Calm",
];

type BrandKitFormProps = {
  kit: BrandKitRecord | null;
  onSave: (kit: BrandKitRecord) => void;
};

export function BrandKitForm({ kit, onSave }: BrandKitFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(kit?.name ?? "");
  const [logoUrl, setLogoUrl] = useState(kit?.logoUrl ?? "/logo.png");
  const [primaryColor, setPrimaryColor] = useState(kit?.primaryColor ?? "");
  const [secondaryColor, setSecondaryColor] = useState(kit?.secondaryColor ?? "");
  const [headingFont, setHeadingFont] = useState(kit?.fonts?.heading ?? "Inter");
  const [bodyFont, setBodyFont] = useState(kit?.fonts?.body ?? "Inter");
  const [toneOfVoice, setToneOfVoice] = useState(kit?.toneOfVoice ?? "Professional");
  const [error, setError] = useState<string | null>(null);

  const canSave = name.trim().length >= 1;

  function getUploadedUrl(file: { ufsUrl?: string; url?: string; serverData?: { url?: string } | null }) {
    return file.ufsUrl ?? file.serverData?.url ?? file.url ?? null;
  }

  async function onSaveClick() {
    if (!canSave) return;
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/brand-kit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: kit?.id,
            name: name.trim(),
            logoUrl,
            primaryColor: primaryColor || null,
            secondaryColor: secondaryColor || null,
            fonts: { heading: headingFont, body: bodyFont },
            toneOfVoice,
          }),
        });
        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? "Failed to save brand kit.");
          return;
        }

        onSave(result.kit);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
          <Palette className="h-5 w-5 text-accent-text" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text">Brand Kit</h2>
          <p className="text-sm text-text-secondary">
            Define your brand identity. It will be applied automatically to all generations.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text">Brand name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Co"
            className="w-full rounded-xl border border-border bg-bg-subtle px-4 py-3 text-sm text-text placeholder:text-text-tertiary transition-colors focus:border-border-strong focus:shadow-(--focus-ring)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text">Logo</label>
          {logoUrl ? (
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-xl border border-border bg-bg">
                <Image src={logoUrl} alt="Logo" width={64} height={64} className="h-full w-full object-contain" />
              </div>
              <button
                type="button"
                onClick={() => { setLogoUrl(null); }}
                className="text-xs font-medium text-text-secondary hover:text-danger transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <UploadDropzone
              endpoint="mediaReferenceUploader"
              config={{ mode: "auto" }}
              appearance={{
                container: {
                  border: "1px dashed var(--border)",
                  background: "var(--bg-subtle)",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                },
                label: { color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600 },
                allowedContent: { color: "var(--text-tertiary)", fontSize: "0.6875rem" },
                button: { display: "none" },
              }}
              content={{
                label: "Drop logo here",
                allowedContent: "PNG, JPG, or SVG up to 4MB",
              }}
              onClientUploadComplete={(files) => {
                const firstFile = files[0];
                if (!firstFile) return;
                const uploadedUrl = getUploadedUrl(firstFile);
                if (!uploadedUrl) {
                  setError("Upload completed, but no URL returned.");
                  return;
                }
                setLogoUrl(uploadedUrl);
                setError(null);
              }}
              onUploadError={(err) => setError(err.message)}
            />
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Primary color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor || "#000000"}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm text-text font-mono transition-colors focus:border-border-strong focus:shadow-(--focus-ring)"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Secondary color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor || "#ffffff"}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1 rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm text-text font-mono transition-colors focus:border-border-strong focus:shadow-(--focus-ring)"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Heading font</label>
            <select
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm text-text transition-colors focus:border-border-strong focus:shadow-(--focus-ring)"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Body font</label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2.5 text-sm text-text transition-colors focus:border-border-strong focus:shadow-(--focus-ring)"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text">Tone of voice</label>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setToneOfVoice(tone)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                  toneOfVoice === tone
                    ? "border-accent bg-accent-soft text-accent-text"
                    : "border-border bg-bg text-text-secondary hover:bg-surface-raised hover:text-text",
                )}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-md bg-danger-soft p-3 text-sm text-danger">{error}</div>
        ) : null}

        <button
          type="button"
          onClick={onSaveClick}
          disabled={isPending || !canSave}
          className="btn-primary w-full rounded-xl px-5 py-3 text-sm"
        >
          {isPending ? "Saving..." : kit ? "Update brand kit" : "Create brand kit"}
        </button>
      </div>
    </div>
  );
}
