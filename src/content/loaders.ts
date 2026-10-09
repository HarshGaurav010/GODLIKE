import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  pageSchema,
  glossarySchema,
  imageManifestSchema,
  bilingualRecordSchema,
  pairedTextSchema,
} from "./schemas";

const contentRoot = path.join(process.cwd(), "content");

export function loadJson<T>(file: string, schema: z.ZodType<T>): T {
  return schema.parse(
    JSON.parse(readFileSync(path.join(contentRoot, file), "utf8")),
  );
}

export function loadPage(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Invalid page slug.");
  const page = loadJson(`pages/${slug}.json`, pageSchema);
  if (page.slug !== slug)
    throw new Error(`Page slug does not match filename: ${slug}`);
  return page;
}

export function loadPages() {
  const directory = path.join(contentRoot, "pages");
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => loadPage(file.slice(0, -5)));
}

export function loadGlossary() {
  return loadJson("glossary.json", glossarySchema);
}
export function loadImages() {
  return loadJson("images.json", imageManifestSchema);
}

export function loadGlobal(name: "header" | "footer") {
  return loadJson(`global/${name}.json`, bilingualRecordSchema);
}

const uiSchema = z.record(z.string(), pairedTextSchema);
export function loadUi() {
  const ui = loadJson("global/ui.json", uiSchema);
  const glossary = loadGlossary();
  const institute = glossary.find(
    (term) => term.original === "IIT (ISM) Dhanbad",
  );
  const shortName = glossary.find((term) => term.original === "Short name");
  if (!institute || !shortName)
    throw new Error("Institute glossary entries are missing.");
  ui.brand = {
    original: institute.original,
    pirate: shortName.pirate.split(" / ")[0],
  };
  return ui;
}
