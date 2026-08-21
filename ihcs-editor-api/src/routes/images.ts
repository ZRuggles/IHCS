import { Hono } from "hono";
import { param } from "../lib/params.js";
import sharp from "sharp";
import { sql } from "../lib/db.js";
import { env } from "../lib/env.js";
import { requireEditor, adminClient, audit } from "../lib/auth.js";
import { imageMetaSchema, formatValidationError } from "../lib/validation.js";
import { imageUrl } from "../lib/content.js";

/**
 * Image uploads.
 *
 * Security posture: the file's real type is determined by decoding
 * it, not by trusting its extension or the browser's Content-Type.
 * Everything is re-encoded through sharp, which means a file that
 * merely claims to be a PNG but contains something else fails to
 * decode and is rejected. Re-encoding also strips EXIF, which can
 * carry GPS coordinates from a phone photo.
 */

const app = new Hono();
app.use("*", requireEditor);

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB before processing
const MAX_DIMENSION = 2400;                // generous for full-width hero images

app.get("/", async (c) => {
  const rows = await sql`
    select
      i.id::text, i.storage_key, i.filename, i.alt_text, i.width, i.height,
      i.bytes, i.mime_type, i.is_legacy, i.created_at,
      coalesce(
        array_agg(c.title) filter (where c.title is not null),
        '{}'
      ) as used_by
    from images i
    left join courses c on c.image_id = i.id and c.deleted_at is null
    group by i.id
    order by i.is_legacy, i.created_at desc
  `;

  return c.json({
    images: rows.map((row) => ({
      ...row,
      url: imageUrl(row.storage_key as string, row.is_legacy as boolean)
    }))
  });
});

app.post("/", async (c) => {
  const form = await c.req.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) {
    return c.json({ error: "Choose an image file to upload." }, 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return c.json(
      { error: "That image is larger than 12 MB. Please choose a smaller file." },
      413
    );
  }

  const altText = String(form?.get("alt_text") ?? "").slice(0, 300);
  const input = Buffer.from(await file.arrayBuffer());

  // Decoding is the real type check. A file that is not actually an
  // image cannot get past this, whatever it is named.
  let processed: Buffer;
  let width: number;
  let height: number;

  try {
    const pipeline = sharp(input, { failOn: "error" });
    const meta = await pipeline.metadata();

    if (!meta.width || !meta.height) {
      return c.json({ error: "That file is not a readable image." }, 422);
    }

    const resized =
      meta.width > MAX_DIMENSION || meta.height > MAX_DIMENSION
        ? pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
        : pipeline;

    // WebP at 82 is visually indistinguishable here and roughly a
    // third the bytes of the equivalent JPEG.
    processed = await resized.webp({ quality: 82 }).toBuffer();

    const outMeta = await sharp(processed).metadata();
    width = outMeta.width ?? meta.width;
    height = outMeta.height ?? meta.height;
  } catch {
    return c.json(
      { error: "That file could not be read as an image. Try a JPG, PNG, or WebP." },
      422
    );
  }

  // Random key: filenames from users are never trusted as paths.
  const storageKey = `${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await adminClient.storage
    .from(env.storageBucket)
    .upload(storageKey, processed, { contentType: "image/webp", upsert: false });

  if (uploadError) {
    return c.json({ error: "The image could not be saved. Please try again." }, 502);
  }

  const editor = c.get("editor");
  const safeName = file.name.replace(/[^\w.\- ]/g, "").slice(0, 160) || "image";

  const rows = await sql`
    insert into images (storage_key, filename, alt_text, width, height, bytes, mime_type, uploaded_by)
    values (
      ${storageKey}, ${safeName}, ${altText}, ${width}, ${height},
      ${processed.byteLength}, 'image/webp', ${editor.id}
    )
    returning id::text, storage_key, filename, alt_text, width, height, bytes
  `;

  const image = rows[0]!;
  await audit(c, "image.upload", image.id as string, { filename: safeName, bytes: processed.byteLength });

  return c.json(
    { image: { ...image, url: imageUrl(image.storage_key as string, false) } },
    201
  );
});

app.patch("/:id", async (c) => {
  const parsed = imageMetaSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: "Please correct the highlighted fields.", fields: formatValidationError(parsed.error) }, 422);
  }

  const rows = await sql`
    update images set alt_text = ${parsed.data.alt_text}
    where id = ${param(c, "id")}::uuid
    returning id::text, alt_text
  `;
  if (rows.length === 0) return c.json({ error: "That image no longer exists." }, 404);

  await audit(c, "image.update", param(c, "id"), {});
  return c.json({ image: rows[0] });
});

/** Deletes an image, refusing while anything still references it. */
app.delete("/:id", async (c) => {
  const id = param(c, "id");

  const rows = await sql`select storage_key, is_legacy, filename from images where id = ${id}::uuid`;
  const image = rows[0];
  if (!image) return c.json({ error: "That image no longer exists." }, 404);

  const inUse = await sql`
    select title from courses where image_id = ${id}::uuid and deleted_at is null
  `;
  if (inUse.length > 0) {
    const titles = inUse.map((r) => r.title).join(", ");
    return c.json(
      { error: `This image is still used by: ${titles}. Replace it there first.` },
      409
    );
  }

  if (!image.is_legacy) {
    await adminClient.storage.from(env.storageBucket).remove([image.storage_key as string]);
  }

  await sql`delete from images where id = ${id}::uuid`;
  await audit(c, "image.delete", id, { filename: image.filename });
  return c.json({ ok: true });
});

export default app;
