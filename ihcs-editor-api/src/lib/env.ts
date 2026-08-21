/**
 * Environment configuration.
 *
 * Fails fast and loudly at boot if anything required is missing —
 * a service that starts with a missing key only fails later, at
 * request time, where it is far harder to diagnose.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `See .env.example for the full list.`
    );
  }
  return value.trim();
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : fallback;
}

export const env = {
  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseAnonKey: required("SUPABASE_ANON_KEY"),
  databaseUrl: required("DATABASE_URL"),

  storageBucket: optional("SUPABASE_STORAGE_BUCKET", "site-images"),

  port: Number(optional("PORT", "8787")),
  isProduction: optional("NODE_ENV", "development") === "production",

  allowedOrigins: optional("ALLOWED_ORIGINS", "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  renderDeployHookUrl: process.env.RENDER_DEPLOY_HOOK_URL?.trim() || null
};
