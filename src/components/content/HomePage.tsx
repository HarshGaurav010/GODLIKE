"use client";

import { useLanguage } from "./LanguageProvider";
import { useRef } from "react";
import { useVoyageEffects } from "./useVoyageEffects";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { SectionContext } from "@/components/sections/SectionContext";
import type { Page, PirateImage, Section } from "@/content/types";
import type { UiContent } from "@/content/global-schemas";

/** Notices and events share one band, as on the source homepage. */
function groupSections(sections: Section[]) {
  const groups: Section[][] = [];
  sections.forEach((section, index) => {
    const previous = sections[index - 1];
    if (
      previous?.kind === "noticeBoard" &&
      section.kind === "newsList" &&
      section.variant === "events"
    ) {
      groups[groups.length - 1].push(section);
    } else groups.push([section]);
  });
  return groups;
}

export function HomePage({
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
        className="home-main"
        id="main-content"
        tabIndex={-1}
        data-page={page.slug}
      >
        {groupSections(page.sections).map((group) =>
          group.length === 1 ? (
            <SectionRenderer key={group[0].id} section={group[0]} mode={mode} />
          ) : (
            <div className="home-band" key={group[0].id}>
              <div className="shell-container notice-events">
                {group.map((section) => (
                  <SectionRenderer
                    key={section.id}
                    section={section}
                    mode={mode}
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </main>
    </SectionContext.Provider>
  );
}
