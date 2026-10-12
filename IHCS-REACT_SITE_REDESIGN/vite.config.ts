import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
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
    define: { "import.meta.env.VITE_SITE_VARIANT": JSON.stringify(variant) },
    build: { outDir: school ? "dist-school" : "dist" },
  };
});
