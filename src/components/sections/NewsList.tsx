"use client";

import { useRef } from "react";
import { eventsSchema, researchSchema } from "@/content/section-schemas";
import type { Json } from "@/content/types";
import { SafeNavLink } from "@/components/layout/SafeNavLink";
import { PirateFigure } from "./PirateFigure";
import { SectionHeading } from "./SectionHeading";
import { useSectionContext } from "./SectionContext";

function ResearchList({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = researchSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  return (
    <section
      className="home-band home-band-alt"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="newsList"
      data-variant="research"
    >
      <div className="shell-container">
        <SectionHeading id={id} {...data} />
        <ul className="card-grid card-grid-4">
          {data.items.map((item) => (
            <li className="research-card" key={item.imageId}>
              <PirateFigure
                id={item.imageId}
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 90vw"
                className="research-card-art"
              />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <SafeNavLink
                className="text-action"
                href={item.cta.href}
                builtRoutes={builtRoutes}
              >
                {item.cta.label} <span aria-hidden="true">→</span>
              </SafeNavLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function EventsCarousel({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = eventsSchema.parse(content);
  const track = useRef<HTMLUListElement>(null);
  const move = (direction: 1 | -1) => {
    const list = track.current;
    const first = list?.firstElementChild as HTMLElement | null;
    if (!list || !first) return;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: direction * (first.offsetWidth + gap),
      behavior: reduce ? "auto" : "smooth",
    });
  };
  return (
    <section
      className="events-panel"
      id={id}
      aria-labelledby={`${id}-heading`}
      aria-roledescription="carousel"
      data-section-kind="newsList"
      data-variant="events"
    >
      <div className="section-heading">
        <h2 id={`${id}-heading`}>{data.heading}</h2>
        <div className="carousel-controls">
          <button
            type="button"
            className="plain-button"
            aria-label={data.previousLabel}
            aria-controls={`${id}-track`}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="plain-button"
            aria-label={data.nextLabel}
            aria-controls={`${id}-track`}
            onClick={() => move(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <ul className="event-track" id={`${id}-track`} ref={track} tabIndex={0}>
        {data.items.map((item, index) => (
          <li
            className="event-card"
            key={item.imageId}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${data.items.length}`}
          >
            <PirateFigure
              id={item.imageId}
              sizes="(min-width: 1280px) 25vw, 80vw"
              className="event-card-art"
            />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NewsList({
  id,
  variant,
  content,
}: {
  id: string;
  variant?: string;
  content: Record<string, Json>;
}) {
  if (variant === "research") return <ResearchList id={id} content={content} />;
  if (variant === "events") return <EventsCarousel id={id} content={content} />;
  throw new Error(`Unknown newsList variant: ${variant}`);
}
