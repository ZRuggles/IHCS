import { createClient } from "@supabase/supabase-js";
import { json } from "./json.js";
import type { Context, Next } from "hono";
import { env } from "./env.js";
import { sql } from "./db.js";

/**
 * Authentication and authorization.
 *
 * Credentials, password hashing, reset emails, and lockout are all
 * handled by Supabase Auth — deliberately, because hand-rolling
 * those is the highest-risk code in a project like this.
 *
 * This module does two things:
 *   1. Verifies the caller's JWT with Supabase.
 *   2. Checks OUR OWN editor_profiles table for whether that user
 *      is actually allowed to edit.
 *
 * Step 2 matters: a Supabase Auth account is not by itself edit
 * access. New signups land inactive and an admin must activate
 * them, so an unexpected signup cannot touch the site.
 */

/** Verifies user JWTs. Uses the public anon key — no elevated rights. */
const authClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

/** Full-access client for storage and admin operations. Server only. */
export const adminClient = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export type EditorRole = "admin" | "editor" | "viewer";

export interface Editor {
  id: string;
  email: string;
  fullName: string | null;
  role: EditorRole;
}

declare module "hono" {
  interface ContextVariableMap {
    editor: Editor;
  }
}

function bearerToken(c: Context): string | null {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token === "" ? null : token;
}

/**
 * Requires a signed-in, active editor. Attaches the profile to the
 * request context for downstream handlers and the audit log.
 */
export async function requireEditor(c: Context, next: Next) {
  const token = bearerToken(c);
  if (!token) {
    return c.json({ error: "Not signed in." }, 401);
  }

  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) {
    return c.json({ error: "Your session has expired. Please sign in again." }, 401);
  }

  const rows = await sql<
    { id: string; email: string; full_name: string | null; role: EditorRole; is_active: boolean }[]
  >`
    select id, email, full_name, role, is_active
    from editor_profiles
    where id = ${data.user.id}
  `;

  const profile = rows[0];
  if (!profile) {
    return c.json({ error: "This account has no editor profile." }, 403);
  }
  if (!profile.is_active) {
    return c.json(
      { error: "This account is not active. An administrator must enable it." },
      403
    );
  }
  if (profile.role === "viewer") {
    return c.json({ error: "This account has read-only access." }, 403);
  }

  c.set("editor", {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role
  });

  // Fire-and-forget: a failed timestamp update must never block a request.
  sql`update editor_profiles set last_seen_at = now() where id = ${profile.id}`.catch(
    () => {}
  );

  await next();
}

/** Requires the 'admin' role — user management, destructive operations. */
export async function requireAdmin(c: Context, next: Next) {
  const editor = c.get("editor");
  if (!editor || editor.role !== "admin") {
    return c.json({ error: "This action requires an administrator account." }, 403);
  }
  await next();
}

/** Appends to the audit log. Never throws — logging must not break writes. */
export async function audit(
  c: Context,
  action: string,
  entity: string | null,
  detail: Record<string, unknown> = {}
): Promise<void> {
  try {
    const editor = c.get("editor");
    const forwarded = c.req.header("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || null;

    await sql`
      insert into audit_log (user_id, action, entity, detail, ip, user_agent)
      values (
        ${editor?.id ?? null},
        ${action},
        ${entity},
        ${json(detail)},
        ${ip}::inet,
        ${c.req.header("user-agent") ?? null}
      )
    `;
  } catch {
    // Intentionally swallowed.
  }
}
