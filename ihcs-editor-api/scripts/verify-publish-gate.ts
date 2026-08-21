/**
 * Proves that unpublished edits never reach visitors.
 *
 * This exists because the gate silently failed once: buildContent()
 * filtered on `status = 'published'` but then read the DRAFT scalar
 * columns, so every inline edit went live the instant it was typed.
 * The publish route compounded it by stamping published_at before
 * building the payload, so the fix alone would have published stale
 * snapshots.
 *
 * Both are the kind of bug that looks fine in the UI and is only
 * visible by checking what an anonymous visitor actually receives.
 *
 * Requires: a seeded database, a running API, and editor credentials.
 *
 *   npx tsx --env-file=.env scripts/verify-publish-gate.ts <email> <password>
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "../src/lib/env.js";
import { sql } from "../src/lib/db.js";

const [, , email, password] = process.argv;
const API = `http://localhost:${env.port}`;
const SLUG = "hybrid-nurse-aide";

if (!email || !password) {
  console.error(
    "Usage: npx tsx --env-file=.env scripts/verify-publish-gate.ts <email> <password>"
  );
  process.exit(1);
}

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? "PASS" : "FAIL"}  ${label}: ${actual}` +
      (ok ? "" : ` (expected ${expected})`)
  );
}

async function main() {
  const client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    console.error(`Sign-in failed: ${error?.message}`);
    process.exit(1);
  }
  const auth = { Authorization: `Bearer ${data.session.access_token}` };

  const rows = await sql<{ id: string; cost: string }[]>`
    select id::text, cost from courses where slug = ${SLUG}
  `;
  const course = rows[0];
  if (!course) {
    console.error(`Course "${SLUG}" not found — is the database seeded?`);
    process.exit(1);
  }
  const originalCost = course.cost;

  interface CoursePayload {
    courses: { id: string; details: { cost: string } }[];
  }

  const costOf = (payload: CoursePayload) =>
    payload.courses.find((c) => c.id === SLUG)?.details.cost;

  /** What an anonymous visitor receives. */
  const publicCost = async () =>
    costOf((await fetch(`${API}/api/public/content`).then((r) => r.json())) as CoursePayload);

  /** What a signed-in editor sees. */
  const draftCost = async () =>
    costOf(
      (
        (await fetch(`${API}/api/content/draft`, { headers: auth }).then((r) =>
          r.json()
        )) as { content: CoursePayload }
      ).content
    );

  const setCost = (cost: string) =>
    fetch(`${API}/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ cost })
    });

  const publish = () =>
    fetch(`${API}/api/publish`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: "{}"
    });

  const SENTINEL = "$9,999";

  console.log(`Publish gate — starting from ${originalCost}\n`);

  console.log("[1] An inline edit that has NOT been published");
  await setCost(SENTINEL);
  check("editor sees the new price", await draftCost(), SENTINEL);
  check("visitors still see the old price", await publicCost(), originalCost);

  console.log("\n[2] After publishing");
  await publish();
  check("visitors see the new price", await publicCost(), SENTINEL);

  console.log("\n[3] Correcting it, before publishing again");
  await setCost(originalCost);
  check("visitors still see the published value", await publicCost(), SENTINEL);
  check("editor sees the correction", await draftCost(), originalCost);

  console.log("\n[4] Publishing the correction");
  await publish();
  check("visitors see the corrected price", await publicCost(), originalCost);

  console.log(`\n${failures} failure(s).`);
  await sql.end();

  if (failures > 0) {
    console.log("\nUnpublished edits are reaching visitors. Do not deploy.");
    process.exit(1);
  }
  console.log("Drafts stay private until published.");
}

main().catch(async (error) => {
  console.error(error);
  await sql.end().catch(() => {});
  process.exit(1);
});
