import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface SitemapEntry {
  /** Absolute URL of the page or section */
  loc: string;
  /** Last modification date (YYYY-MM-DD) */
  lastmod: string;
  /** Priority: "1.0" for main, "0.8" for sections */
  priority: string;
}

/**
 * Generates a valid sitemap.xml string per the Sitemaps 0.9 protocol.
 *
 * @param baseUrl - The base URL of the site (e.g. "https://www.jmsjetski.com.br")
 * @param sections - Array of section anchors (e.g. ['sobre', 'servicos', 'localizacao', 'agendar'])
 * @returns XML string for the sitemap
 */
export function generateSitemap(baseUrl: string, sections: string[]): string {
  const lastmod = new Date().toISOString().split("T")[0];

  const entries: SitemapEntry[] = [
    { loc: `${baseUrl}/`, lastmod, priority: "1.0" },
    ...sections.map((section) => ({
      loc: `${baseUrl}/#${section}`,
      lastmod,
      priority: "0.8",
    })),
  ];

  const urls = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <priority>${entry.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// Only run when executed directly (not imported)
const __filename = fileURLToPath(import.meta.url);
const isDirectRun =
  process.argv[1] &&
  (resolve(process.argv[1]) === resolve(__filename) ||
    resolve(process.argv[1]) === resolve(__filename.replace(/\.[^.]+$/, ".ts")));

if (isDirectRun) {
  const baseUrl = "https://www.jmsjetski.com.br";
  const sections = ["sobre", "jetskis", "locais", "galeria", "instagram", "depoimentos", "faq", "localizacao"];

  const xml = generateSitemap(baseUrl, sections);

  const publicDir = resolve(dirname(__filename), "..", "public");
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = resolve(publicDir, "sitemap.xml");
  writeFileSync(outputPath, xml, "utf-8");
  console.log(`✅ sitemap.xml generated at ${outputPath}`);
}
