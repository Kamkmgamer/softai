import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { UTApi } from "uploadthing/server";

const DRY_RUN = process.argv.includes("--dry-run");

const databaseUrl = process.env.DATABASE_URL;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const uploadThingToken = process.env.UPLOADTHING_TOKEN;

if (!databaseUrl) throw new Error("DATABASE_URL is required.");
if (!openRouterApiKey) throw new Error("OPENROUTER_API_KEY is required.");
if (!uploadThingToken) throw new Error("UPLOADTHING_TOKEN is required.");

const sql = neon(databaseUrl);
const utapi = new UTApi();

const candidates = await sql`
  SELECT id, title, url
  FROM outputs
  WHERE type = 'final_video'
    AND removed_at IS NULL
    AND url ILIKE '%openrouter.ai%'
  ORDER BY created_at ASC
`;

console.log(`Found ${candidates.length} OpenRouter video output(s).`);

if (candidates.length === 0) {
  process.exit(0);
}

const failures = [];

for (const output of candidates) {
  console.log(`${DRY_RUN ? "Would migrate" : "Migrating"} ${output.id}: ${output.title}`);
  console.log(`  ${output.url}`);

  if (DRY_RUN) continue;

  let durableUrl;
  try {
    durableUrl = await uploadOpenRouterVideo(output.url, output.title);
  } catch (error) {
    failures.push({ id: output.id, title: output.title, url: output.url, error: getErrorMessage(error) });
    console.error(`  !! ${getErrorMessage(error)}`);
    continue;
  }

  await sql`
    UPDATE outputs
    SET url = ${durableUrl}
    WHERE id = ${output.id}
      AND url = ${output.url}
  `;

  console.log(`  -> ${durableUrl}`);
}

if (DRY_RUN) {
  console.log("Dry run complete. Re-run without --dry-run to migrate.");
} else {
  const remaining = await sql`
    SELECT count(*)::int AS count
    FROM outputs
    WHERE type = 'final_video'
      AND removed_at IS NULL
      AND url ILIKE '%openrouter.ai%'
  `;
  console.log(`Migration complete. Remaining OpenRouter video output(s): ${remaining[0]?.count ?? 0}`);
  if (failures.length > 0) {
    console.log(`Failed to migrate ${failures.length} output(s):`);
    for (const failure of failures) {
      console.log(`- ${failure.id} (${failure.title}): ${failure.error}`);
    }
  }
}

async function uploadOpenRouterVideo(url, title) {
  const upstream = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${openRouterApiKey}`,
    },
  });

  if (!upstream.ok) {
    throw new Error(`Failed to fetch ${url}: upstream returned ${upstream.status}.`);
  }

  const upstreamContentType = upstream.headers.get("content-type") ?? "";
  if (!isAcceptableVideoResponse(upstreamContentType, url)) {
    throw new Error(`Upstream did not return video content for ${url}. Content-Type: ${upstreamContentType || "none"}`);
  }

  const contentType = normalizeVideoContentType(upstreamContentType);
  const blob = await upstream.blob();
  const file = new File([blob], getVideoFilename(title, contentType, url), { type: contentType });
  const result = await utapi.uploadFiles(file, { contentDisposition: "inline" });
  const durableUrl = result?.data?.ufsUrl ?? result?.ufsUrl;

  if (!durableUrl) {
    throw new Error(`UploadThing upload failed for ${url}: ${JSON.stringify(result?.error ?? result)}`);
  }

  return durableUrl;
}

function isAcceptableVideoResponse(contentType, url) {
  const lower = contentType.toLowerCase();
  if (lower.startsWith("video/")) return true;
  if (lower === "application/octet-stream" || lower === "binary/octet-stream") return true;
  return isKnownOpenRouterContentUrl(url);
}

function normalizeVideoContentType(contentType) {
  const lower = contentType.toLowerCase();
  if (lower.startsWith("video/")) return contentType;
  return "video/mp4";
}

function isKnownOpenRouterContentUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith("openrouter.ai") && /\/api\/v1\/videos\/[^/]+\/content\/?$/.test(parsed.pathname.toLowerCase());
  } catch {
    return false;
  }
}

function getVideoFilename(title, contentType, sourceUrl) {
  const base = sanitizeFilename(title);
  const ext = getExtensionFromContentType(contentType) || getExtensionFromUrl(sourceUrl) || "mp4";
  return `${base}.${ext}`;
}

function sanitizeFilename(title) {
  return title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().slice(0, 80) || "video";
}

function getExtensionFromContentType(contentType) {
  const lower = contentType.toLowerCase();
  if (lower.includes("mp4") || lower.includes("quicktime")) return "mp4";
  if (lower.includes("webm")) return "webm";
  if (lower.includes("ogg")) return "ogg";
  return "";
}

function getExtensionFromUrl(url) {
  try {
    const match = new URL(url).pathname.match(/\.([a-zA-Z0-9]+)(?:$|[?#])/);
    return match?.[1]?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
