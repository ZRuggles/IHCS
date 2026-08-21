/**
 * The shape of the published content payload.
 *
 * `PublicCourse` is intentionally identical to the original `Course`
 * interface from src/data/courses.ts — the migration changes where
 * course data comes from, not what the components receive.
 */

export interface PublicCourse {
  /** The slug — used in URLs and routing. */
  id: string;
  /** Database uuid, used by the inline editor. Empty in fallback data. */
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
  /** Page copy, addressed as content[page][key]. */
  content: Record<string, Record<string, unknown>>;
  settings: Record<string, unknown>;
  images: Record<string, { url: string; alt: string }>;
}
