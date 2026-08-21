import type { Context } from "hono";

/**
 * Reads a required route parameter.
 *
 * Hono types `c.req.param()` as `string | undefined` because a name
 * that is not in the route pattern yields undefined. For a param the
 * route guarantees, that union only forces noise at every call site —
 * this narrows it once, and throws loudly if a name is ever mistyped.
 */
export function param(c: Context, name: string): string {
  const value = c.req.param(name);
  if (value === undefined) {
    throw new Error(`Route parameter "${name}" is missing from the route pattern.`);
  }
  return value;
}
