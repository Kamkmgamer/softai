"use client";

import { cn } from "@/lib/utils";

type FilterType = "all" | "scene_image" | "final_video";

type Props = {
  active: FilterType;
  onChange: (type: FilterType) => void;
  labels: { all: string; images: string; videos: string };
};

const filters: Array<{ value: FilterType; labelKey: "all" | "images" | "videos" }> = [
  { value: "all", labelKey: "all" },
  { value: "scene_image", labelKey: "images" },
  { value: "final_video", labelKey: "videos" },
];

export function HistoryFilters({ active, onChange, labels }: Props) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors",
            active === f.value
              ? "border-accent bg-accent-soft text-accent-text"
              : "border-border bg-surface text-text-secondary hover:bg-surface-raised hover:text-text",
          )}
        >
          {labels[f.labelKey]}
        </button>
      ))}
    </div>
  );
}
