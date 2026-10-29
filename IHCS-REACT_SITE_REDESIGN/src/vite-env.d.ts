/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_VARIANT?: "ihs" | "school";
  readonly VITE_SCHOOL_SITE_URL?: string;
  readonly VITE_IHS_SITE_URL?: string;
  /** Editor API base URL. Empty on the public build. */
  readonly VITE_EDITOR_API_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_AXISAI_API_KEY?: string;
  readonly VITE_AXISAI_API_URL?: string;
  readonly VITE_AXISAI_WIDGET_URL?: string;
  /** November 2 launch: "auto" (default), "on", or "off". See vite.config.ts. */
  readonly VITE_NOV2_RELEASE?: string;
}

/** Build-time constants from vite.config.ts. Use src/data/launch.ts instead. */
declare const __NOV2_RELEASED__: boolean;
declare const __NOV2_LAUNCH_AT__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
