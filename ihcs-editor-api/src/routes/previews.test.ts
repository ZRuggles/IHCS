import test from "node:test";
import assert from "node:assert/strict";
import type { Context, Next } from "hono";
import type { EditorRole } from "../lib/auth.js";
// Fictional configuration; tests inject the database and authentication.
process.env.SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_ANON_KEY ??= "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-key";
process.env.DATABASE_URL ??= "postgres://test:test@localhost:9/test";
const { createPreviewRoutes } = await import("./previews.js");
const id = "a1b2c3d4-1234-4123-8123-123456789abc";

function fixture(role: EditorRole, email: string, shared = true) {
  let reads = 0;
  const profile = async (c: Context, next: Next) => {
    if (!c.req.header("Authorization")) return c.json({ error: "Not signed in." }, 401);
    c.set("editor", { id, email, role, fullName: null });
    await next();
  };
  const editor = async (c: Context, next: Next) => {
    if (c.get("editor").role === "viewer") return c.json({ error: "Read only." }, 403);
    await next();
  };
  const database = (async () => { reads++; return [{ id, title: "Private concept", description: "Review", html: "<h1>Private</h1>", is_shared: shared, reviewer_emails: ["client@example.com"], updated_at: "2026-10-13" }]; }) as unknown as NonNullable<Parameters<typeof createPreviewRoutes>[0]>["database"];
  return { app: createPreviewRoutes({ database, activeProfile: profile, editingProfile: editor, writeAudit: async () => {} }), reads: () => reads };
}

test("signed-out requests cannot retrieve any preview content", async () => {
  const f = fixture("viewer", "client@example.com");
  assert.equal((await f.app.request(`/${id}`)).status, 401);
  assert.equal(f.reads(), 0);
});

test("approved client can read a shared design without the reviewer list", async () => {
  const f = fixture("viewer", "client@example.com");
  const r = await f.app.request(`/${id}`, { headers: { Authorization: "Bearer fixture" } });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("Cache-Control"), "no-store");
  const data = await r.json() as { preview: { html: string; reviewer_emails?: string[] } };
  assert.equal(data.preview.html, "<h1>Private</h1>");
  assert.equal(data.preview.reviewer_emails, undefined);
});

test("other clients and revoked shares cannot read the design", async () => {
  for (const [email, shared] of [["other@example.com", true], ["client@example.com", false]] as const) {
    const f = fixture("viewer", email, shared);
    assert.equal((await f.app.request(`/${id}`, { headers: { Authorization: "Bearer fixture" } })).status, 404);
  }
});

test("a reviewer cannot create previews, change access, or read editor templates", async () => {
  const f = fixture("viewer", "client@example.com");
  for (const [path, method] of [["/", "POST"], [`/${id}`, "PATCH"], ["/template", "GET"], [`/${id}/template`, "POST"]]) {
    assert.equal((await f.app.request(path!, { method, headers: { Authorization: "Bearer fixture" } })).status, 403);
  }
  assert.equal(f.reads(), 0);
});
