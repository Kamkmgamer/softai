import { apiError, requireAppUser } from "@/lib/api";
import { ensureDurableVideoOutputUrl } from "@/lib/media-storage";
import { getShareOutputByToken } from "@/lib/store";
import {
  addProviderAuthHeaders,
  forwardRangeHeaders,
  normalizeVideoContentType,
} from "@/lib/video-proxy";

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

    const isVideo = result.output.type === "final_video";
    const isDownload = new URL(request.url).searchParams.get("download") === "1";
    const outputUrl = await ensureDurableVideoOutputUrl(result.output);

    const upstreamHeaders = new Headers();
    if (isVideo && !isDownload) {
      const range = request.headers.get("range");
      if (range) upstreamHeaders.set("Range", range);
    }
    addProviderAuthHeaders(outputUrl, upstreamHeaders);

    const upstream = await fetch(outputUrl, { cache: "no-store", headers: upstreamHeaders });
    if (!upstream.ok) {
      return apiError(new Error(`Failed to fetch media: upstream returned ${upstream.status}.`), 502);
    }

    const upstreamCt = upstream.headers.get("content-type");
    const contentType = isVideo
      ? normalizeVideoContentType(upstreamCt)
      : upstreamCt ?? "image/png";
    const ext = getExtensionFromContentType(contentType);
    const filename = `${sanitizeFilename(result.output.title)}${ext ? `.${ext}` : ""}`;

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);
    responseHeaders.set("Cache-Control", isDownload ? "private, max-age=0" : "private, max-age=300");

    if (isDownload) {
      responseHeaders.set("Content-Disposition", `attachment; filename="${filename}"`);
    }

    // Always forward range headers for video so seeking works reliably.
    if (isVideo && !isDownload) {
      forwardRangeHeaders(upstream.headers, responseHeaders);
    } else {
      const contentLength = upstream.headers.get("content-length");
      if (contentLength) responseHeaders.set("Content-Length", contentLength);
    }

    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    return apiError(error);
  }
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
