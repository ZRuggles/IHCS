import { sql } from "./db.js";
import { json } from "./json.js";

/**
 * Revision history — the undo safety net.
 *
 * Every write snapshots the PRIOR state before overwriting it, so
 * any change can be rolled back. This matters more than it sounds
 * when the person editing is changing a published tuition price.
 */

export type EntityType = "course" | "content_block" | "setting" | "schedule";

export async function recordRevision(
  entityType: EntityType,
  entityId: string,
  snapshot: unknown,
  changedBy: string | null
): Promise<void> {
  await sql`
    insert into revisions (entity_type, entity_id, snapshot, changed_by)
    values (
      ${entityType},
      ${entityId},
      ${json(snapshot ?? null)},
      ${changedBy}
    )
  `;
}

export interface RevisionRow {
  id: string;
  snapshot: unknown;
  changed_at: string;
  changed_by: string | null;
  editor_email: string | null;
}

export async function listRevisions(
  entityType: EntityType,
  entityId: string,
  limit = 25
): Promise<RevisionRow[]> {
  return sql<RevisionRow[]>`
    select
      r.id::text,
      r.snapshot,
      r.changed_at,
      r.changed_by,
      p.email as editor_email
    from revisions r
    left join editor_profiles p on p.id = r.changed_by
    where r.entity_type = ${entityType}
      and r.entity_id = ${entityId}
    order by r.changed_at desc
    limit ${limit}
  `;
}

export async function getRevision(
  revisionId: string
): Promise<{ entity_type: string; entity_id: string; snapshot: unknown } | null> {
  const rows = await sql<{ entity_type: string; entity_id: string; snapshot: unknown }[]>`
    select entity_type, entity_id, snapshot
    from revisions
    where id = ${revisionId}::bigint
  `;
  return rows[0] ?? null;
}

/**
 * Trims history to the most recent `keep` entries per entity.
 * Called opportunistically after writes; unbounded history would
 * grow the database without bound for no practical benefit.
 */
export async function pruneRevisions(
  entityType: EntityType,
  entityId: string,
  keep = 50
): Promise<void> {
  await sql`
    delete from revisions
    where entity_type = ${entityType}
      and entity_id = ${entityId}
      and id not in (
        select id from revisions
        where entity_type = ${entityType}
          and entity_id = ${entityId}
        order by changed_at desc
        limit ${keep}
      )
  `;
}
