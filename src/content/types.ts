import type { z } from "zod";
import type {
  pageSchema,
  sectionSchema,
  imageSchema,
  glossarySchema,
} from "./schemas";

export type Json =
  string | number | boolean | null | Json[] | { [key: string]: Json };
export type ContentMode = "original" | "pirate";
export type Page = z.infer<typeof pageSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type PirateImage = z.infer<typeof imageSchema>;
export type Glossary = z.infer<typeof glossarySchema>;
