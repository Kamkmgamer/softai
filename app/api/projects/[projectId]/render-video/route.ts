import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { getProviderJobMetadata, getProviderRoute } from "@/lib/ai-provider-router";
import { holdVideoCredits, refundVideoCredits, settleVideoCredits } from "@/lib/credits";
import { assertPromptAllowed } from "@/lib/moderation";
import {
  createGenerationJob,
  createOutput,
  getProjectBundle,
  updateGenerationJob,
} from "@/lib/store";
import { buildFinalVideoPrompt, submitVideoRender, pollVideoStatus } from "@/lib/openrouter";

const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 12;

type ProjectRenderMetadata = {
  aspectRatio?: string;
  duration?: string;
  resolution?: string;
};

function getRenderMetadata(value: unknown): ProjectRenderMetadata {
  if (!value || typeof value !== "object") return {};
  return value as ProjectRenderMetadata;
}

function getVideoRenderOptions(metadata: ProjectRenderMetadata) {
  const duration = Number.parseInt(metadata.duration ?? "10s", 10);
  const shortEdge = metadata.resolution === "1080p" ? 1080 : 720;
  const longEdge = metadata.resolution === "1080p" ? 1920 : 1280;
  const size = metadata.aspectRatio === "16:9"
    ? `${longEdge}x${shortEdge}`
    : metadata.aspectRatio === "1:1"
      ? `${shortEdge}x${shortEdge}`
      : `${shortEdge}x${longEdge}`;

  return {
    duration: Number.isFinite(duration) ? duration : 10,
    size,
  };
}

function distributeSceneDurations<T extends { durationSeconds: number }>(scenes: T[], totalDurationSeconds: number) {
  if (scenes.length === 0) return scenes;
  const baseSeconds = Math.floor(totalDurationSeconds / scenes.length);
  const remainder = totalDurationSeconds % scenes.length;

  return scenes.map((scene, index) => ({
    ...scene,
    durationSeconds: baseSeconds + (index < remainder ? 1 : 0),
  }));
}

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

    assertPromptAllowed([
      bundle.storyboard.headline,
      bundle.storyboard.hook,
      bundle.storyboard.cta,
      ...bundle.scenes.map((scene) => `${scene.narration}\n${scene.visualDirection}`),
    ].join("\n"));

    await holdVideoCredits(user.id, projectId);
    heldCredits = true;
    const route = getProviderRoute("video");
    const renderOptions = getVideoRenderOptions(getRenderMetadata(bundle.project.metadata));
    const renderScenes = distributeSceneDurations(bundle.scenes, renderOptions.duration);
    const prompt = buildFinalVideoPrompt({
      headline: bundle.storyboard.headline,
      hook: bundle.storyboard.hook,
      cta: bundle.storyboard.cta,
      language: bundle.project.language,
      scenes: renderScenes.map((scene) => ({
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
      ...getProviderJobMetadata(route),
      requestPayload: { prompt, imageUrls: bundle.scenes.map((scene) => scene.imageUrl as string), options: renderOptions },
    });

    const result = await submitVideoRender(
      prompt,
      bundle.scenes.map((scene) => scene.imageUrl as string),
      bundle.project.language,
      renderOptions,
    );

    await updateGenerationJob(job.id, {
      status: result.status === "completed" ? "completed" : "submitted",
      modelKey: result.provider,
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
