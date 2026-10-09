"use client";

import { createContext, useContext } from "react";
import type { PirateImage } from "@/content/types";

export type SectionContextValue = {
  images: PirateImage[];
  builtRoutes: string[];
  t: (key: string) => string;
};

export const SectionContext = createContext<SectionContextValue | null>(null);

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (!context)
    throw new Error("This section needs the page's image and route context.");
  return context;
}

export function useImage(id: string) {
  const image = useSectionContext().images.find((entry) => entry.id === id);
  if (!image) throw new Error(`Image ${id} is not in the manifest.`);
  return image;
}
