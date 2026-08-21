import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { useEditor } from "./useEditor";
import { api, ApiError } from "./api";

/**
 * Inline editing.
 *
 * Signed out, <EditableText> renders exactly its children and nothing
 * else — no wrapper behavior, no listeners, no visual difference.
 * Signed in, a pencil appears on hover and clicking it swaps the text
 * for an input in place.
 */

type SaveState = "idle" | "saving" | "saved" | "error";

interface EditableTextProps {
  page: string;
  contentKey: string;
  value: string;
  /** Renders the current value. Lets callers keep their own styling. */
  children: ReactNode;
  multiline?: boolean;
  label?: string;
  onSaved?: (next: string) => void;
}

export function EditableText({
  page,
  contentKey,
  value,
  children,
  multiline = false,
  label,
  onSaved
}: EditableTextProps) {
  const { isSignedIn, noteSaved } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // The draft is seeded when the pencil is clicked rather than synced
  // from an effect. Writing state from an effect on every `value` change
  // is what produces the cascading renders that froze CourseDetail once
  // before (commit db3a877), so this component avoids that shape.

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
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
      await api.saveBlock(page, contentKey, draft, multiline ? "richtext" : "text", label ?? "");
      setState("saved");
      noteSaved();
      onSaved?.(draft);
      setIsEditing(false);
      window.setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      setState("error");
      setError(err instanceof ApiError ? err.message : "Could not save. Please try again.");
    }
  }

  function cancel() {
    setDraft(value);
    setIsEditing(false);
    setState("idle");
    setError(null);
  }

  if (isEditing) {
    const shared = {
      ref: inputRef as never,
      value: draft,
      onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
      className:
        "w-full rounded border-2 border-[#561D7E] bg-white px-2 py-1 text-inherit font-inherit outline-none",
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") cancel();
        // Enter saves single-line fields; multiline needs Ctrl/Cmd+Enter
        // so a paragraph can still contain line breaks.
        if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          void save();
        }
      }
    };

    return (
      <span className="relative block">
        {multiline ? <textarea {...shared} rows={4} /> : <input {...shared} type="text" />}

        <span className="mt-1 flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => void save()}
            disabled={state === "saving"}
            className="inline-flex items-center gap-1 rounded bg-[#561D7E] px-2 py-1 text-white disabled:opacity-60"
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
            className="inline-flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-gray-700"
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
          <span className="text-xs text-gray-500">
            {multiline ? "Ctrl+Enter to save" : "Enter to save"} &middot; Esc to cancel
          </span>
        </span>

        {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <span className="group/edit relative inline-block">
      {children}
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setIsEditing(true);
        }}
        aria-label={`Edit ${label ?? contentKey}`}
        title={`Edit ${label ?? contentKey}`}
        className="ml-1 inline-flex h-5 w-5 translate-y-[-1px] items-center justify-center rounded bg-[#561D7E] text-white opacity-0 transition-opacity group-hover/edit:opacity-100 focus:opacity-100"
      >
        <Pencil className="h-3 w-3" />
      </button>
      {state === "saved" && (
        <span className="ml-1 text-xs font-medium text-green-700">Saved</span>
      )}
    </span>
  );
}

interface EditableImageProps {
  imageUrl: string;
  alt: string;
  children: ReactNode;
  onReplace: (imageId: string, url: string) => void | Promise<void>;
}

/** Wraps an image so a signed-in editor can click to replace it. */
export function EditableImage({ imageUrl, alt, children, onReplace }: EditableImageProps) {
  const { isSignedIn, noteSaved } = useEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isSignedIn) return <>{children}</>;

  async function handleFile(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const { image } = await api.uploadImage(file, alt);
      await onReplace(image.id, image.url);
      noteSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The image could not be uploaded.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <span className="group/img relative block">
      {children}

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/img:opacity-100">
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
      </span>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          // Reset so selecting the same file twice still fires onChange.
          e.target.value = "";
        }}
      />

      {error && (
        <span className="absolute inset-x-0 bottom-0 bg-red-600 px-2 py-1 text-xs text-white">
          {error}
        </span>
      )}

      {imageUrl === "" && (
        <span className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500">
          No photo yet
        </span>
      )}
    </span>
  );
}
