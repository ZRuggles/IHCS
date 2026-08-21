/**
 * The current site content, transcribed from the live source.
 *
 * Sources:
 *   IHCS-REACT_SITE_REDESIGN/src/data/courses.ts
 *   IHCS-REACT_SITE_REDESIGN/src/data/siteInfo.ts
 *   IHCS-REACT_SITE_REDESIGN/src/pages/{Home,Services,Employment}.tsx
 *
 * Schedules appear here as real dates. The originals were strings
 * like "March 16 - April 25, 2026"; each was converted by hand and
 * verified to render back identically (see scripts/verify-seed.ts).
 */

export interface SeedScheduleEntry {
  label: string | null;
  start_date: string;
  end_date: string;
  note: string | null;
}

export const scheduleGroups: {
  key: string;
  name: string;
  entries: SeedScheduleEntry[];
}[] = [
  {
    key: "cna-refresher",
    name: "Nurse Aide & Refresher",
    entries: [
      { label: null, start_date: "2026-03-16", end_date: "2026-04-25", note: null },
      { label: null, start_date: "2026-04-27", end_date: "2026-06-06", note: null },
      { label: null, start_date: "2026-06-08", end_date: "2026-07-18", note: null },
      { label: null, start_date: "2026-07-20", end_date: "2026-08-29", note: null },
      { label: null, start_date: "2026-09-07", end_date: "2026-10-17", note: null },
      { label: null, start_date: "2026-10-19", end_date: "2026-11-28", note: null },
      { label: null, start_date: "2026-11-30", end_date: "2027-01-09", note: null }
    ]
  },
  {
    key: "phlebotomy",
    name: "Phlebotomy",
    entries: [
      { label: "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM)", start_date: "2026-05-11", end_date: "2026-07-08", note: null },
      { label: "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM)", start_date: "2026-07-13", end_date: "2026-09-02", note: null },
      { label: "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM)", start_date: "2026-09-07", end_date: "2026-10-28", note: null },
      { label: "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM)", start_date: "2026-11-02", end_date: "2026-12-23", note: null },
      { label: "Cohort 2 (Tue/Thu, Face-to-Face)", start_date: "2026-05-12", end_date: "2026-07-09", note: null },
      { label: "Cohort 2 (Tue/Thu, Face-to-Face)", start_date: "2026-07-14", end_date: "2026-09-10", note: null },
      { label: "Cohort 2 (Tue/Thu, Face-to-Face)", start_date: "2026-09-15", end_date: "2026-11-19", note: null },
      { label: "Cohort 2 (Tue/Thu, Face-to-Face)", start_date: "2026-11-24", end_date: "2027-01-26", note: "Thanksgiving break observed" }
    ]
  }
];

/** Files already in /public. Registered as legacy so URLs keep working. */
export const legacyImages = [
  "/Nurse-Aide.jpg",
  "/Phlebotomy.jpg",
  "/Medication.jpg",
  "/Infusion.jpeg",
  "/Refresher.jpg",
  "/NurseAide.jpg",
  "/Home Infusion.jpeg",
  "/Supplemental Staffing.jpeg",
  "/FootCareNurse.jpeg",
  "/Home Care Services.jpeg",
  "/LPN and RN.jpg",
  "/PRN Home Visit.jpg",
  "/NursesHoldingDiplomas.jpg",
  "/LOGO.png",
  "/ThumbnailLogo.png",
  "/courselogo.png",
  "/CW-Logo.bmp"
];

export interface SeedCourse {
  slug: string;
  title: string;
  description: string;
  duration: string;
  next_start: string;
  image: string;
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
  schedule_group: string | null;
  sort_order: number;
}

export const courses: SeedCourse[] = [
  {
    slug: "hybrid-nurse-aide",
    title: "Nurse Aide / Nursing Assistant Program",
    description:
      "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course. This 120-hour program combines flexible online learning with hands-on clinical experience, all completed in just 5½ weeks.",
    duration: "120 Hours (5½ Weeks)",
    next_start: "Check Upcoming Schedule section",
    image: "/Nurse-Aide.jpg",
    badge: "Most Popular",
    icon: "heart",
    cost: "$1,205",
    overview:
      "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course. This 120-hour program combines flexible online learning with hands-on clinical experience, all completed in just 5½ weeks. Perfect for individuals looking to enter the nursing field quickly and confidently with weekly assignments.",
    curriculum: [
      "Course Duration: 5½ weeks per session",
      "Weekly Assignments: Online assignments with deadlines each week",
      "Lab Days: Saturdays and Sundays, 9:00 AM to 5:00 PM (Weeks 1-3)",
      "Clinical Days: Saturdays and Sundays, 7:00 AM to 3:00 PM (Weeks 4-5)",
      "Online & in-person format",
      "Clinicals included"
    ],
    requirements: [
      "Valid ID",
      "Social Security Card",
      "Official Transcript or GED — OR pass our Placement Test",
      "Immunizations Required",
      "TB Skin Test or Quantiferon Test"
    ],
    tuition_includes: ["Criminal Background Check", "Drug Screening"],
    additional_notes: [
      "Students are responsible for purchasing uniforms at the school's selected uniform location."
    ],
    certification:
      "State-approved Nurse Aide I certification upon successful completion and passing the state exam",
    schedule_summary:
      "120 hours / 5½ weeks, online and in-person format with included clinicals",
    full_payment_url: "https://buy.stripe.com/14A5kCdpI1H55tFcbd0oM01",
    payment_plans: [],
    schedule_group: "cna-refresher",
    sort_order: 0
  },
  {
    slug: "hybrid-phlebotomy-technician",
    title: "Phlebotomy Course",
    description:
      "Build core phlebotomy skills in our 8-week Hybrid Phlebotomy Technician course with weekly online assignments, in-person instruction, and clinical practice.",
    duration: "8 Weeks",
    next_start: "Check Upcoming Schedule section",
    image: "/Phlebotomy.jpg",
    badge: "Fast Track",
    icon: "droplet",
    cost: "$1,205",
    overview:
      "Students complete online assignments each week, with all coursework due by Sunday and weekly exams every Thursday. This 8-week phlebotomy program includes in-person instruction and begins clinical placement in Week 4. During clinicals, students work to complete ASPT certification requirements, including 75 successful venipunctures of various types. Completion requirements may be met at different times based on student progress, but graduation occurs at the official course end date.",
    curriculum: [
      "8-week course format with two cohorts",
      "Cohort 1: Mondays and Wednesdays, 9:00 AM - 1:00 PM",
      "Cohort 2: Tuesdays and Thursdays, face-to-face instruction",
      "Weekly online assignments due Sundays and weekly Thursday exams",
      "Clinical placement begins in Week 4",
      "ASPT requirement: 75 successful venipunctures"
    ],
    requirements: [
      "Valid ID",
      "Social Security Card",
      "Official High School Transcript — OR pass our Placement Test",
      "Immunizations",
      "TB Skin Test or Quantiferon Test",
      "Must be willing to perform and receive venipuncture from classmates"
    ],
    tuition_includes: ["Criminal Background Check", "Drug Screening"],
    additional_notes: [
      "Optional: Textbook (Book online in Google Classroom)",
      "Optional: Practice Arm",
      "Students are responsible for purchasing uniforms at the school's selected uniform location."
    ],
    certification: "Certificate of Completion with ASPT certification preparation",
    schedule_summary:
      "8 weeks - Cohort 1 (Mon/Wed 9:00 AM - 1:00 PM) or Cohort 2 (Tue/Thu face-to-face), with clinicals starting Week 4",
    full_payment_url: "https://buy.stripe.com/7sY28qadwbhFf4f7UX0oM02",
    payment_plans: [],
    schedule_group: "phlebotomy",
    sort_order: 1
  },
  {
    slug: "medication-aide",
    title: "Medication Aide Class",
    description:
      "This course is designed for individuals who are currently listed as Nursing Assistants. Classes begin every Monday, Skill check off following Friday. Course materials are included in tuition.",
    duration: "Self-Paced + 1-Day Skills Check-Off",
    next_start: "Every Monday, Skill check off following Friday",
    image: "/Medication.jpg",
    badge: null,
    icon: "pill",
    cost: "$360",
    overview:
      "This Medication Aide Class is designed for individuals who are currently listed as Nursing Assistants. Classes begin every Monday, so you can start the week you're ready. Complete the lessons online at your own pace, then attend a one-day in-person competency check-off. Approved for North Carolina state requirements. Course materials are included in tuition.",
    curriculum: [
      "New classes begin every Monday",
      "Skill check off following Friday",
      "Self-paced online instruction",
      "1-day in-person skills validation",
      "State-approved curriculum",
      "Course materials included in tuition"
    ],
    requirements: ["Valid ID", "Social Security Card", "Official Transcript or GED"],
    tuition_includes: [],
    additional_notes: [],
    certification: "State-approved Medication Aide certification",
    schedule_summary:
      "Classes begin every Monday - self-paced online + 1-day in-person skills check-off",
    full_payment_url: "https://buy.stripe.com/28EaEW2L45Xl8FR5MP0oM04",
    payment_plans: [],
    schedule_group: null,
    sort_order: 2
  },
  {
    slug: "med-tech",
    title: "Med Tech Course",
    description:
      "Perfect for individuals interested in medication technician training. Classes begin every Monday. Course materials are included in tuition.",
    duration: "Self-Paced + 1-Day Skills Check-Off",
    next_start: "Every Monday, Skill check off following Friday",
    image: "/Infusion.jpeg",
    badge: null,
    icon: "pill",
    cost: "$360",
    overview:
      "The Med Tech Course is perfect for individuals interested in medication technician training. Classes begin every Monday, so you can start the week you're ready. Complete the lessons online at your own pace, then attend a one-day in-person skills check-off. Course materials are included in tuition.",
    curriculum: [
      "New classes begin every Monday",
      "Medication technician training",
      "Self-paced online instruction",
      "1-day in-person skills validation",
      "Course materials included in tuition"
    ],
    requirements: ["Official Transcript or GED", "Valid ID", "Social Security Card"],
    tuition_includes: [],
    additional_notes: [],
    certification: "Medication Technician training certificate of completion",
    schedule_summary:
      "Classes begin every Monday - self-paced online + 1-day in-person skills check-off",
    full_payment_url: "https://buy.stripe.com/6oUcN45Xg0D1f4f1wz0oM0j",
    payment_plans: [],
    schedule_group: null,
    sort_order: 3
  },
  {
    slug: "hybrid-refresher-course",
    title: "Nurse Aide Refresher / CNA Refresher Course",
    description:
      "Designed for individuals who want to return to the healthcare field and prepare to challenge or retake the state exam. Refresh your hands-on clinical skills and build confidence.",
    duration: "1 or 2 Weeks",
    next_start: "Check Upcoming Schedule section",
    image: "/Refresher.jpg",
    badge: null,
    icon: "refresh-cw",
    cost: "$570",
    overview:
      "Our Nurse Aide Refresher Course is designed for individuals who want to return to the healthcare field and prepare to challenge or retake the state exam. This course is designed to refresh hands-on clinical skills, build confidence, and help students transition back into healthcare opportunities.",
    curriculum: [
      "Online review + optional skills support",
      "1-week or 2-week formats available",
      "Hands-on clinical skills refresh",
      "Registry renewal / state exam preparation support"
    ],
    requirements: [
      "Valid ID",
      "Social Security Card",
      "Proof of previous healthcare training or certification"
    ],
    tuition_includes: [],
    additional_notes: [
      "This course is available to: Expired Nursing Assistants; individuals who completed an approved Nurse Aide training program but did not take the state exam (proof of course completion required); Paramedics; Respiratory Therapists; and other healthcare professionals with hands-on clinical certifications or training."
    ],
    certification:
      "Refresher course completion certificate to challenge or retake the state exam",
    schedule_summary:
      "1-week or 2-week formats with online review and optional skills support",
    full_payment_url: "https://buy.stripe.com/dRm28qbhAetRaNZ0sv0oM03",
    payment_plans: [
      {
        label: "Hybrid Nurse Refresher Payment Link 1",
        url: "https://buy.stripe.com/28E7sK99setR3lxcbd0oM0e"
      },
      {
        label: "Hybrid Nurse Refresher Payment Link 2",
        url: "https://buy.stripe.com/8x2eVcgBU4Thg8j6QT0oM0f"
      }
    ],
    schedule_group: "cna-refresher",
    sort_order: 4
  },
  {
    slug: "aha-cpr-instructor",
    title: "American Heart Association CPR Instructor Course",
    description:
      "Take the next step in your healthcare career by becoming an American Heart Association (AHA) CPR Instructor. Designed for individuals passionate about teaching life-saving skills to healthcare professionals, workplaces, community organizations, schools, churches, and the public.",
    duration: "Instructor Certification (valid 2 years)",
    next_start: "Contact Admissions",
    image: "/NurseAide.jpg",
    badge: "New",
    icon: "heart",
    cost: "$700",
    overview:
      "Take the next step in your healthcare career by becoming an American Heart Association (AHA) CPR Instructor through Innovation Healthcare Solutions. This course is designed for individuals who are passionate about teaching life-saving skills to healthcare professionals, workplaces, community organizations, schools, churches, and the public. Once all requirements are successfully completed, students will receive their official American Heart Association CPR Instructor Card, valid for two years.",
    curriculum: [
      "AHA Instructor Manual",
      "Instructor Essentials Kit",
      "Instructor Training Guidance",
      "Monitoring Support Information"
    ],
    requirements: [
      "Must hold a current American Heart Association Provider CPR Card",
      "Must successfully complete the AHA Instructor Essentials Course",
      "Must align with an authorized AHA Training Center or Training Site",
      "Must complete instructor monitoring by teaching a CPR class under supervision"
    ],
    tuition_includes: [],
    additional_notes: [],
    certification:
      "Official American Heart Association CPR Instructor Card, valid for two years",
    schedule_summary: "Contact admissions for the current schedule",
    full_payment_url: "https://buy.stripe.com/00wcN4etMetR7BNejl0oM0k",
    payment_plans: [],
    schedule_group: null,
    sort_order: 5
  }
];

/** Site-wide settings, from siteInfo.ts. */
export const settings: { key: string; label: string; value: unknown }[] = [
  { key: "contact.faxNumber", label: "Fax number", value: "7047692049" },
  { key: "contact.faxHref", label: "Fax link", value: "tel:+17047692049" },
  {
    key: "contact.admissionEmail",
    label: "Admissions email",
    value: "admission@innovationhealthcaresolutions.com"
  },
  {
    key: "links.schoolApplication",
    label: "Online application link",
    value:
      "https://iihs.populiweb.com/router/admissions/onlineapplications/index?application_form=2"
  },
  {
    key: "links.enrollmentAgreement",
    label: "Enrollment agreement link",
    value:
      "https://docs.google.com/forms/d/e/1FAIpQLSdDsxdGtPb1vdHTPeGAxmJjr_oLXLsGTfa9sljbpCxjIh3v6Q/viewform?usp=sharing&ouid=111345749796514694670"
  },
  { key: "links.lms", label: "Student LMS link", value: "https://iihs.populiweb.com/" }
];

/** Page copy currently hardcoded in components. */
export const contentBlocks: {
  page: string;
  key: string;
  kind: string;
  label: string;
  value: unknown;
}[] = [
  // ---- Home ----
  {
    page: "home",
    key: "hero.eyebrow",
    kind: "text",
    label: "Hero badge text",
    value: "Healthcare Programs"
  },
  {
    page: "home",
    key: "hero.headlineLead",
    kind: "text",
    label: "Hero headline (first line)",
    value: "Your Path to a"
  },
  {
    page: "home",
    key: "hero.headlineAccent",
    kind: "text",
    label: "Hero headline (highlighted word)",
    value: "Rewarding"
  },
  {
    page: "home",
    key: "hero.headlineTail",
    kind: "text",
    label: "Hero headline (second line)",
    value: "Healthcare Career"
  },
  {
    page: "home",
    key: "hero.subheading",
    kind: "richtext",
    label: "Hero paragraph",
    value:
      "Transform your future with state-approved healthcare training programs. Get the skills, certification, and confidence to excel in your new career."
  },
  {
    page: "home",
    key: "hero.stat2.value",
    kind: "text",
    label: "Hero stat 2 — value",
    value: "120-Hour"
  },
  {
    page: "home",
    key: "hero.stat2.label",
    kind: "text",
    label: "Hero stat 2 — label",
    value: "CNA Training"
  },
  {
    page: "home",
    key: "hero.stat3.value",
    kind: "text",
    label: "Hero stat 3 — value",
    value: "State"
  },
  {
    page: "home",
    key: "hero.stat3.label",
    kind: "text",
    label: "Hero stat 3 — label",
    value: "Approved"
  },
  {
    page: "home",
    key: "hero.startDatesNote",
    kind: "text",
    label: "Hero — start dates note",
    value: "Start dates throughout 2026"
  },

  // Section headings further down the page.
  {
    page: "home",
    key: "programs.heading",
    kind: "text",
    label: "Programs section — heading",
    value: "Find Your Perfect Program"
  },
  {
    page: "home",
    key: "programs.subheading",
    kind: "richtext",
    label: "Programs section — paragraph",
    value:
      "Choose from our range of comprehensive healthcare training programs, each designed to prepare you for a successful career."
  },
  {
    page: "home",
    key: "success.heading",
    kind: "text",
    label: "Success section — heading",
    value: "We're Invested in Your Success"
  },
  {
    page: "home",
    key: "success.subheading",
    kind: "richtext",
    label: "Success section — paragraph",
    value:
      "Our commitment goes beyond education - we provide the resources and support you need to thrive in your healthcare career."
  },
  {
    page: "home",
    key: "testimonials.heading",
    kind: "text",
    label: "Testimonials section — heading",
    value: "Hear From Our Graduates"
  },
  {
    page: "home",
    key: "cta.heading",
    kind: "text",
    label: "Closing call to action — heading",
    value: "Ready to Begin?"
  },
  {
    page: "home",
    key: "cta.subheading",
    kind: "richtext",
    label: "Closing call to action — paragraph",
    value:
      "Take the first step towards a fulfilling career in healthcare. Our admissions team is here to guide you through the enrollment process."
  },

  // ---- Courses listing page ----
  {
    page: "courses",
    key: "hero.heading",
    kind: "text",
    label: "Page heading",
    value: "Explore Our Healthcare Training Programs"
  },
  {
    page: "courses",
    key: "hero.subheading",
    kind: "richtext",
    label: "Page introduction",
    value:
      "State-approved certifications designed to launch your healthcare career. Flexible schedules, expert instruction, and hands-on training to help you succeed."
  },
  {
    page: "courses",
    key: "schedules.heading",
    kind: "text",
    label: "Schedules section — heading",
    value: "Course Schedules"
  },
  {
    page: "courses",
    key: "schedules.subheading",
    kind: "text",
    label: "Schedules section — paragraph",
    value: "Published schedules for 2026 and early 2027 cohorts."
  },
  {
    page: "courses",
    key: "programs.heading",
    kind: "text",
    label: "Programs section — heading",
    value: "Available Programs"
  },
  {
    page: "courses",
    key: "programs.subheading",
    kind: "richtext",
    label: "Programs section — paragraph",
    value:
      "Choose the program that fits your career goals and schedule. All courses include hands-on training and certification preparation."
  },
  {
    page: "courses",
    key: "enrollment.heading",
    kind: "text",
    label: "Enrollment section — heading",
    value: "Simple Enrollment Process"
  },
  {
    page: "courses",
    key: "enrollment.subheading",
    kind: "text",
    label: "Enrollment section — paragraph",
    value: "Get started in just four easy steps"
  },

  // ---- Services ----
  {
    page: "services",
    key: "homeAssistance.items",
    kind: "json",
    label: "Home assistance services",
    value: [
      { icon: "Utensils", title: "Meal Planning & Preparation", description: "Nutritious meal planning and cooking assistance" },
      { icon: "Sparkles", title: "Light Housekeeping", description: "Maintaining a clean and safe living environment" },
      { icon: "ShoppingCart", title: "Grocery Shopping", description: "Shopping assistance and errand support" },
      { icon: "Shield", title: "Laundry Assistance", description: "Washing, folding, and organizing clothing" },
      { icon: "Car", title: "Errands", description: "Transportation and errand assistance" },
      { icon: "Car", title: "Doctor Appointments", description: "Transportation and companion care for medical visits" },
      { icon: "Pill", title: "Medication Reminders", description: "Ensuring medications are taken on schedule" },
      { icon: "CheckCircle", title: "Family Respite", description: "Temporary relief for family caregivers" }
    ]
  },
  {
    page: "services",
    key: "personalCare.items",
    kind: "json",
    label: "Personal care services",
    value: [
      { icon: "Bath", title: "Bathing", description: "Safe bathing and showering assistance" },
      { icon: "Shield", title: "Dressing", description: "Help with clothing and getting ready" },
      { icon: "Sparkles", title: "Personal Hygiene", description: "Grooming and hygiene support" },
      { icon: "Sparkles", title: "Grooming", description: "Hair care, shaving, and personal care" },
      { icon: "Activity", title: "Mobility Assistance", description: "Safe movement and transfer support" },
      { icon: "Heart", title: "Incontinence Care", description: "Dignified personal care assistance" }
    ]
  },
  {
    page: "services",
    key: "specialty.items",
    kind: "json",
    label: "Specialty services",
    value: [
      {
        icon: "Activity",
        title: "Home Infusion",
        description:
          "Comprehensive in-home infusion therapy services including nursing care, medication administration, and supplies for patients requiring IV treatments.",
        features: ["24/7 nursing support", "Medication management", "Administrative supplies", "Patient education"],
        backgroundImage: "/Home Infusion.jpeg"
      },
      {
        icon: "Home",
        title: "Supplemental Staffing",
        description:
          "Professional healthcare staffing solutions for medical offices, facilities, and hospitals with qualified RNs, LPNs, CNAs, and patient sitters.",
        features: ["Registered Nurses (RN)", "Licensed Practical Nurses (LPN)", "Certified Nursing Assistants (CNA)", "Patient sitters"],
        backgroundImage: "/Supplemental Staffing.jpeg"
      },
      {
        icon: "Activity",
        title: "Foot Care Nurse",
        description:
          "Specialized skilled nursing foot care services providing comprehensive treatment for nail care, calluses, corns, circulation support, and pain management.",
        features: ["Professional nail care", "Callus and corn treatment", "Circulation assessment", "Pain reduction therapy"],
        backgroundImage: "/FootCareNurse.jpeg"
      }
    ]
  },

  // ---- Employment ----
  {
    page: "employment",
    key: "positions",
    kind: "json",
    label: "Open positions",
    value: [
      {
        title: "Registered Nurse (RN)",
        type: "Full-time / Part-time",
        description:
          "Provide skilled nursing care for in-home infusion therapy and patient care. Work with diverse patient populations across all ages.",
        requirements: ["Active RN license", "Infusion therapy experience preferred", "Reliable transportation", "Excellent communication skills"]
      },
      {
        title: "Licensed Practical Nurse (LPN)",
        type: "Full-time / Part-time",
        description:
          "Support patient care in home health settings. Administer medications, monitor vital signs, and provide quality nursing care.",
        requirements: ["Active LPN license", "Home health experience preferred", "Strong clinical skills", "Compassionate care approach"]
      },
      {
        title: "Certified Nursing Assistant (CNA)",
        type: "Full-time / Part-time / PRN",
        description:
          "Provide direct patient care including bathing, dressing, and mobility assistance. Help patients maintain independence at home.",
        requirements: ["Current CNA certification", "Clean background check", "Reliable transportation", "Caring and patient demeanor"]
      },
      {
        title: "Foot Care Technician",
        type: "Full-time / Part-time",
        description:
          "Responsibilities include foot health, trimming toenails, educating patients on foot hygiene, and working with other healthcare professionals to manage complex conditions. Foot Care Technicians play a vital role in preventing complications such as infections or ulcers, which can lead to serious health issues if left untreated.",
        requirements: ["On-the-job training provided", "No credentials needed", "Reliable transportation", "Caring and patient demeanor"]
      },
      {
        title: "Phlebotomy Technician",
        type: "Full-time / Part-time",
        description:
          "Perform blood draws for home health patients and clinical settings. Maintain quality specimen collection and processing.",
        requirements: ["Phlebotomy certification", "Venipuncture experience", "Attention to detail", "Professional patient interaction"]
      },
      {
        title: "Healthcare Instructor",
        type: "Full-time / Part-time",
        description:
          "Teach healthcare certification courses including CNA, phlebotomy, and medical assistant programs. Shape the next generation of healthcare professionals.",
        requirements: ["Relevant healthcare certification", "Teaching experience preferred", "Strong communication skills", "Passion for education"]
      }
    ]
  },
  {
    page: "employment",
    key: "benefits",
    kind: "json",
    label: "Employee benefits",
    value: [
      { icon: "DollarSign", title: "Competitive Pay", description: "Competitive wages with regular performance reviews and raises" },
      { icon: "Shield", title: "Retirement Plan", description: "Simple IRA with 3% company match to secure your future" },
      { icon: "GraduationCap", title: "Paid Training", description: "Comprehensive training from day one with ongoing education opportunities" },
      { icon: "Heart", title: "Free Supplies", description: "Complimentary supplies for basic lab draws and antibiotic therapy" },
      { icon: "Users", title: "Simulation Labs", description: "Access to state-of-the-art training facilities and equipment" },
      { icon: "Headphones", title: "24/7 Support", description: "Around-the-clock clinical support and guidance" },
      { icon: "Clock", title: "Flexible Schedules", description: "Full-time, part-time, and PRN positions available" },
      { icon: "TrendingUp", title: "Career Growth", description: "Advancement opportunities and career development programs" }
    ]
  }
];
