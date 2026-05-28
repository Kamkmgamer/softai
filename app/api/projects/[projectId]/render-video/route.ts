import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { holdVideoCredits, refundVideoCredits, settleVideoCredits } from "@/lib/credits";
import {
  createGenerationJob,
  createOutput,
  getProjectBundle,
  updateGenerationJob,
} from "@/lib/store";
import { buildFinalVideoPrompt, submitVideoRender, pollVideoStatus } from "@/lib/openrouter";

const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 12;

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
    const prompt = buildFinalVideoPrompt({
      headline: bundle.storyboard.headline,
      hook: bundle.storyboard.hook,
      cta: bundle.storyboard.cta,
      language: bundle.project.language,
      scenes: bundle.scenes.map((scene) => ({
        order: scene.order,
        title: scene.title,
        narration: scene.narration,
        visualDirection: scene.visualDirection,
        overlayText: scene.overlayText,
        durationSeconds: scene.durationSeconds,
      })),
    });

    const job = await createGenerationJob(user.id, projectId, {
      type: "video",
      status: "processing",
      requestPayload: { prompt, imageUrls: bundle.scenes.map((scene) => scene.imageUrl as string) },
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

    if (result.status === "completed" && result.url) {
      await createOutput(user.id, projectId, {
        type: "final_video",
        title: `${bundle.project.title} final render`,
        url: result.url,
      });
      await settleVideoCredits(user.id, projectId);
      return apiSuccess({ jobId: job.id, providerJobId: result.id, url: result.url, status: "completed" });
    }

    if (!result.pollingUrl) {
      await settleVideoCredits(user.id, projectId);
      return apiSuccess({ jobId: job.id, providerJobId: result.id, url: null, status: "submitted" });
    }

    // Server-side polling loop
    let videoUrl: string | null = null;
    let finalStatus: string = "processing";

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      const poll = await pollVideoStatus(result.pollingUrl);

      if (poll.status === "completed") {
        videoUrl = poll.url;
        finalStatus = "completed";
        break;
      }

      if (poll.status === "failed") {
        finalStatus = "failed";
        await updateGenerationJob(job.id, {
          status: "failed",
          errorMessage: poll.error ?? "Video generation failed",
        });
        await refundVideoCredits(user.id, projectId);
        heldCredits = false;
        return apiError(new Error(poll.error ?? "Video generation failed."));
      }

      await updateGenerationJob(job.id, {
        status: poll.status === "in_progress" ? "processing" : "submitted",
      });
    }

    if (finalStatus === "completed" && videoUrl) {
      await updateGenerationJob(job.id, { status: "completed" });
      await createOutput(user.id, projectId, {
        type: "final_video",
        title: `${bundle.project.title} final render`,
        url: videoUrl,
      });
      await settleVideoCredits(user.id, projectId);
      return apiSuccess({ jobId: job.id, providerJobId: result.id, url: videoUrl, status: "completed" });
    }

    // Timeout — job remains "submitted", webhook or page refresh will complete it
    return apiSuccess({ jobId: job.id, providerJobId: result.id, url: null, status: "processing" });
  } catch (error) {
    const { projectId } = await params;
    const user = await requireAppUser().catch(() => null);
    if (user && heldCredits) {
      await refundVideoCredits(user.id, projectId);
    }
    return apiError(error);
  }
}
