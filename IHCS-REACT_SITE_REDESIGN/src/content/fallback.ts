import { courses as legacyCourses, getNextStart } from "../data/courses";
import {
  CONTACT_INFO,
  ADMISSION_EMAIL,
  APPLICATION_LINKS,
  LMS_URL
} from "../data/siteInfo";
import type { SiteContent } from "./types";

/**
 * Last-resort content, built from the original data files.
 *
 * Used only if /content.json is missing or malformed — a broken
 * deploy, or a first render before the file has loaded. Because it is
 * compiled into the bundle it is always available, so the site cannot
 * render empty.
 *
 * These files stay in the repo as this safety net. The database is
 * the source of truth; this is the parachute.
 */
export const fallbackContent: SiteContent = {
  version: 0,
  generatedAt: "",
  courses: legacyCourses.map((course) => ({
    id: course.id,
    // The fallback has no database ids. Inline editing is unavailable
    // in this mode anyway, since it means the API was unreachable.
    courseId: "",
    title: course.title,
    description: course.description,
    duration: course.duration,
    // Computed the same way the site always has, so the fallback
    // shows a live date rather than a stale one.
    nextStart: getNextStart(course),
    image: course.image,
    ...(course.badge ? { badge: course.badge } : {}),
    icon: course.icon,
    payments: course.payments,
    ...(course.scheduleDates ? { scheduleDates: course.scheduleDates } : {}),
    details: course.details
  })),
  content: {},
  settings: {
    "contact.faxNumber": CONTACT_INFO.faxNumber,
    "contact.faxHref": CONTACT_INFO.faxHref,
    "contact.admissionEmail": ADMISSION_EMAIL,
    "links.schoolApplication": APPLICATION_LINKS.schoolApplication,
    "links.enrollmentAgreement": APPLICATION_LINKS.enrollmentAgreement,
    "links.lms": LMS_URL
  },
  images: {}
};
