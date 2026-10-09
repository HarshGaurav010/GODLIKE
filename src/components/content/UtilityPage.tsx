"use client";

import { useLanguage } from "./LanguageProvider";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import type { Page } from "@/content/types";

type Ui = Record<string, { original: string; pirate: string }>;

export function UtilityPage({ page, ui }: { page: Page; ui: Ui }) {
  const { mode } = useLanguage();
  const t = (key: string) => ui[key][mode];
  return (
    <div className="utility-container">
      <main className="utility-main" id="main-content" tabIndex={-1}>
        <div className="utility-intro">
          <p className="eyebrow">{t("phase")}</p>
          <h1>{page.title[mode]}</h1>
        </div>
        {page.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} mode={mode} />
        ))}
        <section
          className="utility-status"
          id="status"
          aria-labelledby="status-heading"
        >
          <h2 id="status-heading">{t("pageStatus")}</h2>
          <p>{t("draftStatus")}</p>
        </section>
      </main>
    </div>
  );
}
