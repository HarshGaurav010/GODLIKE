import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  loadPages,
  loadImages,
  loadGlossary,
  loadUi,
  loadHeader,
  loadFooter,
} from "../src/content/loaders";
import { richTextSchema, ctaSchema } from "../src/content/schemas";
import { resolveLink } from "../src/content/links";
import type { Json } from "../src/content/types";

const pages = loadPages();
const images = loadImages();
const glossary = loadGlossary();
const ui = loadUi();
const imageIndex = new Map(images.map((image) => [image.id, image]));
const routes = pages.map((page) =>
  page.slug === "home" ? "/" : `/${page.slug}`,
);
const style = readFileSync("content/image-style.txt", "utf8").trim();
if (!style) throw new Error("Shared image style is empty.");

function checkImages(value: Json, location: string) {
  if (Array.isArray(value))
    return value.forEach((entry, i) => checkImages(entry, `${location}[${i}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    if (key === "imageId" && typeof entry === "string") {
      const image = imageIndex.get(entry);
      if (
        !image ||
        image.status === "todo" ||
        !existsSync(path.join("public", image.file))
      ) {
        throw new Error(
          `${location}: image ${entry} is missing or unfinished.`,
        );
      }
    }
    if (
      ["image", "imageUrl", "src"].includes(key) &&
      typeof entry === "string" &&
      /^https?:/i.test(entry)
    ) {
      throw new Error(
        `${location}: page images must use manifest IDs, not original URLs.`,
      );
    }
    checkImages(entry, `${location}.${key}`);
  }
}

for (const image of images) {
  if (!image.prompt.startsWith(style))
    throw new Error(
      `Image ${image.id} must begin with the shared image style.`,
    );
  if (image.status !== "todo" && !existsSync(path.join("public", image.file))) {
    throw new Error(`Missing image file for ${image.id}.`);
  }
}
for (const page of pages) {
  for (const section of page.sections) {
    for (const mode of ["original", "pirate"] as const) {
      const content = section[mode];
      checkImages(content, `${page.slug}.${section.id}.${mode}`);
      if (section.kind === "richText") richTextSchema.parse(content);
      if (section.kind === "cta") {
        const cta = ctaSchema.parse(content);
        if (resolveLink(cta.href, routes, page.slug) !== cta.href) {
          throw new Error(
            `Unsafe or unbuilt CTA destination: ${page.slug}.${section.id}`,
          );
        }
        if (
          cta.href.startsWith("#") &&
          ![
            "#main-content",
            "#status",
            ...page.sections.map((s) => `#${s.id}`),
          ].includes(cta.href)
        ) {
          throw new Error(`Unknown anchor in ${page.slug}.${section.id}`);
        }
      }
    }
  }
}
for (const [name, content] of [
  ["header", loadHeader()],
  ["footer", loadFooter()],
] as const) {
  checkImages(content as Json, `global.${name}`);
}
console.log(
  `Validated ${pages.length} pages, ${glossary.length} glossary entries, ${Object.keys(ui).length} UI labels and ${images.length} images.`,
);
