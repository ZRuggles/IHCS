/**
 * Publishes every waiting draft — the same steps as the editor's Publish
 * button, without signing in to the editor.
 *
 *   npx tsx --env-file=.env scripts/publish.ts                      # list what is waiting
 *   npx tsx --env-file=.env scripts/publish.ts --apply "note"       # publish
 *
 * This does not rebuild the sites; trigger that with Render's Manual Deploy
 * or a push to master. Until a rebuild, visitors keep the previous content.
 */

import { sql } from "../src/lib/db.js";
import { json } from "../src/lib/json.js";
import { publishDrafts } from "../src/lib/publishing.js";

const apply = process.argv.includes("--apply");
const note = process.argv.slice(2).filter((arg) => arg !== "--apply").join(" ") || null;

// Content-block pages that belong to the care site; everything else is the
// school site or shared.
const CARE_PAGES = new Set(["ihsHome", "ihsContact", "ihsEducation", "services", "employment"]);

async function main() {
  const courses = await sql<{ slug: string; status: string; published_at: string | null; changed: string[] }[]>`
    select slug, status::text, published_at::text,
      array_remove(array[
        case when published_data->>'title' is distinct from title then 'title' end,
        case when published_data->>'duration' is distinct from duration then 'duration' end,
        case when published_data->>'description' is distinct from description then 'description' end,
        case when published_data->'details'->>'overview' is distinct from overview then 'overview' end,
        case when published_data->'details'->'curriculum' is distinct from to_jsonb(curriculum) then 'curriculum' end,
        case when published_data->'details'->'requirements' is distinct from to_jsonb(requirements) then 'requirements' end,
        case when published_data->'details'->>'cost' is distinct from cost then 'cost' end,
        case when published_data->'details'->>'schedule' is distinct from schedule_summary then 'schedule' end,
        case when published_data->>'nextStart' is distinct from next_start then 'next start' end
      ], null) as changed
    from courses
    where deleted_at is null and (published_at is null or updated_at > published_at)
    order by sort_order`;
  const blocks = await sql<{ page: string; key: string; draft_value: unknown; published_value: unknown }[]>`
    select page, key, draft_value, published_value from content_blocks
    where draft_value is distinct from published_value order by page, key`;
  const settings = await sql<{ key: string }[]>`
    select key from site_settings where draft_value is distinct from published_value order by key`;

  console.log("Waiting to publish:");
  for (const c of courses) {
    const live = c.status === "published" ? "" : ` (status ${c.status}: not shown on the site)`;
    console.log(`  school program ${c.slug}${live}: ${c.changed.length ? c.changed.join(", ") : "metadata only"}`);
  }
  for (const b of blocks) {
    const site = CARE_PAGES.has(b.page) ? "CARE SITE" : "school/shared";
    console.log(`  ${site} text ${b.page}/${b.key}: ${JSON.stringify(b.published_value)} -> ${JSON.stringify(b.draft_value)}`);
  }
  for (const s of settings) console.log(`  setting ${s.key}`);
  if (!courses.length && !blocks.length && !settings.length) console.log("  nothing");

  if (!apply) {
    console.log("\nNothing was published. Re-run with --apply to publish.");
    return;
  }

  const { publishId, payload } = await publishDrafts(null, note);
  await sql`insert into audit_log (user_id, action, entity, detail) values (null, 'publish', ${publishId}, ${json({ courses: payload.courses.length, note, via: "scripts/publish.ts" })})`;
  console.log(`\nPublished (publish #${publishId}). ${payload.courses.length} programs in the published content:`);
  for (const course of payload.courses) console.log(`  ${course.id}: ${course.title}`);
}

main()
  .catch((error) => {
    console.error(`Stopped: ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
