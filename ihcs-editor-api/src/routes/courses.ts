import { Hono } from "hono";
import { json } from "../lib/json.js";
import { param } from "../lib/params.js";
import { sql } from "../lib/db.js";
import { requireEditor, requireAdmin, audit } from "../lib/auth.js";
import { recordRevision, pruneRevisions, listRevisions, getRevision } from "../lib/revisions.js";
import {
  courseSchema,
  coursePatchSchema,
  formatValidationError
} from "../lib/validation.js";

/**
 * Course / program management.
 *
 * Every write records a revision of the PRIOR state first, so any
 * change is reversible. Deletes are soft and recoverable for 30 days.
 */

const app = new Hono();

app.use("*", requireEditor);

/** All courses, including drafts and hidden — this is the editor's view. */
app.get("/", async (c) => {
  const rows = await sql`
    select
      c.id::text, c.slug, c.title, c.description, c.duration, c.next_start,
      c.badge, c.icon, c.cost, c.image_id::text, c.overview, c.curriculum,
      c.requirements, c.tuition_includes, c.additional_notes, c.certification,
      c.schedule_summary, c.full_payment_url, c.payment_plans, c.status,
      c.sort_order, c.schedule_group_id::text, c.published_at, c.updated_at,
      (c.published_at is null or c.updated_at > c.published_at) as has_unpublished_changes,
      i.storage_key, i.is_legacy, i.alt_text
    from courses c
    left join images i on i.id = c.image_id
    where c.deleted_at is null
    order by c.sort_order, c.title
  `;
  return c.json({ courses: rows });
});

/** Soft-deleted courses, for the restore screen. */
app.get("/trash", async (c) => {
  const rows = await sql`
    select id::text, slug, title, deleted_at
    from courses
    where deleted_at is not null
    order by deleted_at desc
  `;
  return c.json({ courses: rows });
});

app.get("/:id", async (c) => {
  const rows = await sql`
    select c.*, i.storage_key, i.is_legacy, i.alt_text
    from courses c
    left join images i on i.id = c.image_id
    where c.id = ${param(c, "id")}::uuid
      and c.deleted_at is null
  `;
  const course = rows[0];
  if (!course) return c.json({ error: "That program no longer exists." }, 404);
  return c.json({ course });
});

app.get("/:id/revisions", async (c) => {
  const revisions = await listRevisions("course", param(c, "id"));
  return c.json({ revisions });
});

app.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Could not read the submitted data." }, 400);

  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Please correct the highlighted fields.", fields: formatValidationError(parsed.error) }, 422);
  }
  const input = parsed.data;

  const existing = await sql`select id from courses where slug = ${input.slug}`;
  if (existing.length > 0) {
    return c.json(
      {
        error: "Another program already uses that web address.",
        fields: { slug: "This web address is already taken." }
      },
      409
    );
  }

  const editor = c.get("editor");
  const rows = await sql`
    insert into courses (
      slug, title, description, duration, next_start, badge, icon, cost,
      image_id, overview, curriculum, requirements, tuition_includes,
      additional_notes, certification, schedule_summary, full_payment_url,
      payment_plans, status, schedule_group_id, sort_order, updated_by
    ) values (
      ${input.slug}, ${input.title}, ${input.description}, ${input.duration},
      ${input.next_start}, ${input.badge ?? null}, ${input.icon}, ${input.cost},
      ${input.image_id ?? null}, ${input.overview},
      ${input.curriculum}, ${input.requirements}, ${input.tuition_includes},
      ${input.additional_notes}, ${input.certification}, ${input.schedule_summary},
      ${input.full_payment_url ?? null},
      ${json(input.payment_plans)},
      ${input.status}, ${input.schedule_group_id ?? null},
      ${input.sort_order}, ${editor.id}
    )
    returning id::text, slug, title, status
  `;

  const created = rows[0]!;
  await audit(c, "course.create", created.id, { slug: created.slug });
  return c.json({ course: created }, 201);
});

app.patch("/:id", async (c) => {
  const id = param(c, "id");
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Could not read the submitted data." }, 400);

  const parsed = coursePatchSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Please correct the highlighted fields.", fields: formatValidationError(parsed.error) }, 422);
  }
  const patch = parsed.data;

  const current = await sql`select * from courses where id = ${id}::uuid and deleted_at is null`;
  const before = current[0];
  if (!before) return c.json({ error: "That program no longer exists." }, 404);

  if (patch.slug && patch.slug !== before.slug) {
    const clash = await sql`select id from courses where slug = ${patch.slug} and id <> ${id}::uuid`;
    if (clash.length > 0) {
      return c.json(
        { error: "Another program already uses that web address.", fields: { slug: "This web address is already taken." } },
        409
      );
    }
  }

  const editor = c.get("editor");
  await recordRevision("course", id, before, editor.id);

  // Only the keys actually present in the request are written, so a
  // partial save never blanks fields the editor did not touch.
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    // payment_plans is jsonb: hand the driver the value itself. Passing a
    // pre-stringified copy would store the JSON *text*, not an array.
    updates[key] = key === "payment_plans" ? json(value) : value;
  }
  updates.updated_by = editor.id;

  const rows = await sql`
    update courses set ${sql(updates)}
    where id = ${id}::uuid
    returning id::text, slug, title, status, updated_at
  `;

  pruneRevisions("course", id).catch(() => {});
  await audit(c, "course.update", id, { fields: Object.keys(patch) });
  return c.json({ course: rows[0] });
});

/** Hide or show a program without touching its content. */
app.post("/:id/status", async (c) => {
  const id = param(c, "id");
  const body = await c.req.json().catch(() => ({}));
  const status = (body as { status?: string }).status;

  if (!status || !["draft", "published", "hidden"].includes(status)) {
    return c.json({ error: "Choose draft, published, or hidden." }, 422);
  }

  const editor = c.get("editor");
  const rows = await sql`
    update courses
    set status = ${status}::publish_status, updated_by = ${editor.id}
    where id = ${id}::uuid and deleted_at is null
    returning id::text, slug, status
  `;
  if (rows.length === 0) return c.json({ error: "That program no longer exists." }, 404);

  await audit(c, "course.status", id, { status });
  return c.json({ course: rows[0] });
});

/** Bulk reorder — the drag-to-sort handler on the Courses screen. */
app.post("/reorder", async (c) => {
  const body = await c.req.json().catch(() => null);
  const order = (body as { order?: string[] } | null)?.order;
  if (!Array.isArray(order)) {
    return c.json({ error: "Could not read the new order." }, 422);
  }

  await sql.begin(async (tx) => {
    for (const [index, courseId] of order.entries()) {
      await tx`update courses set sort_order = ${index} where id = ${courseId}::uuid`;
    }
  });

  await audit(c, "course.reorder", null, { count: order.length });
  return c.json({ ok: true });
});

/**
 * Soft delete. Content is retained and restorable for 30 days.
 *
 * The Footer hardcodes links to four course slugs, so removing one
 * would leave a dead link. We surface that as a warning rather than
 * blocking, since the editor may genuinely intend it.
 */
const FOOTER_LINKED_SLUGS = [
  "hybrid-nurse-aide",
  "hybrid-phlebotomy-technician",
  "hybrid-medication-aide",
  "hybrid-refresher-course"
];

app.delete("/:id", requireAdmin, async (c) => {
  const id = param(c, "id");
  const current = await sql`select * from courses where id = ${id}::uuid and deleted_at is null`;
  const before = current[0];
  if (!before) return c.json({ error: "That program no longer exists." }, 404);

  const editor = c.get("editor");
  await recordRevision("course", id, before, editor.id);

  await sql`update courses set deleted_at = now(), updated_by = ${editor.id} where id = ${id}::uuid`;
  await audit(c, "course.delete", id, { slug: before.slug });

  const warning = FOOTER_LINKED_SLUGS.includes(before.slug as string)
    ? `The website footer links directly to "${before.title}". That link will stop working until it is updated.`
    : null;

  return c.json({ ok: true, warning });
});

app.post("/:id/restore", async (c) => {
  const id = param(c, "id");
  const rows = await sql`
    update courses set deleted_at = null
    where id = ${id}::uuid and deleted_at is not null
    returning id::text, slug, title
  `;
  if (rows.length === 0) return c.json({ error: "That program is not in the trash." }, 404);

  await audit(c, "course.restore", id, {});
  return c.json({ course: rows[0] });
});

/** Roll a course back to an earlier revision. */
app.post("/:id/revert/:revisionId", async (c) => {
  const id = param(c, "id");
  const revision = await getRevision(param(c, "revisionId"));

  if (!revision || revision.entity_type !== "course" || revision.entity_id !== id) {
    return c.json({ error: "That earlier version could not be found." }, 404);
  }

  const current = await sql`select * from courses where id = ${id}::uuid`;
  if (!current[0]) return c.json({ error: "That program no longer exists." }, 404);

  const editor = c.get("editor");
  await recordRevision("course", id, current[0], editor.id);

  const snapshot = revision.snapshot as Record<string, unknown>;
  // Identity and audit columns are never restored from a snapshot.
  const { id: _id, created_at, updated_at, published_at, published_data, deleted_at, ...restorable } =
    snapshot;
  restorable.updated_by = editor.id;

  await sql`update courses set ${sql(restorable)} where id = ${id}::uuid`;
  await audit(c, "course.revert", id, { revisionId: param(c, "revisionId") });

  return c.json({ ok: true });
});

export default app;
