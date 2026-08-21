import { Hono } from "hono";
import { param } from "../lib/params.js";
import { sql } from "../lib/db.js";
import { requireEditor, requireAdmin, adminClient, audit } from "../lib/auth.js";
import { inviteSchema, formatValidationError } from "../lib/validation.js";

/**
 * Editor account management.
 *
 * Invited users receive a Supabase email invitation and set their own
 * password — passwords are never transmitted by us or seen by an
 * administrator.
 */

const app = new Hono();
app.use("*", requireEditor);

/** Who am I — drives the editor toolbar and permission checks in the UI. */
app.get("/me", async (c) => {
  const editor = c.get("editor");
  return c.json({ editor });
});

app.get("/", requireAdmin, async (c) => {
  const users = await sql`
    select id::text, email, full_name, role, is_active, created_at, last_seen_at
    from editor_profiles
    order by created_at
  `;
  return c.json({ users });
});

app.post("/invite", requireAdmin, async (c) => {
  const parsed = inviteSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: "Please correct the highlighted fields.", fields: formatValidationError(parsed.error) }, 422);
  }
  const { email, full_name, role } = parsed.data;

  const existing = await sql`select id from editor_profiles where email = ${email}`;
  if (existing.length > 0) {
    return c.json({ error: "An account with that email already exists." }, 409);
  }

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { full_name }
  });

  if (error || !data.user) {
    return c.json({ error: "The invitation could not be sent. Check the email address." }, 502);
  }

  // The auth trigger creates the profile as inactive; activate it
  // with the intended role now that an admin has explicitly invited.
  await sql`
    update editor_profiles
    set role = ${role}::editor_role, is_active = true, full_name = ${full_name}, email = ${email}
    where id = ${data.user.id}::uuid
  `;

  await audit(c, "user.invite", data.user.id, { email, role });
  return c.json({ user: { id: data.user.id, email, full_name, role, is_active: true } }, 201);
});

app.patch("/:id", requireAdmin, async (c) => {
  const id = param(c, "id");
  const body = (await c.req.json().catch(() => ({}))) as {
    role?: string;
    is_active?: boolean;
    full_name?: string;
  };

  const editor = c.get("editor");

  // An admin locking themselves out is unrecoverable without database
  // access, so it is refused rather than merely warned about.
  if (id === editor.id && (body.is_active === false || (body.role && body.role !== "admin"))) {
    return c.json({ error: "You cannot remove your own administrator access." }, 400);
  }

  if (body.role && !["admin", "editor", "viewer"].includes(body.role)) {
    return c.json({ error: "Choose administrator, editor, or viewer." }, 422);
  }

  // Refuse to demote or disable the last remaining active admin.
  if (body.is_active === false || (body.role && body.role !== "admin")) {
    const [target] = await sql<{ role: string }[]>`
      select role from editor_profiles where id = ${id}::uuid
    `;
    if (target?.role === "admin") {
      const [{ n } = { n: "0" }] = await sql<{ n: string }[]>`
        select count(*)::text as n from editor_profiles where role = 'admin' and is_active = true
      `;
      if (Number(n) <= 1) {
        return c.json({ error: "There must be at least one active administrator." }, 400);
      }
    }
  }

  const updates: Record<string, unknown> = {};
  if (body.role) updates.role = body.role;
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
  if (typeof body.full_name === "string") updates.full_name = body.full_name.slice(0, 120);

  if (Object.keys(updates).length === 0) {
    return c.json({ error: "No changes were submitted." }, 400);
  }

  const rows = await sql`
    update editor_profiles set ${sql(updates)}
    where id = ${id}::uuid
    returning id::text, email, full_name, role, is_active
  `;
  if (rows.length === 0) return c.json({ error: "That account no longer exists." }, 404);

  await audit(c, "user.update", id, updates);
  return c.json({ user: rows[0] });
});

app.delete("/:id", requireAdmin, async (c) => {
  const id = param(c, "id");
  const editor = c.get("editor");

  if (id === editor.id) {
    return c.json({ error: "You cannot remove your own account." }, 400);
  }

  const [{ n } = { n: "0" }] = await sql<{ n: string }[]>`
    select count(*)::text as n from editor_profiles where role = 'admin' and is_active = true
  `;
  const [target] = await sql<{ role: string; email: string }[]>`
    select role, email from editor_profiles where id = ${id}::uuid
  `;
  if (!target) return c.json({ error: "That account no longer exists." }, 404);
  if (target.role === "admin" && Number(n) <= 1) {
    return c.json({ error: "There must be at least one active administrator." }, 400);
  }

  // Removing the auth user cascades to editor_profiles.
  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) return c.json({ error: "That account could not be removed." }, 502);

  await audit(c, "user.delete", id, { email: target.email });
  return c.json({ ok: true });
});

/** Recent activity — who changed what. */
app.get("/activity", requireAdmin, async (c) => {
  const rows = await sql`
    select a.id::text, a.action, a.entity, a.detail, a.created_at, e.email
    from audit_log a
    left join editor_profiles e on e.id = a.user_id
    order by a.created_at desc
    limit 100
  `;
  return c.json({ activity: rows });
});

export default app;
