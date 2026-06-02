import { apiError, requireAppUser } from "@/lib/api";
import { ensureDurableVideoOutputUrl } from "@/lib/media-storage";
import { getProjectBundle } from "@/lib/store";
import {
  addProviderAuthHeaders,
  forwardRangeHeaders,
  normalizeVideoContentType,
} from "@/lib/video-proxy";

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

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
    if (match) return match[1].toLowerCase();
  } catch {}
  return "";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; outputId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { projectId, outputId } = await params;
    const bundle = await getProjectBundle(user.id, projectId);

    if (!bundle) {
      return apiError(new Error("Project not found."), 404);
    }

    const output = bundle.outputs.find((entry) => entry.id === outputId);
    if (!output) {
      return apiError(new Error("Output not found."), 404);
    }

    const isVideo = output.type === "final_video";
    const mediaUrl = await ensureDurableVideoOutputUrl(output);
    const upstreamHeaders = new Headers();
    addProviderAuthHeaders(mediaUrl, upstreamHeaders);

    const upstream = await fetch(mediaUrl, { cache: "no-store", headers: upstreamHeaders });
    if (!upstream.ok) {
      return apiError(new Error(`Failed to fetch media: upstream returned ${upstream.status}.`), 502);
    }

    const upstreamContentType = upstream.headers.get("content-type") ?? "";
    const contentType = isVideo
      ? normalizeVideoContentType(upstreamContentType)
      : upstreamContentType || "application/octet-stream";
    const ext = getExtensionFromContentType(contentType) || getExtensionFromUrl(mediaUrl);
    const filename = `${sanitizeFilename(output.title)}${ext ? `.${ext}` : ""}`;

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Cache-Control", "private, max-age=0");

    forwardRangeHeaders(upstream.headers, headers);

    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    return apiError(error);
  }
}
