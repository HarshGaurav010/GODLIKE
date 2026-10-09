import type { Section, ContentMode } from "@/content/types";
import { RichText } from "./RichText";
import { Cta } from "./Cta";
import { Hero } from "./Hero";
import { LeaderMessage } from "./LeaderMessage";
import { Stats } from "./Stats";
import { CardGrid } from "./CardGrid";
import { NewsList } from "./NewsList";
import { NoticeBoard } from "./NoticeBoard";
import { VideoFeature } from "./VideoFeature";

export function SectionRenderer({
  section,
  mode,
}: {
  section: Section;
  mode: ContentMode;
}) {
  const props = { id: section.id, content: section[mode] };
  switch (section.kind) {
    case "richText":
      return <RichText {...props} />;
    case "cta":
      return <Cta {...props} />;
    case "hero":
      return <Hero {...props} />;
    case "people":
      return <LeaderMessage {...props} />;
    case "stats":
      return <Stats {...props} />;
    case "cardGrid":
      return <CardGrid {...props} variant={section.variant} />;
    case "newsList":
      return <NewsList {...props} variant={section.variant} />;
    case "noticeBoard":
      return <NoticeBoard {...props} />;
    case "gallery":
      if (section.variant === "video") return <VideoFeature {...props} />;
      throw new Error(`Unknown gallery variant: ${section.variant}`);
    default:
      throw new Error(
        `Renderer for ${section.kind} must be added in its page task.`,
      );
  }
}
