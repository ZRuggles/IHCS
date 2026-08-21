import { sql } from "./db.js";
import { env } from "./env.js";
import {
  computeNextStart,
  formatScheduleEntry,
  sortScheduleEntries,
  type ScheduleEntry
} from "./schedule.js";

/**
 * Content assembly.
 *
 * Builds the payload the public site renders from. Two modes:
 *   - draft:     what a signed-in editor sees (live database state)
 *   - published: what visitors see (frozen at the last Publish)
 *
 * The published payload is written to a static content.json, so the
 * public site never calls this API at request time. That is what
 * makes a sleeping Render service harmless to visitors.
 */

export interface PublicCourse {
  /** The slug — what appears in URLs and what the site routes on. */
  id: string;
  /**
   * Database uuid. Carried so a signed-in editor knows which row an
   * inline edit belongs to; visitors simply ignore it.
   */
  courseId: string;
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

export interface SiteContent {
  version: number;
  generatedAt: string;
  courses: PublicCourse[];
  content: Record<string, Record<string, unknown>>;
  settings: Record<string, unknown>;
  images: Record<string, { url: string; alt: string }>;
}

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  next_start: string;
  badge: string | null;
  icon: string;
  cost: string;
  overview: string;
  curriculum: string[];
  requirements: string[];
  tuition_includes: string[];
  additional_notes: string[];
  certification: string;
  schedule_summary: string;
  full_payment_url: string | null;
  payment_plans: { label: string; url: string }[];
  status: "draft" | "published" | "hidden";
  sort_order: number;
  schedule_group_id: string | null;
  /** Frozen copy of the course as last published. Null until first publish. */
  published_data: unknown;
  storage_key: string | null;
  is_legacy: boolean | null;
  alt_text: string | null;
}

/**
 * Resolves an image record to a public URL.
 *
 * Legacy images are the files that already shipped in /public — they
 * stay on the site's own origin so nothing breaks during migration.
 * Newly uploaded images live in Supabase Storage.
 */
export function imageUrl(storageKey: string | null, isLegacy: boolean | null): string {
  if (!storageKey) return "";
  if (isLegacy) return storageKey.startsWith("/") ? storageKey : `/${storageKey}`;
  return `${env.supabaseUrl}/storage/v1/object/public/${env.storageBucket}/${storageKey}`;
}

function toPublicCourse(row: CourseRow, scheduleLines: string[], nextStart: string): PublicCourse {
  const course: PublicCourse = {
    // The public id is the SLUG, because that is what appears in URLs
    // and what the existing frontend routes on (/courses/:courseId).
    id: row.slug,
    courseId: row.id,
    title: row.title,
    description: row.description,
    duration: row.duration,
    nextStart,
    image: imageUrl(row.storage_key, row.is_legacy),
    icon: row.icon,
    payments: {},
    details: {
      overview: row.overview,
      curriculum: row.curriculum ?? [],
      requirements: row.requirements ?? [],
      certification: row.certification,
      cost: row.cost,
      schedule: row.schedule_summary
    }
  };

  // Optional fields are omitted rather than set to null, matching the
  // original Course interface where they are `?:`.
  if (row.badge) course.badge = row.badge;
  if (row.full_payment_url) course.payments.fullPaymentUrl = row.full_payment_url;
  if (row.payment_plans?.length) course.payments.paymentPlans = row.payment_plans;
  if (scheduleLines.length) course.scheduleDates = scheduleLines;
  if (row.tuition_includes?.length) course.details.tuitionIncludes = row.tuition_includes;
  if (row.additional_notes?.length) course.details.additionalNotes = row.additional_notes;

  return course;
}

export async function buildContent(mode: "draft" | "published"): Promise<SiteContent> {
  // Published mode shows only 'published' courses. Draft mode also
  // shows drafts, so an editor can preview unfinished work — but
  // never 'hidden', which is an explicit "keep this off the site".
  //
  // NOTE: this filter selects WHICH courses appear. It does not decide
  // which VERSION of each course is used — see the published_data
  // handling below. Getting that wrong leaks unpublished edits.
  const statusFilter =
    mode === "published"
      ? sql`and c.status = 'published'`
      : sql`and c.status in ('published', 'draft')`;

  const courseRows = await sql<CourseRow[]>`
    select
      c.id::text, c.slug, c.title, c.description, c.duration, c.next_start,
      c.badge, c.icon, c.cost, c.overview, c.curriculum, c.requirements,
      c.tuition_includes, c.additional_notes, c.certification,
      c.schedule_summary, c.full_payment_url, c.payment_plans,
      c.status, c.sort_order, c.schedule_group_id::text, c.published_data,
      i.storage_key, i.is_legacy, i.alt_text
    from courses c
    left join images i on i.id = c.image_id
    where c.deleted_at is null
    ${statusFilter}
    order by c.sort_order, c.title
  `;

  const scheduleRows = await sql<(ScheduleEntry & { group_id: string })[]>`
    select
      id::text, group_id::text, label, start_date::text,
      end_date::text, note, sort_order
    from schedule_entries
    order by sort_order, start_date
  `;

  const byGroup = new Map<string, ScheduleEntry[]>();
  for (const row of scheduleRows) {
    const list = byGroup.get(row.group_id) ?? [];
    list.push(row);
    byGroup.set(row.group_id, list);
  }

  const courses = courseRows.map((row) => {
    const entries = row.schedule_group_id
      ? sortScheduleEntries(byGroup.get(row.schedule_group_id) ?? [])
      : [];
    const lines = entries.map(formatScheduleEntry);
    // Next Start is computed HERE, at publish time, so the browser
    // never does date math and the value can never drift per-visitor.
    const nextStart = computeNextStart(entries, row.next_start);

    // In published mode the frozen snapshot is authoritative. The scalar
    // columns are DRAFT state — an editor's in-progress edits live there
    // — so reading them here would push unpublished changes live the
    // instant they were typed, defeating the whole publish gate.
    //
    // Schedule dates are the deliberate exception: they are shared
    // across courses and always current, so they are recomputed rather
    // than frozen.
    if (mode === "published" && row.published_data) {
      const snapshot = row.published_data as PublicCourse;
      return {
        ...snapshot,
        courseId: row.id,
        ...(lines.length ? { scheduleDates: lines } : {}),
        nextStart
      };
    }

    return toPublicCourse(row, lines, nextStart);
  });

  const valueColumn = mode === "published" ? sql`published_value` : sql`draft_value`;

  const blockRows = await sql<
    { page: string; key: string; value: unknown }[]
  >`
    select page, key, ${valueColumn} as value
    from content_blocks
    order by page, sort_order
  `;

  const content: Record<string, Record<string, unknown>> = {};
  for (const row of blockRows) {
    if (row.value === null || row.value === undefined) continue;
    content[row.page] ??= {};
    content[row.page]![row.key] = row.value;
  }

  const settingRows = await sql<{ key: string; value: unknown }[]>`
    select key, ${valueColumn} as value
    from site_settings
  `;

  const settings: Record<string, unknown> = {};
  for (const row of settingRows) {
    if (row.value === null || row.value === undefined) continue;
    settings[row.key] = row.value;
  }

  const imageRows = await sql<
    { id: string; storage_key: string; is_legacy: boolean; alt_text: string }[]
  >`
    select id::text, storage_key, is_legacy, alt_text from images
  `;

  const images: Record<string, { url: string; alt: string }> = {};
  for (const row of imageRows) {
    images[row.id] = {
      url: imageUrl(row.storage_key, row.is_legacy),
      alt: row.alt_text ?? ""
    };
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    courses,
    content,
    settings,
    images
  };
}

/** Counts unpublished changes, for the editor toolbar's badge. */
export async function countPendingChanges(): Promise<number> {
  const [courses] = await sql<{ n: string }[]>`
    select count(*)::text as n
    from courses
    where deleted_at is null
      and (
        published_at is null
        or updated_at > published_at
      )
  `;

  const [blocks] = await sql<{ n: string }[]>`
    select count(*)::text as n
    from content_blocks
    where draft_value is distinct from published_value
  `;

  const [settings] = await sql<{ n: string }[]>`
    select count(*)::text as n
    from site_settings
    where draft_value is distinct from published_value
  `;

  return Number(courses?.n ?? 0) + Number(blocks?.n ?? 0) + Number(settings?.n ?? 0);
}
