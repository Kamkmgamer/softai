import { Download, Film, ImageIcon } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { OutputWithProject } from "@/lib/types";
import { ShareButton } from "@/components/share-button";

type Props = {
  items: OutputWithProject[];
  locale: Locale;
};

const typeIcons = {
  scene_image: ImageIcon,
  final_video: Film,
  thumbnail: ImageIcon,
};

const typeBadgeLabels: Record<string, Record<Locale, string>> = {
  scene_image: { en: "Image", ar: "صورة" },
  final_video: { en: "Video", ar: "فيديو" },
  thumbnail: { en: "Thumbnail", ar: "مصغرة" },
};

export function HistoryList({ items, locale }: Props) {
  const dictionary = getDictionary(locale);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = typeIcons[item.type] ?? ImageIcon;
        const isVideo = item.type === "final_video";
        const badgeLabel = typeBadgeLabels[item.type]?.[locale] ?? item.type;

        return (
          <div
            key={item.id}
            className="group relative rounded-xl border border-border bg-surface transition-colors hover:bg-surface-raised"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-subtle">
              {isVideo ? (
                <video
                  src={`/api/projects/${item.projectId}/outputs/${item.id}/media`}
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-border/50 bg-bg/80 px-1.5 py-0.5 text-[11px] font-medium text-text-secondary backdrop-blur">
                <Icon className="h-3 w-3" />
                {badgeLabel}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-text">
                  {item.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-text-tertiary">
                  {dictionary.history.from} {item.projectTitle}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-text-tertiary">
                  {formatDate(item.createdAt, locale)}
                </span>
                <div className="flex gap-1">
                  <a
                    href={`/api/projects/${item.projectId}/outputs/${item.id}/download`}
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-bg px-2 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text"
                  >
                    <Download className="h-3 w-3" />
                    <span className="sr-only">{dictionary.history.download}</span>
                  </a>
                  <ShareButton outputId={item.id} label={dictionary.history.share} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
