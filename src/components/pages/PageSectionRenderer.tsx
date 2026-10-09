"use client";

import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { sectionSchemaKey } from "@/content/section-schemas";
import type { ContentMode, Section } from "@/content/types";
import {
  Contacts,
  DataTable,
  HelpCards,
  ListBlock,
  PageHero,
  Quote,
  Roster,
  Story,
  Tickets,
  Timeline,
} from "./PageSections";
import {
  Compass,
  CrewFilter,
  NoticeSearch,
  TreasureMap,
} from "./InteractiveSections";

const renderers: Record<
  string,
  (props: {
    id: string;
    content: Section["original"];
    variant?: string;
  }) => React.ReactNode
> = {
  "hero:page": PageHero,
  "richText:story": Story,
  timeline: Timeline,
  "cardGrid:compass": Compass,
  "cardGrid:tickets": Tickets,
  "cardGrid:crews": CrewFilter,
  "cardGrid:map": TreasureMap,
  "cardGrid:help": HelpCards,
  "linkList:chips": ListBlock,
  "linkList:bullets": ListBlock,
  "linkList:contacts": Contacts,
  table: DataTable,
  "table:notices": NoticeSearch,
  "people:roster": Roster,
  "people:quote": Quote,
};

/** Inner-page sections, falling back to the shared Home renderer. */
export function PageSectionRenderer({
  section,
  mode,
}: {
  section: Section;
  mode: ContentMode;
}) {
  const Render = renderers[sectionSchemaKey(section.kind, section.variant)];
  if (!Render) return <SectionRenderer section={section} mode={mode} />;
  return (
    <Render id={section.id} content={section[mode]} variant={section.variant} />
  );
}
