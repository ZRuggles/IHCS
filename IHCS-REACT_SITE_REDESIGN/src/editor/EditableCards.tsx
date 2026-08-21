import { useState, type ReactNode } from "react";
import { Pencil, Check, Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useEditor } from "./useEditor";
import { api, ApiError } from "./api";
import { useContent } from "../content/context";

/**
 * Editor for content blocks that hold a LIST OF OBJECTS —
 * the Services cards, Employment positions, and benefits.
 *
 * Distinct from the other two editors:
 *   Editable.tsx       page copy      -> content_blocks, plain strings
 *   EditableField.tsx  course columns -> PATCH /api/courses/:id
 *   this file          card lists     -> content_blocks, arrays of objects
 *
 * Each card gets its own labelled fields rather than raw JSON, so an
 * editor is never asked to get brackets and commas right.
 */

/** Describes one field on a card, for rendering the form. */
export interface CardField {
  key: string;
  label: string;
  /** "text" is a single line, "textarea" a paragraph, "list" a bullet array. */
  type: "text" | "textarea" | "list";
}

/**
 * One card. Deliberately loose: callers pass their own typed shapes
 * (Position, Service, and so on) and this editor only needs to read and
 * write fields by name.
 */
type Card = Record<string, unknown>;

interface EditableCardsProps<T> {
  page: string;
  contentKey: string;
  value: T[];
  fields: CardField[];
  label: string;
  children: ReactNode;
  /** Which field to show as each card's heading while editing. */
  titleField?: string;
}

export function EditableCards<T extends object>({
  page,
  contentKey,
  value,
  fields,
  label,
  children,
  titleField = "title"
}: EditableCardsProps<T>) {
  const { isSignedIn, noteSaved } = useEditor();
  const { refresh } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [cards, setCards] = useState<Card[]>(value as Card[]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSignedIn) return <>{children}</>;

  function updateField(index: number, key: string, next: unknown) {
    setCards((current) =>
      current.map((card, i) => (i === index ? { ...card, [key]: next } : card))
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= cards.length) return;
    const next = [...cards];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved!);
    setCards(next);
  }

  function addCard() {
    // Seed every declared field so the new card renders complete inputs.
    const blank: Card = {};
    for (const field of fields) blank[field.key] = field.type === "list" ? [] : "";
    // Icons are chosen in code, not here; copy one from an existing card
    // so a new entry does not render without its icon.
    const firstIcon = cards[0]?.icon;
    if (firstIcon !== undefined) blank.icon = firstIcon;
    setCards([...cards, blank]);
  }

  async function save() {
    setIsSaving(true);
    setError(null);
    try {
      await api.saveBlock(page, contentKey, cards, "json", label);
      setIsEditing(false);
      noteSaved();
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save these changes.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="group/cards relative">
        {children}
        <button
          type="button"
          onClick={() => {
            setCards(value as Card[]);
            setIsEditing(true);
          }}
          className="absolute -top-3 right-0 z-20 inline-flex items-center gap-1 rounded bg-[#561D7E] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover/cards:opacity-100 focus:opacity-100"
        >
          <Pencil className="h-3 w-3" />
          Edit {label}
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-20 rounded-lg border-2 border-[#561D7E] bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-[#561D7E]">Editing: {label}</p>

      <div className="flex flex-col gap-4">
        {cards.map((card, index) => (
          <div key={index} className="rounded border border-gray-200 bg-[#FAFAFB] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex-1 truncate text-sm font-semibold text-[#101828]">
                {String(card[titleField] ?? "") || `Item ${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="rounded p-1 text-[#6a7282] hover:bg-gray-200 disabled:opacity-30"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === cards.length - 1}
                aria-label="Move down"
                className="rounded p-1 text-[#6a7282] hover:bg-gray-200 disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCards(cards.filter((_, i) => i !== index))}
                aria-label="Remove this item"
                className="rounded p-1 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {fields.map((field) => {
                const raw = card[field.key];

                if (field.type === "list") {
                  const listItems = Array.isArray(raw) ? (raw as string[]) : [];
                  return (
                    <label key={field.key} className="text-xs">
                      <span className="mb-1 block font-medium text-[#101828]">
                        {field.label}{" "}
                        <span className="font-normal text-[#6a7282]">(one per line)</span>
                      </span>
                      <textarea
                        value={listItems.join("\n")}
                        rows={Math.max(2, listItems.length)}
                        onChange={(e) =>
                          updateField(
                            index,
                            field.key,
                            e.target.value.split("\n").map((line) => line.trim())
                          )
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-[#561D7E]"
                      />
                    </label>
                  );
                }

                return (
                  <label key={field.key} className="text-xs">
                    <span className="mb-1 block font-medium text-[#101828]">{field.label}</span>
                    {field.type === "textarea" ? (
                      <textarea
                        value={String(raw ?? "")}
                        rows={3}
                        onChange={(e) => updateField(index, field.key, e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-[#561D7E]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(raw ?? "")}
                        onChange={(e) => updateField(index, field.key, e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-[#561D7E]"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCard}
        className="mt-3 inline-flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-sm text-[#101828]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add another
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2 border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={isSaving}
          className="inline-flex items-center gap-1 rounded bg-[#561D7E] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Save changes
        </button>
        <button
          type="button"
          onClick={() => {
            setCards(value as Card[]);
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
