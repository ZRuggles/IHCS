import { getToken } from "./session";

/**
 * Editor API client.
 *
 * Every call carries the bearer token and surfaces the server's
 * human-readable message. Field-level validation errors come back as
 * `fields`, which the inline editors show next to the input.
 */

const BASE = import.meta.env.VITE_EDITOR_API_URL ?? "";

export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; formData?: FormData } = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) headers.Authorization = `Bearer ${token}`;
  // Content-Type is omitted for FormData so the browser sets the
  // multipart boundary itself.
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method: options.method ?? (options.body || options.formData ? "POST" : "GET"),
      headers,
      body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined)
    });
  } catch {
    throw new ApiError(
      "Could not reach the editor service. Check your connection and try again.",
      0
    );
  }

  if (response.status === 204) return undefined as T;

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    fields?: Record<string, string>;
  } & T;

  if (!response.ok) {
    throw new ApiError(
      payload.error ?? "Something went wrong. Please try again.",
      response.status,
      payload.fields ?? {}
    );
  }

  return payload;
}

export interface EditorCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  next_start: string;
  badge: string | null;
  icon: string;
  cost: string;
  image_id: string | null;
  overview: string;
  curriculum: string[];
  requirements: string[];
  tuition_includes: string[];
  additional_notes: string[];
  certification: string;
  schedule_summary: string;
  full_payment_url: string | null;
  payment_plans: { label: string; url: string }[];
  status: "draft" | "published" | "hidden";
  sort_order: number;
  schedule_group_id: string | null;
  has_unpublished_changes: boolean;
}

export interface ScheduleEntry {
  id: string;
  label: string | null;
  start_date: string;
  end_date: string;
  note: string | null;
  sort_order: number;
  display: string;
}

export interface EditorImage {
  id: string;
  url: string;
  filename: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  is_legacy: boolean;
  used_by: string[];
}

export const api = {
  me: () => request<{ editor: { id: string; email: string; role: string } }>("/api/users/me"),

  // ---- Courses ----
  listCourses: () => request<{ courses: EditorCourse[] }>("/api/courses"),
  getCourse: (id: string) => request<{ course: EditorCourse }>(`/api/courses/${id}`),
  createCourse: (body: Partial<EditorCourse>) =>
    request<{ course: EditorCourse }>("/api/courses", { method: "POST", body }),
  updateCourse: (id: string, body: Partial<EditorCourse>) =>
    request<{ course: EditorCourse }>(`/api/courses/${id}`, { method: "PATCH", body }),
  setCourseStatus: (id: string, status: string) =>
    request<{ course: EditorCourse }>(`/api/courses/${id}/status`, {
      method: "POST",
      body: { status }
    }),
  reorderCourses: (order: string[]) =>
    request<{ ok: true }>("/api/courses/reorder", { method: "POST", body: { order } }),
  deleteCourse: (id: string) =>
    request<{ ok: true; warning: string | null }>(`/api/courses/${id}`, { method: "DELETE" }),
  restoreCourse: (id: string) =>
    request<{ course: EditorCourse }>(`/api/courses/${id}/restore`, { method: "POST" }),
  listTrash: () =>
    request<{ courses: { id: string; slug: string; title: string; deleted_at: string }[] }>(
      "/api/courses/trash"
    ),
  courseRevisions: (id: string) =>
    request<{ revisions: { id: string; changed_at: string; editor_email: string | null }[] }>(
      `/api/courses/${id}/revisions`
    ),
  revertCourse: (id: string, revisionId: string) =>
    request<{ ok: true }>(`/api/courses/${id}/revert/${revisionId}`, { method: "POST" }),

  // ---- Schedules ----
  listScheduleGroups: () =>
    request<{
      groups: { id: string; key: string; name: string; entry_count: number; used_by: string[] }[];
    }>("/api/schedules/groups"),
  listScheduleEntries: (groupId: string) =>
    request<{ entries: ScheduleEntry[]; nextStart: string }>(
      `/api/schedules/groups/${groupId}/entries`
    ),
  createScheduleEntry: (groupId: string, body: Partial<ScheduleEntry>) =>
    request<{ entry: ScheduleEntry }>(`/api/schedules/groups/${groupId}/entries`, {
      method: "POST",
      body
    }),
  updateScheduleEntry: (id: string, body: Partial<ScheduleEntry>) =>
    request<{ entry: ScheduleEntry }>(`/api/schedules/entries/${id}`, { method: "PATCH", body }),
  deleteScheduleEntry: (id: string) =>
    request<{ ok: true }>(`/api/schedules/entries/${id}`, { method: "DELETE" }),
  previewSchedule: (body: Partial<ScheduleEntry>) =>
    request<{ display: string }>("/api/schedules/preview", { method: "POST", body }),

  // ---- Page content ----
  saveBlock: (page: string, key: string, value: unknown, kind = "text", label = "") =>
    request<{ block: unknown }>(`/api/content/blocks/${page}/${key}`, {
      method: "PUT",
      body: { value, kind, label }
    }),
  revertBlock: (page: string, key: string) =>
    request<{ block: unknown }>(`/api/content/blocks/${page}/${key}/revert`, { method: "POST" }),
  saveSetting: (key: string, value: unknown, label = "") =>
    request<{ setting: unknown }>(`/api/content/settings/${key}`, {
      method: "PUT",
      body: { value, label }
    }),
  listSettings: () =>
    request<{
      settings: { key: string; label: string; draft_value: unknown; has_unpublished_changes: boolean }[];
    }>("/api/content/settings"),

  // ---- Images ----
  listImages: () => request<{ images: EditorImage[] }>("/api/images"),
  uploadImage: (file: File, altText: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("alt_text", altText);
    return request<{ image: EditorImage }>("/api/images", { method: "POST", formData: form });
  },
  updateImage: (id: string, altText: string) =>
    request<{ image: EditorImage }>(`/api/images/${id}`, {
      method: "PATCH",
      body: { alt_text: altText }
    }),
  deleteImage: (id: string) => request<{ ok: true }>(`/api/images/${id}`, { method: "DELETE" }),

  // ---- Publishing ----
  publishStatus: () =>
    request<{ pendingChanges: number; lastPublishedAt: string | null; lastPublishedBy: string | null }>(
      "/api/publish/status"
    ),
  publish: (note?: string) =>
    request<{ ok: true; courses: number; deployTriggered: boolean; warning: string | null }>(
      "/api/publish",
      { method: "POST", body: { note } }
    ),
  discardDrafts: () => request<{ ok: true; note: string }>("/api/publish/discard", { method: "POST" }),

  // ---- Users ----
  listUsers: () =>
    request<{
      users: {
        id: string;
        email: string;
        full_name: string | null;
        role: string;
        is_active: boolean;
        last_seen_at: string | null;
      }[];
    }>("/api/users"),
  inviteUser: (email: string, fullName: string, role: string) =>
    request<{ user: unknown }>("/api/users/invite", {
      method: "POST",
      body: { email, full_name: fullName, role }
    }),
  updateUser: (id: string, body: { role?: string; is_active?: boolean }) =>
    request<{ user: unknown }>(`/api/users/${id}`, { method: "PATCH", body }),
  deleteUser: (id: string) => request<{ ok: true }>(`/api/users/${id}`, { method: "DELETE" })
};
