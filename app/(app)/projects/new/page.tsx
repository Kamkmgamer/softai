import { ProjectCreationForm } from "@/components/project-creation-form";
import { PageHeader } from "@/components/ui";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New project"
        description="Create the brief that drives your campaign."
      />
      <div className="max-w-2xl">
        <ProjectCreationForm />
      </div>
    </div>
  );
}
