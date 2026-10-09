"use client";

import { academicsSchema, campusSchema } from "@/content/section-schemas";
import type { Json } from "@/content/types";
import { SafeNavLink } from "@/components/layout/SafeNavLink";
import { PirateFigure } from "./PirateFigure";
import { SectionHeading } from "./SectionHeading";
import { useSectionContext } from "./SectionContext";

function CampusCards({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = campusSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  return (
    <section
      className="home-band home-band-alt"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="cardGrid"
      data-variant="campus"
    >
      <div className="shell-container">
        <SectionHeading id={id} {...data} />
        <ul className="card-grid card-grid-3">
          {data.cards.map((card) => (
            <li className="story-card" key={card.imageId}>
              <PirateFigure
                id={card.imageId}
                sizes="(min-width: 768px) 30vw, 90vw"
                className="story-card-art"
              />
              <p>{card.text}</p>
              <SafeNavLink
                className="text-action"
                href={card.cta.href}
                builtRoutes={builtRoutes}
              >
                {card.cta.label} <span aria-hidden="true">→</span>
              </SafeNavLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AcademicTiles({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = academicsSchema.parse(content);
  return (
    <section
      className="home-band"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="cardGrid"
      data-variant="academics"
    >
      <div className="shell-container academics-layout">
        <PirateFigure
          id={data.featureImageId}
          sizes="(min-width: 768px) 35vw, 80vw"
          className="academics-feature"
        />
        <div>
          <SectionHeading id={id} {...data} />
          <ul className="academic-tiles">
            {data.tiles.map((tile) => (
              <li className="academic-tile" key={tile.imageId}>
                <PirateFigure
                  id={tile.imageId}
                  sizes="(min-width: 768px) 25vw, 90vw"
                  className="academic-tile-art"
                  decorative
                />
                <span className="academic-tile-label">{tile.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function CardGrid({
  id,
  variant,
  content,
}: {
  id: string;
  variant?: string;
  content: Record<string, Json>;
}) {
  if (variant === "campus") return <CampusCards id={id} content={content} />;
  if (variant === "academics")
    return <AcademicTiles id={id} content={content} />;
  throw new Error(`Unknown cardGrid variant: ${variant}`);
}
