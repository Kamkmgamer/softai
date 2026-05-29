import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { getProviderJobMetadata, getProviderRoute } from "@/lib/ai-provider-router";
import { holdImageCredits, refundImageCredits, settleImageCredits } from "@/lib/credits";
import { assertPromptAllowed } from "@/lib/moderation";
import { createGenerationJob, createOutput, getProjectBundle, saveSceneImage, updateGenerationJob } from "@/lib/store";
import { buildSceneImagePrompt, generateSceneImage } from "@/lib/openrouter";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  let heldCredits = false;

  try {
    const user = await requireAppUser();
    const { projectId } = await params;
    const bundle = await getProjectBundle(user.id, projectId);

    if (!bundle) {
      return apiError(new Error("Project not found."), 404);
    }

    if (!bundle.storyboard || bundle.scenes.length === 0) {
      return apiError(new Error("Approve a storyboard before rendering images."), 409);
    }

    assertPromptAllowed([
      bundle.storyboard.headline,
      bundle.storyboard.hook,
      bundle.storyboard.cta,
      ...bundle.scenes.map((scene) => scene.visualDirection),
    ].join("\n"));

    await holdImageCredits(user.id, projectId);
    heldCredits = true;

    const jobs = await Promise.all(
      bundle.scenes.map(async (scene) => {
        const route = getProviderRoute("image");
        const prompt = buildSceneImagePrompt({
          headline: bundle.storyboard?.headline ?? bundle.project.title,
          visualDirection: scene.visualDirection,
          language: bundle.project.language,
        });
        const job = await createGenerationJob(user.id, projectId, {
          type: "image",
          status: "processing",
          ...getProviderJobMetadata(route),
          requestPayload: { prompt, sceneId: scene.id },
        });
        let result: Awaited<ReturnType<typeof generateSceneImage>>;
        try {
          result = await generateSceneImage(prompt, bundle.project.language);
        } catch (error) {
          await updateGenerationJob(job.id, {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Image generation failed.",
          });
          throw error;
        }
        await updateGenerationJob(job.id, {
          status: "completed",
          responsePayload: result.responsePayload,
          modelKey: result.provider,
        });
        if (result.imageUrl) {
          await saveSceneImage(projectId, scene.order, result.imageUrl);
          await createOutput(user.id, projectId, {
            type: "scene_image",
            title: `${scene.title} image`,
            url: result.imageUrl,
          });
        }
        return result;
      }),
    );

    await settleImageCredits(user.id, projectId);
    return apiSuccess({ jobs });
  } catch (error) {
    const { projectId } = await params;
    const user = await requireAppUser().catch(() => null);
    if (user && heldCredits) {
      await refundImageCredits(user.id, projectId);
    }
    return apiError(error);
  }
}
