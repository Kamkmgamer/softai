import { getEnv } from "@/lib/env";

/**
 * Shared video proxy utilities.
 *
 * Both `/api/projects/…/media` and `/api/share/…/media` routes use these
 * helpers so that content-type handling, auth, and range forwarding behave
 * identically everywhere.
 */

// ---------------------------------------------------------------------------
// Known-provider URL detection
// ---------------------------------------------------------------------------

/**
 * Returns `true` when the URL is a recognised video-content endpoint that may
 * legitimately return `application/octet-stream` instead of a `video/*` MIME.
 */
export function isKnownVideoContentUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    if (
      parsed.hostname.endsWith("openrouter.ai") &&
      /\/api\/v1\/videos\/[^/]+\/content\/?$/.test(path)
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Content-type helpers
// ---------------------------------------------------------------------------

const OCTET_STREAM_TYPES = new Set([
  "application/octet-stream",
  "binary/octet-stream",
]);

/**
 * Determines whether the upstream response should be treated as playable
 * video. This is intentionally lenient: we accept `video/*`, common
 * octet-stream types, and any 2xx from a known video-provider URL.
 */
export function isAcceptableVideoResponse(
  contentType: string | null,
  url: string,
): boolean {
  const lower = contentType?.toLowerCase() ?? "";
  if (lower.startsWith("video/")) return true;
  if (OCTET_STREAM_TYPES.has(lower)) return true;
  if (isKnownVideoContentUrl(url)) return true;
  return false;
}

/**
 * Returns the content-type string that should be forwarded to the browser.
 * If the upstream sent `application/octet-stream` (as OpenRouter does), we
 * rewrite it to `video/mp4` so the `<video>` element will attempt playback.
 */
export function normalizeVideoContentType(
  upstreamContentType: string | null,
): string {
  const lower = upstreamContentType?.toLowerCase() ?? "";
  if (lower.startsWith("video/")) return upstreamContentType!;
  // Octet-stream from a video endpoint → treat as mp4.
  return "video/mp4";
}

// ---------------------------------------------------------------------------
// Auth header injection
// ---------------------------------------------------------------------------

/**
 * Attaches provider-specific auth headers for the given upstream URL.
 * Currently only OpenRouter is supported.
 */
export function addProviderAuthHeaders(url: string, headers: Headers): void {
  const apiKey = getEnv().openRouterApiKey;
  if (!apiKey) return;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("openrouter.ai")) {
      headers.set("Authorization", `Bearer ${apiKey}`);
    }
  } catch {
    // Malformed URL — nothing to attach.
  }
}

// ---------------------------------------------------------------------------
// Range-header forwarding
// ---------------------------------------------------------------------------

/** Headers that should always be forwarded from the upstream for seek support. */
const RANGE_HEADERS = ["accept-ranges", "content-length", "content-range"] as const;

/**
 * Copies range-related headers from the upstream response into `target`.
 * This is required regardless of content-type so that `<video>` seeking works
 * even when the upstream returns `application/octet-stream`.
 */
export function forwardRangeHeaders(
  upstream: Headers,
  target: Headers,
): void {
  for (const header of RANGE_HEADERS) {
    const value = upstream.get(header);
    if (value) target.set(header, value);
  }
}

// ---------------------------------------------------------------------------
// Full proxy helper
// ---------------------------------------------------------------------------

type ProxyVideoOptions = {
  /** The stored upstream URL to fetch from. */
  url: string;
  /** The incoming browser request (used to read Range headers). */
  request: Request;
  /** If true, set Content-Disposition for download. */
  download?: boolean;
  /** Filename for the Content-Disposition header. */
  filename?: string;
  /** Cache-Control value (defaults to "private, max-age=300"). */
  cacheControl?: string;
};

/**
 * Fetches the upstream video URL, normalises the content-type, and returns a
 * ready-to-send `Response` that the browser's `<video>` element can play.
 *
 * Returns `null` when the upstream is unreachable or returns a non-video,
 * non-octet-stream response that is not from a known provider.
 */
export async function proxyVideoResponse(
  options: ProxyVideoOptions,
): Promise<Response | null> {
  const { url, request, download, filename, cacheControl } = options;

  const upstreamHeaders = new Headers();
  const range = request.headers.get("range");
  if (range) upstreamHeaders.set("Range", range);
  addProviderAuthHeaders(url, upstreamHeaders);

  const upstream = await fetch(url, {
    cache: "no-store",
    headers: upstreamHeaders,
  });

  if (!upstream.ok) return null;

  const upstreamCt = upstream.headers.get("content-type");
  if (!isAcceptableVideoResponse(upstreamCt, url)) return null;

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", normalizeVideoContentType(upstreamCt));
  responseHeaders.set(
    "Cache-Control",
    cacheControl ?? "private, max-age=300",
  );

  if (download && filename) {
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );
  }

  forwardRangeHeaders(upstream.headers, responseHeaders);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
