"use client";

import { useRef, useState } from "react";
import { FolderArchive } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { OutputWithProject } from "@/lib/types";
import { EmptyState } from "@/components/ui";
import { HistoryFilters } from "./history-filters";
import { HistoryList } from "./history-list";
import { HistoryLoadMore } from "./history-load-more";

export type FilterType = "all" | "scene_image" | "final_video";

type Props = {
  initialItems: OutputWithProject[];
  initialCursor: string | null;
  locale: Locale;
};

export function HistoryPageClient({ initialItems, initialCursor, locale }: Props) {
  const dictionary = getDictionary(locale);
  const [filter, setFilter] = useState<FilterType>("all");
  const [items, setItems] = useState<OutputWithProject[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [filtering, setFiltering] = useState(false);
  const activeFilterRef = useRef<FilterType>("all");

  function handleFilterChange(type: FilterType) {
    activeFilterRef.current = type;
    setFilter(type);
    setCursor(null);
    setFiltering(true);
    void fetchItems(type, null);
  }

  async function fetchItems(type: FilterType, before: string | null) {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (before) params.set("before", before);
    const res = await fetch(`/api/history?${params.toString()}`);
    if (!res.ok) {
      setFiltering(false);
      return;
    }
    const data = await res.json();
    if (type !== activeFilterRef.current) return;
    setItems((prev) => (before ? [...prev, ...(data.items ?? [])] : (data.items ?? [])));
    setCursor(data.nextCursor ?? null);
    setFiltering(false);
  }

  function handleMoreLoaded(newItems: Array<Record<string, unknown>>, nextCursor: string | null, type: FilterType) {
    if (type !== activeFilterRef.current) return;
    setItems((prev) => [...prev, ...(newItems as unknown as OutputWithProject[])]);
    setCursor(nextCursor);
  }

  if (items.length === 0 && !filtering) {
    return (
      <>
        <HistoryFilters
          active={filter}
          onChange={handleFilterChange}
          labels={{
            all: dictionary.history.all,
            images: dictionary.history.images,
            videos: dictionary.history.videos,
          }}
        />
        <EmptyState
          icon={FolderArchive}
          title={dictionary.history.emptyTitle}
          description={filter === "all" ? dictionary.history.emptyDescription : undefined}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <HistoryFilters
        active={filter}
        onChange={handleFilterChange}
        labels={{
          all: dictionary.history.all,
          images: dictionary.history.images,
          videos: dictionary.history.videos,
        }}
      />
      <HistoryList items={items} locale={locale} />
      {cursor ? (
        <HistoryLoadMore
          cursor={cursor}
          type={filter}
          label={dictionary.history.loadMore}
          onLoaded={handleMoreLoaded}
        />
      ) : null}
    </div>
  );
}
