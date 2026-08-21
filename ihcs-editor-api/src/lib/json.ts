import { sql } from "./db.js";

/**
 * Binds a value to a jsonb column.
 *
 * The `postgres` driver already serializes JS values for json/jsonb
 * parameters. Serializing first therefore encodes twice: an array
 * arrives as the JSON *string* "[]" rather than an array, and
 * `jsonb_typeof` reports 'string' instead of 'array'.
 *
 * That failure is silent and destructive — reads come back as strings
 * and anything iterating them (course payment plans, page content
 * lists) quietly renders nothing. Always route jsonb values through
 * here rather than pre-stringifying them.
 */
export function json(value: unknown) {
  // The driver's JSONValue type cannot express "arbitrary JSON-shaped
  // data", which is exactly what callers pass. Values reaching here are
  // already validated by the Zod schemas in validation.ts.
  return sql.json(value === undefined ? null : (value as never));
}
