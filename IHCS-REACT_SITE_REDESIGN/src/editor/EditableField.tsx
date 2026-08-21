import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pencil, Check, X, Loader2, Plus, Trash2 } from "lucide-react";
import { useEditor } from "./useEditor";
import { api, ApiError } from "./api";
import { useContent } from "../content/context";

/**
 * Inline editors for COURSE fields.
 *
 * Distinct from Editable.tsx, which writes page copy into
 * `content_blocks`. These write to a course record instead, so they
 * PATCH /api/courses/:id and address fields by column name.
 *
 * Signed out, every component here renders its children and nothing
 * else — no wrapper, no listeners, no visual difference for visitors.
 */

type SaveState = "idle" | "saving" | "saved";

/** Course columns that are plain strings. */
export type CourseTextField =
  | "title"
  | "description"
  | "duration"
  | "cost"
  | "overview"
  | "certification"
  | "schedule_summary"
  | "next_start"
  | "badge";

/** Course columns that are ordered lists of bullet points. */
export type CourseListField =
  | "curriculum"
  | "requirements"
  | "tuition_includes"
  | "additional_notes";

/**
 * Refreshes drafts after a save so every place the value appears
 * updates at once — a price shows on the card, the sidebar, and the
 * cost breakdown, and they must never disagree.
 */
function useAfterSave() {
  const { noteSaved } = useEditor();
  const { refresh } = useContent();
  return async () => {
    noteSaved();
    await refresh();
  };
}

interface EditableCourseTextProps {
  /** Database id (uuid) of the course — NOT the slug. */
  courseId: string;
  field: CourseTextField;
  value: string;
  children: ReactNode;
  multiline?: boolean;
  label: string;
}

export function EditableCourseText({
  courseId,
  field,
  value,
  children,
  multiline = false,
  label
}: EditableCourseTextProps) {
  const { isSignedIn } = useEditor();
  const afterSave = useAfterSave();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  if (!isSignedIn) return <>{children}</>;

  async function save() {
    if (draft === value) {
      setIsEditing(false);
      return;
    }
    setState("saving");
    setError(null);
    try {
      await api.updateCourse(courseId, { [field]: draft });
      setState("saved");
      setIsEditing(false);
      await afterSave();
      window.setTimeout(() => setState("idle"), 1800);
    } catch (err) {
      setState("idle");
      setError(
        err instanceof ApiError
          ? (err.fields[field] ?? err.message)
          : "Could not save. Please try again."
      );
    }
  }

  function cancel() {
    setDraft(value);
    setIsEditing(false);
    setError(null);
  }

  if (isEditing) {
    const common = {
      ref: inputRef,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      className:
        "w-full rounded border-2 border-[#561D7E] bg-white px-2 py-1 text-base text-[#101828] outline-none",
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          void save();
        }
      }
    };

    return (
      <span className="relative z-20 block">
        {multiline ? <textarea {...common} rows={5} /> : <input {...common} type="text" />}
        <span className="mt-1 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void save()}
            disabled={state === "saving"}
            className="inline-flex items-center gap-1 rounded bg-[#561D7E] px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
          >
            {state === "saving" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={cancel}
            className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
          <span className="text-xs text-gray-500">
            {multiline ? "Ctrl+Enter saves" : "Enter saves"} · Esc cancels
          </span>
        </span>
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <span className="group/f relative inline-block max-w-full">
      {children}
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setIsEditing(true);
        }}
        aria-label={`Edit ${label}`}
        title={`Edit ${label}`}
        className="ml-1.5 inline-flex h-5 w-5 shrink-0 translate-y-[-2px] items-center justify-center rounded bg-[#561D7E] align-middle text-white opacity-0 shadow transition-opacity group-hover/f:opacity-100 focus:opacity-100"
      >
        <Pencil className="h-3 w-3" />
      </button>
      {state === "saved" && (
        <span className="ml-1 align-middle text-xs font-medium text-green-700">Saved</span>
      )}
    </span>
  );
}

interface EditableCourseListProps {
  courseId: string;
  field: CourseListField;
  value: string[];
  children: ReactNode;
  label: string;
}

/**
 * Edits a bullet list (curriculum, requirements, and similar).
 *
 * Opens the whole list at once rather than per-item: reordering and
 * adding are far more common than changing one line, and a single
 * save keeps the list consistent.
 */
export function EditableCourseList({
  courseId,
  field,
  value,
  children,
  label
}: EditableCourseListProps) {
  const { isSignedIn } = useEditor();
  const afterSave = useAfterSave();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<string[]>(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSignedIn) return <>{children}</>;

  async function save() {
    // Blank rows are dropped rather than rejected — an empty box the
    // editor never filled in is not an error worth interrupting them for.
    const cleaned = items.map((i) => i.trim()).filter((i) => i !== "");
    setIsSaving(true);
    setError(null);
    try {
      await api.updateCourse(courseId, { [field]: cleaned });
      setIsEditing(false);
      await afterSave();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this list.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isEditing) {
    return (
      <div className="relative z-20 rounded border-2 border-[#561D7E] bg-white p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#561D7E]">
          {label}
        </p>

        <ul className="mb-3 flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <textarea
                value={item}
                rows={Math.max(1, Math.ceil(item.length / 60))}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = e.target.value;
                  setItems(next);
                }}
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm text-[#101828] outline-none focus:border-[#561D7E]"
              />
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                aria-label={`Remove item ${index + 1}`}
                className="mt-1 rounded p-1 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setItems([...items, ""])}
          className="mb-3 inline-flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-sm text-[#101828]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>

        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void save()}
            disabled={isSaving}
            className="inline-flex items-center gap-1 rounded bg-[#561D7E] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save list
          </button>
          <button
            type="button"
            onClick={() => {
              setItems(value);
              setIsEditing(false);
              setError(null);
            }}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group/l relative">
      {children}
      <button
        type="button"
        onClick={() => {
          setItems(value.length ? value : [""]);
          setIsEditing(true);
        }}
        aria-label={`Edit ${label}`}
        title={`Edit ${label}`}
        className="absolute -top-2 right-0 z-10 inline-flex items-center gap-1 rounded bg-[#561D7E] px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover/l:opacity-100 focus:opacity-100"
      >
        <Pencil className="h-3 w-3" />
        Edit list
      </button>
    </div>
  );
}

interface EditableCourseImageProps {
  courseId: string;
  children: ReactNode;
  alt: string;
}

/** Click-to-replace for a course's photo. */
export function EditableCourseImage({ courseId, children, alt }: EditableCourseImageProps) {
  const { isSignedIn } = useEditor();
  const afterSave = useAfterSave();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isSignedIn) return <>{children}</>;

  async function handleFile(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const { image } = await api.uploadImage(file, alt);
      await api.updateCourse(courseId, { image_id: image.id });
      await afterSave();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The photo could not be uploaded.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="group/img relative">
      {children}

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded bg-black/40 opacity-0 transition-opacity group-hover/img:opacity-100">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="pointer-events-auto inline-flex items-center gap-2 rounded bg-white px-3 py-2 text-sm font-medium text-[#561D7E] shadow"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" /> Replace photo
            </>
          )}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="absolute inset-x-0 bottom-0 z-20 bg-red-600 px-2 py-1 text-xs text-white">
          {error}
        </p>
      )}
    </div>
  );
}
