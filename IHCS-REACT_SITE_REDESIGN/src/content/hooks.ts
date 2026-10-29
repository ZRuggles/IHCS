import { useMemo } from "react";
import { useContent } from "./context";
import type { PublicCourse } from "./types";
import { getNextStart } from "../data/courses";
import { isLaunchReleased } from "../data/launch";
import { launchPrograms } from "../data/launchPrograms";
import { withoutEndedCohorts } from "../data/scheduleDisplay";

/**
 * Content accessors.
 *
 * Kept apart from ContentProvider.tsx so that file exports only its
 * component — a module mixing components with other exports breaks
 * Fast Refresh during development.
 */

/**
 * All visible courses, in display order. Every program listing, card,
 * footer link, and /courses/:id page reads this, so the November 2
 * programs appear (and stay absent) everywhere at once.
 */
export function useCourses(): PublicCourse[] {
  const courses = useContent().content.courses;
  return useMemo(() => {
    // Launch programs lead the list once released. A program the editor has
    // added under the same slug wins over the built-in entry.
    const launched = isLaunchReleased
      ? launchPrograms().filter((program) => !courses.some((course) => course.id === program.id))
      : [];
    // A published snapshot can outlive a cohort date. Finished cohorts are
    // dropped and Next Start recalculated, so schedules stay current
    // without a republish.
    return [...launched, ...courses].map((course) => {
      const current = course.scheduleDates
        ? { ...course, scheduleDates: withoutEndedCohorts(course.scheduleDates) }
        : course;
      return { ...current, nextStart: getNextStart(current) };
    });
  }, [courses]);
}

export function useCourse(slug: string | undefined): PublicCourse | undefined {
  const courses = useCourses();
  return useMemo(
    () => (slug ? courses.find((course) => course.id === slug) : undefined),
    [courses, slug]
  );
}

/**
 * One editable text value, with a fallback.
 *
 * The fallback is what the site showed before the editor existed, so
 * a key that has not been seeded still renders the original copy
 * rather than blank space.
 */
export function useText(page: string, key: string, fallback: string): string {
  const { content } = useContent();
  const value = content.content?.[page]?.[key];
  return typeof value === "string" && value !== "" ? value : fallback;
}

/** A structured (JSON) content block, such as the Services lists. */
export function useBlock<T>(page: string, key: string, fallback: T): T {
  const { content } = useContent();
  const value = content.content?.[page]?.[key];
  return (value as T) ?? fallback;
}

export function useSetting(key: string, fallback: string): string {
  const { content } = useContent();
  const value = content.settings?.[key];
  return typeof value === "string" && value !== "" ? value : fallback;
}
