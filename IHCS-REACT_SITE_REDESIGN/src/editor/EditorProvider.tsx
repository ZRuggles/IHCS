import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import { getToken, watchSession, signOut as doSignOut, type EditorIdentity } from "./session";
import { EditorContext, type EditorState } from "./useEditor";
import { useContent } from "../content/context";

/**
 * Editor session state.
 *
 * Signed out — which is every visitor — this provider does nothing:
 * no API calls, no extra rendering, no visible UI. The editing layer
 * only wakes up once a valid session exists.
 */

export function EditorProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<EditorIdentity | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const { refresh: refreshContent } = useContent();

  const refreshStatus = useCallback(async () => {
    if (!getToken()) return;
    try {
      const status = await api.publishStatus();
      setPendingChanges(status.pendingChanges);
    } catch {
      // A failed status poll is cosmetic; leave the last known count.
    }
  }, []);

  /** Loads the signed-in editor's identity, or clears it if invalid. */
  const loadIdentity = useCallback(async () => {
    if (!getToken()) {
      setEditor(null);
      return;
    }
    try {
      const { editor: me } = await api.me();
      setAuthError(null);
      setEditor(me as EditorIdentity);
      if (me.role === "viewer") {
        await refreshContent(true);
        return;
      }
      await refreshContent();
      await refreshStatus();
    } catch (error) {
      // Supabase accepted the password but the API rejected the account
      // (no profile, inactive, expired) or could not be reached. Drop the
      // token so /admin returns to the form and says why, instead of
      // waiting forever on a token that will never be confirmed.
      setEditor(null);
      setAuthError(
        error instanceof Error ? error.message : "Sign-in could not be completed."
      );
      await doSignOut();
    }
  }, [refreshContent, refreshStatus]);

  useEffect(() => {
    void loadIdentity();
    return watchSession((signedIn) => {
      if (signedIn) void loadIdentity();
      else {
        setEditor(null);
        void refreshContent(true);
      }
    });
    // loadIdentity is stable via useCallback; listing it would re-subscribe
    // on every content refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const noteSaved = useCallback(() => {
    setLastSavedAt(new Date());
    setPendingChanges((count) => count + 1);
  }, []);

  const publish = useCallback(
    async (note?: string) => {
      setIsPublishing(true);
      try {
        const result = await api.publish(note);
        setPendingChanges(0);
        await refreshContent();
        return {
          ok: true,
          message:
            result.warning ??
            `Published. Your website is rebuilding and will show the changes in a minute or two.`
        };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "Publishing failed. Please try again."
        };
      } finally {
        setIsPublishing(false);
      }
    },
    [refreshContent]
  );

  const signOut = useCallback(async () => {
    await doSignOut();
    setEditor(null);
    await refreshContent();
  }, [refreshContent]);

  const value = useMemo<EditorState>(
    () => ({
      editor,
      isSignedIn: editor !== null && editor.role !== "viewer",
      authError,
      pendingChanges,
      isPublishing,
      lastSavedAt,
      refreshStatus,
      noteSaved,
      publish,
      signOut
    }),
    [editor, authError, pendingChanges, isPublishing, lastSavedAt, refreshStatus, noteSaved, publish, signOut]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
