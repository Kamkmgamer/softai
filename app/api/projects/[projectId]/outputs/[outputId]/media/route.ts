import { apiError, requireAppUser } from "@/lib/api";
import { getEnv } from "@/lib/env";
import { getProjectBundle } from "@/lib/store";

type ResolvedVideo =
  | { kind: "data"; contentType: string; body: Buffer }
  | { kind: "remote"; url: string };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; outputId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { projectId, outputId } = await params;
    const bundle = await getProjectBundle(user.id, projectId);
    const output = bundle?.outputs.find((entry) => entry.id === outputId && entry.type === "final_video");

    if (!output) {
      return apiError(new Error("Output not found."), 404);
    }

    const resolved = await resolveVideo(output.url);
    if (!resolved) {
      return apiError(new Error("Video URL is not playable."), 422);
    }

    if (resolved.kind === "data") {
      return new Response(resolved.body as BodyInit, {
        headers: {
          "Content-Type": resolved.contentType,
          "Cache-Control": "private, max-age=300",
        },
      });
    }

    const headers = new Headers();
    const range = request.headers.get("range");
    if (range) headers.set("Range", range);
    addProviderAuthHeaders(resolved.url, headers);

    const upstream = await fetch(resolved.url, { cache: "no-store", headers });
    if (!upstream.ok || !isVideoContentType(upstream.headers.get("content-type"))) {
      return apiError(new Error("Video URL is not playable."), 422);
    }

    const responseHeaders = new Headers({
      "Content-Type": upstream.headers.get("content-type") ?? "video/mp4",
      "Cache-Control": "private, max-age=300",
    });
    for (const header of ["accept-ranges", "content-length", "content-range"]) {
      const value = upstream.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }

    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    return apiError(error);
  }
}

async function resolveVideo(value: unknown, depth = 0): Promise<ResolvedVideo | null> {
  if (depth > 8) return null;

  const direct = getDirectVideo(value);
  if (direct) return direct;

  const parsed = parseEmbeddedJson(value);
  if (parsed) return resolveVideo(parsed, depth + 1);

  if (typeof value === "string" && isHttpUrl(value)) {
    const headers = new Headers();
    addProviderAuthHeaders(value, headers);
    const response = await fetch(value, { cache: "no-store", headers }).catch(() => null);
    if (!response) return null;

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (isVideoContentType(contentType)) return { kind: "remote", url: value };
    if (!contentType.includes("json") && !contentType.startsWith("text/")) return null;

    const text = await response.text().catch(() => "");
    return resolveVideo(text, depth + 1);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = await resolveVideo(item, depth + 1);
      if (resolved) return resolved;
    }
    return null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["video_url", "videoUrl", "url", "file", "download_url", "downloadUrl", "unsigned_urls", "videos", "output", "data", "result", "media", "content", "generations", "generation"]) {
      const resolved = await resolveVideo(record[key], depth + 1);
      if (resolved) return resolved;
    }
  }

  return null;
}

function getDirectVideo(value: unknown): ResolvedVideo | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();

  if (trimmed.startsWith("data:video/")) {
    return decodeDataUrl(trimmed);
  }

  if (isHttpUrl(trimmed) && /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(trimmed)) {
    return { kind: "remote", url: trimmed };
  }

  return null;
}

function parseEmbeddedJson(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return parseJson(trimmed);
  }

  const dataJsonPrefix = "data:application/json";
  if (!trimmed.toLowerCase().startsWith(dataJsonPrefix)) return null;

  const commaIndex = trimmed.indexOf(",");
  if (commaIndex === -1) return null;

  const metadata = trimmed.slice(0, commaIndex).toLowerCase();
  const payload = trimmed.slice(commaIndex + 1);
  const json = metadata.includes(";base64")
    ? Buffer.from(payload, "base64").toString("utf8")
    : decodeURIComponent(payload);

  return parseJson(json);
}

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function decodeDataUrl(url: string): ResolvedVideo | null {
  const commaIndex = url.indexOf(",");
  if (commaIndex === -1) return null;

  const metadata = url.slice(5, commaIndex);
  const [contentType = "video/mp4"] = metadata.split(";");
  const payload = url.slice(commaIndex + 1);
  const body = metadata.toLowerCase().includes(";base64")
    ? Buffer.from(payload, "base64")
    : Buffer.from(decodeURIComponent(payload), "binary");

  return { kind: "data", contentType, body };
}

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function isVideoContentType(value: string | null) {
  return value?.toLowerCase().startsWith("video/") ?? false;
}

function addProviderAuthHeaders(url: string, headers: Headers) {
  const apiKey = getEnv().openRouterApiKey;
  if (!apiKey) return;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("openrouter.ai")) {
      headers.set("Authorization", `Bearer ${apiKey}`);
    }
  } catch {
  }
}
