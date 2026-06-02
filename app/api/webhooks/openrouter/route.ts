import { apiError, apiSuccess } from "@/lib/api";
import { refundVideoCredits, settleVideoCredits } from "@/lib/credits";
import { getEnv } from "@/lib/env";
import { storeVideoDurably } from "@/lib/media-storage";
import { extractVideoUrlFromUnsignedUrls } from "@/lib/openrouter";
import { createOutput, updateGenerationJob, updateGenerationJobByProviderJobId } from "@/lib/store";
import crypto from "crypto";

const FIVE_MINUTES_IN_SECONDS = 300;

function verifyWebhookSignature(request: Request, rawBody: string): boolean {
  const secret = getEnv().openRouterWebhookSecret;
  if (!secret) {
    return false;
  }

  const signatureHeader = request.headers.get("x-openrouter-signature") ?? "";
  if (!signatureHeader) {
    return false;
  }

  const parts = signatureHeader.split(",");
  const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
  const hash = parts.find((p) => p.startsWith("v1="))?.slice(3);

  if (!timestamp || !hash) {
    return false;
  }

  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (Number.isNaN(age) || age > FIVE_MINUTES_IN_SECONDS) {
    return false;
  }

  const signedPayload = `${timestamp},${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  if (expected.length !== hash.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
}

function normalizeStatus(status: string | null | undefined) {
  if (!status) {
    return "submitted" as const;
  }

  if (["completed", "succeeded", "success"].includes(status)) {
    return "completed" as const;
  }

  if (["failed", "error", "cancelled", "canceled", "expired"].includes(status)) {
    return "failed" as const;
  }

  if (["processing", "running", "queued", "in_progress"].includes(status)) {
    return "processing" as const;
  }

  return "submitted" as const;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    if (!verifyWebhookSignature(request, rawBody)) {
      return apiError(new Error("Invalid OpenRouter webhook signature."), 401);
    }

    const payload = JSON.parse(rawBody);
    const data = payload?.data ?? payload;
    const providerJobId = data?.id ?? data?.job_id ?? data?.video_id ?? null;
    const status = normalizeStatus(data?.status);

    const url =
      extractVideoUrlFromUnsignedUrls(data?.unsigned_urls) ??
      data?.url ??
      data?.video_url ??
      data?.output?.url ??
      data?.result?.url ??
      null;

    if (!providerJobId) {
      return apiSuccess({ received: true, provider: "openrouter", ignored: true, payload });
    }

    let outputUrl = url;

    const job = await updateGenerationJobByProviderJobId(providerJobId, {
      status: status === "completed" && url ? "processing" : status,
      responsePayload: payload,
      errorMessage: status === "failed" ? JSON.stringify(data?.error ?? payload) : null,
    }, { onlyIfStatus: ["queued", "submitted", "processing"] });

    if (job && status === "completed" && url) {
      const title = "OpenRouter final render";
      const durableUrl = await storeVideoDurably({ sourceUrl: url, title });
      outputUrl = durableUrl;
      await updateGenerationJob(job.id, { status: "completed" });
      await createOutput(job.userId, job.projectId, {
        type: "final_video",
        title,
        url: durableUrl,
      });
      await settleVideoCredits(job.userId, job.projectId);
    }

    if (job && status === "failed") {
      await refundVideoCredits(job.userId, job.projectId);
    }

    return apiSuccess({
      received: true,
      provider: "openrouter",
      providerJobId,
      status,
      matchedJob: job?.id ?? null,
      outputUrl,
    });
  } catch (error) {
    return apiError(error);
  }
}
