import { notFound } from "next/navigation";
import { StoryboardReviewForm } from "@/components/storyboard-review-form";
import { Card, PageHeader } from "@/components/ui";
import { getAppSession } from "@/lib/auth";
import { burnStoryboardCredits } from "@/lib/credits";
import { generateStoryboard } from "@/lib/openrouter";
import { createGenerationJob, getProjectBundle, saveStoryboard } from "@/lib/store";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await getAppSession();
  let bundle = getProjectBundle(session.userId, projectId);

  if (!bundle) {
    notFound();
  }

  if (!bundle.storyboard || bundle.scenes.length === 0) {
    burnStoryboardCredits(session.userId, projectId);
    const generated = await generateStoryboard({
      productName: bundle.project.productName,
      offer: bundle.project.offer,
      cta: bundle.project.cta,
      targetAudience: bundle.project.targetAudience,
      brandVoice: bundle.project.brandVoice,
      script: bundle.project.script,
    });

    createGenerationJob(session.userId, projectId, {
      type: "storyboard",
      status: "completed",
      requestPayload: generated.requestPayload,
      responsePayload: generated.responsePayload,
    });

    saveStoryboard(session.userId, projectId, {
      headline: generated.headline,
      hook: generated.hook,
      cta: generated.cta,
      scenes: generated.scenes,
    });
    bundle = getProjectBundle(session.userId, projectId);
  }

  if (!bundle) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Review"
        title={`Polish ${bundle.project.title}`}
        description="This is the lightweight review step. Tighten the hook, scene narration, overlay text, and visual direction before rendering images or video."
      />
      <Card className="rounded-[2rem] p-6">
        <StoryboardReviewForm projectId={projectId} initialBundle={bundle} />
      </Card>
    </div>
  );
}
