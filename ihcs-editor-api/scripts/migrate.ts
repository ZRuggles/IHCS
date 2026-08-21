/**
 * Applies SQL migrations in order, exactly once each.
 *
 * Deliberately minimal — a schema_migrations table and a directory
 * of numbered .sql files is the whole mechanism. Each file runs
 * inside a transaction, so a failure leaves nothing half-applied.
 *
 *   npm run migrate
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "../src/lib/db.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(here, "..", "supabase", "migrations");

async function main() {
  await sql`
    create table if not exists schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `;

  const applied = await sql<{ name: string }[]>`select name from schema_migrations`;
  const done = new Set(applied.map((r) => r.name));

  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();

  let ran = 0;
  for (const file of files) {
    if (done.has(file)) {
      console.log(`  skip   ${file}`);
      continue;
    }

    const contents = await readFile(path.join(migrationsDir, file), "utf8");
    process.stdout.write(`  apply  ${file} ... `);

    try {
      await sql.begin(async (tx) => {
        await tx.unsafe(contents);
        await tx`insert into schema_migrations (name) values (${file})`;
      });
      console.log("ok");
      ran += 1;
    } catch (error) {
      console.log("FAILED");
      console.error(error);
      process.exit(1);
    }
  }

  console.log(ran === 0 ? "\nAlready up to date." : `\nApplied ${ran} migration(s).`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
