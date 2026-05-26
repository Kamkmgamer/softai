import Link from "next/link";
import { ArrowRight, Film, Folder, Sparkles, Wallet } from "lucide-react";
import { Card, PageHeader, Pill } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { getDashboardStats, listProjects } from "@/lib/store";
import { formatCredits, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getAppSession();
  const stats = getDashboardStats(session.userId);
  const projects = listProjects(session.userId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Build ad campaigns from one brief."
        description="Create the product brief, review the storyboard, and push scene generation and final render from the same project."
        action={
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
          >
            New project
            <Sparkles className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-5 lg:grid-cols-4">
        {[
          { label: "Active projects", value: stats.activeProjects, icon: Folder },
          { label: "Completed videos", value: stats.completedVideos, icon: Film },
          { label: "Credit balance", value: formatCredits(stats.creditBalance), icon: Wallet },
          { label: "Monthly credits", value: formatCredits(stats.monthlyCredits), icon: ArrowRight },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="rounded-[2rem] p-5">
              <Icon className="h-5 w-5 text-accent-strong" />
              <p className="mt-6 text-sm text-muted">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Projects</h2>
              <p className="mt-1 text-sm text-muted">Drafts, review states, and completed renders.</p>
            </div>
            <Pill>{projects.length} total</Pill>
          </div>

          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-white/70 p-5 transition hover:border-accent"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted">
                      {project.productName} for {project.targetAudience}
                    </p>
                  </div>
                  <Pill>{project.status.replaceAll("_", " ")}</Pill>
                </div>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{project.offer}</span>
                  <span>Updated {formatDate(project.updatedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Workflow</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
            <p>1. Create a project brief with product, audience, offer, CTA, and script.</p>
            <p>2. Upload assets and a consent-attested avatar reference.</p>
            <p>3. Generate a storyboard and edit the scenes before render.</p>
            <p>4. Render images, then submit the final 9:16 video job.</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
