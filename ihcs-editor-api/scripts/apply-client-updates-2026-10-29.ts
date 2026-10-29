/**
 * Applies the school's October 29, 2026 content changes to the editor
 * database.
 *
 *   npx tsx --env-file=.env scripts/apply-client-updates-2026-10-29.ts           # preview only
 *   npx tsx --env-file=.env scripts/apply-client-updates-2026-10-29.ts --apply   # write
 *
 * What goes live when:
 *   - Course text (titles, durations, curriculum, schedule lines, Next Start)
 *     is written to the DRAFT columns. It reaches the site only when an
 *     editor presses Publish.
 *   - Schedule dates, the Refresher's separate calendar, Hiding Phlebotomy,
 *     and the homepage stat label take effect on the next site rebuild
 *     (Publish triggers one). Schedules and status have no draft stage.
 *
 * Every changed course, schedule group, and content block is snapshotted
 * to `revisions` first, so the editor's history can restore it.
 */

import { sql } from "../src/lib/db.js";
import { json } from "../src/lib/json.js";

const apply = process.argv.includes("--apply");

type Patch = Record<string, string | string[]>;

/** Replaces exactly one occurrence, or fails loudly if the text moved. */
function swap(list: string[], from: string, to: string, field: string): string[] {
  const index = list.findIndex((item) => item === from);
  if (index < 0) throw new Error(`${field}: expected an item "${from}" — it was not found.`);
  return list.map((item, i) => (i === index ? to : item));
}

function removeText(value: string, text: string, field: string): string {
  if (!value.includes(text)) throw new Error(`${field}: expected text "${text}" — it was not found.`);
  return value.replace(text, "");
}

const FOUR_DAYS = "Total 4 days (3 days online coursework, 1 day in-person skills)";

// Changes are computed from each course's current DRAFT values.
const courseChanges: Record<string, (row: Record<string, unknown>) => Patch> = {
  "hybrid-nurse-aide": (row) => ({
    title: "Nurse Aide I",
    duration: removeText(String(row.duration), " (5½ Weeks)", "duration").trim(),
    schedule_summary: removeText(String(row.schedule_summary), " / 5½ weeks", "schedule_summary"),
    curriculum: swap(
      swap(row.curriculum as string[], "Course Duration: 5½ weeks per session", "Course Duration: See Schedule", "curriculum"),
      "Online & in-person format",
      "Format: Hybrid (coursework online; lab and clinical in person)",
      "curriculum"
    ),
  }),
  "hybrid-refresher-course": () => ({
    title: "Nurse Aide Refresher",
    duration: "See Schedule",
  }),
  "medication-aide": () => ({
    duration: FOUR_DAYS,
    schedule_summary: "Every Monday",
    curriculum: ["New classes begin every Monday", "Course materials included in tuition"],
  }),
  "med-tech": () => ({
    duration: FOUR_DAYS,
    next_start: "Every Monday",
  }),
};

const HIDE = ["hybrid-phlebotomy-technician"];

// [start, end] as ISO dates. Two entries follow the school's text exactly
// at the owner's direction: Dec 28, 2026 - Jan 6, 2027 and Jun 14 - Jul 31, 2027.
const nurseAideI: [string, string][] = [
  ["2026-11-16", "2026-12-26"],
  ["2026-11-30", "2027-01-09"],
  ["2026-12-28", "2027-01-06"],
  ["2027-01-25", "2027-03-06"],
  ["2027-02-22", "2027-04-03"],
  ["2027-03-22", "2027-05-01"],
  ["2027-04-19", "2027-05-29"],
  ["2027-05-17", "2027-06-26"],
  ["2027-06-14", "2027-07-31"],
];

const nurseAideRefresher: [string, string][] = [
  ["2026-11-16", "2026-12-06"],
  ["2026-12-07", "2026-12-27"],
  ["2026-12-28", "2027-01-17"],
  ["2027-01-18", "2027-02-07"],
  ["2027-02-08", "2027-02-28"],
  ["2027-03-01", "2027-03-21"],
  ["2027-03-22", "2027-04-11"],
  ["2027-04-12", "2027-05-02"],
  ["2027-05-03", "2027-05-23"],
  ["2027-05-24", "2027-06-13"],
];

const HOME_STAT = { page: "home", key: "hero.stat2.label", value: "Nurse Aide I Training" };

function show(label: string, before: unknown, after: unknown) {
  console.log(`  ${label}:\n    before: ${JSON.stringify(before)}\n    after:  ${JSON.stringify(after)}`);
}

async function main() {
  console.log(apply ? "APPLYING changes.\n" : "PREVIEW ONLY — nothing is written. Re-run with --apply to write.\n");

  const pending = await sql`select count(*)::int as n from courses where deleted_at is null and status = 'published' and published_data is not null and updated_at > published_at`;
  console.log(`Courses with unpublished edits already waiting: ${pending[0]?.n ?? 0} (Publish will include them too).\n`);

  await sql.begin(async (tx) => {
    // ---- Course text (drafts) ----
    for (const [slug, change] of Object.entries(courseChanges)) {
      const rows = await tx`select * from courses where slug = ${slug} and deleted_at is null`;
      const row = rows[0];
      if (!row) throw new Error(`Course "${slug}" was not found.`);
      const patch = change(row);
      console.log(`Course ${slug} (draft):`);
      for (const [field, value] of Object.entries(patch)) show(field, row[field], value);
      if (apply) {
        await tx`insert into revisions (entity_type, entity_id, snapshot, changed_by) values ('course', ${row.id}, ${json(row)}, null)`;
        const updates: Record<string, unknown> = {};
        for (const [field, value] of Object.entries(patch)) updates[field] = value;
        await tx`update courses set ${tx(updates)}, updated_at = now() where id = ${row.id}`;
      }
    }

    // ---- Hide programs ----
    for (const slug of HIDE) {
      const rows = await tx`select id, status from courses where slug = ${slug} and deleted_at is null`;
      if (!rows[0]) throw new Error(`Course "${slug}" was not found.`);
      console.log(`Course ${slug}:`);
      show("status", rows[0].status, "hidden");
      if (apply) await tx`update courses set status = 'hidden', updated_at = now() where id = ${rows[0].id}`;
    }

    // ---- Schedules ----
    const groups = await tx`select id::text, key, name from schedule_groups where key = 'cna-refresher'`;
    const sharedGroup = groups[0];
    if (!sharedGroup) throw new Error(`Schedule group "cna-refresher" was not found.`);
    const oldEntries = await tx`select label, start_date::text, end_date::text, note, sort_order from schedule_entries where group_id = ${sharedGroup.id}::uuid order by sort_order, start_date`;

    console.log(`Schedule group "cna-refresher" -> Nurse Aide I only:`);
    show("entries", oldEntries.map((e) => `${e.start_date}..${e.end_date}`), nurseAideI.map(([s, e]) => `${s}..${e}`));
    console.log(`New schedule group "nurse-aide-refresher" for the Refresher:`);
    show("entries", [], nurseAideRefresher.map(([s, e]) => `${s}..${e}`));

    if (apply) {
      await tx`insert into revisions (entity_type, entity_id, snapshot, changed_by) values ('schedule', ${sharedGroup.id}, ${json({ group: sharedGroup, entries: oldEntries })}, null)`;
      await tx`update schedule_groups set name = 'Nurse Aide I' where id = ${sharedGroup.id}::uuid`;
      await tx`delete from schedule_entries where group_id = ${sharedGroup.id}::uuid`;
      for (const [index, [start, end]] of nurseAideI.entries()) {
        await tx`insert into schedule_entries (group_id, start_date, end_date, sort_order) values (${sharedGroup.id}::uuid, ${start}, ${end}, ${index})`;
      }

      const created = await tx`
        insert into schedule_groups (key, name) values ('nurse-aide-refresher', 'Nurse Aide Refresher')
        on conflict (key) do update set name = excluded.name
        returning id::text`;
      const refresherGroupId = created[0].id;
      await tx`delete from schedule_entries where group_id = ${refresherGroupId}::uuid`;
      for (const [index, [start, end]] of nurseAideRefresher.entries()) {
        await tx`insert into schedule_entries (group_id, start_date, end_date, sort_order) values (${refresherGroupId}::uuid, ${start}, ${end}, ${index})`;
      }
      await tx`update courses set schedule_group_id = ${refresherGroupId}::uuid where slug = 'hybrid-refresher-course' and deleted_at is null`;
    }

    // ---- Homepage stat label (draft) ----
    const blocks = await tx`select id::text, draft_value from content_blocks where page = ${HOME_STAT.page} and key = ${HOME_STAT.key}`;
    console.log(`Content ${HOME_STAT.page}/${HOME_STAT.key} (draft):`);
    show("value", blocks[0]?.draft_value ?? null, HOME_STAT.value);
    if (apply) {
      if (blocks[0]) {
        await tx`insert into revisions (entity_type, entity_id, snapshot, changed_by) values ('content_block', ${blocks[0].id}, ${json(blocks[0])}, null)`;
        await tx`update content_blocks set draft_value = ${json(HOME_STAT.value)}, updated_at = now() where id = ${blocks[0].id}::uuid`;
      } else {
        await tx`insert into content_blocks (page, key, kind, label, draft_value) values (${HOME_STAT.page}, ${HOME_STAT.key}, 'text', 'second stat label', ${json(HOME_STAT.value)})`;
      }
      await tx`insert into audit_log (user_id, action, entity, detail) values (null, 'script.client-updates-2026-10-29', null, ${json({ courses: Object.keys(courseChanges), hidden: HIDE })})`;
    }
  });

  console.log(apply ? "\nDone. Sign in to the editor, review, and press Publish." : "\nPreview complete. Nothing was written.");
  await sql.end();
}

main().catch(async (error) => {
  console.error(`\nStopped: ${error instanceof Error ? error.message : error}\nNothing was written.`);
  await sql.end();
  process.exit(1);
});
