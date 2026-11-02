/**
 * The November 2, 2026 reorganization of the site's /public images into
 * /images/{programs,school,care,brand}. Old path -> new path, as served
 * from the site's origin.
 *
 * Used by reorganize-images-2026-11-02.ts to rewrite the database, and
 * as the record of where each file went.
 */
export const IMAGE_MOVES: ReadonlyArray<readonly [string, string]> = [
  // School program photos
  ["/Nurse-Aide.jpg", "/images/programs/nurse-aide-i.jpg"],
  ["/Refresher.jpg", "/images/programs/nurse-aide-refresher.jpg"],
  ["/NurseAide.jpg", "/images/programs/nurse-aide-ii.jpg"],
  ["/LPN and RN.jpg", "/images/programs/practical-nursing.jpg"],
  ["/Medication.jpg", "/images/programs/medication-aide.jpg"],
  ["/Infusion.jpeg", "/images/programs/med-tech.jpeg"],
  ["/CPR.png", "/images/programs/aha-cpr-instructor.png"],
  ["/Phlebotomy.jpg", "/images/programs/phlebotomy.jpg"],
  // Other school site images
  ["/NursesHoldingDiplomas.jpg", "/images/school/graduates.jpg"],
  ["/admissions/application-guide.png", "/images/school/application-guide.png"],
  // Care site photos
  ["/FootCareNurse.jpeg", "/images/care/foot-care-nurse.jpeg"],
  ["/Home Care Services.jpeg", "/images/care/home-care-services.jpeg"],
  ["/Home Infusion.jpeg", "/images/care/home-infusion.jpeg"],
  ["/PRN Home Visit.jpg", "/images/care/prn-home-visit.jpg"],
  ["/Supplemental Staffing.jpeg", "/images/care/supplemental-staffing.jpeg"],
  // Logos, favicons, and emblems
  ["/LOGO.png", "/images/brand/logo.png"],
  ["/ThumbnailLogo.png", "/images/brand/thumbnail-logo.png"],
  ["/courselogo.png", "/images/brand/course-logo.png"],
  ["/CW-Logo.bmp", "/images/brand/cw-logo.bmp"],
  ["/brands/iihs-logo.png", "/images/brand/iihs-logo.png"],
  ["/brands/ihs-logo.png", "/images/brand/ihs-logo.png"],
  ["/Glossy Golden I Lightbulb Emblem.png", "/images/brand/lightbulb-emblem.png"],
  ["/Glossy Purple Gold Graduation Emblem.png", "/images/brand/graduation-emblem-glossy.png"],
  ["/Purple and Gold Graduation Emblem.png", "/images/brand/graduation-emblem.png"],
];

/**
 * Every spelling of each old path that can appear in stored text: as
 * written, and URL-encoded ("/Home%20Care%20Services.jpeg").
 */
export function pathRewrites(): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  for (const [from, to] of IMAGE_MOVES) {
    pairs.push([from, to]);
    if (encodeURI(from) !== from) pairs.push([encodeURI(from), to]);
  }
  return pairs;
}

/** Rewrites every old image path in a piece of text. */
export function rewriteImagePaths(text: string): string {
  return pathRewrites().reduce((out, [from, to]) => out.replaceAll(from, to), text);
}
