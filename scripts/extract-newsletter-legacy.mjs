/**
 * One-off: reads static newsletter.html / newsletter-archives.html and writes
 * data/minds-eye-legacy.json for merging with the LinkedIn RSS feed.
 * Run: node scripts/extract-newsletter-legacy.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function decodeAttrEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseNewsletterMain(html) {
  const parts = html.split('<div class="newsletter-item reveal"');
  const items = [];
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const n = p.match(/^ data-newsletter="(\d+)"/);
    if (!n) continue;
    const h3 = p.match(/<h3>([^<]*)<\/h3>/);
    const dt = p.match(/<span class="newsletter-date">([^<]*)<\/span>/);
    const ft = p.match(/data-fulltext="([^"]*)"/);
    let body = "";
    if (ft) body = decodeAttrEntities(ft[1]);
    items.push({
      sortKey: Number(n[1]),
      title: h3 ? h3[1].trim() : "",
      date: dt ? dt[1].trim() : "",
      link: "",
      html: body,
    });
  }
  items.sort((a, b) => a.sortKey - b.sortKey);
  return items.map(({ sortKey: _s, ...rest }) => rest);
}

function parseArchives(html) {
  const parts = html.split('<div class="archive-newsletter-item reveal"');
  const items = [];
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const h3 = p.match(/<h3>\s*([\s\S]*?)<\/h3>/);
    const dt = p.match(
      /<span class="archive-newsletter-date">([^<]*)<\/span>/,
    );
    const title = h3
      ? h3[1]
          .replace(/\s+/g, " ")
          .replace(/<!--[\s\S]*?-->/g, "")
          .trim()
      : "";
    items.push({
      title,
      date: dt ? dt[1].trim() : "",
      link: "",
      html: "",
    });
  }
  return items;
}

const main = parseNewsletterMain(
  fs.readFileSync(path.join(root, "newsletter.html"), "utf8"),
);
const archives = parseArchives(
  fs.readFileSync(path.join(root, "newsletter-archives.html"), "utf8"),
);

const seen = new Set();
const merged = [];
function key(item) {
  return `${item.title}|||${item.date}`;
}
for (const item of main) {
  const k = key(item);
  if (seen.has(k)) continue;
  seen.add(k);
  merged.push(item);
}
for (const item of archives) {
  const k = key(item);
  if (seen.has(k)) continue;
  seen.add(k);
  merged.push(item);
}

const outDir = path.join(root, "data");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "minds-eye-legacy.json");
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      description:
        "Legacy Mind's Eye editions (merged with live LinkedIn RSS on the site). Re-run scripts/extract-newsletter-legacy.mjs if you edit static HTML.",
      items: merged,
    },
    null,
    2,
  ),
  "utf8",
);
console.log("Wrote", outPath, "items:", merged.length);
