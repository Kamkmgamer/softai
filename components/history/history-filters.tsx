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
            "shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors",
            active === f.value
              ? "border-text bg-text text-bg"
              : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-raised",
          )}
        >
          {labels[f.labelKey]}
        </button>
      ))}
    </div>
  );
}
