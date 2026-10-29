import type { PublicCourse } from "../content/types";

/**
 * Programs that launch on November 2, 2026. Only builds that include the
 * launch use this list (see useCourses and src/data/launch.ts); earlier
 * builds leave it out of the bundle.
 *
 * Content rule: publish only what the school has confirmed. No requirements,
 * tuition, program length, start date, or approval/accreditation status has
 * been supplied for either program yet, so those fields send visitors to
 * Admissions and the empty lists render a "being finalized" notice. Replace
 * them as soon as confirmed details arrive — or add the program in the
 * editor with the same slug, which takes precedence over this entry.
 */
export const launchPrograms: PublicCourse[] = [
  {
    id: "practical-nursing",
    courseId: "",
    title: "Practical Nursing Program (LPN)",
    description:
      "Applications are open for the first cohort of our Practical Nursing program. Review the program details below and contact Admissions to prepare for admission.",
    duration: "Contact Admissions",
    nextStart: "First cohort",
    image: "/LPN and RN.jpg",
    badge: "First Cohort",
    icon: "stethoscope",
    payments: {},
    details: {
      overview:
        "Innovation Institute of Healthcare Solutions is accepting applications for the first cohort of its Practical Nursing program. Admissions can answer questions about the program, its admission requirements, and how to prepare your application.",
      curriculum: [],
      requirements: [],
      certification:
        "Contact Admissions for credential and licensure information for this program.",
      cost: "Contact Admissions",
      schedule: "Contact Admissions",
      credentialLabel: "Contact Admissions",
    },
  },
  {
    id: "nurse-aide-ii",
    courseId: "",
    title: "Nurse Aide II",
    description:
      "Nurse Aide II training builds on Nurse Aide I. Contact Admissions for admission requirements, tuition, and upcoming class dates.",
    duration: "Contact Admissions",
    nextStart: "Contact Admissions",
    image: "/NurseAide.jpg",
    badge: "New",
    icon: "medical",
    payments: {},
    details: {
      overview:
        "Nurse Aide II training builds on Nurse Aide I. Admissions can answer questions about the program, its admission requirements, and how to apply.",
      curriculum: [],
      requirements: [],
      certification:
        "Contact Admissions for credential information for this program.",
      cost: "Contact Admissions",
      schedule: "Contact Admissions",
      credentialLabel: "Contact Admissions",
    },
  },
];
