import { createContext, useContext } from "react";
import type { EditorIdentity } from "./session";

/**
 * Editor context and its accessor.
 *
 * Separated from EditorProvider.tsx so that file exports only its
 * component, which Fast Refresh requires.
 */

export interface EditorState {
  editor: EditorIdentity | null;
  isSignedIn: boolean;
  pendingChanges: number;
  isPublishing: boolean;
  lastSavedAt: Date | null;
  refreshStatus: () => Promise<void>;
  noteSaved: () => void;
  publish: (note?: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
}

export const EditorContext = createContext<EditorState | null>(null);

export function useEditor(): EditorState {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used inside an EditorProvider.");
  }
  return context;
}
