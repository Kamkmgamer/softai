import { redirect, notFound } from "next/navigation";
import { StoryboardReviewForm } from "@/components/storyboard-review-form";
import { PageHeader } from "@/components/ui";
import { getProviderJobMetadata, getProviderRoute } from "@/lib/ai-provider-router";
import { getAppSession } from "@/lib/auth";
import { burnStoryboardCredits } from "@/lib/credits";
import { assertPromptAllowed, buildProjectModerationText } from "@/lib/moderation";
import { generateStoryboard } from "@/lib/openrouter";
import { createGenerationJob, getProjectBundle, saveStoryboard } from "@/lib/store";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await getAppSession();
  let bundle = await getProjectBundle(session.userId, projectId);

  if (!bundle) {
    notFound();
  }

  // Multi-shot projects have storyboard pre-approved at creation; skip review
  if (bundle.project.kind === "multi_shot_video") {
    redirect(`/projects/${projectId}`);
  }

  if (!bundle.storyboard || bundle.scenes.length === 0) {
    assertPromptAllowed(buildProjectModerationText(bundle.project));
    await burnStoryboardCredits(session.userId, projectId);
    const route = getProviderRoute("text");
    const generated = await generateStoryboard({
      productName: bundle.project.productName,
      offer: bundle.project.offer,
      cta: bundle.project.cta,
      targetAudience: bundle.project.targetAudience,
      brandVoice: bundle.project.brandVoice,
      script: bundle.project.script,
      language: bundle.project.language,
    });

    await createGenerationJob(session.userId, projectId, {
      type: "storyboard",
      status: "completed",
      ...getProviderJobMetadata(route),
      modelKey: generated.provider,
      requestPayload: generated.requestPayload,
      responsePayload: generated.responsePayload,
    });

    await saveStoryboard(session.userId, projectId, {
      headline: generated.headline,
      hook: generated.hook,
      cta: generated.cta,
      scenes: generated.scenes,
    });
    bundle = await getProjectBundle(session.userId, projectId);
  }

  if (!bundle) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={`Review: ${bundle.project.title}`}
        description="Tighten the hook, narration, and visual direction before rendering."
      />

      <StoryboardReviewForm projectId={projectId} initialBundle={bundle} />
    </div>
  );
}
