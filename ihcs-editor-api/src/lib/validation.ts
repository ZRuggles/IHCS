import { z } from "zod";

/**
 * Input validation.
 *
 * Every write is validated server-side before it reaches the
 * database. Client-side checks are a convenience for the editor;
 * these are the ones that actually protect the data.
 */

/**
 * Trims and strips control characters.
 *
 * Note this is NOT the XSS defense — React escapes text on render,
 * and the publish step escapes anything embedded into JSON. This
 * only keeps invisible junk (nulls, stray control bytes) out of the
 * database so stored text stays clean and comparable.
 */
const safeText = (max: number) =>
  z
    .string()
    .max(max, `Must be ${max} characters or fewer.`)
    // eslint-disable-next-line no-control-regex
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim());

/**
 * URLs are restricted to http/https.
 *
 * Without this, a `javascript:` URL saved into a payment link
 * becomes stored XSS the moment someone clicks "Enroll".
 */
const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => {
      if (value === "") return true;
      try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid link starting with http:// or https://" }
  );

/** Lowercase, dash-separated, URL-safe. Drives /courses/:slug. */
export const slugSchema = z
  .string()
  .trim()
  .min(1, "Enter a web address for this program.")
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and dashes only (for example: nurse-aide)."
  );

const bulletList = z.array(safeText(500)).max(50, "Up to 50 items.");

export const courseSchema = z.object({
  slug: slugSchema,
  title: safeText(200).pipe(z.string().min(1, "Enter a program name.")),
  description: safeText(2000),
  duration: safeText(120),
  next_start: safeText(120),
  badge: safeText(60).nullable().optional(),
  icon: safeText(40),
  cost: safeText(60),
  image_id: z.string().uuid().nullable().optional(),

  overview: safeText(5000),
  curriculum: bulletList,
  requirements: bulletList,
  tuition_includes: bulletList,
  additional_notes: bulletList,
  certification: safeText(1000),
  schedule_summary: safeText(1000),

  full_payment_url: safeUrl.nullable().optional(),
  payment_plans: z
    .array(z.object({ label: safeText(120), url: safeUrl }))
    .max(12)
    .default([]),

  status: z.enum(["draft", "published", "hidden"]).default("draft"),
  schedule_group_id: z.string().uuid().nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).default(0)
});

export type CourseInput = z.infer<typeof courseSchema>;

/** Partial update — every field optional, but each still validated. */
export const coursePatchSchema = courseSchema.partial();

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Choose a valid date.");

export const scheduleEntrySchema = z
  .object({
    label: safeText(200).nullable().optional(),
    start_date: isoDate,
    end_date: isoDate,
    note: safeText(200).nullable().optional(),
    sort_order: z.number().int().min(0).max(9999).default(0)
  })
  .refine((entry) => entry.end_date >= entry.start_date, {
    message: "The end date must be on or after the start date.",
    path: ["end_date"]
  });

export const contentBlockSchema = z.object({
  page: safeText(60),
  key: safeText(120),
  kind: z.enum(["text", "richtext", "image", "list", "json"]).default("text"),
  label: safeText(200).default(""),
  value: z.unknown()
});

export const settingSchema = z.object({
  key: safeText(80),
  label: safeText(200).default(""),
  value: z.unknown()
});

export const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  full_name: safeText(120).default(""),
  role: z.enum(["admin", "editor", "viewer"]).default("editor")
});

export const imageMetaSchema = z.object({
  alt_text: safeText(300).default("")
});

/**
 * Formats a Zod error into `{ field: message }` so the editor UI can
 * show the message next to the field that caused it.
 */
export function formatValidationError(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_";
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}
