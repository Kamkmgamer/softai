"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { FilterType } from "./history-page-client";

type Props = {
  cursor: string;
  type: FilterType;
  label: string;
  onLoaded: (items: Array<Record<string, unknown>>, nextCursor: string | null, type: FilterType) => void;
};

export function HistoryLoadMore({ cursor, type, label, onLoaded }: Props) {
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ before: cursor });
      if (type !== "all") params.set("type", type);
      const res = await fetch(`/api/history?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      onLoaded(data.items ?? [], data.nextCursor ?? null, type);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={loadMore}
      disabled={loading}
      className="btn btn-secondary mx-auto"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        label
      )}
    </button>
  );
}
