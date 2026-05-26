import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, WandSparkles } from "lucide-react";
import { ProjectActions } from "@/components/project-actions";
import { ProjectInputs } from "@/components/project-inputs";
import { Card, PageHeader, Pill } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { getProjectBundle } from "@/lib/store";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await getAppSession();
  const bundle = getProjectBundle(session.userId, projectId);

  if (!bundle) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Project"
        title={bundle.project.title}
        description={`${bundle.project.productName} for ${bundle.project.targetAudience}. Review the storyboard, render images, and finish with the final vertical video.`}
        action={<Pill>{bundle.project.status.replaceAll("_", " ")}</Pill>}
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Brief</h2>
            <Link href={`/projects/${projectId}/review`} className="text-sm font-semibold text-accent-strong">
              Review storyboard
            </Link>
          </div>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Offer", bundle.project.offer],
              ["CTA", bundle.project.cta],
              ["Audience", bundle.project.targetAudience],
              ["Voice", bundle.project.brandVoice],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="mt-2 font-medium text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 rounded-[1.5rem] border border-border bg-white/70 p-5">
            <p className="text-sm text-muted">Script seed</p>
            <p className="mt-2 text-sm leading-7 text-foreground">{bundle.project.script}</p>
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold">Pipeline actions</h2>
          <div className="mt-6 grid gap-4">
            <ActionTile
              icon={WandSparkles}
              title="Generate storyboard"
              description="Burns storyboard credits and drafts 3-6 scenes."
              href={`/projects/${projectId}/review`}
            />
          </div>
          <div className="mt-6">
            <ProjectActions projectId={projectId} />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] p-6" id="images">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Scene gallery</h2>
            <span className="text-sm text-muted">{bundle.scenes.length} scenes</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bundle.scenes.map((scene) => (
              <div key={scene.id} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                <div className="aspect-[9/16] overflow-hidden rounded-[1.25rem] bg-accent-soft">
                  {scene.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={scene.imageUrl} alt={scene.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted">No image yet</div>
                  )}
                </div>
                <h3 className="mt-4 font-semibold">{scene.title}</h3>
                <p className="mt-1 text-sm text-muted">{scene.overlayText}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6" id="video">
          <h2 className="text-xl font-semibold">Outputs</h2>
          <div className="mt-6 space-y-4">
            {bundle.outputs.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-white/50 p-8 text-sm text-muted">
                Render images and the final video to populate the output library.
              </div>
            ) : (
              bundle.outputs.map((output) => (
                <div key={output.id} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{output.title}</p>
                      <p className="text-sm text-muted">{output.type.replace("_", " ")}</p>
                    </div>
                    <a href={output.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent-strong">
                      Open
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <ProjectInputs projectId={projectId} />
    </div>
  );
}

function ActionTile({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-[1.5rem] border border-border bg-white/70 p-5 transition hover:border-accent">
      <Icon className="h-5 w-5 text-accent-strong" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
    </Link>
  );
}
