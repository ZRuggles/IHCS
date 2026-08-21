import { Hono } from "hono";
import { param } from "../lib/params.js";
import { sql } from "../lib/db.js";
import { requireEditor, audit } from "../lib/auth.js";
import { scheduleEntrySchema, formatValidationError } from "../lib/validation.js";
import {
  formatScheduleEntry,
  computeNextStart,
  sortScheduleEntries,
  type ScheduleEntry
} from "../lib/schedule.js";

/**
 * Cohort schedules.
 *
 * Entries are real dates. Responses include the generated `display`
 * string so the editor can show a live preview of exactly what will
 * appear on the site — no guessing about formatting.
 */

const app = new Hono();
app.use("*", requireEditor);

app.get("/groups", async (c) => {
  const groups = await sql`
    select
      g.id::text, g.key, g.name,
      count(e.id)::int as entry_count,
      coalesce(
        array_agg(distinct c.title) filter (where c.title is not null),
        '{}'
      ) as used_by
    from schedule_groups g
    left join schedule_entries e on e.group_id = g.id
    left join courses c on c.schedule_group_id = g.id and c.deleted_at is null
    group by g.id, g.key, g.name
    order by g.name
  `;
  return c.json({ groups });
});

app.get("/groups/:groupId/entries", async (c) => {
  const entries = await sql<ScheduleEntry[]>`
    select id::text, label, start_date::text, end_date::text, note, sort_order
    from schedule_entries
    where group_id = ${param(c, "groupId")}::uuid
    order by sort_order, start_date
  `;

  const sorted = sortScheduleEntries(entries);
  return c.json({
    entries: sorted.map((entry) => ({ ...entry, display: formatScheduleEntry(entry) })),
    // What "Next Start" will read once published.
    nextStart: computeNextStart(sorted, "")
  });
});

app.post("/groups/:groupId/entries", async (c) => {
  const groupId = param(c, "groupId");
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Could not read the submitted data." }, 400);

  const parsed = scheduleEntrySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Please correct the highlighted fields.", fields: formatValidationError(parsed.error) },
      422
    );
  }
  const input = parsed.data;

  const rows = await sql<ScheduleEntry[]>`
    insert into schedule_entries (group_id, label, start_date, end_date, note, sort_order)
    values (
      ${groupId}::uuid, ${input.label ?? null}, ${input.start_date}::date,
      ${input.end_date}::date, ${input.note ?? null}, ${input.sort_order}
    )
    returning id::text, label, start_date::text, end_date::text, note, sort_order
  `;

  const entry = rows[0]!;
  await audit(c, "schedule.create", entry.id, { groupId });
  return c.json({ entry: { ...entry, display: formatScheduleEntry(entry) } }, 201);
});

app.patch("/entries/:id", async (c) => {
  const id = param(c, "id");
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Could not read the submitted data." }, 400);

  const parsed = scheduleEntrySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Please correct the highlighted fields.", fields: formatValidationError(parsed.error) },
      422
    );
  }
  const input = parsed.data;

  const rows = await sql<ScheduleEntry[]>`
    update schedule_entries set
      label = ${input.label ?? null},
      start_date = ${input.start_date}::date,
      end_date = ${input.end_date}::date,
      note = ${input.note ?? null},
      sort_order = ${input.sort_order}
    where id = ${id}::uuid
    returning id::text, label, start_date::text, end_date::text, note, sort_order
  `;

  const entry = rows[0];
  if (!entry) return c.json({ error: "That schedule entry no longer exists." }, 404);

  await audit(c, "schedule.update", id, {});
  return c.json({ entry: { ...entry, display: formatScheduleEntry(entry) } });
});

app.delete("/entries/:id", async (c) => {
  const id = param(c, "id");
  const rows = await sql`delete from schedule_entries where id = ${id}::uuid returning id::text`;
  if (rows.length === 0) return c.json({ error: "That schedule entry no longer exists." }, 404);

  await audit(c, "schedule.delete", id, {});
  return c.json({ ok: true });
});

/**
 * Preview endpoint — renders a prospective entry without saving.
 * Powers the live "this will appear as ..." line in the date editor.
 */
app.post("/preview", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = scheduleEntrySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Enter valid dates to see a preview.", fields: formatValidationError(parsed.error) }, 422);
  }

  const entry = { id: "preview", ...parsed.data } as ScheduleEntry;
  return c.json({ display: formatScheduleEntry(entry) });
});

export default app;
