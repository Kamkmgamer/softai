import { UTApi } from "uploadthing/server";
import {
  addProviderAuthHeaders,
  isAcceptableVideoResponse,
  normalizeVideoContentType,
} from "@/lib/video-proxy";
import { updateOutputUrl } from "@/lib/store";
import type { OutputRecord } from "@/lib/types";

type UploadedVideo = {
  ufsUrl: string;
};

type UploadResult = {
  data?: UploadedVideo | null;
  error?: unknown;
};

type VideoUploader = (file: File) => Promise<unknown>;

type DurableVideoOptions = {
  sourceUrl: string;
  title: string;
  fetcher?: typeof fetch;
  uploader?: VideoUploader;
};

const utapi = new UTApi();

export function isDurableMediaUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname === "ufs.sh" || hostname.endsWith(".ufs.sh") || hostname.endsWith("uploadthing.com");
  } catch {
    return false;
  }
}

export async function storeVideoDurably(options: DurableVideoOptions): Promise<string> {
  const { sourceUrl, title, fetcher = fetch, uploader = uploadVideoFile } = options;

  if (isDurableMediaUrl(sourceUrl)) {
    return sourceUrl;
  }

  const upstreamHeaders = new Headers();
  addProviderAuthHeaders(sourceUrl, upstreamHeaders);

  const upstream = await fetcher(sourceUrl, {
    cache: "no-store",
    headers: upstreamHeaders,
  });

  if (!upstream.ok) {
    throw new Error(`Failed to fetch completed video: upstream returned ${upstream.status}.`);
  }

  const upstreamContentType = upstream.headers.get("content-type");
  if (!isAcceptableVideoResponse(upstreamContentType, sourceUrl)) {
    throw new Error("Completed video URL did not return video content.");
  }

  const contentType = normalizeVideoContentType(upstreamContentType);
  const blob = await upstream.blob();
  const file = new File([blob], getVideoFilename(title, contentType, sourceUrl), { type: contentType });
  const uploadResult = await uploader(file);
  const uploaded = getUploadedVideo(uploadResult);

  if (!uploaded?.ufsUrl) {
    throw new Error("Failed to store completed video durably.");
  }

  return uploaded.ufsUrl;
}

export async function ensureDurableVideoOutputUrl(
  output: Pick<OutputRecord, "id" | "type" | "title" | "url">,
): Promise<string> {
  if (output.type !== "final_video" || !isHttpUrl(output.url) || isDurableMediaUrl(output.url)) {
    return output.url;
  }

  const durableUrl = await storeVideoDurably({ sourceUrl: output.url, title: output.title });
  await updateOutputUrl(output.id, durableUrl);
  return durableUrl;
}

async function uploadVideoFile(file: File) {
  return utapi.uploadFiles(file, { contentDisposition: "inline" });
}

function getUploadedVideo(result: unknown): UploadedVideo | null {
  if (!result || typeof result !== "object") return null;

  const maybeResult = result as UploadResult;
  if (maybeResult.data?.ufsUrl) return maybeResult.data;

  if ("ufsUrl" in maybeResult && typeof maybeResult.ufsUrl === "string") {
    return { ufsUrl: maybeResult.ufsUrl };
  }

  return null;
}

function getVideoFilename(title: string, contentType: string, sourceUrl: string): string {
  const base = sanitizeFilename(title);
  const ext = getExtensionFromContentType(contentType) || getExtensionFromUrl(sourceUrl) || "mp4";
  return `${base}.${ext}`;
}

function sanitizeFilename(title: string): string {
  return title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().slice(0, 80) || "video";
}

function getExtensionFromContentType(contentType: string): string {
  const lower = contentType.toLowerCase();
  if (lower.includes("mp4") || lower.includes("quicktime")) return "mp4";
  if (lower.includes("webm")) return "webm";
  if (lower.includes("ogg")) return "ogg";
  return "";
}

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)(?:$|[?#])/);
    return match?.[1]?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

function isHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
