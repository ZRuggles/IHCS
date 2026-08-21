import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, CalendarDays } from "lucide-react";
import { api, ApiError, type ScheduleEntry } from "./api";
import { useEditor } from "./useEditor";

/**
 * Cohort schedule editing.
 *
 * Dates are picked, never typed as prose. The preview line shows the
 * exact text that will appear on the site, and the "Next Start" line
 * shows what course cards will read — so the effect of a change is
 * visible before saving.
 */

interface Group {
  id: string;
  key: string;
  name: string;
  entry_count: number;
  used_by: string[];
}

export function ScheduleEditor() {
  const { noteSaved } = useEditor();
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [nextStart, setNextStart] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    label: "",
    start_date: "",
    end_date: "",
    note: ""
  });
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .listScheduleGroups()
      .then(({ groups: list }) => {
        setGroups(list);
        setActiveGroup((current) => current ?? list[0]?.id ?? null);
      })
      .catch(() => setError("Could not load the schedules."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!activeGroup) return;
    setIsLoading(true);
    api
      .listScheduleEntries(activeGroup)
      .then((data) => {
        setEntries(data.entries);
        setNextStart(data.nextStart);
      })
      .catch(() => setError("Could not load these dates."))
      .finally(() => setIsLoading(false));
  }, [activeGroup]);

  // Live preview of the line the new entry will produce.
  useEffect(() => {
    if (!newEntry.start_date || !newEntry.end_date) {
      setPreview("");
      return;
    }
    let cancelled = false;
    api
      .previewSchedule({
        label: newEntry.label || null,
        start_date: newEntry.start_date,
        end_date: newEntry.end_date,
        note: newEntry.note || null
      })
      .then(({ display }) => {
        if (!cancelled) setPreview(display);
      })
      .catch(() => {
        if (!cancelled) setPreview("");
      });
    return () => {
      cancelled = true;
    };
  }, [newEntry.label, newEntry.start_date, newEntry.end_date, newEntry.note]);

  async function reload() {
    if (!activeGroup) return;
    const data = await api.listScheduleEntries(activeGroup);
    setEntries(data.entries);
    setNextStart(data.nextStart);
  }

  async function addEntry() {
    if (!activeGroup || !newEntry.start_date || !newEntry.end_date) return;
    setIsSaving(true);
    setError(null);
    try {
      await api.createScheduleEntry(activeGroup, {
        label: newEntry.label || null,
        start_date: newEntry.start_date,
        end_date: newEntry.end_date,
        note: newEntry.note || null
      });
      setNewEntry({ label: "", start_date: "", end_date: "", note: "" });
      await reload();
      noteSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add that date.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeEntry(id: string) {
    if (!window.confirm("Remove this class date from the website?")) return;
    try {
      await api.deleteScheduleEntry(id);
      await reload();
      noteSaved();
    } catch {
      setError("Could not remove that date.");
    }
  }

  const group = groups.find((g) => g.id === activeGroup);

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold text-[#101828]">Class dates</h2>
      <p className="mb-4 text-sm text-[#6a7282]">
        These dates drive the “Next Start” shown on each program.
      </p>

      {groups.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGroup(g.id)}
              className={`rounded border px-3 py-1.5 text-sm ${
                g.id === activeGroup
                  ? "border-[#561D7E] bg-[#561D7E] text-white"
                  : "border-gray-300 bg-white text-[#101828]"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {group && group.used_by.length > 0 && (
        <p className="mb-4 rounded bg-blue-50 px-3 py-2 text-sm text-blue-900">
          Used by: {group.used_by.join(", ")}. Changes here affect every one of them.
        </p>
      )}

      {nextStart && (
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#101828]">
          <CalendarDays className="h-4 w-4 text-[#561D7E]" />
          Next Start currently shows: <span className="font-semibold">{nextStart}</span>
        </p>
      )}

      {error && (
        <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {isLoading ? (
        <p className="flex items-center gap-2 text-sm text-[#6a7282]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      ) : (
        <ul className="mb-6 divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {entries.length === 0 && (
            <li className="px-3 py-4 text-sm text-[#6a7282]">No dates yet.</li>
          )}
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className="flex-1 text-sm text-[#101828]">{entry.display}</span>
              <button
                type="button"
                onClick={() => void removeEntry(entry.id)}
                aria-label={`Remove ${entry.display}`}
                className="rounded p-1.5 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded border border-gray-200 bg-[#FAFAFB] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#101828]">Add a class date</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-[#101828]">Starts</span>
            <input
              type="date"
              value={newEntry.start_date}
              onChange={(e) => setNewEntry({ ...newEntry, start_date: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1.5"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-[#101828]">Ends</span>
            <input
              type="date"
              value={newEntry.end_date}
              min={newEntry.start_date || undefined}
              onChange={(e) => setNewEntry({ ...newEntry, end_date: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1.5"
            />
          </label>

          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-[#101828]">
              Cohort label <span className="font-normal text-[#6a7282]">(optional)</span>
            </span>
            <input
              type="text"
              placeholder="Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM)"
              value={newEntry.label}
              onChange={(e) => setNewEntry({ ...newEntry, label: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1.5"
            />
          </label>

          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-[#101828]">
              Note <span className="font-normal text-[#6a7282]">(optional)</span>
            </span>
            <input
              type="text"
              placeholder="Thanksgiving break observed"
              value={newEntry.note}
              onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1.5"
            />
          </label>
        </div>

        {preview && (
          <p className="mt-3 rounded bg-white px-3 py-2 text-sm">
            <span className="text-[#6a7282]">Will appear as: </span>
            <span className="font-medium text-[#101828]">{preview}</span>
          </p>
        )}

        <button
          type="button"
          onClick={() => void addEntry()}
          disabled={isSaving || !newEntry.start_date || !newEntry.end_date}
          className="mt-3 inline-flex items-center gap-1.5 rounded bg-[#561D7E] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add date
        </button>
      </div>
    </section>
  );
}
