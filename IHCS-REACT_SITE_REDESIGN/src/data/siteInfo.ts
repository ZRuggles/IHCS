export const CONTACT_INFO = {
  faxNumber: "7047692049",
  faxHref: "tel:+17047692049"
};

// Email applicants use to send any additional requested documents.
export const ADMISSION_EMAIL = "admission@innovationhealthcaresolutions.com";

export const APPLICATION_LINKS = {
  // School Application Form — required for ALL programs.
  schoolApplication:
    "https://docs.google.com/forms/d/e/1FAIpQLSes_Fcnig9yHdRtDCAUgf8yPGLznEsRxlIwR3qJLbr2lHPRyw/viewform?usp=sharing&ouid=111345749796514694670",
  // Enrollment Agreement Forms.
  enrollmentAgreement:
    "https://docs.google.com/forms/d/e/1FAIpQLSdDsxdGtPb1vdHTPeGAxmJjr_oLXLsGTfa9sljbpCxjIh3v6Q/viewform?usp=sharing&ouid=111345749796514694670"
};

export const APPLICATION_LINK_LABELS = {
  schoolApplication: "School Application Form",
  enrollmentAgreement: "Enrollment Agreement Forms"
};

// URL the top-bar "Apply Online" button points to. Swap this single value when
// a new apply destination exists.
export const APPLY_ONLINE_URL =
  "https://iihs.populiweb.com/router/admissions/onlineapplications/index?application_form=2";

// Learning Management System login for current students. Leave as an empty
// string until the real LMS link is available — while empty, the header renders
// the "Current Student LMS" button in a disabled state. Paste the real URL here
// (e.g. "https://your-lms.example.com/login") to activate it.
export const LMS_URL = "";

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
    "Please attach your documents to this email before sending (for example: Valid ID, Social Security Card, High School Diploma or GED, immunization records, or proof of prior training).",
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
