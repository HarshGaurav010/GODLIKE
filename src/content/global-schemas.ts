import { z } from "zod";
import { sameShape } from "./schemas";
import type { Json } from "./types";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  children: NavItem[];
};
const navItemSchema: z.ZodType<NavItem> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1),
      label: z.string().min(1),
      href: z.string().min(1),
      children: z.array(navItemSchema),
    })
    .strict(),
);
const brandSchema = z
  .object({
    name: z.string().min(1),
    subtitle: z.string().min(1),
    imageId: z.string().min(1),
  })
  .strict();
export const headerPayloadSchema = z
  .object({
    sourceUrl: z.url(),
    brand: brandSchema,
    desktopRows: z.array(z.array(navItemSchema)).length(2),
    mobileItems: z.array(navItemSchema).min(1),
    quickLinks: z.array(navItemSchema).min(1),
    quickHeading: z.string().min(1),
    socialLinks: z.array(navItemSchema),
    accessibility: z
      .object({
        heading: z.string().min(1),
        controls: z.array(
          z
            .object({
              id: z.string().min(1),
              label: z.string().min(1),
              href: z.string().nullable(),
            })
            .strict(),
        ),
      })
      .strict(),
    search: z
      .object({
        title: z.string().min(1),
        placeholder: z.string().min(1),
        buttonLabel: z.string().min(1),
        closeLabel: z.string().min(1),
      })
      .strict(),
  })
  .strict();
export const footerPayloadSchema = z
  .object({
    sourceUrl: z.url(),
    heading: z.string().min(1),
    resources: z.array(navItemSchema).min(1),
    brand: brandSchema,
    actions: z.array(navItemSchema),
    badges: z.array(z.object({ imageId: z.string() }).strict()),
    badgeSourceLabel: z.string(),
    visit: z.object({ label: z.string(), value: z.string() }).strict(),
  })
  .strict();
export const headerSchema = z
  .object({ original: headerPayloadSchema, pirate: headerPayloadSchema })
  .strict()
  .refine((value) => sameShape(value.original as Json, value.pirate as Json), {
    message: "Header language shapes differ.",
  });
export const footerSchema = z
  .object({ original: footerPayloadSchema, pirate: footerPayloadSchema })
  .strict()
  .refine((value) => sameShape(value.original as Json, value.pirate as Json), {
    message: "Footer language shapes differ.",
  });
export type HeaderContent = z.infer<typeof headerSchema>;
export type FooterContent = z.infer<typeof footerSchema>;
export type UiContent = Record<string, { original: string; pirate: string }>;
export type SearchEntry = { original: string; pirate: string; href: string };
