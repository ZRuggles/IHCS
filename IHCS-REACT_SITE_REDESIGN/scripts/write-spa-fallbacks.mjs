import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const apacheFallback = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteRule . /index.html [L]
</IfModule>
`;

const netlifyFallback = "/* /index.html 200\n";

await mkdir(distDir, { recursive: true });

await writeFile(path.join(distDir, ".htaccess"), apacheFallback, "utf8");
await writeFile(path.join(distDir, "_redirects"), netlifyFallback, "utf8");

const indexHtml = await readFile(path.join(distDir, "index.html"), "utf8");
await writeFile(path.join(distDir, "404.html"), indexHtml, "utf8");
