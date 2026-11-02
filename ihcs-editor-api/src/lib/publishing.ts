import { json } from "./json.js";
import { sql } from "./db.js";
import { buildContent } from "./content.js";

/**
 * Promotes every draft to published and records the payload.
 *
 * Shared by the editor's Publish button (routes/publish.ts) and
 * scripts/publish.ts. Triggering the site rebuild is left to the caller.
 */
export async function publishDrafts(publishedBy: string | null, note: string | null) {
  // Order matters. buildContent("published") reads each course's frozen
  // published_data, so those snapshots must be rewritten FROM the drafts
  // BEFORE that payload is built. Doing it the other way round captures
  // the previous snapshot and the new edits never reach visitors.
  //
  // "draft" mode reads the live scalar columns — exactly the state being
  // promoted.
  const draftState = await buildContent("draft");
  const draftBySlug = new Map(draftState.courses.map((course) => [course.id, course]));

  // One transaction: a partial publish would leave the site in a state
  // no one chose.
  await sql.begin(async (tx) => {
    const rows = await tx<{ slug: string }[]>`
      select slug from courses
      where deleted_at is null and status = 'published'
    `;

    for (const { slug } of rows) {
      const course = draftBySlug.get(slug);
      if (!course) continue;
      await tx`
        update courses
        set published_data = ${json(course)}, published_at = now()
        where slug = ${slug}
      `;
    }

    await tx`
      update content_blocks
      set published_value = draft_value, published_at = now()
      where draft_value is distinct from published_value
    `;

    await tx`
      update site_settings
      set published_value = draft_value, published_at = now()
      where draft_value is distinct from published_value
    `;
  });

  // Built AFTER promotion, so this is exactly what visitors will receive.
  const payload = await buildContent("published");

  const inserted = await sql<{ id: string }[]>`
    insert into publishes (payload, published_by, note)
    values (${json(payload)}, ${publishedBy}, ${note})
    returning id::text
  `;

  return { publishId: inserted[0]?.id ?? null, payload };
}
