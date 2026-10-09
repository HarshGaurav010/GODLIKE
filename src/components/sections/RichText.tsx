import { richTextSchema } from "@/content/schemas";
import type { Json } from "@/content/types";

export function RichText({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = richTextSchema.parse(content);
  return (
    <section
      className="utility-copy"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="richText"
    >
      <h2 id={`${id}-heading`}>{data.heading}</h2>
      {data.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </section>
  );
}
