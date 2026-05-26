import { Card, PageHeader, Pill } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { listProjects } from "@/lib/store";

export default async function LibraryPage() {
  const session = await getAppSession();
  const projects = listProjects(session.userId);
  const outputs = projects.flatMap((project) =>
    project ? [] : [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Assets, avatars, and outputs."
        description="A single archive for the product assets you uploaded and the creative artifacts the generation pipeline produced."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Project archive</h2>
            <Pill>{projects.length} campaigns</Pill>
          </div>
          <div className="mt-6 space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-[1.5rem] border border-border bg-white/70 p-4">
                <p className="font-semibold">{project.title}</p>
                <p className="mt-1 text-sm text-muted">{project.productName}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold">Output policy</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <p>All generated outputs should carry traceable metadata and remain linked to the originating project.</p>
            <p>Identity-based generations require user attestation and must not depict celebrities or public figures without consent.</p>
            <p>{outputs.length === 0 ? "No final outputs have been rendered yet." : `${outputs.length} outputs available.`}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
