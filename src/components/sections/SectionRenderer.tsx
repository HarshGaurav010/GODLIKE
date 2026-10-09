import type { Section, ContentMode } from "@/content/types";
import { RichText } from "./RichText";
import { Cta } from "./Cta";

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
    default:
      throw new Error(
        `Renderer for ${section.kind} must be added in its page task.`,
      );
  }
}
