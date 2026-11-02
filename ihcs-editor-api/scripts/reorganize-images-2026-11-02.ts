/**
 * Points the database at the reorganized /public images (see
 * image-paths-2026-11-02.ts) and gives the AHA CPR Instructor course its
 * own photo instead of sharing Nurse Aide II's.
 *
 *   npx tsx --env-file=.env scripts/reorganize-images-2026-11-02.ts           # preview
 *   npx tsx --env-file=.env scripts/reorganize-images-2026-11-02.ts --apply   # apply, then publish
 *
 * Rewrites every stored copy of an old path: the image library, page
 * text (draft and published), settings, course snapshots, revision
 * history and past publishes (so a rollback still finds its images), and
 * design previews. Then publishes, which rebuilds the course snapshots
 * from the drafts. Like scripts/publish.ts, it does not rebuild the
 * sites; the push that moves the files does that.
 */

import { sql } from "../src/lib/db.js";
import { json } from "../src/lib/json.js";
import { publishDrafts } from "../src/lib/publishing.js";
import { pathRewrites } from "./image-paths-2026-11-02.js";

const apply = process.argv.includes("--apply");

const CPR_SLUG = "aha-cpr-instructor";
const CPR_IMAGE = {
  storage_key: "/images/programs/aha-cpr-instructor.png",
  filename: "aha-cpr-instructor.png",
  alt_text: "Students practicing CPR compressions on training manikins",
  width: 513,
  height: 598,
  bytes: 519577,
  mime_type: "image/png",
};

// Text columns that can hold an image path, as [table, column, cast].
// jsonb columns are rewritten as text and parsed back.
const COLUMNS: Array<[string, string, "jsonb" | "text"]> = [
  ["images", "storage_key", "text"],
  ["images", "filename", "text"],
  ["content_blocks", "draft_value", "jsonb"],
  ["content_blocks", "published_value", "jsonb"],
  ["site_settings", "draft_value", "jsonb"],
  ["site_settings", "published_value", "jsonb"],
  ["courses", "published_data", "jsonb"],
  ["revisions", "snapshot", "jsonb"],
  ["publishes", "payload", "jsonb"],
  ["design_previews", "html", "text"],
];

/** SQL expression that applies every rewrite to `expr`. */
function rewritten(expr: string): string {
  return pathRewrites().reduce(
    (out, [from, to]) => `replace(${out}, ${literal(from)}, ${literal(to)})`,
    expr,
  );
}

function literal(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

async function main() {
  const rewrites = pathRewrites();

  console.log("Rows holding old image paths:");
  for (const [table, column, kind] of COLUMNS) {
    const text = kind === "jsonb" ? `${column}::text` : column;
    const matches = rewrites.map(([from]) => `position(${literal(from)} in ${text}) > 0`).join(" or ");
    const [{ count }] = await sql.unsafe<{ count: string }[]>(
      `select count(*)::text as count from ${table} where ${column} is not null and (${matches})`,
    );
    console.log(`  ${table}.${column}: ${count}`);
  }

  // Root-level image paths the mapping does not cover would break silently.
  const leftovers = await sql<{ path: string }[]>`
    select distinct m[1] as path from (
      select regexp_matches(coalesce(draft_value::text, '') || ' ' || coalesce(published_value::text, ''),
        '"(/[^"/]+\\.(?:jpe?g|png|bmp|gif|webp|svg))"', 'gi') as m from content_blocks
      union all
      select regexp_matches(storage_key, '^(/[^/]+)$') from images where is_legacy
    ) found`;
  const known = new Set(rewrites.map(([from]) => from));
  const unknown = leftovers.map((row) => row.path).filter((path) => !known.has(path));
  console.log(unknown.length ? `\nNOT covered by the mapping: ${unknown.join(", ")}` : "\nEvery root-level image path is covered.");

  const [cpr] = await sql<{ id: string; title: string; image: string | null }[]>`
    select c.id::text, c.title, i.storage_key as image
    from courses c left join images i on i.id = c.image_id
    where c.slug = ${CPR_SLUG} and c.deleted_at is null`;
  if (!cpr) throw new Error(`No course with slug ${CPR_SLUG}.`);
  console.log(`\n${cpr.title}: photo ${cpr.image} -> ${CPR_IMAGE.storage_key}`);

  if (!apply) {
    console.log("\nNothing was changed. Re-run with --apply to apply and publish.");
    return;
  }
  if (unknown.length) throw new Error("Add the uncovered paths to the mapping first.");

  await sql.begin(async (tx) => {
    for (const [table, column, kind] of COLUMNS) {
      const value = kind === "jsonb" ? `(${rewritten(`${column}::text`)})::jsonb` : rewritten(column);
      await tx.unsafe(`update ${table} set ${column} = ${value} where ${column} is not null`);
    }

    const [course] = await tx`select * from courses where id = ${cpr.id}::uuid`;
    await tx`insert into revisions (entity_type, entity_id, snapshot, changed_by) values ('course', ${cpr.id}, ${json(course)}, null)`;
    const [image] = await tx<{ id: string }[]>`
      insert into images (storage_key, filename, alt_text, width, height, bytes, mime_type, is_legacy)
      values (${CPR_IMAGE.storage_key}, ${CPR_IMAGE.filename}, ${CPR_IMAGE.alt_text},
        ${CPR_IMAGE.width}, ${CPR_IMAGE.height}, ${CPR_IMAGE.bytes}, ${CPR_IMAGE.mime_type}, true)
      on conflict (storage_key) do update set alt_text = excluded.alt_text
      returning id::text`;
    await tx`update courses set image_id = ${image.id}::uuid, updated_at = now() where id = ${cpr.id}::uuid`;

    await tx`insert into audit_log (user_id, action, entity, detail) values (null, 'script.reorganize-images-2026-11-02', null, ${json({ moves: rewrites.length, cprImage: CPR_IMAGE.storage_key })})`;
  });

  const { publishId, payload } = await publishDrafts(null, "Reorganized site images; AHA CPR Instructor photo");
  await sql`insert into audit_log (user_id, action, entity, detail) values (null, 'publish', ${publishId}, ${json({ courses: payload.courses.length, via: "scripts/reorganize-images-2026-11-02.ts" })})`;
  console.log(`\nApplied and published (publish #${publishId}). Program photos now:`);
  for (const course of payload.courses) console.log(`  ${course.id}: ${course.image}`);
}

main()
  .catch((error) => {
    console.error(`Stopped: ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
