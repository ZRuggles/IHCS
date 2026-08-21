import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, LogOut, Settings, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEditor } from "./useEditor";
import { useContent } from "../content/context";

/**
 * The signed-in editor's toolbar.
 *
 * Fixed to the top of every page while signed in. It states plainly
 * that drafts are being shown and how many changes are waiting, so
 * "what I see" and "what visitors see" are never confused.
 */
export function EditorToolbar() {
  const { editor, isSignedIn, pendingChanges, isPublishing, publish, signOut, refreshStatus } =
    useEditor();
  const { isDraftMode } = useContent();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    void refreshStatus();
  }, [isSignedIn, refreshStatus]);

  // Auto-dismiss the confirmation so it does not linger over content.
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 8000);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!isSignedIn || !editor) return null;

  async function handlePublish() {
    const result = await publish();
    setMessage({ ok: result.ok, text: result.message });
  }

  return (
    <>
      {/* Pushes the site down so the fixed bar never covers the header. */}
      <div className="h-12" aria-hidden="true" />

      <div className="fixed inset-x-0 top-0 z-[60] bg-[#2C1338] text-white shadow-lg">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-4">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            Editing mode
          </span>

          {isDraftMode && (
            <span className="hidden rounded bg-white/15 px-2 py-0.5 text-xs sm:inline">
              You are seeing drafts — visitors still see the published site
            </span>
          )}

          <span className="ml-auto flex items-center gap-2">
            {pendingChanges > 0 ? (
              <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950">
                {pendingChanges} unpublished {pendingChanges === 1 ? "change" : "changes"}
              </span>
            ) : (
              <span className="hidden text-xs text-white/70 sm:inline">Everything is published</span>
            )}

            <button
              type="button"
              onClick={() => void handlePublish()}
              disabled={isPublishing || pendingChanges === 0}
              className="inline-flex items-center gap-1.5 rounded bg-white px-3 py-1.5 text-sm font-semibold text-[#2C1338] transition-opacity disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Publish
            </button>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-sm hover:bg-white/10"
              title="Editor dashboard"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-sm hover:bg-white/10"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </span>
        </div>

        {message && (
          <div
            className={`px-4 py-2 text-sm ${
              message.ok ? "bg-green-700" : "bg-red-700"
            }`}
            role="status"
          >
            <span className="mx-auto flex max-w-7xl items-center gap-2">
              {message.ok ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {message.text}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
