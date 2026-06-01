"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTemplatesByKit, type Template } from "@/lib/templates";
import type { StarterKit } from "@/lib/features";

type TemplateBrowserProps = {
  kit: StarterKit;
};

export function TemplateBrowser({ kit }: TemplateBrowserProps) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const templates = getTemplatesByKit(kit);

  if (templates.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface/80 px-5 py-6 text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-text-tertiary" />
        <p className="text-sm text-text-secondary">
          No templates available for this kit yet.
        </p>
      </div>
    );
  }

  function handleUseTemplate(template: Template) {
    const params = new URLSearchParams({
      template: template.id,
      prompt: template.prompt,
      preset: template.presets[0] ?? "",
      aspect: template.aspectRatio,
    });
    router.push(`/apps/${template.appSlug}?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent-text" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
          Quick-start templates
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {templates.map((template) => {
          const active = selectedTemplate?.id === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                setSelectedTemplate(active ? null : template);
              }}
              className={cn(
                "group rounded-xl border p-3 text-left transition-colors",
                active
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-raised",
              )}
            >
              <p className="text-sm font-semibold text-text">{template.name}</p>
              <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                {template.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.presets.slice(0, 2).map((preset) => (
                  <span
                    key={preset}
                    className="rounded-md bg-bg px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary"
                  >
                    {preset}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selectedTemplate ? (
        <button
          type="button"
          onClick={() => handleUseTemplate(selectedTemplate)}
          className="btn-primary w-full rounded-xl px-4 py-2.5 text-sm"
        >
          Use &ldquo;{selectedTemplate.name}&rdquo; template
        </button>
      ) : null}
    </div>
  );
}
