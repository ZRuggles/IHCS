import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { api, ApiError } from "./api";
import { useEditor } from "./useEditor";

/**
 * Creates a new program.
 *
 * Asks only for what a program genuinely needs to exist; everything
 * else is filled in afterwards by clicking the pencils on the program's
 * own page, which is where the rest of the editing happens.
 *
 * New programs are created as DRAFTS. They do not appear on the public
 * site until published, so a half-finished program is never visible.
 */

const ICON_CHOICES = [
  { value: "heart", label: "Heart" },
  { value: "droplet", label: "Droplet (phlebotomy)" },
  { value: "pill", label: "Pill (medication)" },
  { value: "refresh-cw", label: "Refresh (refresher)" },
  { value: "stethoscope", label: "Stethoscope" },
  { value: "medical", label: "Medical" },
  { value: "ambulance", label: "Ambulance" }
];

/** Derives a URL-safe slug from the program name. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

interface Props {
  onCreated: () => void;
  onCancel: () => void;
}

export function NewProgramForm({ onCreated, onCancel }: Props) {
  const { noteSaved } = useEditor();
  const [title, setTitle] = useState("");
  // Tracked separately so an editor can override the derived slug, but
  // it keeps following the title until they do.
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState("");
  const [nextStart, setNextStart] = useState("Contact Admissions");
  const [icon, setIcon] = useState("heart");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const effectiveSlug = slugTouched ? slug : slugify(title);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      await api.createCourse({
        slug: effectiveSlug,
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        cost: cost.trim(),
        next_start: nextStart.trim(),
        icon,
        // Filled in later from the program's own page. The API requires
        // these keys to be present, so they are sent as empty rather
        // than omitted.
        overview: "",
        certification: "",
        schedule_summary: "",
        curriculum: [],
        requirements: [],
        tuition_includes: [],
        additional_notes: [],
        payment_plans: [],
        // Draft until explicitly published — a new program is never
        // public the moment it is created.
        status: "draft"
      });

      noteSaved();
      onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fields);
      } else {
        setError("The program could not be created. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass =
    "w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#561D7E] focus:ring-1 focus:ring-[#561D7E]";

  return (
    <form onSubmit={submit} className="rounded-lg border-2 border-[#561D7E] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="flex-1 text-sm font-semibold text-[#101828]">Add a program</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="rounded p-1 text-[#6a7282] hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-4 text-sm text-[#6a7282]">
        Fill in the basics here. Once created, open the program to add its
        overview, curriculum, requirements, and photo.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-[#101828]">Program name</span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Medical Assistant Program"
            className={inputClass}
          />
          {fieldErrors.title && <span className="text-xs text-red-600">{fieldErrors.title}</span>}
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-[#101828]">
            Web address{" "}
            <span className="font-normal text-[#6a7282]">
              (filled in automatically — change it only if you need to)
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="shrink-0 text-sm text-[#6a7282]">/courses/</span>
            <input
              type="text"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={inputClass}
            />
          </span>
          {fieldErrors.slug && <span className="text-xs text-red-600">{fieldErrors.slug}</span>}
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-[#101828]">Short description</span>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Shown on the program card and at the top of the program page."
            className={inputClass}
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[#101828]">Duration</span>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="8 Weeks"
            className={inputClass}
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[#101828]">Tuition</span>
          <input
            type="text"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="$1,205"
            className={inputClass}
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[#101828]">Next start</span>
          <input
            type="text"
            value={nextStart}
            onChange={(e) => setNextStart(e.target.value)}
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-[#6a7282]">
            Used only until class dates are added under Class dates.
          </span>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-[#101828]">Icon</span>
          <select value={icon} onChange={(e) => setIcon(e.target.value)} className={inputClass}>
            {ICON_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-3">
        <button
          type="submit"
          disabled={isSaving || title.trim() === ""}
          className="inline-flex items-center gap-1.5 rounded bg-[#561D7E] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create program
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          Cancel
        </button>
        <span className="ml-auto text-xs text-[#6a7282]">
          Created as a draft — publish when ready.
        </span>
      </div>
    </form>
  );
}
