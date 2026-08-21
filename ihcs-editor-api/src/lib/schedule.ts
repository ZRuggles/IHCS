/**
 * Schedule formatting.
 *
 * The legacy site stored schedules as hand-typed strings and used a
 * regex to pull start dates back out of them to compute "Next Start".
 * That worked only as long as every string matched the expected
 * shape — one differently-typed date silently broke a visible field.
 *
 * Here the direction is reversed: real DATE columns are the source of
 * truth and the display string is GENERATED from them. There is no
 * parsing, so there is nothing to fail.
 */

export interface ScheduleEntry {
  id: string;
  label: string | null;
  start_date: string; // ISO date, 'YYYY-MM-DD'
  end_date: string;
  note: string | null;
  sort_order: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

/**
 * Parses an ISO 'YYYY-MM-DD' into a LOCAL date.
 *
 * `new Date("2026-05-11")` parses as UTC midnight, which in any
 * timezone behind UTC renders as May 10 — an off-by-one on a
 * customer-visible date. Splitting the parts avoids that entirely.
 */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function formatLongDate(iso: string): string {
  const date = parseISODate(iso);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Renders one entry the way the site has always displayed it:
 *
 *   "March 16 - April 25, 2026"
 *   "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM): May 11 - July 8, 2026"
 *   "Cohort 2 (Tue/Thu): November 24, 2026 - January 26, 2027 (Thanksgiving break observed)"
 *
 * The start's year is omitted when it matches the end's year, which
 * is what the original hand-written strings did.
 */
export function formatScheduleEntry(entry: ScheduleEntry): string {
  const start = parseISODate(entry.start_date);
  const end = parseISODate(entry.end_date);

  const sameYear = start.getFullYear() === end.getFullYear();

  const startText = sameYear
    ? `${MONTHS[start.getMonth()]} ${start.getDate()}`
    : `${MONTHS[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;

  const endText = `${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;

  let line = `${startText} - ${endText}`;

  if (entry.label && entry.label.trim() !== "") {
    line = `${entry.label.trim()}: ${line}`;
  }
  if (entry.note && entry.note.trim() !== "") {
    line = `${line} (${entry.note.trim()})`;
  }

  return line;
}

/** Shown when a schedule-driven course has no upcoming cohort. */
export const NEXT_START_FALLBACK = "Check Upcoming Schedule section";

/**
 * The "Next Start" label for a course.
 *
 * - With schedule entries: the soonest start on or after today.
 * - Without: the course's own static `nextStart` text
 *   (e.g. "Every Monday", "Contact Admissions").
 *
 * Computed at publish time and baked into content.json, so the
 * browser never has to do date math to render a course card.
 */
export function computeNextStart(
  entries: ScheduleEntry[],
  staticNextStart: string
): string {
  if (entries.length === 0) {
    return staticNextStart || NEXT_START_FALLBACK;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = entries
    .map((e) => parseISODate(e.start_date))
    .filter((d) => d.getTime() >= today.getTime())
    .sort((a, b) => a.getTime() - b.getTime());

  const next = upcoming[0];
  if (!next) return NEXT_START_FALLBACK;

  return `${MONTHS[next.getMonth()]} ${next.getDate()}, ${next.getFullYear()}`;
}

/**
 * Sorts entries for display: grouped by label (so all of Cohort 1
 * appears together, matching the current site), then by date.
 */
export function sortScheduleEntries(entries: ScheduleEntry[]): ScheduleEntry[] {
  return [...entries].sort((a, b) => {
    const labelA = a.label ?? "";
    const labelB = b.label ?? "";
    if (labelA !== labelB) return labelA.localeCompare(labelB);
    return a.start_date.localeCompare(b.start_date);
  });
}
