import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { z } from "zod";
import { sql } from "../lib/db.js";
import { requireActiveProfile, requireEditor, audit } from "../lib/auth.js";
import { canReadPreview } from "../lib/previewAccess.js";
import { ihsProposal } from "../lib/ihsProposal.js";

const idSchema = z.string().uuid();
const inputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).default(""),
  html: z.string().min(1).max(5_000_000),
  reviewerEmails: z.array(z.string().trim().email().transform(e => e.toLowerCase())).max(30).default([]),
  isShared: z.boolean().default(false),
});
export function createPreviewRoutes(dependencies: {
  database?: typeof sql;
  activeProfile?: typeof requireActiveProfile;
  editingProfile?: typeof requireEditor;
  writeAudit?: typeof audit;
} = {}) {
const database = dependencies.database ?? sql;
const activeProfile = dependencies.activeProfile ?? requireActiveProfile;
const editingProfile = dependencies.editingProfile ?? requireEditor;
const writeAudit = dependencies.writeAudit ?? audit;
const app = new Hono();
app.onError((error, c) => {
  if ((error as { code?: string }).code === "42P01") {
    return c.json({ error: "Design Previews needs its one-time database setup. Apply migration 0003_design_previews.sql." }, 503);
  }
  console.error("[preview error]", error);
  return c.json({ error: "Could not load or save this preview. Please try again." }, 500);
});
app.use("*", activeProfile);
app.use("*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  await next();
});
app.use("*", bodyLimit({ maxSize: 6_000_000, onError: c => c.json({ error: "Preview file is too large." }, 413) }));

app.get("/", async (c) => {
  const editor = c.get("editor");
  const email = editor.email.trim().toLowerCase();
  const previews = editor.role === "viewer"
    ? await database`select id::text, title, description, is_shared, updated_at from design_previews where is_shared and ${email} = any(reviewer_emails) order by updated_at desc`
    : await database`select id::text, title, description, is_shared, reviewer_emails, updated_at from design_previews order by updated_at desc`;
  return c.json({ previews });
});

app.get("/template", editingProfile, (c) => c.json({ html: ihsProposal }));

// Replace only a private design's HTML, preserving its review URL and access.
app.post("/:id/template", editingProfile, async (c) => {
  const id = idSchema.safeParse(c.req.param("id"));
  if (!id.success) return c.json({ error: "Preview not found." }, 404);
  const [preview] = await database`
    update design_previews set html = ${ihsProposal}, updated_at = now()
    where id = ${id.data}::uuid returning id::text, title, description, is_shared, reviewer_emails, updated_at
  `;
  if (!preview) return c.json({ error: "Preview not found." }, 404);
  await writeAudit(c, "preview.replace-template", id.data, {});
  return c.json({ preview });
});

app.get("/:id", async (c) => {
  const id = idSchema.safeParse(c.req.param("id"));
  if (!id.success) return c.json({ error: "Preview not found." }, 404);
  const [preview] = await database<({ id: string; title: string; description: string; html: string; is_shared: boolean; reviewer_emails: string[]; updated_at: string })[]>`
    select id::text, title, description, html, is_shared, reviewer_emails, updated_at from design_previews where id = ${id.data}::uuid
  `;
  if (!preview || !canReadPreview(preview, c.get("editor"))) {
    return c.json({ error: "Preview not found or not shared with your account." }, 404);
  }
  const { reviewer_emails, ...result } = preview;
  return c.json({ preview: c.get("editor").role === "viewer" ? result : { ...result, reviewer_emails } });
});

app.post("/", editingProfile, async (c) => {
  const parsed = inputSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "Enter a title, valid reviewer emails, and an HTML file under 5 MB." }, 422);
  const p = parsed.data;
  const [preview] = await database`
    insert into design_previews (title, description, html, reviewer_emails, is_shared, created_by)
    values (${p.title}, ${p.description}, ${p.html}, ${p.reviewerEmails}, ${p.isShared}, ${c.get("editor").id}::uuid)
    returning id::text, title, description, is_shared, reviewer_emails, updated_at
  `;
  if (!preview) throw new Error("Preview insert returned no row.");
  await writeAudit(c, "preview.create", preview.id, { title: p.title });
  return c.json({ preview }, 201);
});

app.patch("/:id", editingProfile, async (c) => {
  const id = idSchema.safeParse(c.req.param("id"));
  if (!id.success) return c.json({ error: "Preview not found." }, 404);
  const parsed = inputSchema.omit({ html: true }).safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "Check the title and reviewer emails." }, 422);
  const p = parsed.data;
  const [preview] = await database`
    update design_previews set title = ${p.title}, description = ${p.description}, reviewer_emails = ${p.reviewerEmails}, is_shared = ${p.isShared}, updated_at = now()
    where id = ${id.data}::uuid returning id::text, title, description, is_shared, reviewer_emails, updated_at
  `;
  if (!preview) return c.json({ error: "Preview not found." }, 404);
  await writeAudit(c, "preview.update", id.data, { isShared: p.isShared });
  return c.json({ preview });
});

return app;
}

export default createPreviewRoutes();
