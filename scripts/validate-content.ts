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
import {
  sectionContentSchemas,
  sectionSchemaKey,
} from "../src/content/section-schemas";
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

const pendingImages = new Set<string>();

function checkImages(value: Json, location: string) {
  if (Array.isArray(value))
    return value.forEach((entry, i) => checkImages(entry, `${location}[${i}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    if (/(?:^i|I)(?:mage|con)Id$/.test(key) && typeof entry === "string") {
      const image = imageIndex.get(entry);
      // "todo" images render as a labelled pending frame until generated.
      if (
        !image ||
        (image.status !== "todo" &&
          !existsSync(path.join("public", image.file)))
      ) {
        throw new Error(`${location}: image ${entry} is missing.`);
      }
      if (image.status === "todo") pendingImages.add(entry);
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
      const schema =
        sectionContentSchemas[sectionSchemaKey(section.kind, section.variant)];
      if (schema) schema.parse(content);
      else if (!["richText", "cta"].includes(section.kind)) {
        throw new Error(
          `No content schema for ${page.slug}.${section.id} (${section.kind}${section.variant ? `:${section.variant}` : ""}).`,
        );
      }
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
if (pendingImages.size) {
  console.log(
    `${pendingImages.size} referenced images still await generation (status "todo"): ${[...pendingImages].join(", ")}`,
  );
}
