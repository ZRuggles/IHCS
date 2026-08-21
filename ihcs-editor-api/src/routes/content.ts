import { Hono } from "hono";
import { json } from "../lib/json.js";
import { param } from "../lib/params.js";
import { sql } from "../lib/db.js";
import { requireEditor, audit } from "../lib/auth.js";
import { recordRevision, pruneRevisions } from "../lib/revisions.js";
import { buildContent, countPendingChanges } from "../lib/content.js";

/**
 * Page text blocks and site-wide settings.
 *
 * These cover everything that is not a course: hero headings, body
 * copy, the Services lists, Employment listings, contact details,
 * and apply links.
 */

const app = new Hono();
app.use("*", requireEditor);

/** The full draft payload — what the editor's preview renders from. */
app.get("/draft", async (c) => {
  const [content, pending] = await Promise.all([
    buildContent("draft"),
    countPendingChanges()
  ]);
  return c.json({ content, pendingChanges: pending });
});

app.get("/blocks", async (c) => {
  const page = c.req.query("page");
  const rows = page
    ? await sql`
        select id::text, page, key, kind, label, draft_value, published_value,
               (draft_value is distinct from published_value) as has_unpublished_changes,
               sort_order, updated_at
        from content_blocks
        where page = ${page}
        order by sort_order, key
      `
    : await sql`
        select id::text, page, key, kind, label, draft_value, published_value,
               (draft_value is distinct from published_value) as has_unpublished_changes,
               sort_order, updated_at
        from content_blocks
        order by page, sort_order, key
      `;
  return c.json({ blocks: rows });
});

/**
 * Saves a block's draft value.
 *
 * Upserts, so the editor can write to a key that was declared in the
 * frontend but never seeded — new editable fields work immediately
 * without a migration.
 */
app.put("/blocks/:page/:key", async (c) => {
  const page = param(c, "page");
  const key = param(c, "key");
  const body = await c.req.json().catch(() => null);

  if (!body || !("value" in body)) {
    return c.json({ error: "No new content was submitted." }, 400);
  }

  const editor = c.get("editor");
  const existing = await sql`select * from content_blocks where page = ${page} and key = ${key}`;

  if (existing[0]) {
    await recordRevision("content_block", existing[0].id as string, existing[0], editor.id);
  }

  const rows = await sql`
    insert into content_blocks (page, key, kind, label, draft_value, updated_by)
    values (
      ${page}, ${key},
      ${(body.kind ?? "text")}::content_kind,
      ${body.label ?? ""},
      ${json(body.value)},
      ${editor.id}
    )
    on conflict (page, key) do update set
      draft_value = excluded.draft_value,
      label = coalesce(nullif(excluded.label, ''), content_blocks.label),
      updated_by = excluded.updated_by
    returning id::text, page, key, draft_value, updated_at
  `;

  const block = rows[0]!;
  pruneRevisions("content_block", block.id as string).catch(() => {});
  await audit(c, "content.update", `${page}/${key}`, {});
  return c.json({ block });
});

/** Discards one block's draft, restoring the published value. */
app.post("/blocks/:page/:key/revert", async (c) => {
  const page = param(c, "page");
  const key = param(c, "key");

  const rows = await sql`
    update content_blocks
    set draft_value = published_value
    where page = ${page} and key = ${key}
    returning id::text, draft_value
  `;
  if (rows.length === 0) return c.json({ error: "That content block was not found." }, 404);

  await audit(c, "content.revert", `${page}/${key}`, {});
  return c.json({ block: rows[0] });
});

app.get("/settings", async (c) => {
  const rows = await sql`
    select key, label, draft_value, published_value,
           (draft_value is distinct from published_value) as has_unpublished_changes,
           updated_at
    from site_settings
    order by key
  `;
  return c.json({ settings: rows });
});

app.put("/settings/:key", async (c) => {
  const key = param(c, "key");
  const body = await c.req.json().catch(() => null);
  if (!body || !("value" in body)) {
    return c.json({ error: "No new value was submitted." }, 400);
  }

  const editor = c.get("editor");
  const existing = await sql`select * from site_settings where key = ${key}`;
  if (existing[0]) {
    await recordRevision("setting", key, existing[0], editor.id);
  }

  const rows = await sql`
    insert into site_settings (key, label, draft_value, updated_by)
    values (${key}, ${body.label ?? ""}, ${json(body.value)}, ${editor.id})
    on conflict (key) do update set
      draft_value = excluded.draft_value,
      label = coalesce(nullif(excluded.label, ''), site_settings.label),
      updated_by = excluded.updated_by
    returning key, draft_value, updated_at
  `;

  await audit(c, "setting.update", key, {});
  return c.json({ setting: rows[0] });
});

export default app;
