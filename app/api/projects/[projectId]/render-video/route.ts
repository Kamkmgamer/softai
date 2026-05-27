import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { holdVideoCredits, refundVideoCredits, settleVideoCredits } from "@/lib/credits";
import {
  createGenerationJob,
  createOutput,
  getProjectBundle,
  updateGenerationJob,
} from "@/lib/store";
import { submitVideoRender } from "@/lib/openrouter";

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

    if (!bundle.storyboard || bundle.scenes.some((scene) => !scene.imageUrl)) {
      return apiError(new Error("Render scene images before the final video."), 409);
    }

    await holdVideoCredits(user.id, projectId);
    heldCredits = true;
    const prompt = [
      bundle.storyboard.headline,
      bundle.storyboard.hook,
      ...bundle.scenes.map((scene) => scene.narration),
      bundle.storyboard.cta,
    ].join(" ");

    const job = await createGenerationJob(user.id, projectId, {
      type: "video",
      status: "processing",
      requestPayload: { prompt },
    });

    const result = await submitVideoRender(
      prompt,
      bundle.scenes.map((scene) => scene.imageUrl as string),
      bundle.project.language,
    );

    await updateGenerationJob(job.id, {
      status: result.status === "completed" ? "completed" : "submitted",
      providerJobId: result.id,
      responsePayload: result.responsePayload,
    });

    if (result.url) {
      await createOutput(user.id, projectId, {
        type: "final_video",
        title: `${bundle.project.title} final render`,
        url: result.url,
      });
    }

    await settleVideoCredits(user.id, projectId);
    return apiSuccess({ jobId: job.id, providerJobId: result.id, url: result.url });
  } catch (error) {
    const { projectId } = await params;
    const user = await requireAppUser().catch(() => null);
    if (user && heldCredits) {
      await refundVideoCredits(user.id, projectId);
    }
    return apiError(error);
  }
}
