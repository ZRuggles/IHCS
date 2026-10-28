export const CONTACT_INFO = {
  faxNumber: "7047692049",
  faxHref: "tel:+17047692049"
};

// Email applicants use to send any additional requested documents.
export const ADMISSION_EMAIL = "admission@innovationhealthcaresolutions.com";

export const APPLICATION_LINKS = {
  // Online application — required for ALL programs. Points to the Populi
  // admissions application. Every "Apply Online" / "Apply for This Course"
  // button across the site uses this single value.
  schoolApplication:
    "https://iihs.populiweb.com/router/admissions/onlineapplications/index?application_form=2",
  // Add the distinct Populi LPN application here once Admissions provides it.
  // Until then, the application-choice page safely sends both choices to the
  // current general application.
  lpnApplication: "",
  // Enrollment Agreement Forms (previous Google Form). Currently unused —
  // the Enrollment Agreement buttons are commented out site-wide until the
  // Populi flow / new destination is confirmed. Kept here for easy re-enable.
  enrollmentAgreement:
    "https://docs.google.com/forms/d/e/1FAIpQLSdDsxdGtPb1vdHTPeGAxmJjr_oLXLsGTfa9sljbpCxjIh3v6Q/viewform?usp=sharing&ouid=111345749796514694670"
};

// The LPN program and its application-choice modal stay hidden until this
// moment (midnight Eastern, Nov 2 2026). Checked in the visitor's browser, so
// the switch happens on its own without a rebuild.
export const LPN_LAUNCH_AT = new Date("2026-11-02T00:00:00-05:00");

export function isLpnLaunched(): boolean {
  return Date.now() >= LPN_LAUNCH_AT.getTime();
}

const LPN_MENTION = /\bLPNs?\b|Licensed Practical Nurs/i;

/** True for text (a job title, a feature bullet) to hide before the launch. */
export function isHiddenLpn(text: string): boolean {
  return !isLpnLaunched() && LPN_MENTION.test(text);
}

/**
 * Drops "LPNs" from a list in running copy before the launch, e.g.
 * "RNs, LPNs, CNAs, and patient sitters" -> "RNs, CNAs, and patient sitters".
 * Display-only: editors still see and save the original text.
 */
export function withoutLpn(text: string): string {
  if (isLpnLaunched()) return text;
  return text
    .replace(/\blicensed practical nurses?,\s*/gi, "")
    .replace(/\bLPNs?,\s*/g, "")
    .replace(/,?\s*(?:and\s+)?\bLPNs?\b/g, "");
}

export const APPLICATION_LINK_LABELS = {
  schoolApplication: "School Application Form",
  enrollmentAgreement: "Enrollment Agreement Forms"
};

// Learning Management System login for current students. Leave as an empty
// string until the real LMS link is available — while empty, the header renders
// the "Current Student LMS" button in a disabled state. Paste the real URL here
// (e.g. "https://your-lms.example.com/login") to activate it.
export const LMS_URL = "https://iihs.populiweb.com/";

/**
 * Builds a mailto: link that opens the visitor's default email app with the
 * admission address, a subject, and a body pre-filled. The visitor only needs
 * to attach their documents and hit send. (Browsers cannot auto-attach files
 * to a mailto link, so the body instructs the visitor to attach them.)
 */
export function buildDocumentEmailHref(courseTitle?: string): string {
  const subject = courseTitle
    ? `Document Submission - ${courseTitle}`
    : "Document Submission - Innovation Healthcare Solutions";

  const bodyLines = [
    "Hello Admissions Team,",
    "",
    courseTitle
      ? `I am submitting my requested documents for the ${courseTitle}.`
      : "I am submitting my requested documents.",
    "",
    "Please attach your documents to this email before sending (for example: Valid ID, Social Security Card, Official Transcript or GED, immunization records, or proof of prior training).",
    "",
    "Name:",
    "Phone:",
    "Program of interest:",
    "",
    "Thank you,"
  ];

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\r\n")
  });

  // URLSearchParams encodes spaces as "+"; mailto clients expect %20.
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${ADMISSION_EMAIL}?${query}`;
}
