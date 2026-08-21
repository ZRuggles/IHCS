import { Hono } from "hono";
import { json } from "../lib/json.js";
import { param } from "../lib/params.js";
import { sql } from "../lib/db.js";
import { env } from "../lib/env.js";
import { requireEditor, audit } from "../lib/auth.js";
import { buildContent, countPendingChanges } from "../lib/content.js";

/**
 * Publishing.
 *
 * Publishing does three things, in order:
 *   1. Freezes the current draft state into the published columns.
 *   2. Stores the exact payload in `publishes`, so a bad publish can
 *      be rolled back wholesale.
 *   3. Triggers a Render rebuild, which fetches /api/public/content
 *      and writes it into the static bundle as content.json.
 *
 * Because the public site reads that static file, visitors never
 * depend on this API being awake.
 */

const app = new Hono();

/** Publish status for the editor toolbar. */
app.get("/status", requireEditor, async (c) => {
  const [pending, lastPublish] = await Promise.all([
    countPendingChanges(),
    sql<{ created_at: string; email: string | null; note: string | null }[]>`
      select p.created_at, e.email, p.note
      from publishes p
      left join editor_profiles e on e.id = p.published_by
      order by p.created_at desc
      limit 1
    `
  ]);

  return c.json({
    pendingChanges: pending,
    lastPublishedAt: lastPublish[0]?.created_at ?? null,
    lastPublishedBy: lastPublish[0]?.email ?? null
  });
});

app.get("/history", requireEditor, async (c) => {
  const rows = await sql`
    select p.id::text, p.created_at, p.note, e.email as published_by
    from publishes p
    left join editor_profiles e on e.id = p.published_by
    order by p.created_at desc
    limit 30
  `;
  return c.json({ publishes: rows });
});

app.post("/", requireEditor, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const note = String((body as { note?: string }).note ?? "").slice(0, 300);
  const editor = c.get("editor");

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
    values (${json(payload)}, ${editor.id}, ${note || null})
    returning id::text
  `;

  await audit(c, "publish", inserted[0]?.id ?? null, { courses: payload.courses.length, note });

  // Kick the static site rebuild. A failure here does not undo the
  // publish — the content IS published; only the rebuild lagged, and
  // it can be retried from the editor.
  let deployTriggered = false;
  let deployError: string | null = null;

  if (env.renderDeployHookUrl) {
    try {
      const response = await fetch(env.renderDeployHookUrl, { method: "POST" });
      deployTriggered = response.ok;
      if (!response.ok) deployError = `Deploy hook returned ${response.status}.`;
    } catch {
      deployError = "Could not reach the deploy service.";
    }
  } else {
    deployError = "No deploy hook is configured.";
  }

  return c.json({
    ok: true,
    publishId: inserted[0]?.id ?? null,
    courses: payload.courses.length,
    deployTriggered,
    // Publishing succeeded even if the rebuild did not start; the UI
    // shows this as a warning rather than a failure.
    warning: deployTriggered
      ? null
      : `Your changes were saved and published, but the website rebuild did not start. ${deployError ?? ""} Changes will appear after the next rebuild.`.trim()
  });
});

/** Discards every unpublished draft, restoring the live state. */
app.post("/discard", requireEditor, async (c) => {
  await sql.begin(async (tx) => {
    await tx`
      update content_blocks
      set draft_value = published_value
      where draft_value is distinct from published_value
    `;
    await tx`
      update site_settings
      set draft_value = published_value
      where draft_value is distinct from published_value
    `;
  });

  await audit(c, "publish.discard", null, {});
  return c.json({
    ok: true,
    // Course field edits are reverted individually from each course's
    // history, since a blanket revert there would be too destructive.
    note: "Page text and settings were restored to the published version. Program edits can be undone from each program's history."
  });
});

/** Restores a previous publish snapshot as the live content. */
app.post("/rollback/:publishId", requireEditor, async (c) => {
  const rows = await sql<{ payload: unknown }[]>`
    select payload from publishes where id = ${param(c, "publishId")}::bigint
  `;
  const snapshot = rows[0];
  if (!snapshot) return c.json({ error: "That published version could not be found." }, 404);

  const editor = c.get("editor");
  await sql`
    insert into publishes (payload, published_by, note)
    values (${json(snapshot.payload)}, ${editor.id}, 'Rolled back')
  `;

  await audit(c, "publish.rollback", param(c, "publishId"), {});

  if (env.renderDeployHookUrl) {
    await fetch(env.renderDeployHookUrl, { method: "POST" }).catch(() => {});
  }

  return c.json({ ok: true });
});

export default app;
