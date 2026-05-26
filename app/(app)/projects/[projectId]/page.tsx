import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectActions } from "@/components/project-actions";
import { ProjectInputs } from "@/components/project-inputs";
import { PageHeader, StatusBadge, ButtonLink, SectionHeader, DataRow, EmptyState } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { getProjectBundle } from "@/lib/store";
import { ImageIcon } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await getAppSession();
  const bundle = await getProjectBundle(session.userId, projectId);

  if (!bundle) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title={bundle.project.title}
        action={<StatusBadge status={bundle.project.status} />}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          {/* Brief section */}
          <section className="space-y-4">
            <SectionHeader
              title="Project brief"
              action={
                <Link href={`/projects/${projectId}/review`} className="text-[13px] font-medium text-accent-text hover:underline">
                  Review storyboard
                </Link>
              }
            />
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface">
              <div className="px-5">
                <DataRow label="Product">{bundle.project.productName}</DataRow>
                <DataRow label="Offer">{bundle.project.offer}</DataRow>
                <DataRow label="CTA">{bundle.project.cta}</DataRow>
                <DataRow label="Audience">{bundle.project.targetAudience}</DataRow>
                <DataRow label="Voice">{bundle.project.brandVoice}</DataRow>
              </div>
              <div className="border-t border-border bg-surface-raised px-5 py-4 rounded-b-[var(--radius-lg)]">
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Script seed</p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{bundle.project.script}</p>
              </div>
            </div>
          </section>

          {/* Scene gallery */}
          <section className="space-y-4">
            <SectionHeader title="Scene gallery" count={`${bundle.scenes.length} scenes`} />
            <div className="grid gap-4 sm:grid-cols-2">
              {bundle.scenes.length === 0 ? (
                <div className="sm:col-span-2">
                  <EmptyState title="No scenes yet" description="Generate a storyboard to see scenes here." />
                </div>
              ) : (
                bundle.scenes.map((scene) => (
                  <div key={scene.id} className="group relative overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
                    <div className="aspect-[9/16] bg-surface-sunken">
                      {scene.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={scene.imageUrl} alt={scene.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-text-tertiary">
                          <ImageIcon className="h-6 w-6 opacity-50" />
                          <span className="text-[11px] font-medium">Pending render</span>
                        </div>
                      )}
                    </div>
                    {/* Gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">Scene {scene.order}</p>
                      <h3 className="mt-0.5 text-[13px] font-medium leading-tight">{scene.title}</h3>
                      {scene.overlayText && (
                        <p className="mt-1.5 text-xs font-medium text-accent-soft line-clamp-2">&quot;{scene.overlayText}&quot;</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Actions */}
          <section className="space-y-4">
            <SectionHeader title="Pipeline actions" />
            <div className="space-y-3">
              <ButtonLink href={`/projects/${projectId}/review`} variant="secondary">
                Generate storyboard
              </ButtonLink>
              <ProjectActions
                projectId={projectId}
                canRenderImages={Boolean(bundle.storyboard && bundle.scenes.length > 0)}
                canRenderVideo={Boolean(bundle.storyboard && bundle.scenes.length > 0 && bundle.scenes.every((scene) => scene.imageUrl))}
              />
            </div>
          </section>

          {/* Outputs */}
          <section className="space-y-4">
            <SectionHeader title="Final outputs" count={bundle.outputs.length} />
            {bundle.outputs.length === 0 ? (
              <EmptyState title="No outputs" description="Render the video to see outputs here." />
            ) : (
              <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
                {bundle.outputs.map((output) => (
                  <div key={output.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-text">{output.title}</p>
                      <p className="text-[11px] text-text-tertiary uppercase tracking-wider mt-0.5">{output.type.replace("_", " ")}</p>
                    </div>
                    <a href={output.url} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-accent-text hover:underline">
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <ProjectInputs projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
