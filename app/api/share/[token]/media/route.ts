import { apiError, requireAppUser } from "@/lib/api";
import { getEnv } from "@/lib/env";
import { getShareOutputByToken } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    await requireAppUser();
    const { token } = await params;
    const result = await getShareOutputByToken(token);

    if (!result) {
      return apiError(new Error("Share link not found or expired."), 404);
    }

    const outputUrl = result.output.url;
    const isVideo = result.output.type === "final_video";
    const isDownload = new URL(request.url).searchParams.get("download") === "1";

    const upstreamHeaders = new Headers();
    if (isVideo && !isDownload) {
      const range = request.headers.get("range");
      if (range) upstreamHeaders.set("Range", range);
    }
    addProviderAuthHeaders(outputUrl, upstreamHeaders);

    const upstream = await fetch(outputUrl, { cache: "no-store", headers: upstreamHeaders });
    if (!upstream.ok) {
      return apiError(new Error("Failed to fetch media."), 502);
    }

    const contentType = upstream.headers.get("content-type") ?? (isVideo ? "video/mp4" : "image/png");
    const ext = getExtensionFromContentType(contentType);
    const filename = `${sanitizeFilename(result.output.title)}${ext ? `.${ext}` : ""}`;

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);
    responseHeaders.set("Cache-Control", isDownload ? "private, max-age=0" : "private, max-age=300");

    if (isDownload) {
      responseHeaders.set("Content-Disposition", `attachment; filename="${filename}"`);
    }

    if (isVideo && !isDownload) {
      for (const header of ["content-length", "content-range", "accept-ranges"]) {
        const value = upstream.headers.get(header);
        if (value) responseHeaders.set(header, value);
      }
    } else {
      const contentLength = upstream.headers.get("content-length");
      if (contentLength) responseHeaders.set("Content-Length", contentLength);
    }

    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    return apiError(error);
  }
}

function addProviderAuthHeaders(url: string, headers: Headers) {
  const apiKey = getEnv().openRouterApiKey;
  if (!apiKey) return;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("openrouter.ai")) {
      headers.set("Authorization", `Bearer ${apiKey}`);
    }
  } catch {}
}

function sanitizeFilename(title: string): string {
  return title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().slice(0, 80) || "download";
}

function getExtensionFromContentType(ct: string): string {
  const lower = ct.toLowerCase();
  if (lower.includes("mp4") || lower.includes("quicktime")) return "mp4";
  if (lower.includes("webm")) return "webm";
  if (lower.includes("ogg")) return "ogg";
  if (lower.includes("png")) return "png";
  if (lower.includes("jpeg") || lower.includes("jpg")) return "jpg";
  if (lower.includes("webp")) return "webp";
  if (lower.includes("gif")) return "gif";
  return "";
}
