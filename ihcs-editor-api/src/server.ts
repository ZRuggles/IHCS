import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { env } from "./lib/env.js";
import { healthCheck } from "./lib/db.js";
import { buildContent } from "./lib/content.js";
import coursesRoutes from "./routes/courses.js";
import schedulesRoutes from "./routes/schedules.js";
import contentRoutes from "./routes/content.js";
import imagesRoutes from "./routes/images.js";
import publishRoutes from "./routes/publish.js";
import usersRoutes from "./routes/users.js";

const app = new Hono();

app.use("*", secureHeaders());

/**
 * CORS is restricted to an explicit allowlist.
 *
 * Note this is not the primary defense — every write also requires a
 * valid bearer token, and CORS is a browser-enforced policy that a
 * non-browser client ignores entirely. It exists to stop a malicious
 * page from riding along on an editor's active session.
 */
app.use(
  "*",
  cors({
    origin: (origin) => (env.allowedOrigins.includes(origin) ? origin : null),
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400
  })
);

/**
 * Rate limiting.
 *
 * In-memory and per-instance, which is the right trade for a single
 * small service: it blunts runaway loops and casual probing without
 * adding a Redis dependency. Supabase Auth independently rate-limits
 * the actual login attempts, which is the endpoint that matters most.
 */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;

app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") return next();

  const key = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const record = hits.get(key);

  if (!record || now > record.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    record.count += 1;
    if (record.count > MAX_PER_WINDOW) {
      return c.json({ error: "Too many requests. Please wait a moment and try again." }, 429);
    }
  }

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  }

  return next();
});

app.get("/health", async (c) => {
  const dbOk = await healthCheck();
  return c.json({ ok: dbOk, service: "ihcs-editor-api" }, dbOk ? 200 : 503);
});

/**
 * The only unauthenticated endpoint: published content.
 *
 * Read-only and published-only, so exposing it reveals nothing that
 * is not already on the public website. The static build fetches
 * this at deploy time to produce content.json.
 */
app.get("/api/public/content", async (c) => {
  const content = await buildContent("published");
  c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
  return c.json(content);
});

app.route("/api/courses", coursesRoutes);
app.route("/api/schedules", schedulesRoutes);
app.route("/api/content", contentRoutes);
app.route("/api/images", imagesRoutes);
app.route("/api/publish", publishRoutes);
app.route("/api/users", usersRoutes);

app.notFound((c) => c.json({ error: "Not found." }, 404));

app.onError((err, c) => {
  // Log the real error server-side; return a generic message to the
  // client so internal details never leak into a browser.
  console.error("[api error]", err);
  return c.json({ error: "Something went wrong. Please try again." }, 500);
});

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`IHCS editor API listening on :${info.port}`);
});
