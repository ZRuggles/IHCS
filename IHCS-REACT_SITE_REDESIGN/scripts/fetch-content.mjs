/**
 * Fetches published content into public/content.json at build time.
 *
 * This is what decouples the public site from the API. The built
 * bundle contains a static snapshot, so visitors never wait on (or
 * depend on) the editor service being awake.
 *
 * A failure here is deliberately NOT fatal: the site falls back to the
 * content compiled into the bundle, so a deploy still produces a
 * working website even if the API is down at that moment.
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const apiUrl = process.env.VITE_EDITOR_API_URL ?? process.env.EDITOR_API_URL ?? "";

async function main() {
  if (!apiUrl) {
    console.log("[content] No API URL configured — using bundled fallback content.");
    return;
  }

  const endpoint = `${apiUrl.replace(/\/$/, "")}/api/public/content`;
  console.log(`[content] Fetching ${endpoint}`);

  try {
    // Render's free tier can take ~50s to wake, so allow a generous
    // window before giving up.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`API returned ${response.status}`);

    const content = await response.json();
    if (!content || !Array.isArray(content.courses)) {
      throw new Error("Response did not contain a course list");
    }

    await mkdir(publicDir, { recursive: true });
    await writeFile(
      path.join(publicDir, "content.json"),
      JSON.stringify(content),
      "utf8"
    );

    console.log(`[content] Wrote content.json — ${content.courses.length} courses.`);
  } catch (error) {
    console.warn(`[content] Could not fetch published content: ${error.message}`);
    console.warn("[content] The site will build with its bundled fallback content.");
  }
}

await main();
