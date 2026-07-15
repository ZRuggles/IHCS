export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  nextStart: string;
  image: string;
  badge?: string;
  icon: string;
  payments: {
    // Optional: some programs (e.g. Med Tech, AHA CPR Instructor) enroll via
    // the application form + admission email and have no Stripe link yet.
    fullPaymentUrl?: string;
    paymentPlans?: {
      label: string;
      url: string;
    }[];
  };
  scheduleDates?: string[];
  details: {
    overview: string;
    curriculum: string[];
    requirements: string[];
    // Optional extra notes shown below requirements (uniforms, optional
    // items, what tuition includes, etc.).
    tuitionIncludes?: string[];
    additionalNotes?: string[];
    certification: string;
    cost: string;
    schedule: string;
  };
}

export const cnaAndRefresherSchedule = [
  "March 16 - April 25, 2026",
  "April 27 - June 6, 2026",
  "June 8 - July 18, 2026",
  "July 20 - August 29, 2026",
  "September 7 - October 17, 2026",
  "October 19 - November 28, 2026",
  "November 30, 2026 - January 9, 2027"
];

export const phlebotomySchedule = [
  "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM): May 11 - July 8, 2026",
  "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM): July 13 - September 2, 2026",
  "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM): September 7 - October 28, 2026",
  "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM): November 2 - December 23, 2026",
  "Cohort 2 (Tue/Thu, Face-to-Face): May 12 - July 9, 2026",
  "Cohort 2 (Tue/Thu, Face-to-Face): July 14 - September 10, 2026",
  "Cohort 2 (Tue/Thu, Face-to-Face): September 15 - November 19, 2026",
  "Cohort 2 (Tue/Thu, Face-to-Face): November 24, 2026 - January 26, 2027 (Thanksgiving break observed)"
];

export const courses: Course[] = [
  {
    id: "hybrid-nurse-aide",
    title: "Nurse Aide / Nursing Assistant Program",
    description:
      "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course. This 120-hour program combines flexible online learning with hands-on clinical experience, all completed in just 5½ weeks.",
    duration: "120 Hours (5½ Weeks)",
    nextStart: "May 11, 2026",
    image: "/Nurse-Aide.jpg",
    badge: "Most Popular",
    icon: "heart",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/14A5kCdpI1H55tFcbd0oM01"
    },
    scheduleDates: cnaAndRefresherSchedule,
    details: {
      overview: "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course. This 120-hour program combines flexible online learning with hands-on clinical experience, all completed in just 5½ weeks. Perfect for individuals looking to enter the nursing field quickly and confidently with weekly assignments.",
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
        "Official High School Diploma or GED — OR pass our Placement Test",
        "Immunizations Required",
        "TB Skin Test or Quantiferon Test"
      ],
      tuitionIncludes: [
        "Criminal Background Check",
        "Drug Screening"
      ],
      additionalNotes: [
        "Students are responsible for purchasing uniforms at the school's selected uniform location."
      ],
      certification: "State-approved Nurse Aide I certification upon successful completion and passing the state exam",
      cost: "$1,205",
      schedule: "120 hours / 5½ weeks, online and in-person format with included clinicals"
    }
  },
  {
    id: "hybrid-phlebotomy-technician",
    title: "Phlebotomy Course",
    description: "Build core phlebotomy skills in our 8-week Hybrid Phlebotomy Technician course with weekly online assignments, in-person instruction, and clinical practice.",
    duration: "8 Weeks",
    nextStart: "May 11, 2026",
    image: "/Phlebotomy.jpg",
    badge: "Fast Track",
    icon: "droplet",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/7sY28qadwbhFf4f7UX0oM02"
    },
    scheduleDates: phlebotomySchedule,
    details: {
      overview: "Students complete online assignments each week, with all coursework due by Sunday and weekly exams every Thursday. This 8-week phlebotomy program includes in-person instruction and begins clinical placement in Week 4. During clinicals, students work to complete ASPT certification requirements, including 75 successful venipunctures of various types. Completion requirements may be met at different times based on student progress, but graduation occurs at the official course end date.",
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
      tuitionIncludes: [
        "Criminal Background Check",
        "Drug Screening"
      ],
      additionalNotes: [
        "Optional: Textbook (Book online in Google Classroom)",
        "Optional: Practice Arm",
        "Students are responsible for purchasing uniforms at the school's selected uniform location."
      ],
      certification: "Certificate of Completion with ASPT certification preparation",
      cost: "$1,205",
      schedule: "8 weeks - Cohort 1 (Mon/Wed 9:00 AM - 1:00 PM) or Cohort 2 (Tue/Thu face-to-face), with clinicals starting Week 4"
    }
  },
  {
    id: "medication-aide",
    title: "Medication Aide Class",
    description: "This course is designed for individuals who are currently listed as Nursing Assistants. Classes begin every Monday. Course materials are included in tuition.",
    duration: "Self-Paced + 1-Day Skills Check-Off",
    nextStart: "Every Monday",
    image: "/Medication.jpg",
    icon: "pill",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/28EaEW2L45Xl8FR5MP0oM04"
    },
    details: {
      overview: "This Medication Aide Class is designed for individuals who are currently listed as Nursing Assistants. Classes begin every Monday, so you can start the week you're ready. Complete the lessons online at your own pace, then attend a one-day in-person competency check-off. Approved for North Carolina state requirements. Course materials are included in tuition.",
      curriculum: [
        "New classes begin every Monday",
        "Self-paced online instruction",
        "1-day in-person skills validation",
        "State-approved curriculum",
        "Course materials included in tuition"
      ],
      requirements: [
        "Valid ID",
        "Social Security Card",
        "Official High School Diploma or GED"
      ],
      certification: "State-approved Medication Aide certification",
      cost: "$360",
      schedule: "Classes begin every Monday - self-paced online + 1-day in-person skills check-off"
    }
  },
  {
    id: "med-tech",
    title: "Med Tech Course",
    description: "Perfect for individuals interested in medication technician training. Classes begin every Monday. Course materials are included in tuition.",
    duration: "Self-Paced + 1-Day Skills Check-Off",
    nextStart: "Every Monday",
    image: "/Infusion.jpeg",
    icon: "pill",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/6oUcN45Xg0D1f4f1wz0oM0j"
    },
    details: {
      overview: "The Med Tech Course is perfect for individuals interested in medication technician training. Classes begin every Monday, so you can start the week you're ready. Complete the lessons online at your own pace, then attend a one-day in-person skills check-off. Course materials are included in tuition.",
      curriculum: [
        "New classes begin every Monday",
        "Medication technician training",
        "Self-paced online instruction",
        "1-day in-person skills validation",
        "Course materials included in tuition"
      ],
      requirements: [
        "Official High School Diploma or GED",
        "Valid ID",
        "Social Security Card"
      ],
      certification: "Medication Technician training certificate of completion",
      cost: "$360",
      schedule: "Classes begin every Monday - self-paced online + 1-day in-person skills check-off"
    }
  },
  {
    id: "hybrid-refresher-course",
    title: "Nurse Aide Refresher / CNA Refresher Course",
    description: "Designed for individuals who want to return to the healthcare field and prepare to challenge or retake the state exam. Refresh your hands-on clinical skills and build confidence.",
    duration: "1 or 2 Weeks",
    nextStart: "May 11, 2026",
    image: "/Refresher.jpg",
    icon: "refresh-cw",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/dRm28qbhAetRaNZ0sv0oM03",
      paymentPlans: [
        {
          label: "Hybrid Nurse Refresher Payment Link 1",
          url: "https://buy.stripe.com/28E7sK99setR3lxcbd0oM0e"
        },
        {
          label: "Hybrid Nurse Refresher Payment Link 2",
          url: "https://buy.stripe.com/8x2eVcgBU4Thg8j6QT0oM0f"
        }
      ]
    },
    scheduleDates: cnaAndRefresherSchedule,
    details: {
      overview: "Our Nurse Aide Refresher Course is designed for individuals who want to return to the healthcare field and prepare to challenge or retake the state exam. This course is designed to refresh hands-on clinical skills, build confidence, and help students transition back into healthcare opportunities.",
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
      additionalNotes: [
        "This course is available to: Expired Nursing Assistants; individuals who completed an approved Nurse Aide training program but did not take the state exam (proof of course completion required); Paramedics; Respiratory Therapists; and other healthcare professionals with hands-on clinical certifications or training."
      ],
      certification: "Refresher course completion certificate to challenge or retake the state exam",
      cost: "$570",
      schedule: "1-week or 2-week formats with online review and optional skills support"
    }
  },
  {
    id: "aha-cpr-instructor",
    title: "American Heart Association CPR Instructor Course",
    description: "Take the next step in your healthcare career by becoming an American Heart Association (AHA) CPR Instructor. Designed for individuals passionate about teaching life-saving skills to healthcare professionals, workplaces, community organizations, schools, churches, and the public.",
    duration: "Instructor Certification (valid 2 years)",
    nextStart: "Contact Admissions",
    image: "/NurseAide.jpg",
    badge: "New",
    icon: "heart",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/00wcN4etMetR7BNejl0oM0k"
    },
    details: {
      overview: "Take the next step in your healthcare career by becoming an American Heart Association (AHA) CPR Instructor through Innovation Healthcare Solutions. This course is designed for individuals who are passionate about teaching life-saving skills to healthcare professionals, workplaces, community organizations, schools, churches, and the public. Once all requirements are successfully completed, students will receive their official American Heart Association CPR Instructor Card, valid for two years.",
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
      certification: "Official American Heart Association CPR Instructor Card, valid for two years",
      cost: "$700",
      schedule: "Contact admissions for the current schedule"
    }
  }
];
