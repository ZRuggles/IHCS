/**
 * Loads the current site content into the database.
 *
 * Idempotent: re-running updates existing rows rather than
 * duplicating them, so it is safe to run after a schema change.
 *
 * Run scripts/verify-seed.ts first — it proves the seed data matches
 * the live site before any of it reaches the database.
 *
 *   npm run seed
 */

import { sql } from "../src/lib/db.js";
import { json } from "../src/lib/json.js";
import { courses, scheduleGroups, legacyImages, settings, contentBlocks } from "./seed-data.js";

async function main() {
  console.log("Seeding IHCS content\n");

  // ---- Images (legacy files already in /public) ----
  const imageIdByPath = new Map<string, string>();

  for (const filePath of legacyImages) {
    const filename = filePath.replace(/^\//, "");
    const rows = await sql<{ id: string }[]>`
      insert into images (storage_key, filename, alt_text, is_legacy)
      values (${filePath}, ${filename}, '', true)
      on conflict (storage_key) do update set filename = excluded.filename
      returning id::text
    `;
    imageIdByPath.set(filePath, rows[0]!.id);
  }
  console.log(`  images            ${legacyImages.length}`);

  // ---- Schedule groups and entries ----
  const groupIdByKey = new Map<string, string>();

  for (const group of scheduleGroups) {
    const rows = await sql<{ id: string }[]>`
      insert into schedule_groups (key, name)
      values (${group.key}, ${group.name})
      on conflict (key) do update set name = excluded.name
      returning id::text
    `;
    const groupId = rows[0]!.id;
    groupIdByKey.set(group.key, groupId);

    // Replaced wholesale so re-seeding cannot accumulate duplicates.
    await sql`delete from schedule_entries where group_id = ${groupId}::uuid`;

    for (const [index, entry] of group.entries.entries()) {
      await sql`
        insert into schedule_entries (group_id, label, start_date, end_date, note, sort_order)
        values (
          ${groupId}::uuid, ${entry.label}, ${entry.start_date}::date,
          ${entry.end_date}::date, ${entry.note}, ${index}
        )
      `;
    }
    console.log(`  schedule[${group.key}]  ${group.entries.length} entries`);
  }

  // ---- Courses ----
  for (const course of courses) {
    const imageId = imageIdByPath.get(course.image) ?? null;
    const groupId = course.schedule_group ? groupIdByKey.get(course.schedule_group) ?? null : null;

    await sql`
      insert into courses (
        slug, title, description, duration, next_start, badge, icon, cost,
        image_id, overview, curriculum, requirements, tuition_includes,
        additional_notes, certification, schedule_summary, full_payment_url,
        payment_plans, status, schedule_group_id, sort_order, published_at
      ) values (
        ${course.slug}, ${course.title}, ${course.description}, ${course.duration},
        ${course.next_start}, ${course.badge}, ${course.icon}, ${course.cost},
        ${imageId}::uuid, ${course.overview},
        ${course.curriculum}, ${course.requirements}, ${course.tuition_includes},
        ${course.additional_notes}, ${course.certification}, ${course.schedule_summary},
        ${course.full_payment_url},
        ${json(course.payment_plans)},
        'published', ${groupId}::uuid, ${course.sort_order}, now()
      )
      on conflict (slug) do update set
        title = excluded.title,
        description = excluded.description,
        duration = excluded.duration,
        next_start = excluded.next_start,
        badge = excluded.badge,
        icon = excluded.icon,
        cost = excluded.cost,
        image_id = excluded.image_id,
        overview = excluded.overview,
        curriculum = excluded.curriculum,
        requirements = excluded.requirements,
        tuition_includes = excluded.tuition_includes,
        additional_notes = excluded.additional_notes,
        certification = excluded.certification,
        schedule_summary = excluded.schedule_summary,
        full_payment_url = excluded.full_payment_url,
        payment_plans = excluded.payment_plans,
        schedule_group_id = excluded.schedule_group_id,
        sort_order = excluded.sort_order
    `;
  }
  console.log(`  courses           ${courses.length}`);

  // ---- Settings ----
  for (const setting of settings) {
    await sql`
      insert into site_settings (key, label, draft_value, published_value, published_at)
      values (
        ${setting.key}, ${setting.label},
        ${json(setting.value)},
        ${json(setting.value)},
        now()
      )
      on conflict (key) do update set label = excluded.label
    `;
  }
  console.log(`  settings          ${settings.length}`);

  // ---- Page content blocks ----
  for (const [index, block] of contentBlocks.entries()) {
    await sql`
      insert into content_blocks (page, key, kind, label, draft_value, published_value, published_at, sort_order)
      values (
        ${block.page}, ${block.key}, ${block.kind}::content_kind, ${block.label},
        ${json(block.value)},
        ${json(block.value)},
        now(), ${index}
      )
      on conflict (page, key) do update set
        label = excluded.label,
        kind = excluded.kind
    `;
  }
  console.log(`  content blocks    ${contentBlocks.length}`);

  // Freeze each course's published snapshot.
  //
  // buildContent("published") reads published_data, so without this a
  // fresh install would serve the draft columns publicly until someone
  // pressed Publish — meaning any edit would go live immediately.
  const { buildContent } = await import("../src/lib/content.js");
  const draftState = await buildContent("draft");

  for (const course of draftState.courses) {
    await sql`
      update courses
      set published_data = ${json(course)}, published_at = now()
      where slug = ${course.id}
    `;
  }

  // Record the initial publish so the site has content to build from
  // before anyone has pressed Publish.
  const payload = await buildContent("published");
  await sql`
    insert into publishes (payload, note)
    values (${json(payload)}, 'Initial import from site source')
  `;

  console.log(`\nDone. ${payload.courses.length} courses published.`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
