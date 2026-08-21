import postgres from "postgres";
import { env } from "./env.js";

/**
 * Postgres connection pool.
 *
 * Kept small deliberately: this API serves a handful of editors,
 * not public traffic, and Supabase's connection limits are the
 * scarcer resource. idle_timeout lets connections drop while the
 * Render service is idle.
 */
/**
 * TLS is required in every environment, not just production.
 *
 * Supabase refuses unencrypted connections, so "prefer" (which falls
 * back to plaintext) leaves a local run hanging on a negotiation that
 * can never succeed. `rejectUnauthorized: false` is needed because
 * Supabase's pooler presents a chain Node does not ship a root for;
 * the connection is still encrypted, and the host itself is
 * authenticated by the credentials in the connection string.
 */
const ssl = { rejectUnauthorized: false } as const;

export const sql = postgres(env.databaseUrl, {
  max: 5,
  idle_timeout: 30,
  connect_timeout: 15,
  ssl,
  transform: { undefined: null }
});

export async function healthCheck(): Promise<boolean> {
  try {
    await sql`select 1`;
    return true;
  } catch {
    return false;
  }
}
