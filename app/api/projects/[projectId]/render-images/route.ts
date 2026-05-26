import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { holdImageCredits, refundImageCredits, settleImageCredits } from "@/lib/credits";
import { createGenerationJob, createOutput, getProjectBundle, saveSceneImage, updateGenerationJob } from "@/lib/store";
import { generateSceneImage } from "@/lib/openrouter";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { projectId } = await params;
    const bundle = getProjectBundle(user.id, projectId);

    if (!bundle) {
      return apiError(new Error("Project not found."), 404);
    }

    if (!bundle.storyboard || bundle.scenes.length === 0) {
      return apiError(new Error("Approve a storyboard before rendering images."), 409);
    }

    holdImageCredits(user.id, projectId);

    const jobs = await Promise.all(
      bundle.scenes.map(async (scene) => {
        const prompt = `${bundle.storyboard?.headline}. ${scene.visualDirection}. Overlay text: ${scene.overlayText}. Vertical ad frame 9:16.`;
        const job = createGenerationJob(user.id, projectId, {
          type: "image",
          status: "processing",
          requestPayload: { prompt, sceneId: scene.id },
        });
        const result = await generateSceneImage(prompt);
        updateGenerationJob(job.id, {
          status: "completed",
          responsePayload: result.responsePayload,
        });
        if (result.imageUrl) {
          saveSceneImage(projectId, scene.order, result.imageUrl);
          createOutput(user.id, projectId, {
            type: "scene_image",
            title: `${scene.title} image`,
            url: result.imageUrl,
          });
        }
        return result;
      }),
    );

    settleImageCredits(user.id, projectId);
    return apiSuccess({ jobs });
  } catch (error) {
    const { projectId } = await params;
    const user = await requireAppUser().catch(() => null);
    if (user) {
      refundImageCredits(user.id, projectId);
    }
    return apiError(error);
  }
}
