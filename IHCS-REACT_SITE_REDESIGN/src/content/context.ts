import { createContext, useContext } from "react";
import type { SiteContent } from "./types";

/**
 * Content context and its accessor.
 *
 * Separated from ContentProvider.tsx so that file exports only its
 * component, which Fast Refresh requires.
 */

export interface ContentState {
  content: SiteContent;
  /** True while draft content is being fetched for a signed-in editor. */
  isLoadingDrafts: boolean;
  /** True when showing unpublished drafts rather than live content. */
  isDraftMode: boolean;
  refresh: () => Promise<void>;
  applyLocalEdit: (mutate: (draft: SiteContent) => SiteContent) => void;
}

export const ContentContext = createContext<ContentState | null>(null);

export function useContent(): ContentState {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used inside a ContentProvider.");
  }
  return context;
}
