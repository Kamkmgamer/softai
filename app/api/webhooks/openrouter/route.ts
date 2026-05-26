import { apiError, apiSuccess } from "@/lib/api";
import { getEnv } from "@/lib/env";
import { createOutput, updateGenerationJobByProviderJobId } from "@/lib/store";

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function verifyWebhookSecret(request: Request) {
  const secret = getEnv().openRouterWebhookSecret;
  if (!secret) {
    return false;
  }

  const headerSecret =
    request.headers.get("x-openrouter-webhook-secret") ??
    request.headers.get("x-webhook-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  return safeEqual(headerSecret, secret);
}

function normalizeStatus(status: string | null | undefined) {
  if (!status) {
    return "submitted" as const;
  }

  if (["completed", "succeeded", "success"].includes(status)) {
    return "completed" as const;
  }

  if (["failed", "error", "cancelled", "canceled"].includes(status)) {
    return "failed" as const;
  }

  if (["processing", "running", "queued"].includes(status)) {
    return "processing" as const;
  }

  return "submitted" as const;
}

export async function POST(request: Request) {
  try {
    if (!verifyWebhookSecret(request)) {
      return apiError(new Error("Invalid OpenRouter webhook signature."), 401);
    }

    const payload = await request.json();
    const data = payload?.data ?? payload;
    const providerJobId = data?.id ?? data?.job_id ?? data?.video_id ?? null;
    const status = normalizeStatus(data?.status);
    const url =
      data?.url ??
      data?.video_url ??
      data?.output?.url ??
      data?.result?.url ??
      null;

    if (!providerJobId) {
      return apiSuccess({ received: true, provider: "openrouter", ignored: true, payload });
    }

    const job = await updateGenerationJobByProviderJobId(providerJobId, {
      status,
      responsePayload: payload,
      errorMessage: status === "failed" ? JSON.stringify(data?.error ?? payload) : null,
    });

    if (job && status === "completed" && url) {
      await createOutput(job.userId, job.projectId, {
        type: "final_video",
        title: "OpenRouter final render",
        url,
      });
    }

    return apiSuccess({
      received: true,
      provider: "openrouter",
      providerJobId,
      status,
      matchedJob: job?.id ?? null,
      outputUrl: url,
    });
  } catch (error) {
    return apiError(error);
  }
}
