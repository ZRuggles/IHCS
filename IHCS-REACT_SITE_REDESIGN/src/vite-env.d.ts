/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Editor API base URL. Empty on the public build. */
  readonly VITE_EDITOR_API_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_AXISAI_API_KEY?: string;
  readonly VITE_AXISAI_API_URL?: string;
  readonly VITE_AXISAI_WIDGET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
