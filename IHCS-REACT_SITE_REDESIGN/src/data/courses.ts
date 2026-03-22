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
    fullPaymentUrl: string;
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
  "April 7 - May 29, 2026",
  "May 19 - July 10, 2026",
  "July 7 - August 28, 2026",
  "August 18 - October 9, 2026",
  "September 29 - November 20, 2026",
  "November 10 - December 31, 2026"
];

export const courses: Course[] = [
  {
    id: "hybrid-nurse-aide",
    title: "Hybrid Nurse Aide (CNA) Course (North Carolina)",
    description: "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course. This 128-hour, 5-week program includes online learning, hands-on clinical experience, and a uniform.",
    duration: "128 Hours (5 Weeks)",
    nextStart: "March 16, 2026",
    image: "https://images.unsplash.com/photo-1731514836024-614e2bab04c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkElMjBudXJzaW5nJTIwYXNzaXN0YW50JTIwcGF0aWVudCUyMGNhcmUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQxMjc0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Most Popular",
    icon: "heart",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/14A5kCdpI1H55tFcbd0oM01",
      paymentPlans: [
        { label: "Payment Plan 1", url: "https://buy.stripe.com/5kQaEW4Tc2L909l6QT0oM09" },
        { label: "Payment Plan 2", url: "https://buy.stripe.com/00w14mgBUbhFg8jcbd0oM0a" },
        { label: "Payment Plan 3", url: "https://buy.stripe.com/dRmcN44Tc99x5tF1wz0oM0b" },
        { label: "Payment Plan 4", url: "https://buy.stripe.com/4gM9ASfxQdpN5tF5MP0oM0c" },
        { label: "Payment Plan 5", url: "https://buy.stripe.com/14AbJ03P8bhFcW72AD0oM0d" }
      ]
    },
    scheduleDates: cnaAndRefresherSchedule,
    details: {
      overview: "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course. This 128-hour program combines flexible online learning with hands-on clinical experience, all completed in just 5 weeks. Perfect for individuals looking to enter the nursing field quickly and confidently with weekly assignments.",
      curriculum: [
        "Course Duration: 5 weeks per session",
        "Weekly Assignments: Online assignments with deadlines each week",
        "Online learning with weekly assignments",
        "Lab Days: Saturdays and Sundays, 9:00 AM to 5:00 PM (Weeks 1-3)",
        "Clinical Days: Saturdays and Sundays, 7:00 AM to 3:00 PM (Weeks 4-5)",
        "Online and in-person format",
        "Clinicals included",
        "Uniform included in tuition"
      ],
      requirements: [
        "High school diploma or GED",
        "Pass background check",
        "Physical examination",
        "TB test",
        "Must be 18 years or older"
      ],
      certification: "State-approved Nurse Aide I certification upon successful completion and passing the state exam",
      cost: "$1,205",
      schedule: "128 hours / 5 weeks, online and in-person format with included clinicals and uniform"
    }
  },
  {
    id: "hybrid-phlebotomy-technician",
    title: "Hybrid Phlebotomy Technician Course",
    description: "Master the essential skills of phlebotomy in just 4 weeks with our Hybrid Phlebotomy Technician course. This program blends online instruction with in-person lab sessions.",
    duration: "4 Weeks",
    nextStart: "April 7, 2026",
    image: "https://images.unsplash.com/photo-1569287808794-a0c3f32d4388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGxlYm90b215JTIwYmxvb2QlMjBkcmF3JTIwdGVjaG5pY2lhbiUyMHRyYWluaW5nfGVufDF8fHx8MTc3NDEyNzQ0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Fast Track",
    icon: "droplet",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/7sY28qadwbhFf4f7UX0oM02",
      paymentPlans: [
        { label: "Payment Plan 1", url: "https://buy.stripe.com/4gMeVcbhA99x3lx8Z10oM05" },
        { label: "Payment Plan 2", url: "https://buy.stripe.com/4gM3cudpI5Xl5tF4IL0oM06" },
        { label: "Payment Plan 3", url: "https://buy.stripe.com/9B67sKadw99x4pB7UX0oM07" },
        { label: "Payment Plan 4", url: "https://buy.stripe.com/8x29ASclE3Pd8FRgrt0oM08" }
      ]
    },
    scheduleDates: phlebotomySchedule,
    details: {
      overview: "Master the essential skills of phlebotomy in just 4 weeks with our Hybrid Phlebotomy Technician course. This program blends online instruction with in-person lab sessions, preparing students for work in hospitals, labs, and clinics.",
      curriculum: [
        "Online learning + hands-on lab",
        "Fast-track your healthcare career",
        "National certification eligible"
      ],
      requirements: [
        "High school diploma or GED",
        "Pass background check",
        "Physical examination and immunizations",
        "Good manual dexterity",
        "Must be 18 years or older"
      ],
      certification: "Certificate of Completion - National certification eligible",
      cost: "$1,205",
      schedule: "4 weeks - Hybrid format with online learning and hands-on lab sessions"
    }
  },
  {
    id: "hybrid-medication-aide",
    title: "Hybrid Medication Aide Course",
    description: "Ideal for nurse aides looking to expand their skills. Complete online lessons at your own pace, then attend a one-day in-person competency check-off.",
    duration: "Self-Paced + 1-Day Skills Check-Off",
    nextStart: "Rolling Enrollment",
    image: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2F0aW9uJTIwbnVyc2UlMjBhZG1pbmlzdGVyaW5nJTIwbWVkaWNpbmUlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc3NDEyODYzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "pill",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/28EaEW2L45Xl8FR5MP0oM04"
    },
    details: {
      overview: "This Hybrid Medication Aide course is ideal for nurse aides looking to expand their skills. Complete the lessons online at your own pace, then attend a one-day in-person competency check-off. Approved for North Carolina state requirements.",
      curriculum: [
        "Self-paced online instruction",
        "1-day in-person skills validation",
        "State-approved curriculum"
      ],
      requirements: [
        "Active Nurse Aide certification",
        "Good standing with state registry",
        "Basic computer skills for online learning",
        "Reliable internet access"
      ],
      certification: "State-approved Medication Aide certification",
      cost: "$295",
      schedule: "Self-paced online + 1-day in-person skills check-off"
    }
  },
  {
    id: "hybrid-refresher-course",
    title: "Hybrid Refresher Course (CNA)",
    description: "Have your Nurse Aide certification lapsed or need to refresh your skills? Our Hybrid Refresher Course offers 1-week and 2-week options.",
    duration: "1 or 2 Weeks",
    nextStart: "March 16, 2026",
    image: "https://images.unsplash.com/photo-1676046261150-063cf0de59dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGFpZGUlMjB0cmFpbmluZyUyMHNraWxscyUyMHJlZnJlc2hlciUyMGNvdXJzZXxlbnwxfHx8fDE3NzQxMjg2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "refresh-cw",
    payments: {
      fullPaymentUrl: "https://buy.stripe.com/dRm28qbhAetRaNZ0sv0oM03",
      paymentPlans: [
        { label: "Payment Plan 1", url: "https://buy.stripe.com/28E7sK99setR3lxcbd0oM0e" },
        { label: "Payment Plan 2", url: "https://buy.stripe.com/8x2eVcgBU4Thg8j6QT0oM0f" }
      ]
    },
    scheduleDates: cnaAndRefresherSchedule,
    details: {
      overview: "Have your Nurse Aide certification lapsed or need to refresh your skills? Our Hybrid Refresher Course offers 1-week and 2-week options with online content and skills review. Open to students who have graduated from a state-approved nurse aide program or have an expired listing on the Nurse Aide Registry.",
      curriculum: [
        "Online review + optional skills support",
        "1-week or 2-week formats available",
        "Registry renewal support"
      ],
      requirements: [
        "Previous graduation from state-approved nurse aide program OR expired listing on Nurse Aide Registry",
        "Valid government-issued ID",
        "Completion of background check (if applicable)"
      ],
      certification: "Refresher course completion certificate for registry renewal",
      cost: "$570",
      schedule: "1-week or 2-week formats with online review and optional skills support"
    }
  }
];
