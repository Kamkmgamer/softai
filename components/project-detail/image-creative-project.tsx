import Image from "next/image";
import { Download, ImageIcon } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { AppBackButton } from "@/components/app-back-button";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { ProjectBundle } from "@/lib/types";

type Props = {
  bundle: ProjectBundle;
  locale: Locale;
};

type CreativeMetadata = {
  app?: "text-to-image" | "image-editor" | "mockup" | "create-ad";
  aspectRatio?: "9:16" | "1:1" | "16:9";
  sourceImageUrl?: string;
  style?: string;
};

function getCreativeMetadata(value: unknown): CreativeMetadata {
  if (!value || typeof value !== "object") return {};
  return value as CreativeMetadata;
}

export function ImageCreativeProject({ bundle, locale }: Props) {
  const dictionary = getDictionary(locale);
  const metadata = getCreativeMetadata(bundle.project.metadata);
  const sourceImageUrl =
    metadata.sourceImageUrl ??
    bundle.assets.find((asset) => asset.name === "Source image")?.url ??
    null;
  const generatedImage =
    bundle.outputs.find((output) => output.type === "scene_image") ?? null;
  const downloadUrl = generatedImage
    ? `/api/projects/${bundle.project.id}/outputs/${generatedImage.id}/download`
    : undefined;
  const appLabel =
    bundle.project.kind === "image_edit" ? "AI Image Editor" : bundle.project.kind === "mockup" ? "Mockup Generator" : bundle.project.kind === "create_ad" ? "Create Ad" : "Text to Image";
  const promptLabel =
    bundle.project.kind === "image_edit" ? "Edit instruction" : bundle.project.kind === "mockup" ? "Scene description" : bundle.project.kind === "create_ad" ? "Ad description" : "Prompt";

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-bg">
      <div className="grid min-h-full lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border-border bg-surface px-5 py-5 lg:border-r lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AppBackButton />
              <h1 className="text-[15px] font-semibold text-text">{appLabel}</h1>
            </div>
            <StatusBadge status={bundle.project.status} />
          </div>

          <div className="mt-8 space-y-6">
            <section>
              <p className="text-xs font-medium text-text-tertiary">
                {promptLabel}
              </p>
              <p className="mt-3 max-h-55 overflow-y-auto rounded-xl border border-border bg-bg-subtle p-3 text-sm leading-6 text-text-secondary">
                {bundle.project.script}
              </p>
            </section>

            <section className="grid gap-3">
              <DetailRow label="Tool" value={appLabel} />
              <DetailRow
                label="Edit mode"
                value={metadata.style ?? bundle.project.offer}
              />
              <DetailRow
                label="Canvas"
                value={metadata.aspectRatio ?? "9:16"}
              />
            </section>

            {sourceImageUrl ? (
              <section>
                <p className="text-xs font-medium text-text-tertiary">
                  Reference image
                </p>
                <div className="mt-3 overflow-hidden rounded-xl border border-border bg-bg-subtle">
                  <Image
                    src={sourceImageUrl}
                    alt="Uploaded source image"
                    width={520}
                    height={520}
                    className="max-h-64 w-full object-contain"
                  />
                </div>
              </section>
            ) : null}
          </div>
        </aside>

        <main className="flex min-h-0 flex-col gap-4 overflow-y-auto px-5 py-6 lg:px-10 lg:py-8">
          {bundle.project.kind === "image_edit" || bundle.project.kind === "mockup" || bundle.project.kind === "create_ad" ? (
            <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-2">
              <ImagePanel
                title="Source"
                imageUrl={sourceImageUrl}
                emptyLabel="No source image saved"
              />
              <ImagePanel
                title={bundle.project.kind === "mockup" ? "Mockup result" : bundle.project.kind === "create_ad" ? "Ad result" : "Edited result"}
                imageUrl={generatedImage?.url ?? null}
                primary
                emptyLabel="Image generation is still pending"
                downloadUrl={downloadUrl}
                downloadLabel={dictionary.library.downloadImage}
              />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-4xl">
              <ImagePanel
                title="Generated result"
                imageUrl={generatedImage?.url ?? null}
                primary
                emptyLabel="Image generation is still pending"
                downloadUrl={downloadUrl}
                downloadLabel={dictionary.library.downloadImage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ImagePanel({
  title,
  imageUrl,
  primary = false,
  emptyLabel,
  downloadUrl,
  downloadLabel,
}: {
  title: string;
  imageUrl: string | null;
  primary?: boolean;
  emptyLabel: string;
  downloadUrl?: string;
  downloadLabel?: string;
}) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-border bg-surface p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        {primary && downloadUrl ? (
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text"
          >
            <Download className="h-3 w-3" />
            {downloadLabel}
          </a>
        ) : primary ? (
          <span className="text-xs font-medium text-text-tertiary">
            Result
          </span>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-bg-subtle">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-tertiary">
            <ImageIcon className="h-5 w-5" />
            <p className="text-sm font-semibold">{emptyLabel}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-subtle px-3 py-2.5">
      <p className="text-xs font-medium text-text-tertiary">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-text">{value}</p>
    </div>
  );
}
