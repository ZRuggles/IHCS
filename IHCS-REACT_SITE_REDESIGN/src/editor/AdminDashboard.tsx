import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  UserPlus,
  Plus,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { api, ApiError, type EditorCourse } from "./api";
import { useEditor } from "./useEditor";
import { ScheduleEditor } from "./ScheduleEditor";
import { NewProgramForm } from "./NewProgramForm";

/**
 * The editor dashboard at /admin.
 *
 * Covers the operations that do not fit inline on a page: program
 * visibility and removal, class dates, and account management.
 * Everyday text and photo edits happen on the pages themselves.
 */

type Tab = "programs" | "dates" | "people";

export function AdminDashboard() {
  const { editor, pendingChanges } = useEditor();
  const [tab, setTab] = useState<Tab>("programs");

  const isAdmin = editor?.role === "admin";

  return (
    <div className="min-h-screen bg-[#F7F5F9]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#561D7E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the website
        </Link>

        <h1 className="mb-1 text-2xl font-semibold text-[#101828]">Editor dashboard</h1>
        <p className="mb-6 text-sm text-[#6a7282]">
          Signed in as {editor?.email}
          {pendingChanges > 0 && (
            <> &middot; {pendingChanges} unpublished {pendingChanges === 1 ? "change" : "changes"}</>
          )}
        </p>

        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {([
            ["programs", "Programs"],
            ["dates", "Class dates"],
            ...(isAdmin ? ([["people", "People"]] as const) : [])
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                tab === key
                  ? "border-[#561D7E] text-[#561D7E]"
                  : "border-transparent text-[#6a7282] hover:text-[#101828]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {tab === "programs" && <ProgramsTab isAdmin={isAdmin} />}
          {tab === "dates" && <ScheduleEditor />}
          {tab === "people" && isAdmin && <PeopleTab />}
        </div>
      </div>
    </div>
  );
}

function ProgramsTab({ isAdmin }: { isAdmin: boolean }) {
  const { noteSaved } = useEditor();
  const [courses, setCourses] = useState<EditorCourse[]>([]);
  const [trash, setTrash] = useState<{ id: string; title: string; deleted_at: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isAddingProgram, setIsAddingProgram] = useState(false);

  async function load() {
    const [{ courses: list }, { courses: removed }] = await Promise.all([
      api.listCourses(),
      api.listTrash()
    ]);
    setCourses(list);
    setTrash(removed);
  }

  useEffect(() => {
    // `ignore` drops the result if this effect is torn down mid-flight,
    // so a slow response cannot write state into an unmounted tab.
    let ignore = false;

    async function loadInitial() {
      try {
        const [{ courses: list }, { courses: removed }] = await Promise.all([
          api.listCourses(),
          api.listTrash()
        ]);
        if (ignore) return;
        setCourses(list);
        setTrash(removed);
      } catch {
        if (!ignore) setMessage("Could not load the programs.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  async function toggleVisibility(course: EditorCourse) {
    const next = course.status === "published" ? "hidden" : "published";
    try {
      await api.setCourseStatus(course.id, next);
      await load();
      noteSaved();
      setMessage(
        next === "hidden"
          ? `"${course.title}" is now hidden from the website.`
          : `"${course.title}" is now visible on the website.`
      );
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "That change could not be saved.");
    }
  }

  async function remove(course: EditorCourse) {
    const confirmed = window.confirm(
      `Remove "${course.title}" from the website?\n\nIt can be restored for 30 days.`
    );
    if (!confirmed) return;

    try {
      const result = await api.deleteCourse(course.id);
      await load();
      noteSaved();
      setMessage(result.warning ?? `"${course.title}" was removed.`);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "That program could not be removed.");
    }
  }

  async function restore(id: string) {
    try {
      await api.restoreCourse(id);
      await load();
      setMessage("The program was restored.");
    } catch {
      setMessage("That program could not be restored.");
    }
  }

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-[#6a7282]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </p>
    );
  }

  return (
    <section>
      <div className="mb-1 flex items-center gap-3">
        <h2 className="flex-1 text-lg font-semibold text-[#101828]">Programs</h2>
        {!isAddingProgram && (
          <button
            type="button"
            onClick={() => setIsAddingProgram(true)}
            className="inline-flex items-center gap-1.5 rounded bg-[#561D7E] px-3 py-1.5 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add a program
          </button>
        )}
      </div>
      <p className="mb-4 text-sm text-[#6a7282]">
        To change a program's text, price, or photo, open it on the website and click the pencil
        icons.
      </p>

      {message && (
        <p className="mb-4 rounded bg-blue-50 px-3 py-2 text-sm text-blue-900">{message}</p>
      )}

      {isAddingProgram && (
        <div className="mb-4">
          <NewProgramForm
            onCancel={() => setIsAddingProgram(false)}
            onCreated={() => {
              setIsAddingProgram(false);
              setMessage(
                "Program created as a draft. Open it to add the details, then publish when ready."
              );
              void load();
            }}
          />
        </div>
      )}

      <ul className="divide-y divide-gray-200 rounded border border-gray-200">
        {courses.map((course) => (
          <li key={course.id} className="flex flex-wrap items-center gap-3 px-3 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-[#101828]">{course.title}</span>
              <span className="text-xs text-[#6a7282]">
                {course.cost}
                {course.status === "hidden" && " · Hidden from the website"}
                {course.status === "draft" && " · Not published yet"}
                {course.has_unpublished_changes && " · Has unpublished edits"}
              </span>
            </span>

            <Link
              to={`/courses/${course.slug}`}
              className="rounded p-1.5 text-[#561D7E] hover:bg-purple-50"
              title="Open this program on the website"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => void toggleVisibility(course)}
              className="rounded p-1.5 text-[#6a7282] hover:bg-gray-100"
              title={course.status === "published" ? "Hide from the website" : "Show on the website"}
            >
              {course.status === "published" ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => void remove(course)}
                className="rounded p-1.5 text-red-600 hover:bg-red-50"
                title="Remove this program"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {trash.length > 0 && (
        <>
          <h3 className="mt-6 mb-2 text-sm font-semibold text-[#101828]">
            Recently removed
          </h3>
          <ul className="divide-y divide-gray-200 rounded border border-gray-200">
            {trash.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex-1 text-sm text-[#6a7282]">{item.title}</span>
                <button
                  type="button"
                  onClick={() => void restore(item.id)}
                  className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function PeopleTab() {
  const [users, setUsers] = useState<
    { id: string; email: string; role: string; is_active: boolean; last_seen_at: string | null }[]
  >([]);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("editor");
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function load() {
    const { users: list } = await api.listUsers();
    setUsers(list);
  }

  useEffect(() => {
    load().catch(() => setMessage("Could not load the account list."));
  }, []);

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    setIsBusy(true);
    setMessage(null);
    try {
      await api.inviteUser(email.trim(), fullName.trim(), role);
      setEmail("");
      setFullName("");
      await load();
      setMessage("Invitation sent. They will receive an email to set their own password.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "The invitation could not be sent.");
    } finally {
      setIsBusy(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      await api.updateUser(id, { is_active: !isActive });
      await load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "That change could not be saved.");
    }
  }

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold text-[#101828]">People with access</h2>
      <p className="mb-4 text-sm text-[#6a7282]">
        Editors can change content. Administrators can also remove programs and manage accounts.
      </p>

      {message && (
        <p className="mb-4 rounded bg-blue-50 px-3 py-2 text-sm text-blue-900">{message}</p>
      )}

      <ul className="mb-6 divide-y divide-gray-200 rounded border border-gray-200">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center gap-3 px-3 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-[#101828]">
                {user.email}
              </span>
              <span className="text-xs text-[#6a7282]">
                {user.role === "admin" ? "Administrator" : user.role === "editor" ? "Editor" : "View only"}
                {!user.is_active && " · Disabled"}
              </span>
            </span>
            <button
              type="button"
              onClick={() => void toggleActive(user.id, user.is_active)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {user.is_active ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={invite} className="rounded border border-gray-200 bg-[#FAFAFB] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#101828]">Invite someone</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-[#101828]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1.5"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-[#101828]">Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1.5"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-[#101828]">Access level</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1.5"
            >
              <option value="editor">Editor</option>
              <option value="admin">Administrator</option>
              <option value="viewer">View only</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="mt-3 inline-flex items-center gap-1.5 rounded bg-[#561D7E] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Send invitation
        </button>
      </form>
    </section>
  );
}
