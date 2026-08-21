/**
 * Verifies the seed data against the live site source.
 *
 * Transcription is exactly the kind of work that quietly introduces
 * a wrong tuition price or a dropped bullet point, so nothing here
 * is trusted by eye. This imports the REAL courses.ts from the
 * frontend and asserts field-by-field equality, including that every
 * schedule string regenerates byte-identically from its stored dates.
 *
 *   npx tsx scripts/verify-seed.ts
 */

import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { courses as seedCourses, scheduleGroups } from "./seed-data.js";
import { formatScheduleEntry, type ScheduleEntry } from "../src/lib/schedule.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const sitePath = path.resolve(
  here,
  "..",
  "..",
  "IHCS-REACT_SITE_REDESIGN",
  "src",
  "data",
  "courses.ts"
);

interface LiveCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  nextStart: string;
  image: string;
  badge?: string;
  icon: string;
  payments: {
    fullPaymentUrl?: string;
    paymentPlans?: { label: string; url: string }[];
  };
  scheduleDates?: string[];
  details: {
    overview: string;
    curriculum: string[];
    requirements: string[];
    tuitionIncludes?: string[];
    additionalNotes?: string[];
    certification: string;
    cost: string;
    schedule: string;
  };
}

let failures = 0;
let checks = 0;

function check(label: string, actual: unknown, expected: unknown) {
  checks += 1;
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) {
    failures += 1;
    console.log(`  MISMATCH  ${label}`);
    console.log(`     source: ${b}`);
    console.log(`     seed:   ${a}`);
  }
}

async function main() {
  const mod = (await import(pathToFileURL(sitePath).href)) as {
    courses: LiveCourse[];
    cnaAndRefresherSchedule: string[];
    phlebotomySchedule: string[];
  };

  console.log("Verifying seed data against the live site source\n");

  // ---- 1. Schedules regenerate identically ----
  const groupSource: Record<string, string[]> = {
    "cna-refresher": mod.cnaAndRefresherSchedule,
    phlebotomy: mod.phlebotomySchedule
  };

  for (const group of scheduleGroups) {
    const expected = groupSource[group.key];
    if (!expected) {
      console.log(`  MISSING   schedule group "${group.key}" not found in source`);
      failures += 1;
      continue;
    }

    const generated = group.entries.map((entry) =>
      formatScheduleEntry({ id: "x", sort_order: 0, ...entry } as ScheduleEntry)
    );

    // Compare as sets: the seed groups Cohort 1 then Cohort 2, while
    // the source interleaves them. Content must match; order is a
    // presentation concern handled by sortScheduleEntries.
    check(`schedule[${group.key}] count`, generated.length, expected.length);
    for (const line of expected) {
      checks += 1;
      if (!generated.includes(line)) {
        failures += 1;
        console.log(`  MISSING   schedule[${group.key}]: "${line}"`);
      }
    }
  }

  // ---- 2. Every course field matches ----
  check("course count", seedCourses.length, mod.courses.length);

  for (const live of mod.courses) {
    const seed = seedCourses.find((s) => s.slug === live.id);
    if (!seed) {
      failures += 1;
      console.log(`  MISSING   course "${live.id}" is not in the seed data`);
      continue;
    }

    const p = `course[${live.id}]`;
    check(`${p}.title`, seed.title, live.title);
    check(`${p}.description`, seed.description, live.description);
    check(`${p}.duration`, seed.duration, live.duration);
    check(`${p}.nextStart`, seed.next_start, live.nextStart);
    check(`${p}.image`, seed.image, live.image);
    check(`${p}.badge`, seed.badge ?? null, live.badge ?? null);
    check(`${p}.icon`, seed.icon, live.icon);
    check(`${p}.cost`, seed.cost, live.details.cost);
    check(`${p}.overview`, seed.overview, live.details.overview);
    check(`${p}.curriculum`, seed.curriculum, live.details.curriculum);
    check(`${p}.requirements`, seed.requirements, live.details.requirements);
    check(`${p}.tuitionIncludes`, seed.tuition_includes, live.details.tuitionIncludes ?? []);
    check(`${p}.additionalNotes`, seed.additional_notes, live.details.additionalNotes ?? []);
    check(`${p}.certification`, seed.certification, live.details.certification);
    check(`${p}.schedule`, seed.schedule_summary, live.details.schedule);
    check(`${p}.fullPaymentUrl`, seed.full_payment_url ?? null, live.payments.fullPaymentUrl ?? null);
    check(`${p}.paymentPlans`, seed.payment_plans, live.payments.paymentPlans ?? []);

    // A course that has schedule dates in the source must be attached
    // to a schedule group in the seed, and vice versa.
    const liveHasSchedule = Boolean(live.scheduleDates?.length);
    check(`${p}.hasSchedule`, Boolean(seed.schedule_group), liveHasSchedule);

    if (liveHasSchedule && seed.schedule_group) {
      const group = scheduleGroups.find((g) => g.key === seed.schedule_group);
      const generated = (group?.entries ?? []).map((entry) =>
        formatScheduleEntry({ id: "x", sort_order: 0, ...entry } as ScheduleEntry)
      );
      check(
        `${p}.scheduleDates`,
        [...generated].sort(),
        [...(live.scheduleDates ?? [])].sort()
      );
    }
  }

  console.log(`\n${checks} checks, ${failures} mismatch(es).`);
  if (failures > 0) {
    console.log("\nFix seed-data.ts before running the seed.");
    process.exit(1);
  }
  console.log("Seed data matches the live site exactly.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
