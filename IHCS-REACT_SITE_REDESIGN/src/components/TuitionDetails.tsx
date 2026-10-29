import { ChevronDown, DollarSign } from "lucide-react";
import type { PublicCourse } from "../content/types";
import { ADMISSION_EMAIL } from "../data/siteInfo";

/**
 * Expandable tuition breakdown, shown under the Tuition tile near the top
 * of each program page. Native <details>/<summary> (the same pattern as the
 * Student Resources questions) gives keyboard and screen-reader support.
 *
 * Revert: set SHOW_TUITION_ACCORDION to false in CourseDetail.tsx; the tile
 * goes back to "Total Cost" and this panel disappears.
 *
 * Everything shown is taken from the program's own published fields; no
 * amounts or financial-aid statements are added here.
 */

// Additional notes that describe something the student pays for outside
// tuition (uniforms, optional books or supplies). Eligibility notes and
// other information stay out of the tuition breakdown.
const COST_NOTE = /\b(optional|uniforms?|purchas\w*|textbooks?|books?|supplies|fees?)\b/i;

export function TuitionDetails({ course }: { course: PublicCourse }) {
  const { cost, overview, curriculum } = course.details;
  const included = course.details.tuitionIncludes ?? [];
  const notIncluded = (course.details.additionalNotes ?? []).filter((note) => COST_NOTE.test(note));
  // Some programs state what tuition covers in their own copy
  // ("Course materials are included in tuition"); repeat that once here.
  const includedStatements = [...curriculum, ...overview.split(/(?<=\.)\s+/)]
    .filter((text) => /included in tuition/i.test(text))
    .slice(0, 1);
  const hasPublishedTuition = /\d/.test(cost);

  return (
    <details className="group mt-4 rounded-xl border border-[#dfd1eb] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 focus-visible:outline-2focus-visible:outline-offset-2 focus-visible:outline-[#561D7E] [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <span className="rounded-lg bg-[#eee5f5] p-2">
            <DollarSign className="size-6 text-[#561D7E]" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-medium text-[#101828]">Tuition details</span>
            <span className="block text-sm text-[#6a7282]">What tuition includes and what costs extra</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#561D7E]">
          <span className="group-open:hidden">View details</span>
          <span className="hidden group-open:inline">Hide details</span>
          <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>

      <div className="space-y-5 border-t border-[#eee5f5] px-4 pb-5 pt-4 text-[#4a5565]">
        {hasPublishedTuition ? (
          <div className="flex items-baseline justify-between gap-4">
            <span>Total tuition</span>
            <span className="text-xl font-semibold text-[#561D7E]">{cost}</span>
          </div>
        ) : (
          <p>
            Tuition for this program has not been published yet. Contact Admissions at{" "}
            <a href={`mailto:${ADMISSION_EMAIL}`} className="break-all text-[#561D7E] underline">
              {ADMISSION_EMAIL}
            </a>{" "}
            or <a href="tel:+13369997123" className="whitespace-nowrap text-[#561D7E] underline">(336) 999-7123</a>.
          </p>
        )}

        {(included.length > 0 || includedStatements.length > 0) && (
          <div>
            <h3 className="mb-2 font-medium text-[#101828]">Included in tuition</h3>
            <ul className="list-disc space-y-1 pl-5">
              {included.map((item) => <li key={item}>{item}</li>)}
              {includedStatements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}

        {notIncluded.length > 0 && (
          <div>
            <h3 className="mb-2 font-medium text-[#101828]">Not included in tuition</h3>
            <ul className="list-disc space-y-1 pl-5">
              {notIncluded.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
        )}

        {hasPublishedTuition && (
          <p className="text-sm">
            Payment options are chosen in the school application. Questions about costs? Call Admissions at{" "}
            <a href="tel:+13369997123" className="whitespace-nowrap text-[#561D7E] underline">(336) 999-7123</a>.
          </p>
        )}
      </div>
    </details>
  );
}
