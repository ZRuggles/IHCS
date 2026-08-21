import { createClient, type Session } from "@supabase/supabase-js";

/**
 * Editor sign-in.
 *
 * Supabase Auth handles credentials, hashing, reset emails, and
 * lockout. This module is a thin wrapper that also mirrors the access
 * token into localStorage, because the content provider and the API
 * client both need it outside of React's render cycle.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

/**
 * Null when the editor is not configured — which is the normal state
 * for the public site. Every consumer checks for null, so a visitor's
 * bundle never attempts to reach Supabase.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : null;

const TOKEN_KEY = "ihcs_editor_token";

/** Same-tab notification that the stored token changed. */
export const TOKEN_CHANGE_EVENT = "ihcs-token-change";

/**
 * Mirrors the access token into localStorage.
 *
 * The custom event is what lets the current tab react. The native
 * `storage` event fires only in OTHER tabs, so on its own it would
 * never notify the tab actually doing the signing in.
 */
export function storeToken(session: Session | null): void {
  if (session?.access_token) {
    window.localStorage.setItem(TOKEN_KEY, session.access_token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
}

export function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
}

export interface EditorIdentity {
  id: string;
  email: string;
  fullName: string | null;
  role: "admin" | "editor" | "viewer";
}

export async function signIn(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!supabase) {
    return { ok: false, message: "The editor is not configured for this site." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase distinguishes these; the user-facing text deliberately
    // does not reveal whether an email exists.
    const message =
      error.message.toLowerCase().includes("invalid")
        ? "That email and password combination is not recognized."
        : error.message;
    return { ok: false, message };
  }

  storeToken(data.session);
  return { ok: true };
}

export async function signOut(): Promise<void> {
  clearToken();
  await supabase?.auth.signOut();
}

export async function sendPasswordReset(
  email: string
): Promise<{ ok: boolean; message: string }> {
  if (!supabase) return { ok: false, message: "The editor is not configured." };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset`
  });

  // The same message either way, so this cannot be used to discover
  // which email addresses have accounts.
  return {
    ok: !error,
    message: "If that email has an account, a reset link is on its way."
  };
}

/** Keeps the mirrored token in sync with Supabase's refresh cycle. */
export function watchSession(onChange: (signedIn: boolean) => void): () => void {
  if (!supabase) return () => {};

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    storeToken(session);
    onChange(Boolean(session));
  });

  return () => data.subscription.unsubscribe();
}
