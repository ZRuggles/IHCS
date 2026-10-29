import type { PublicCourse } from "../content/types";
import { rollingCohorts } from "./scheduleDisplay";

/**
 * Programs that launch on November 2, 2026. Only builds that include the
 * launch use this list (see useCourses and src/data/launch.ts); earlier
 * builds leave it out of the bundle.
 *
 * Content comes from the school (October 29, 2026). Approval and
 * accreditation status has not been supplied for either program, so the
 * Certification tile and text send visitors to Admissions. Adding a program
 * in the editor with the same slug takes precedence over the entry here.
 *
 * A function rather than a constant: nothing runs at module load, so
 * pre-launch builds can drop this file entirely.
 */
export function launchPrograms(): PublicCourse[] {
  return [
    {
      id: "practical-nursing",
      courseId: "",
      title: "Practical Nursing Program (LPN)",
      description:
        "Applications for the first cohort of our Practical Nursing program are open November 2 through December 2, 2026. The program begins January 11, 2027.",
      duration: "Contact Admissions",
      nextStart: "January 11, 2027",
      image: "/LPN and RN.jpg",
      badge: "First Cohort",
      icon: "stethoscope",
      payments: {},
      scheduleDates: ["January 11 - February 11, 2027"],
      details: {
        overview:
          "Innovation Institute of Healthcare Solutions is accepting applications for the first cohort of its Practical Nursing program. Applications are open November 2 through December 2, 2026, and selected candidates will be announced December 11, 2026. Review the prerequisite courses and entrance requirements below, and contact Admissions with any questions about preparing your application.",
        curriculum: [],
        requirements: [
          "Prerequisite: Official transcript from a completed degree or high school",
          "Prerequisite: College-level English (3 credits)",
          "Prerequisite: College-level Algebra (3 credits)",
          "Prerequisite: Basic Anatomy & Physiology, completed within the past seven years (4 credits)",
          "Prerequisite: General Psychology or Developmental Psychology (3 credits)",
          "Prerequisite: Introduction to Sociology (3 credits)",
          "All prerequisite courses must be completed with a grade of C or better",
          "Active listing on the Nurse Aide Registry (no alternative certifications are accepted at this time)",
          "18 years of age or older",
          "U.S. citizen",
          "Drug screen",
          "Criminal background check",
          "All required immunizations",
          "TB skin test or tuberculin blood test (QuantiFERON)",
          "Current American Heart Association BLS CPR certification",
          "Entrance exam ($50)",
          "Interview",
        ],
        additionalNotes: [
          "Applications open: November 2 - December 2, 2026",
          "Selected candidates announced: December 11, 2026",
          "First tuition payment due: January 4, 2027",
          "Program dates: January 11 - February 11, 2027",
        ],
        paymentSchedule: [
          "Down payment: $4,000.00",
          "8 monthly payments: $1,821.75 each",
        ],
        fees: [
          "Application fee: $100",
          "Entrance exam fee: $50",
          "Technology fee: $30",
          "Lab kit: $280",
          "Liability: $18",
          "Elsevier: $557.02",
        ],
        certification:
          "Contact Admissions for credential and licensure information for this program.",
        cost: "$18,574",
        schedule: "January 11 - February 11, 2027",
        credentialLabel: "Contact Admissions",
      },
    },
    {
      id: "nurse-aide-ii",
      courseId: "",
      title: "Nurse Aide II",
      description:
        "Nurse Aide II training builds on Nurse Aide I with 160 hours of classroom instruction and supervised clinical practice. New sessions start every eight weeks.",
      duration: "160 Hours",
      nextStart: "Check Upcoming Schedule section",
      image: "/NurseAide.jpg",
      badge: "New",
      icon: "medical",
      payments: {},
      // A new eight-week session starts every 56 days from January 18, 2027.
      // Generated when the page loads, so finished sessions drop off and new
      // ones appear without anyone re-entering dates.
      scheduleDates: rollingCohorts({
        firstStart: new Date(2027, 0, 18),
        cycleDays: 56,
        lengthDays: 56,
        count: 7,
      }),
      details: {
        overview:
          "Nurse Aide II training builds on Nurse Aide I. The course includes 80 hours of theory (classroom instruction) and 80 hours of clinical experience (supervised patient care), for a minimum total of 160 hours. A new eight-week session begins every eight weeks.",
        curriculum: [
          "Theory: 80 hours of classroom instruction",
          "Clinical: 80 hours of supervised patient care",
          "Minimum total: 160 hours",
          "New eight-week sessions begin every eight weeks",
        ],
        requirements: [
          "Active listing on the North Carolina Nurse Aide I Registry",
          "No substantiated findings of abuse, neglect, exploitation, mistreatment, drug diversion, fraud, or misappropriation of property, as applicable to the registry requirements",
          "High school diploma or High School Equivalency (HSE) diploma",
          "Any additional admission requirements established by the school",
          "Any required clinical-site paperwork and health or safety clearances established by the school and clinical facility",
        ],
        additionalNotes: [
          "These are the standard admission requirements for a Nurse Aide II course; special provisions apply to certain Career and College Promise students.",
        ],
        certification:
          "Contact Admissions for credential information for this program.",
        cost: "Contact Admissions",
        schedule: "Eight-week sessions; see Upcoming Schedule",
        credentialLabel: "Contact Admissions",
      },
    },
  ];
}
