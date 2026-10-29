import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// November 2, 2026 program launch: midnight America/Denver. Denver is on
// MST (UTC-7) by then; daylight saving time ends November 1.
const LAUNCH_AT = "2026-11-02T00:00:00-07:00";

/**
 * Whether this build includes the November 2 launch content (Practical
 * Nursing and Nurse Aide II pages, the LPN application choice, and a
 * launch-held welcome video). Decided at build time so a pre-launch build
 * does not contain that content at all; see docs/november-2-launch.md.
 *
 * VITE_NOV2_RELEASE: "auto" (default) releases when the build runs at or
 * after LAUNCH_AT; "on" forces it for previews; "off" holds it back.
 */
function launchReleased(setting: string | undefined): boolean {
  const value = (setting || "auto").trim().toLowerCase();
  if (value === "on") return true;
  if (value === "off") return false;
  if (value !== "auto") throw new Error("VITE_NOV2_RELEASE must be auto, on, or off.");
  return Date.now() >= Date.parse(LAUNCH_AT);
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const released = launchReleased(env.VITE_NOV2_RELEASE);
  console.log(
    `[launch] November 2 programs ${released ? "INCLUDED" : "held back"} in this build (VITE_NOV2_RELEASE=${env.VITE_NOV2_RELEASE || "auto"}).`,
  );
  const variant =
    mode === "school"
      ? "school"
      : mode === "ihs"
        ? "ihs"
        : env.VITE_SITE_VARIANT || "ihs";
  if (variant !== "ihs" && variant !== "school")
    throw new Error("VITE_SITE_VARIANT must be ihs or school.");
  const school = variant === "school";
  const name = school
    ? "Innovation Institute of Healthcare Solutions"
    : "Innovation Healthcare Solutions";
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "site-metadata",
        transformIndexHtml(html) {
          return html
            .replace("<title>Innovation</title>", `<title>${name}</title>`)
            .replace(
              "/ThumbnailLogo.png",
              school
                ? "/Glossy%20Purple%20Gold%20Graduation%20Emblem.png"
                : "/Glossy%20Golden%20I%20Lightbulb%20Emblem.png",
            )
            .replace(
              "</head>",
              `<meta name="description" content="${school ? "Healthcare education, training, and career development" : "Home care services and healthcare staffing"} in Winston-Salem, North Carolina." />\n  </head>`,
            );
        },
      },
    ],
    define: {
      "import.meta.env.VITE_SITE_VARIANT": JSON.stringify(variant),
      __NOV2_RELEASED__: JSON.stringify(released),
      __NOV2_LAUNCH_AT__: JSON.stringify(LAUNCH_AT),
    },
    build: { outDir: school ? "dist-school" : "dist" },
  };
});
