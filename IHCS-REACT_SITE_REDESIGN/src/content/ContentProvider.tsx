import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SiteContent } from "./types";
import { ContentContext, type ContentState } from "./context";
import { fallbackContent } from "./fallback";

/**
 * Site content.
 *
 * Resolution order, and why:
 *
 *   1. /content.json — a static file written into the bundle at build
 *      time. This is what every visitor gets. No API call, so a
 *      sleeping backend cannot slow or break the public site.
 *   2. The bundled fallback, compiled from the original data files.
 *      Used if content.json is missing or malformed, which keeps the
 *      site rendering even on a broken deploy.
 *   3. Draft content from the API, fetched ONLY when an editor is
 *      signed in, so they can preview unpublished changes.
 *
 * Because (1) and (2) are both synchronous-ish and always available,
 * the site never renders an empty state waiting on the network.
 */

/** Loaded once at module scope: a plain fetch, not React state. */
let staticContentPromise: Promise<SiteContent> | null = null;

function loadStaticContent(): Promise<SiteContent> {
  staticContentPromise ??= fetch("/content.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`content.json returned ${response.status}`);
      return response.json() as Promise<SiteContent>;
    })
    .then((data) => {
      // A malformed file must not blank the site.
      if (!data || !Array.isArray(data.courses)) throw new Error("content.json is malformed");
      return data;
    })
    .catch(() => fallbackContent);

  return staticContentPromise;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  // Start from the bundled fallback so the very first paint has real
  // content. Nothing ever renders against an empty payload.
  const [content, setContent] = useState<SiteContent>(fallbackContent);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(false);

  // Guards against a resolved fetch writing state after unmount.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    loadStaticContent().then((data) => {
      if (mountedRef.current) setContent(data);
    });
  }, []);

  /**
   * Pulls draft content for a signed-in editor.
   *
   * Deliberately NOT called on mount — a visitor never triggers it, so
   * the public site makes zero API calls. The editor toolbar calls it
   * after a successful sign-in.
   */
  const refresh = useCallback(async () => {
    const token = window.localStorage.getItem("ihcs_editor_token");
    if (!token) {
      // Signed out: fall back to the published static content.
      const published = await loadStaticContent();
      if (mountedRef.current) {
        setContent(published);
        setIsDraftMode(false);
      }
      return;
    }

    setIsLoadingDrafts(true);
    try {
      const base = import.meta.env.VITE_EDITOR_API_URL ?? "";
      const response = await fetch(`${base}/api/content/draft`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`draft fetch returned ${response.status}`);

      const data = (await response.json()) as { content: SiteContent };
      if (mountedRef.current && data.content) {
        setContent(data.content);
        setIsDraftMode(true);
      }
    } catch {
      // Draft fetch failing is not fatal — keep showing published
      // content rather than breaking the page the editor is on.
      if (mountedRef.current) setIsDraftMode(false);
    } finally {
      if (mountedRef.current) setIsLoadingDrafts(false);
    }
  }, []);

  /**
   * Applies an edit locally for instant feedback.
   *
   * The save request still goes to the API; this only avoids a full
   * refetch between typing and seeing the change.
   */
  const applyLocalEdit = useCallback((mutate: (draft: SiteContent) => SiteContent) => {
    setContent((current) => mutate(current));
  }, []);

  const value = useMemo<ContentState>(
    () => ({ content, isLoadingDrafts, isDraftMode, refresh, applyLocalEdit }),
    [content, isLoadingDrafts, isDraftMode, refresh, applyLocalEdit]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
