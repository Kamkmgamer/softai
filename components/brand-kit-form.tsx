"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
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

function ColorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-medium text-text">{label}</label>
      <div
        className="flex items-center gap-2.5 rounded-xl border border-border bg-bg-subtle px-3 py-2 transition-colors focus-within:border-border-strong focus-within:shadow-(--focus-ring)"
        dir="ltr"
      >
        <input
          type="color"
          value={value || placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-mono text-text placeholder:text-text-tertiary focus:outline-none"
        />
      </div>
    </div>
  );
}

function FontField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-medium text-text">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-bg-subtle px-3.5 py-2.5 pr-10 text-sm text-text transition-colors focus:border-border-strong focus:shadow-(--focus-ring)"
        >
          {fontOptions.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
      </div>
    </div>
  );
}

type BrandKitFormProps = {
  kit: BrandKitRecord | null;
  onSave: (kit: BrandKitRecord) => void;
};

export function BrandKitForm({ kit, onSave }: BrandKitFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(kit?.name ?? "");
  const [logoUrl, setLogoUrl] = useState(kit?.logoUrl ?? "/logo.png");
  const [primaryColor, setPrimaryColor] = useState(kit?.primaryColor ?? "");
  const [secondaryColor, setSecondaryColor] = useState(
    kit?.secondaryColor ?? "",
  );
  const [headingFont, setHeadingFont] = useState(
    kit?.fonts?.heading ?? "Inter",
  );
  const [bodyFont, setBodyFont] = useState(kit?.fonts?.body ?? "Inter");
  const [toneOfVoice, setToneOfVoice] = useState(
    kit?.toneOfVoice ?? "Professional",
  );
  const [error, setError] = useState<string | null>(null);

  const canSave = name.trim().length >= 1;

  function getUploadedUrl(file: {
    ufsUrl?: string;
    url?: string;
    serverData?: { url?: string } | null;
  }) {
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
    <div className="space-y-5">
      {/* Brand name */}
      <div className="space-y-2">
        <label className="text-[13px] font-medium text-text">Brand name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme Co"
          className="w-full rounded-xl border border-border bg-bg-subtle px-3.5 py-2.5 text-sm text-text placeholder:text-text-tertiary transition-colors focus:border-border-strong focus:shadow-(--focus-ring)s"
        />
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <label className="text-[13px] font-medium text-text">Logo</label>
        {logoUrl ? (
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-bg">
              <Image
                src={logoUrl}
                alt="Logo"
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setLogoUrl("")}
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-danger hover:text-danger"
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
              label: {
                color: "var(--text-secondary)",
                fontSize: "0.75rem",
                fontWeight: 600,
              },
              allowedContent: {
                color: "var(--text-tertiary)",
                fontSize: "0.6875rem",
              },
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

      {/* Colors */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ColorField
          label="Primary color"
          value={primaryColor}
          onChange={setPrimaryColor}
          placeholder="#000000"
        />
        <ColorField
          label="Secondary color"
          value={secondaryColor}
          onChange={setSecondaryColor}
          placeholder="#ffffff"
        />
      </div>

      {/* Fonts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FontField
          label="Heading font"
          value={headingFont}
          onChange={setHeadingFont}
        />
        <FontField label="Body font" value={bodyFont} onChange={setBodyFont} />
      </div>

      {/* Tone of voice */}
      <div className="space-y-2">
        <label className="text-[13px] font-medium text-text">
          Tone of voice
        </label>
        <div className="flex flex-wrap gap-2">
          {toneOptions.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => setToneOfVoice(tone)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
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

      {/* Error */}
      {error ? (
        <div className="rounded-lg bg-danger-soft p-3 text-[13px] text-danger">
          {error}
        </div>
      ) : null}

      {/* Submit */}
      <button
        type="button"
        onClick={onSaveClick}
        disabled={isPending || !canSave}
        className="btn-primary w-full rounded-xl px-5 py-3 text-sm"
      >
        {isPending
          ? "Saving..."
          : kit
            ? "Update brand kit"
            : "Create brand kit"}
      </button>
    </div>
  );
}
