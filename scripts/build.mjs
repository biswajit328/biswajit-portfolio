import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");
const files = ["index.html", "tech-stack.html", "styles.css", "app.js", "site-data.js", "favicon.svg", "og-card.svg", "assets/biswajit-hero.jpg", "assets/nexora-campus-opportunity-radar.webp", "assets/ai-hospital-drug-supply-illustrative.jpg", "assets/neural-predictive-maintenance-illustrative.jpg", "assets/biswajit-mandal-resume-2026.pdf"];
const html = await readFile(resolve(root, "index.html"), "utf8");
const techHtml = await readFile(resolve(root, "tech-stack.html"), "utf8");
for (const file of files) {
  await readFile(resolve(root, file));
}
if (!html.includes("<main") || !html.includes("</html>")) throw new Error("Portfolio HTML is incomplete.");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(resolve(output, "assets"), { recursive: true });
for (const file of files) await cp(resolve(root, file), resolve(output, file));

const config = await readFile(resolve(root, "site-data.js"), "utf8");
const configuredUrl = process.env.SITE_URL || config.match(/siteUrl:\s*["']([^"']*)["']/)?.[1] || "";
const siteUrl = configuredUrl.replace(/\/$/, "");
let robots = "User-agent: *\nAllow: /\n";
if (siteUrl) {
  const canonical = `<link rel="canonical" href="${escapeXml(siteUrl)}" />`;
  const descriptionEnd = "    <meta name=\"theme-color\" content=\"#11110f\" />";
  let builtHtml = html.replace(descriptionEnd, `${descriptionEnd}\n    ${canonical}`);
  builtHtml = builtHtml.replace('content="/og-card.svg"', `content="${escapeXml(siteUrl)}/og-card.svg"`);
  const builtTechHtml = techHtml.replace(descriptionEnd, `${descriptionEnd}\n    <link rel="canonical" href="${escapeXml(siteUrl)}/tech-stack.html" />`)
    .replace('content="/og-card.svg"', `content="${escapeXml(siteUrl)}/og-card.svg"`);
  await writeFile(resolve(output, "tech-stack.html"), builtTechHtml);
  await writeFile(resolve(output, "index.html"), builtHtml);
  const dataWithSiteUrl = config.replace(/siteUrl:\s*["'][^"']*["']/, `siteUrl: ${JSON.stringify(siteUrl)}`);
  await writeFile(resolve(output, "site-data.js"), dataWithSiteUrl);
  await writeFile(resolve(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeXml(siteUrl)}/</loc></url><url><loc>${escapeXml(siteUrl)}/tech-stack.html</loc></url></urlset>\n`);
  robots += `Sitemap: ${siteUrl}/sitemap.xml\n`;
}
await writeFile(resolve(output, "robots.txt"), robots);
console.log(`Built static portfolio in dist/${siteUrl ? " (canonical + sitemap configured)" : " (set SITE_URL to generate canonical + sitemap)"}`);

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
}
