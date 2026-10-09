"use client";

import { useRef } from "react";
import { useLanguage } from "@/components/content/LanguageProvider";
import { useVoyageEffects } from "@/components/content/useVoyageEffects";
import { SectionContext } from "@/components/sections/SectionContext";
import type { UiContent } from "@/content/global-schemas";
import type { Page, PirateImage } from "@/content/types";
import { PageSectionRenderer } from "./PageSectionRenderer";

/** Shared shell for every inner page: About, Admissions, Departments… */
export function ContentPage({
  page,
  ui,
  images,
  builtRoutes,
}: {
  page: Page;
  ui: UiContent;
  images: PirateImage[];
  builtRoutes: string[];
}) {
  const { mode } = useLanguage();
  const main = useRef<HTMLElement>(null);
  useVoyageEffects(main);
  const t = (key: string) => ui[key][mode];
  return (
    <SectionContext.Provider value={{ images, builtRoutes, t }}>
      <main
        ref={main}
        className="page-main"
        id="main-content"
        tabIndex={-1}
        data-page={page.slug}
      >
        {page.sections.map((section) => (
          <PageSectionRenderer key={section.id} section={section} mode={mode} />
        ))}
      </main>
    </SectionContext.Provider>
  );
}
