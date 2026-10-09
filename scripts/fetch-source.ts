// Fallback source capture for when no Firecrawl key is available.
//
//   npx tsx scripts/fetch-source.ts <slug> [<slug> ...] [--force]
//
// Fetches public HTML pages from www.iitism.ac.in one at a time, keeps only
// the page's own content sections (no header, menus, modals or footer) and
// saves the same cache shape the Firecrawl scraper uses:
//   scrape/raw/<slug>.json  { sourceUrl, fetchedAt, via, title, markdown, links, images }
//   scrape/raw/<slug>.md
// Existing caches are reused unless --force is given. No PDFs, logins or
// people.iitism.ac.in pages are fetched; original images are never downloaded.
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

const ORIGIN = "https://www.iitism.ac.in";
const args = process.argv.slice(2);
const force = args.includes("--force");
const slugs = args.filter((a) => !a.startsWith("--"));
if (!slugs.length) {
  console.error("Usage: npx tsx scripts/fetch-source.ts <slug> [...] [--force]");
  process.exit(1);
}

function toMarkdown($: cheerio.CheerioAPI, root: AnyNode[]) {
  const lines: string[] = [];
  const links: { text: string; href: string }[] = [];
  const images: { src: string; alt: string }[] = [];
  const clean = (text: string) => text.replace(/\s+/g, " ").trim();
  const inline = (el: AnyNode): string => {
    const $el = $(el);
    if (el.type === "text") return $el.text();
    if (el.type !== "tag") return "";
    if (el.tagName === "br") return " ";
    if (el.tagName === "img") {
      images.push({ src: $el.attr("src") ?? "", alt: $el.attr("alt") ?? "" });
      return "";
    }
    const inner = $el
      .contents()
      .toArray()
      .map(inline)
      .join("");
    if (el.tagName === "a") {
      const href = $el.attr("href");
      const text = clean(inner);
      if (href && text) {
        const absolute = new URL(href, ORIGIN).toString();
        links.push({ text, href: absolute });
        return `[${text}](${absolute})`;
      }
    }
    if (el.tagName === "strong" || el.tagName === "b") {
      const text = clean(inner);
      return text ? `**${text}**` : "";
    }
    return inner;
  };
  const block = (el: AnyNode) => {
    if (el.type !== "tag") {
      if (el.type === "text" && clean($(el).text()))
        lines.push(clean($(el).text()));
      return;
    }
    const tag = el.tagName;
    const $el = $(el);
    if (/^h[1-6]$/.test(tag)) {
      const text = clean(inline(el));
      if (text) lines.push(`${"#".repeat(Number(tag[1]))} ${text}`);
    } else if (tag === "p") {
      const text = clean(inline(el));
      if (text) lines.push(text);
    } else if (tag === "li") {
      const nested = $el.children("ul, ol");
      const own = $el
        .contents()
        .toArray()
        .filter((c) => !(c.type === "tag" && ["ul", "ol"].includes(c.tagName)))
        .map(inline)
        .join("");
      if (clean(own)) lines.push(`- ${clean(own)}`);
      nested.each((_, n) => block(n));
    } else if (tag === "table") {
      $el.find("tr").each((_, tr) => {
        const cells = $(tr)
          .children("th, td")
          .toArray()
          .map((cell) => clean(inline(cell)).replace(/\|/g, "/"));
        if (cells.some(Boolean)) lines.push(`| ${cells.join(" | ")} |`);
      });
    } else if (tag === "img") {
      inline(el);
    } else if (["script", "style", "noscript", "form", "button"].includes(tag)) {
      return;
    } else {
      $el.contents().each((_, child) => block(child));
    }
  };
  root.forEach(block);
  const deduped = lines.filter((line, i) => line !== lines[i - 1]);
  return { markdown: deduped.join("\n\n"), links, images };
}

await mkdir("scrape/raw", { recursive: true });
for (const slug of slugs) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Bad slug: ${slug}`);
  const file = `scrape/raw/${slug}.json`;
  if (existsSync(file) && !force) {
    console.log(`${slug}: cached`);
    continue;
  }
  const sourceUrl = `${ORIGIN}/${slug}`;
  const response = await fetch(sourceUrl, {
    headers: { "User-Agent": "NO-Anchor-University hackathon parody (source capture)" },
  });
  if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
    console.log(`${slug}: HTTP ${response.status}, skipped`);
    continue;
  }
  const $ = cheerio.load(await response.text());
  $("script, style, noscript").remove();
  // The source wraps page content in top-level <section>s; the header,
  // menus, modals, social rail and footer are separate top-level elements.
  const sections = $("body > section").toArray();
  const { markdown, links, images } = toMarkdown($, sections);
  const record = {
    sourceUrl,
    fetchedAt: new Date().toISOString(),
    via: "direct-html (no Firecrawl key available)",
    title: $("title").text().trim(),
    markdown,
    links,
    images,
  };
  await writeFile(file, JSON.stringify(record, null, 2) + "\n");
  await writeFile(`scrape/raw/${slug}.md`, markdown + "\n");
  console.log(`${slug}: ${markdown.length} chars, ${links.length} links, ${images.length} images`);
  await new Promise((resolve) => setTimeout(resolve, 1200));
}
