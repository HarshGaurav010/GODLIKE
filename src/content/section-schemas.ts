import { z } from "zod";
import { pageSectionSchemas } from "./page-schemas";

const text = z.string().min(1);
const id = z.string().regex(/^[a-z0-9-]+$/);
const link = z.object({ label: text, href: text }).strict();

export const heroSchema = z
  .object({
    imageId: id,
    rankingGroups: z
      .array(
        z
          .object({
            title: text,
            items: z
              .array(z.object({ text, strong: z.boolean() }).strict())
              .min(1),
          })
          .strict(),
      )
      .min(1),
    footnote: text,
  })
  .strict();

export const messageSchema = z
  .object({
    heading: text,
    // Pirate-only framing; empty in the faithful source version.
    kicker: z.string(),
    paragraphs: z.array(text).min(1),
    verse: text,
    verseTranslation: text,
    person: z.object({ name: text, role: text }).strict(),
    imageId: id,
  })
  .strict();

export const statsSchema = z
  .object({
    backdropImageId: id,
    items: z
      .array(
        z
          .object({
            label: text,
            value: z.number().int().nonnegative(),
            format: z.enum(["year", "count"]),
            note: z.string(),
            iconId: id,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const campusSchema = z
  .object({
    heading: text,
    tagline: text,
    more: link,
    cards: z.array(z.object({ imageId: id, text, cta: link }).strict()).min(1),
  })
  .strict();

export const academicsSchema = z
  .object({
    heading: text,
    tagline: text,
    more: link,
    featureImageId: id,
    tiles: z.array(z.object({ label: text, imageId: id }).strict()).min(1),
  })
  .strict();

export const researchSchema = z
  .object({
    heading: text,
    tagline: text,
    more: link,
    items: z.array(z.object({ title: text, text, cta: link }).strict()).min(1),
  })
  .strict();

export const noticeBoardSchema = z
  .object({
    heading: text,
    pauseLabel: text,
    playLabel: text,
    items: z.array(z.object({ text, href: text }).strict()).min(1),
    more: link,
  })
  .strict();

export const eventsSchema = z
  .object({
    heading: text,
    previousLabel: text,
    nextLabel: text,
    items: z
      .array(z.object({ imageId: id, title: text, text }).strict())
      .min(1),
  })
  .strict();

export const videoSchema = z
  .object({ heading: text, tagline: text, frameText: text, link })
  .strict();

/** Content schema for each implemented kind/variant pair. */
export const sectionContentSchemas: Record<string, z.ZodType> = {
  hero: heroSchema,
  people: messageSchema,
  stats: statsSchema,
  "cardGrid:campus": campusSchema,
  "cardGrid:academics": academicsSchema,
  "newsList:research": researchSchema,
  "newsList:events": eventsSchema,
  noticeBoard: noticeBoardSchema,
  "gallery:video": videoSchema,
  ...pageSectionSchemas,
};

export function sectionSchemaKey(kind: string, variant?: string) {
  return variant ? `${kind}:${variant}` : kind;
}
