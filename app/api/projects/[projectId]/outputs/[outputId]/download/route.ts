import { apiError, requireAppUser } from "@/lib/api";
import { getEnv } from "@/lib/env";
import { getProjectBundle } from "@/lib/store";

type ResolvedMedia =
  | { kind: "data"; contentType: string; body: Buffer }
  | { kind: "remote"; url: string; contentType?: string };

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

    const resolved = await resolveMedia(output.url);
    if (!resolved) {
      return apiError(new Error("Media URL is not valid."), 422);
    }

    if (resolved.kind === "data") {
      const ext = getExtensionFromContentType(resolved.contentType);
      const filename = `${sanitizeFilename(output.title)}${ext ? `.${ext}` : ""}`;

      return new Response(resolved.body as BodyInit, {
        headers: {
          "Content-Type": resolved.contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "private, max-age=0",
        },
      });
    }

    const upstreamHeaders = new Headers();
    addProviderAuthHeaders(resolved.url, upstreamHeaders);
    const upstream = await fetch(resolved.url, { cache: "no-store", headers: upstreamHeaders });
    if (!upstream.ok) {
      return apiError(new Error("Failed to fetch media."), 502);
    }

    const upstreamContentType = upstream.headers.get("content-type") ?? resolved.contentType ?? "";
    const ext = getExtensionFromContentType(upstreamContentType) || getExtensionFromUrl(resolved.url);
    const filename = `${sanitizeFilename(output.title)}${ext ? `.${ext}` : ""}`;

    const headers = new Headers();
    headers.set("Content-Type", upstreamContentType || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Cache-Control", "private, max-age=0");

    const contentLength = upstream.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    for (const header of ["accept-ranges", "content-range"]) {
      const value = upstream.headers.get(header);
      if (value) headers.set(header, value);
    }

    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    return apiError(error);
  }
}

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
    if (match) return match[1].toLowerCase();
  } catch {}
  return "";
}

async function resolveMedia(value: unknown, depth = 0): Promise<ResolvedMedia | null> {
  if (depth > 8) return null;

  const direct = getDirectMedia(value);
  if (direct) return direct;

  const parsed = parseEmbeddedJson(value);
  if (parsed) return resolveMedia(parsed, depth + 1);

  if (typeof value === "string" && isHttpUrl(value)) {
    const headers = new Headers();
    addProviderAuthHeaders(value, headers);
    const response = await fetch(value, { method: "HEAD", cache: "no-store", headers }).catch(() => null);
    if (!response) return null;

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (contentType.startsWith("video/") || contentType.startsWith("image/")) {
      return { kind: "remote", url: value, contentType };
    }
    if (!contentType.includes("json") && !contentType.startsWith("text/")) return null;

    const text = await fetch(value, { cache: "no-store", headers }).then((r) => r.text()).catch(() => "");
    return resolveMedia(text, depth + 1);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = await resolveMedia(item, depth + 1);
      if (resolved) return resolved;
    }
    return null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["video_url", "videoUrl", "image_url", "imageUrl", "url", "file", "download_url", "downloadUrl", "unsigned_urls", "videos", "output", "data", "result", "media", "content", "generations", "generation"]) {
      const resolved = await resolveMedia(record[key], depth + 1);
      if (resolved) return resolved;
    }
  }

  return null;
}

function getDirectMedia(value: unknown): ResolvedMedia | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();

  if (trimmed.startsWith("data:video/")) {
    const decoded = decodeDataUrl(trimmed);
    return decoded ? { kind: "data", contentType: decoded.contentType, body: decoded.body } : null;
  }

  if (trimmed.startsWith("data:image/")) {
    const decoded = decodeDataUrl(trimmed);
    return decoded ? { kind: "data", contentType: decoded.contentType, body: decoded.body } : null;
  }

  if (isHttpUrl(trimmed)) {
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

function decodeDataUrl(url: string): { contentType: string; body: Buffer } | null {
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
