import { z } from "zod";
import { load } from "cheerio";

const documentSchema = z
  .object({
    markdown: z.string(),
    html: z.string(),
    links: z.array(z.string()),
    screenshot: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export function normalizeDocument(raw: unknown) {
  const wrapper = z.record(z.string(), z.unknown()).parse(raw);
  if (wrapper.isError === true || wrapper.success === false)
    throw new Error("Cached Firecrawl response failed.");
  if (wrapper.structuredContent)
    return documentSchema.parse(wrapper.structuredContent);
  if (Array.isArray(wrapper.content)) {
    for (const block of wrapper.content) {
      if (
        block &&
        typeof block === "object" &&
        "type" in block &&
        block.type === "text" &&
        "text" in block &&
        typeof block.text === "string"
      ) {
        return documentSchema.parse(JSON.parse(block.text));
      }
    }
  }
  return documentSchema.parse(wrapper.data ?? wrapper);
}

export function validateSourceUrl(value: string) {
  const url = new URL(value);
  const pathname = decodeURIComponent(url.pathname);
  if (
    url.origin !== "https://www.iitism.ac.in" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    /(^|\/)(?:storage|people|login|logout|signin|auth|[^/]*portal)(\/|$)/i.test(
      pathname,
    ) ||
    /\.[a-z0-9]{2,5}$/i.test(pathname) ||
    pathname.includes("..")
  ) {
    throw new Error(
      "Scraping is restricted to public HTML pages on https://www.iitism.ac.in (no documents, logins, portals or subsites).",
    );
  }
  return url.href;
}

function dimension(value: string | undefined): number | null {
  return value && /^\d+$/.test(value) && Number(value) > 0
    ? Number(value)
    : null;
}

export function extractImages(html: string, sourceUrl: string) {
  const $ = load(html);
  const records: Array<Record<string, unknown>> = [];
  $("img, [style]").each((_, element) => {
    const node = $(element);
    const sources =
      element.tagName === "img"
        ? [node.attr("src") ?? node.attr("data-src")].filter(
            (src): src is string => Boolean(src),
          )
        : [
            ...(node.attr("style") ?? "").matchAll(
              /url\(\s*['"]?([^'")]+)['"]?\s*\)/g,
            ),
          ].map((match) => match[1]);
    for (const source of sources) {
      let src: string;
      try {
        src = new URL(source, sourceUrl).href;
      } catch {
        continue;
      }
      if (!/^https?:/.test(src)) continue;
      const parents = node.parents().toArray().reverse().slice(-6);
      const context = parents.map((parent) => ({
        tag: parent.tagName,
        id: $(parent).attr("id") ?? null,
        class: $(parent).attr("class") ?? null,
      }));
      const section = node.closest("section, header, footer");
      records.push({
        occurrence: records.length + 1,
        src,
        alt: node.attr("alt") ?? "",
        width: dimension(node.attr("width")),
        height: dimension(node.attr("height")),
        section:
          section.attr("id") ??
          section.attr("class") ??
          section.prop("tagName")?.toLowerCase() ??
          null,
        rendering: element.tagName === "img" ? "img" : "css-background",
        context,
        attributes: element.attribs,
      });
    }
  });
  return {
    sourceUrl,
    notes: [
      "Original images are references only; no original assets are downloaded.",
      "Null dimensions mean absent in HTML and must be measured before image generation.",
      "Commented-out markup is excluded.",
    ],
    images: records,
  };
}
