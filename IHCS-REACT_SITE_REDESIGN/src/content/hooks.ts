import { useMemo } from "react";
import { useContent } from "./context";
import type { PublicCourse } from "./types";

/**
 * Content accessors.
 *
 * Kept apart from ContentProvider.tsx so that file exports only its
 * component — a module mixing components with other exports breaks
 * Fast Refresh during development.
 */

/** All visible courses, in display order. */
export function useCourses(): PublicCourse[] {
  return useContent().content.courses;
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
