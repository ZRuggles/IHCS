export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  nextStart: string;
  image: string;
  badge?: string;
  icon: string;
  details: {
    overview: string;
    curriculum: string[];
    requirements: string[];
    certification: string;
    cost: string;
    schedule: string;
  };
}

export const courses: Course[] = [
  {
    id: "hybrid-nurse-aide",
    title: "Hybrid Nurse Aide Course (North Carolina)",
    description: "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course combining online learning with hands-on clinical experience.",
    duration: "128 Hours (5 Weeks)",
    nextStart: "April 5, 2026",
    image: "https://images.unsplash.com/photo-1731514836024-614e2bab04c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTkElMjBudXJzaW5nJTIwYXNzaXN0YW50JTIwcGF0aWVudCUyMGNhcmUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQxMjc0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Most Popular",
    icon: "heart",
    details: {
      overview: "Jumpstart your healthcare career with our state-approved Hybrid Nurse Aide I course. This 128-hour program combines flexible online learning with hands-on clinical experience, all completed in just 5 weeks. Perfect for individuals looking to enter the nursing field quickly and confidently with weekly assignments.",
      curriculum: [
        "Online learning with weekly assignments",
        "Lab Days: Saturdays and Sundays, 9:00 AM to 5:00 PM (Weeks 1-3)",
        "Clinical Days: Saturdays and Sundays, 7:00 AM to 3:00 PM (Weeks 4-5)",
        "Basic Nursing Skills",
        "Vital Signs and Measurements",
        "Patient Care and Safety",
        "Infection Control",
        "Communication and Interpersonal Skills",
        "Restorative Services",
        "Personal Care Procedures"
      ],
      requirements: [
        "High school diploma or GED",
        "Pass background check",
        "Physical examination",
        "TB test",
        "Must be 18 years or older"
      ],
      certification: "State-approved Nurse Aide I certification upon successful completion and passing the state exam",
      cost: "$1,128",
      schedule: "128 hours / 5 weeks - Online & in-person format, clinicals included, uniform included in tuition"
    }
  },
  {
    id: "hybrid-phlebotomy-technician",
    title: "Hybrid Phlebotomy Technician Course",
    description: "Master the essential skills of phlebotomy in just 4 weeks with our hybrid program blending online instruction with in-person lab sessions.",
    duration: "4 Weeks",
    nextStart: "April 12, 2026",
    image: "https://images.unsplash.com/photo-1569287808794-a0c3f32d4388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGxlYm90b215JTIwYmxvb2QlMjBkcmF3JTIwdGVjaG5pY2lhbiUyMHRyYWluaW5nfGVufDF8fHx8MTc3NDEyNzQ0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Fast Track",
    icon: "droplet",
    details: {
      overview: "Master the essential skills of phlebotomy in just 4 weeks with our Hybrid Phlebotomy Technician course. This program blends online instruction with in-person lab sessions, preparing students for work in hospitals, labs, and clinics.",
      curriculum: [
        "Online learning + hands-on lab",
        "Venipuncture Techniques",
        "Capillary Collection",
        "Safety and Infection Control",
        "Specimen Handling and Processing",
        "Medical Terminology",
        "Patient Interaction and Care",
        "Laboratory Operations",
        "Clinical Practicum"
      ],
      requirements: [
        "High school diploma or GED",
        "Pass background check",
        "Physical examination and immunizations",
        "Good manual dexterity",
        "Must be 18 years or older"
      ],
      certification: "Certificate of Completion - National certification eligible",
      cost: "$1,128",
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
    details: {
      overview: "This Hybrid Medication Aide course is ideal for nurse aides looking to expand their skills. Complete the lessons online at your own pace, then attend a one-day in-person competency check-off. Approved for North Carolina state requirements.",
      curriculum: [
        "Self-paced online instruction",
        "Medication Administration Fundamentals",
        "Dosage Calculation",
        "Medication Safety and Storage",
        "Documentation and Record-Keeping",
        "Patient Rights and Ethics",
        "Common Medications and Side Effects",
        "1-day in-person skills validation"
      ],
      requirements: [
        "Active Nurse Aide certification",
        "Good standing with state registry",
        "Basic computer skills for online learning",
        "Reliable internet access"
      ],
      certification: "State-approved Medication Aide certification",
      cost: "$250",
      schedule: "Self-paced online + 1-day in-person skills check-off"
    }
  },
  {
    id: "hybrid-refresher-course",
    title: "Hybrid Refresher Course",
    description: "Have your Nurse Aide certification lapsed or need to refresh your skills? Our Hybrid Refresher Course offers 1-week and 2-week options.",
    duration: "1 or 2 Weeks",
    nextStart: "April 19, 2026",
    image: "https://images.unsplash.com/photo-1676046261150-063cf0de59dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGFpZGUlMjB0cmFpbmluZyUyMHNraWxscyUyMHJlZnJlc2hlciUyMGNvdXJzZXxlbnwxfHx8fDE3NzQxMjg2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "refresh-cw",
    details: {
      overview: "Have your Nurse Aide certification lapsed or need to refresh your skills? Our Hybrid Refresher Course offers 1-week and 2-week options with online content and skills review. Open to students who have graduated from a state-approved nurse aide program or have an expired listing on the Nurse Aide Registry.",
      curriculum: [
        "Online review content",
        "Basic Nursing Skills Review",
        "Vital Signs Refresher",
        "Patient Care Techniques",
        "Infection Control Updates",
        "Safety Protocols",
        "Hands-on Skills Practice",
        "Registry renewal preparation"
      ],
      requirements: [
        "Previous graduation from state-approved nurse aide program OR expired listing on Nurse Aide Registry",
        "Valid government-issued ID",
        "Completion of background check (if applicable)"
      ],
      certification: "Refresher course completion certificate for registry renewal",
      cost: "$500",
      schedule: "1-week or 2-week formats - Online review + optional skills support"
    }
  }
];
