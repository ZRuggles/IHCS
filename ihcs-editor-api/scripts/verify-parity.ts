/**
 * Proves content built FROM THE DATABASE matches the live site exactly.
 *
 * verify-seed.ts checks the transcribed data; this checks the whole
 * path — schema, seed, joins, schedule formatting, next-start
 * computation, and payload assembly. Run it after any change to the
 * schema or to lib/content.ts.
 *
 * Requires a seeded database.
 *
 *   npx tsx --env-file=.env scripts/verify-parity.ts
 */

import { buildContent } from "../src/lib/content.js";
import { sql } from "../src/lib/db.js";
import { courses as live, getNextStart } from "../../IHCS-REACT_SITE_REDESIGN/src/data/courses";

/**
 * Deep-sorts object keys before comparing.
 *
 * The database returns columns in its own order and the original file
 * declares them in another. Key order is meaningless to React and to
 * JSON consumers, so comparing raw stringify output would report
 * differences that do not exist.
 */
function canon(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canon);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, canon(v)])
    );
  }
  return value;
}

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  if (JSON.stringify(canon(actual)) !== JSON.stringify(canon(expected))) {
    failures += 1;
    console.log(`  MISMATCH  ${label}`);
    console.log(`     database: ${JSON.stringify(canon(actual)).slice(0, 400)}`);
    console.log(`     site:     ${JSON.stringify(canon(expected)).slice(0, 400)}`);
  }
}

async function main() {
  const payload = await buildContent("published");

  console.log("Comparing database content against the live site\n");
  check("course count", payload.courses.length, live.length);

  for (const siteCourse of live) {
    const dbCourse = payload.courses.find((c) => c.id === siteCourse.id);
    if (!dbCourse) {
      failures += 1;
      console.log(`  MISSING   ${siteCourse.id}`);
      continue;
    }

    const p = siteCourse.id;
    check(`${p}.title`, dbCourse.title, siteCourse.title);
    check(`${p}.description`, dbCourse.description, siteCourse.description);
    check(`${p}.duration`, dbCourse.duration, siteCourse.duration);
    check(`${p}.image`, dbCourse.image, siteCourse.image);
    check(`${p}.badge`, dbCourse.badge ?? null, siteCourse.badge ?? null);
    check(`${p}.icon`, dbCourse.icon, siteCourse.icon);
    check(`${p}.nextStart`, dbCourse.nextStart, getNextStart(siteCourse));
    check(`${p}.payments`, dbCourse.payments, siteCourse.payments);
    check(`${p}.details`, dbCourse.details, siteCourse.details);
    check(
      `${p}.scheduleDates`,
      [...(dbCourse.scheduleDates ?? [])].sort(),
      [...(siteCourse.scheduleDates ?? [])].sort()
    );

    console.log(
      `  ok  ${p.padEnd(32)} ${dbCourse.details.cost.padEnd(8)} ${dbCourse.nextStart}`
    );
  }

  // jsonb round-tripping: these must be arrays, not JSON strings.
  const positions = payload.content.employment?.positions as unknown[];
  const specialty = payload.content.services?.["specialty.items"] as unknown[];
  check("employment.positions is an array", Array.isArray(positions), true);
  check("employment.positions count", positions?.length, 6);
  check("services.specialty is an array", Array.isArray(specialty), true);
  check("services.specialty count", specialty?.length, 3);

  console.log(
    `\nsettings ${Object.keys(payload.settings).length} | ` +
      `content pages ${Object.keys(payload.content).length} | ` +
      `images ${Object.keys(payload.images).length}`
  );
  console.log(`${failures} mismatch(es).`);

  await sql.end();
  if (failures > 0) process.exit(1);
  console.log("Database content matches the live site exactly.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
