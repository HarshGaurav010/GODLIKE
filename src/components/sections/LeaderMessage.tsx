"use client";

import { messageSchema } from "@/content/section-schemas";
import type { Json } from "@/content/types";
import { PirateFigure } from "./PirateFigure";

export function LeaderMessage({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = messageSchema.parse(content);
  return (
    <section
      className="home-band leader-message"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="people"
    >
      <div className="shell-container leader-message-inner">
        <div>
          <h2 id={`${id}-heading`}>{data.heading}</h2>
          {data.kicker ? (
            <p className="section-tagline">{data.kicker}</p>
          ) : null}
          <figure className="leader-quote">
            <blockquote>
              {data.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p lang="sa">{data.verse}</p>
              <p>{data.verseTranslation}</p>
            </blockquote>
            <figcaption>
              <strong>{data.person.name}</strong>
              <span>{data.person.role}</span>
            </figcaption>
          </figure>
        </div>
        <PirateFigure
          id={data.imageId}
          sizes="(min-width: 768px) 30vw, 90vw"
          className="leader-portrait"
        />
      </div>
    </section>
  );
}
