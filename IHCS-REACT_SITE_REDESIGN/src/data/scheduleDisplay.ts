/**
 * Keeps published schedules current in the visitor's browser.
 *
 * Schedule lines arrive as display strings ("March 16 - April 25, 2026",
 * "November 30, 2026 - January 9, 2027", optionally prefixed with
 * "Cohort 1 (...):" and suffixed with "(note)"). Cohorts whose end date
 * has passed are dropped so the list never shows finished sessions.
 *
 * Kept out of courses.ts, which the editor API's parity scripts import.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** End date of one schedule line, or null if it cannot be read. */
export function scheduleEndDate(entry: string): Date | null {
  const range = entry.includes(":") ? entry.slice(entry.lastIndexOf(":") + 1) : entry;
  const endPart = range.split(" - ")[1] ?? range.split("-")[1];
  const match = endPart?.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;
  const month = MONTHS.findIndex((name) => name.toLowerCase() === match[1].toLowerCase());
  if (month < 0) return null;
  return new Date(Number(match[3]), month, Number(match[2]));
}

/** Drops cohorts that ended before today. Unreadable lines are kept. */
export function withoutEndedCohorts(dates: string[], today = startOfToday()): string[] {
  return dates.filter((entry) => {
    const end = scheduleEndDate(entry);
    return !end || end.getTime() >= today.getTime();
  });
}

/**
 * Cohorts on a fixed cycle, starting from the first cohort that has not
 * ended yet. Each line matches the editor's schedule format, so the
 * shared Next Start calculation reads it like any other schedule.
 */
export function rollingCohorts(options: {
  firstStart: Date;
  cycleDays: number;
  lengthDays: number;
  count: number;
  today?: Date;
}): string[] {
  const { firstStart, cycleDays, lengthDays, count, today = startOfToday() } = options;
  const lines: string[] = [];
  for (let index = 0; lines.length < count && index < 1000; index += 1) {
    const start = addDays(firstStart, index * cycleDays);
    const end = addDays(start, lengthDays - 1);
    if (end.getTime() >= today.getTime()) lines.push(formatRange(start, end));
  }
  return lines;
}

function formatRange(start: Date, end: Date): string {
  const startText = `${MONTHS[start.getMonth()]} ${start.getDate()}`;
  const endText = `${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  // Same rule as the editor: the start year appears only when it differs.
  return start.getFullYear() === end.getFullYear()
    ? `${startText} - ${endText}`
    : `${startText}, ${start.getFullYear()} - ${endText}`;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
