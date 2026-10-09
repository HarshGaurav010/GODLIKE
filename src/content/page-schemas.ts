import { z } from "zod";

/**
 * Content schemas for the inner pages (About, Admissions, Departments, …).
 * Keys are `kind` or `kind:variant`, merged into sectionContentSchemas.
 * Fields typed `z.string()` may be empty in the faithful source version,
 * where the pirate version adds framing the source does not have.
 */
const text = z.string().min(1);
const optional = z.string();
const id = z.string().regex(/^[a-z0-9-]+$/);
const link = z.object({ label: text, href: text }).strict();

export const pageHeroSchema = z
  .object({
    eyebrow: text,
    title: text,
    lede: text,
    imageId: id,
    facts: z.array(z.object({ value: text, label: text }).strict()),
  })
  .strict();

export const storySchema = z
  .object({
    heading: text,
    kicker: optional,
    paragraphs: z.array(text).min(1),
    aside: z.object({ label: optional, text: optional }).strict(),
  })
  .strict();

export const timelineSchema = z
  .object({
    heading: text,
    tagline: optional,
    items: z
      .array(z.object({ when: text, text, note: optional }).strict())
      .min(1),
  })
  .strict();

export const compassSchema = z
  .object({
    heading: text,
    tagline: optional,
    visionLabel: text,
    vision: text,
    missionLabel: text,
    missions: z.array(text).min(2),
    spinLabel: text,
    pickedLabel: text,
  })
  .strict();

export const ticketsSchema = z
  .object({
    heading: text,
    tagline: optional,
    cards: z
      .array(
        z
          .object({
            code: text,
            title: text,
            via: text,
            date: text,
            text,
            cta: link,
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const crewsSchema = z
  .object({
    heading: text,
    tagline: optional,
    filterLabel: text,
    allLabel: text,
    groups: z.array(z.object({ id, label: text }).strict()).min(1),
    cards: z
      .array(z.object({ name: text, group: id, text: optional }).strict())
      .min(1),
  })
  .strict();

export const mapSchema = z
  .object({
    heading: text,
    tagline: optional,
    hint: text,
    pins: z.array(z.object({ code: text, name: text, text }).strict()).min(1),
  })
  .strict();

export const listSchema = z
  .object({
    heading: text,
    tagline: optional,
    items: z.array(text).min(1),
  })
  .strict();

export const helpSchema = z
  .object({
    heading: text,
    tagline: optional,
    contactsLabel: text,
    cards: z
      .array(
        z
          .object({
            id,
            name: text,
            purpose: text,
            details: z.array(text),
            contacts: z.array(text),
            links: z.array(link),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const tableSchema = z
  .object({
    heading: text,
    tagline: optional,
    caption: text,
    columns: z.array(text).min(1),
    rows: z
      .array(z.object({ cells: z.array(z.string()), href: optional }).strict())
      .min(1),
    linkLabel: optional,
    note: optional,
  })
  .strict();

export const noticesSchema = z
  .object({
    heading: text,
    tagline: optional,
    searchLabel: text,
    placeholder: text,
    emptyText: text,
    countLabel: text,
    allLabel: text,
    openLabel: text,
    tabs: z.array(z.object({ id, label: text }).strict()).min(1),
    rows: z
      .array(z.object({ tab: id, text, meta: optional, href: text }).strict())
      .min(1),
  })
  .strict();

export const rosterSchema = z
  .object({
    heading: text,
    tagline: optional,
    members: z
      .array(z.object({ name: text, role: text, title: optional }).strict())
      .min(1),
  })
  .strict();

export const quoteSchema = z
  .object({
    heading: text,
    kicker: optional,
    salutation: text,
    paragraphs: z.array(text).min(1),
    closing: text,
    name: text,
    role: text,
  })
  .strict();

export const contactsSchema = z
  .object({
    heading: text,
    tagline: optional,
    cards: z
      .array(z.object({ title: text, lines: z.array(text).min(1) }).strict())
      .min(1),
  })
  .strict();

export const pageSectionSchemas: Record<string, z.ZodType> = {
  "hero:page": pageHeroSchema,
  "richText:story": storySchema,
  timeline: timelineSchema,
  "cardGrid:compass": compassSchema,
  "cardGrid:tickets": ticketsSchema,
  "cardGrid:crews": crewsSchema,
  "cardGrid:map": mapSchema,
  "cardGrid:help": helpSchema,
  "linkList:chips": listSchema,
  "linkList:bullets": listSchema,
  "linkList:contacts": contactsSchema,
  table: tableSchema,
  "table:notices": noticesSchema,
  "people:roster": rosterSchema,
  "people:quote": quoteSchema,
};
