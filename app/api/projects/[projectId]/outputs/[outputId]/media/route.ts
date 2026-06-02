import { apiError, requireAppUser } from "@/lib/api";
import { ensureDurableVideoOutputUrl } from "@/lib/media-storage";
import { getProjectBundle } from "@/lib/store";
import {
  addProviderAuthHeaders,
  isAcceptableVideoResponse,
  normalizeVideoContentType,
  forwardRangeHeaders,
} from "@/lib/video-proxy";

export async function GET(
  request: Request,
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
      return apiError(new Error("Output not found in project."), 404);
    }

    const url = await ensureDurableVideoOutputUrl(output);

    // Data-URL: decode inline, no HTTP fetch.
    if (typeof url === "string" && url.trimStart().startsWith("data:video/")) {
      const decoded = decodeDataUrl(url.trim());
      if (!decoded) {
        return apiError(new Error("Invalid video data URL."), 422);
      }
      return new Response(decoded.body as BodyInit, {
        headers: {
          "Content-Type": decoded.contentType,
          "Cache-Control": "private, max-age=300",
        },
      });
    }

    // Must be an HTTP(S) URL.
    if (typeof url !== "string" || !isHttpUrl(url)) {
      return apiError(new Error("Video URL is not playable."), 422);
    }

    // Single fetch — no probe. This matches what the download route does and
    // avoids the double-fetch bug where resolveVideo would probe the URL
    // (consuming the connection / single-use token) and then the handler
    // would fetch it again and get a 404 or timeout.
    const headers = new Headers();
    const range = request.headers.get("range");
    if (range) headers.set("Range", range);
    addProviderAuthHeaders(url, headers);

    const upstream = await fetch(url, { cache: "no-store", headers });

    if (!upstream.ok) {
      return apiError(new Error(`Upstream video returned ${upstream.status}.`), 502);
    }

    const upstreamCt = upstream.headers.get("content-type");

    // Happy path: upstream is video or octet-stream from a known provider.
    if (isAcceptableVideoResponse(upstreamCt, url)) {
      const responseHeaders = new Headers({
        "Content-Type": normalizeVideoContentType(upstreamCt),
        "Cache-Control": "private, max-age=300",
      });
      forwardRangeHeaders(upstream.headers, responseHeaders);
      return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
    }

    // Fallback: upstream returned JSON/text (some providers wrap the real URL
    // in a JSON envelope). Try to extract a video URL and follow it once.
    const lower = upstreamCt?.toLowerCase() ?? "";
    if (lower.includes("json") || lower.startsWith("text/")) {
      const text = await upstream.text().catch(() => "");
      const innerUrl = extractVideoUrlFromText(text);
      if (innerUrl) {
        const innerHeaders = new Headers();
        if (range) innerHeaders.set("Range", range);
        addProviderAuthHeaders(innerUrl, innerHeaders);
        const inner = await fetch(innerUrl, { cache: "no-store", headers: innerHeaders });
        if (inner.ok && isAcceptableVideoResponse(inner.headers.get("content-type"), innerUrl)) {
          const responseHeaders = new Headers({
            "Content-Type": normalizeVideoContentType(inner.headers.get("content-type")),
            "Cache-Control": "private, max-age=300",
          });
          forwardRangeHeaders(inner.headers, responseHeaders);
          return new Response(inner.body, { status: inner.status, headers: responseHeaders });
        }
      }
    }

    return apiError(new Error("Video URL is not playable."), 422);
  } catch (error) {
    return apiError(error);
  }
}

// ---------------------------------------------------------------------------
// Helpers (kept local — only this route needs them)
// ---------------------------------------------------------------------------

/** Try to find a video URL inside a JSON or text blob. */
function extractVideoUrlFromText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const parsed = parseJson(trimmed);
  if (!parsed) return null;

  return findNestedUrl(parsed, 0);
}

function findNestedUrl(value: unknown, depth: number): string | null {
  if (depth > 6) return null;

  if (typeof value === "string") {
    const url = value.trim();
    if (isHttpUrl(url) || url.startsWith("data:video/")) return url;
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findNestedUrl(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of [
      "video_url", "videoUrl", "url", "file",
      "download_url", "downloadUrl", "unsigned_urls",
      "videos", "output", "data", "result", "media",
      "content", "generations", "generation",
    ]) {
      const found = findNestedUrl(record[key], depth + 1);
      if (found) return found;
    }
  }

  return null;
}

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

type DecodedDataUrl = { contentType: string; body: Buffer };

function decodeDataUrl(url: string): DecodedDataUrl | null {
  const commaIndex = url.indexOf(",");
  if (commaIndex === -1) return null;

  const metadata = url.slice(5, commaIndex);
  const [contentType = "video/mp4"] = metadata.split(";");
  const payload = url.slice(commaIndex + 1);
  const body = metadata.toLowerCase().includes(";base64")
    ? Buffer.from(payload, "base64")
    : Buffer.from(decodeURIComponent(payload), "binary");

  return { contentType, body };
}

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}
