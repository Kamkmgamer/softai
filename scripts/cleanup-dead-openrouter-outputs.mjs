import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DRY_RUN = process.argv.includes("--dry-run");

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const sql = neon(process.env.DATABASE_URL);

const candidates = await sql`
  SELECT id, title, url, created_at
  FROM outputs
  WHERE type = 'final_video'
    AND removed_at IS NULL
    AND url ILIKE '%openrouter.ai%'
  ORDER BY created_at ASC
`;

console.log(`Found ${candidates.length} OpenRouter video output(s) to soft-delete.`);

if (candidates.length === 0) {
  process.exit(0);
}

for (const output of candidates) {
  console.log(`${DRY_RUN ? "Would delete" : "Deleting"} ${output.id}: ${output.title}`);
  console.log(`  ${output.url}`);

  if (DRY_RUN) continue;

  await sql`
    UPDATE outputs
    SET removed_at = NOW()
    WHERE id = ${output.id}
      AND removed_at IS NULL
  `;
}

if (DRY_RUN) {
  console.log("Dry run complete. Re-run without --dry-run to delete.");
} else {
  const remaining = await sql`
    SELECT count(*)::int AS count
    FROM outputs
    WHERE type = 'final_video'
      AND removed_at IS NULL
      AND url ILIKE '%openrouter.ai%'
  `;
  console.log(`Done. Remaining visible OpenRouter video output(s): ${remaining[0]?.count ?? 0}`);
}
