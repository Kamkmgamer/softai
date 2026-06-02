import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { getProviderJobMetadata, getProviderRoute } from "@/lib/ai-provider-router";
import { holdVideoCredits, refundVideoCredits, settleVideoCredits } from "@/lib/credits";
import { storeVideoDurably } from "@/lib/media-storage";
import { assertPromptAllowed } from "@/lib/moderation";
import { pollVideoStatus, submitVideoRender, type VideoFrameReference } from "@/lib/openrouter";
import {
  addBrandAsset,
  approveStoryboard,
  createGenerationJob,
  createOutput,
  createProject,
  saveSceneImage,
  saveStoryboard,
  updateGenerationJob,
} from "@/lib/store";
import type { JobStatus } from "@/lib/types";
import { imageToVideoSchema } from "@/lib/validators";

const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 6;
const NON_FINAL_STATUSES: JobStatus[] = ["queued", "submitted", "processing"];

type ImageToVideoInput = Awaited<ReturnType<typeof readImageToVideoInput>>;

function readImageToVideoInput(request: Request) {
  return readJson(request, imageToVideoSchema);
}

function titleFromPrompt(prompt: string) {
  return prompt.trim().slice(0, 64) + (prompt.trim().length > 64 ? "..." : "");
}

function parseDurationSeconds(duration: string) {
  const seconds = Number.parseInt(duration, 10);
  return Number.isFinite(seconds) ? seconds : 5;
}

function getVideoSize(input: Pick<ImageToVideoInput, "aspectRatio" | "resolution">) {
  const shortEdge = input.resolution === "1080p" ? 1080 : 720;
  const longEdge = input.resolution === "1080p" ? 1920 : 1280;

  if (input.aspectRatio === "9:16") return `${shortEdge}x${longEdge}`;
  if (input.aspectRatio === "1:1") return `${shortEdge}x${shortEdge}`;
  return `${longEdge}x${shortEdge}`;
}

function buildPrompt(input: ImageToVideoInput) {
  return [
    `Motion direction: ${input.prompt}.`,
    `Target format: ${input.aspectRatio}, ${input.duration}, ${input.resolution}.`,
    "Keep subject identity, product details, logos that exist in the source, colors, and composition stable. Avoid invented text, captions, watermarks, or UI overlays.",
  ].join(" ");
}

function getFrameReferences(input: ImageToVideoInput): VideoFrameReference[] {
  return [
    { url: input.firstFrameUrl, role: "first_frame" },
    ...(input.lastFrameUrl ? [{ url: input.lastFrameUrl, role: "last_frame" } satisfies VideoFrameReference] : []),
  ];
}

export async function POST(request: Request) {
  let heldVideoCreditsForProject: string | null = null;

  try {
    const user = await requireAppUser();
    const input = await readImageToVideoInput(request);

    assertPromptAllowed(input.prompt);

    const project = await createProject(user.id, {
      kind: "image_to_video",
      title: titleFromPrompt(input.prompt),
      productName: input.lastFrameUrl ? "First and Last Frame Video" : "Image to Video",
      offer: input.lastFrameUrl ? "Frame interpolation" : "First-frame animation",
      cta: "Generate video",
      targetAudience: "small business customers",
      brandVoice: "cinematic, polished, product-safe",
      platformTarget: "tiktok",
      language: "en",
      script: input.prompt,
      metadata: {
        ...input,
        mode: input.lastFrameUrl ? "first_last_frames" : "first_frame",
      },
    });

    await addBrandAsset(user.id, project.id, {
      type: "reference_image",
      name: "First frame reference",
      url: input.firstFrameUrl,
    });

    if (input.lastFrameUrl) {
      await addBrandAsset(user.id, project.id, {
        type: "reference_image",
        name: "Last frame reference",
        url: input.lastFrameUrl,
      });
    }

    await saveStoryboard(user.id, project.id, {
      headline: input.lastFrameUrl ? "First-to-last frame video" : "Image-to-video animation",
      hook: input.prompt,
      cta: "Generate video",
      scenes: input.lastFrameUrl
        ? [
            {
              title: "First frame",
              narration: "Open exactly on the uploaded first frame.",
              visualDirection: "Use the first uploaded image as the exact opening frame.",
              overlayText: "",
              durationSeconds: Math.max(3, Math.floor(parseDurationSeconds(input.duration) / 2)),
            },
            {
              title: "Last frame",
              narration: "Resolve exactly into the uploaded last frame.",
              visualDirection: "Use the last uploaded image as the exact final frame.",
              overlayText: "",
              durationSeconds: Math.max(3, Math.ceil(parseDurationSeconds(input.duration) / 2)),
            },
          ]
        : [
            {
              title: "Animated first frame",
              narration: "Animate from the uploaded image with controlled motion.",
              visualDirection: "Use the uploaded image as the exact opening frame, then add the requested motion.",
              overlayText: "",
              durationSeconds: parseDurationSeconds(input.duration),
            },
          ],
    });
    await approveStoryboard(user.id, project.id);
    await saveSceneImage(project.id, 1, input.firstFrameUrl);
    if (input.lastFrameUrl) {
      await saveSceneImage(project.id, 2, input.lastFrameUrl);
    }

    await holdVideoCredits(user.id, project.id);
    heldVideoCreditsForProject = project.id;

    const route = getProviderRoute("video");
    const prompt = buildPrompt(input);
    const frameReferences = getFrameReferences(input);
    const options = {
      duration: parseDurationSeconds(input.duration),
      size: getVideoSize(input),
    };

    const job = await createGenerationJob(user.id, project.id, {
      type: "video",
      status: "processing",
      ...getProviderJobMetadata(route),
      requestPayload: { prompt, frameReferences, options },
    });

    const result = await submitVideoRender(prompt, frameReferences, "en", options);

    await updateGenerationJob(job.id, {
      status: result.status === "completed" && result.url ? "processing" : "submitted",
      modelKey: result.provider,
      providerJobId: result.id,
      responsePayload: result.responsePayload,
    });

    if (result.status === "completed" && result.url) {
      const title = `${project.title} video`;
      const durableUrl = await storeVideoDurably({ sourceUrl: result.url, title });
      await updateGenerationJob(job.id, { status: "completed" });
      await createOutput(user.id, project.id, {
        type: "final_video",
        title,
        url: durableUrl,
      });
      await settleVideoCredits(user.id, project.id);
      heldVideoCreditsForProject = null;
      return apiSuccess({ project: { id: project.id, title: project.title, kind: project.kind }, url: durableUrl }, { status: 201 });
    }

    if (result.pollingUrl) {
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        const poll = await pollVideoStatus(result.pollingUrl);

        if (poll.status === "completed" && poll.url) {
          const title = `${project.title} video`;
          const durableUrl = await storeVideoDurably({ sourceUrl: poll.url, title });
          const updated = await updateGenerationJob(job.id, { status: "completed" }, { onlyIfStatus: NON_FINAL_STATUSES });
          if (!updated) break;
          await createOutput(user.id, project.id, {
            type: "final_video",
            title,
            url: durableUrl,
          });
          await settleVideoCredits(user.id, project.id);
          heldVideoCreditsForProject = null;
          return apiSuccess({ project: { id: project.id, title: project.title, kind: project.kind }, url: durableUrl }, { status: 201 });
        }

        if (poll.status === "failed") {
          const updated = await updateGenerationJob(job.id, {
            status: "failed",
            errorMessage: poll.error ?? "Video generation failed.",
          }, { onlyIfStatus: NON_FINAL_STATUSES });
          if (!updated) break;
          await refundVideoCredits(user.id, project.id);
          heldVideoCreditsForProject = null;
          return apiError(new Error(poll.error ?? "Video generation failed."));
        }

        await updateGenerationJob(job.id, {
          status: poll.status === "in_progress" ? "processing" : "submitted",
        }, { onlyIfStatus: NON_FINAL_STATUSES });
      }
    }

    return apiSuccess({ project: { id: project.id, title: project.title, kind: project.kind }, url: null }, { status: 201 });
  } catch (error) {
    const user = await requireAppUser().catch(() => null);
    if (user && heldVideoCreditsForProject) {
      await refundVideoCredits(user.id, heldVideoCreditsForProject);
    }
    return apiError(error);
  }
}
