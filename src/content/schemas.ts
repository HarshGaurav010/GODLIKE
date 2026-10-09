import { z } from "zod";
import type { Json } from "./types";

const jsonValue: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ]),
);
const record = z.record(z.string(), jsonValue);

export function sameShape(original: Json, pirate: Json): boolean {
  if (original === null || pirate === null) return original === pirate;
  if (Array.isArray(original)) {
    return (
      Array.isArray(pirate) &&
      original.length === pirate.length &&
      original.every((value, i) => sameShape(value, pirate[i]))
    );
  }
  if (Array.isArray(pirate) || typeof original !== typeof pirate) return false;
  if (typeof original === "object" && typeof pirate === "object") {
    const keys = Object.keys(original).sort();
    return (
      keys.join("\0") === Object.keys(pirate).sort().join("\0") &&
      keys.every((key) => sameShape(original[key], pirate[key]))
    );
  }
  return true;
}

export const pairedTextSchema = z
  .object({
    original: z.string().min(1),
    pirate: z.string().min(1),
  })
  .strict();

export const bilingualRecordSchema = z
  .object({
    original: record,
    pirate: record,
  })
  .strict()
  .refine((value) => sameShape(value.original, value.pirate), {
    message:
      "Original and pirate content must have identical recursive keys, types and array lengths.",
    path: ["pirate"],
  });

export const sectionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum([
      "hero",
      "richText",
      "cardGrid",
      "newsList",
      "noticeBoard",
      "stats",
      "people",
      "gallery",
      "linkList",
      "table",
      "cta",
      "marquee",
    ]),
    variant: z
      .string()
      .regex(/^[a-z-]+$/)
      .optional(),
    original: record,
    pirate: record,
  })
  .strict()
  .refine((value) => sameShape(value.original, value.pirate), {
    message: "Original and pirate section shapes differ.",
    path: ["pirate"],
  });

export const pageSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    sourceUrl: z.url(),
    sourceKind: z.enum(["scraped", "authoredUtility"]).default("scraped"),
    title: pairedTextSchema,
    seo: z
      .object({
        pirateTitle: z.string().min(1),
        pirateDescription: z.string().min(1),
      })
      .strict(),
    sections: z.array(sectionSchema).min(1),
  })
  .strict()
  .superRefine((page, context) => {
    const ids = page.sections.map((section) => section.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        message: "Section IDs must be unique.",
        path: ["sections"],
      });
    }
  });

export const imageSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    page: z.string().regex(/^[a-z0-9-]+$/),
    section: z.string().min(1),
    originalAlt: z.string(),
    role: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    prompt: z.string().min(1),
    alt: z.string(),
    file: z
      .string()
      .regex(/^\/images\/pirate\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|svg)$/),
    status: z.enum(["todo", "generated", "placeholder"]),
  })
  .strict();

export const imageManifestSchema = z
  .array(imageSchema)
  .superRefine((images, context) => {
    if (new Set(images.map((image) => image.id)).size !== images.length) {
      context.addIssue({
        code: "custom",
        message: "Image IDs must be unique.",
      });
    }
  });

export const glossarySchema = z
  .array(pairedTextSchema)
  .min(1)
  .superRefine((terms, context) => {
    if (new Set(terms.map((term) => term.original)).size !== terms.length) {
      context.addIssue({
        code: "custom",
        message: "Glossary originals must be unique.",
      });
    }
  });

export const richTextSchema = z
  .object({
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const ctaSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().regex(/^(\/[^/]|#[a-z0-9-])/),
  })
  .strict();
