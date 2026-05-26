import { ProjectCreationForm } from "@/components/project-creation-form";
import { Card, PageHeader } from "@/components/ui";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="New Project"
        title="Create the brief that drives your campaign."
        description="Keep v1 opinionated: product, audience, offer, CTA, and one script seed. The rest of the system works from that brief."
      />
      <Card className="rounded-[2rem] p-6">
        <ProjectCreationForm />
      </Card>
    </div>
  );
}
