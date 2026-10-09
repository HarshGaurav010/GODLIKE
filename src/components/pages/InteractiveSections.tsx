"use client";

import { useId, useState } from "react";
import { SafeNavLink } from "@/components/layout/SafeNavLink";
import { useSectionContext } from "@/components/sections/SectionContext";
import {
  compassSchema,
  crewsSchema,
  mapSchema,
  noticesSchema,
} from "@/content/page-schemas";
import type { Json } from "@/content/types";
import { Block } from "./PageSections";

type Props = { id: string; content: Record<string, Json> };

/** Vision & mission, with a compass that lands on a random mission. */
export function Compass({ id, content }: Props) {
  const data = compassSchema.parse(content);
  const [turn, setTurn] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  function spin() {
    let next = Math.floor(Math.random() * data.missions.length);
    if (next === picked) next = (next + 1) % data.missions.length;
    // Whole turns plus the slice that points at the chosen mission.
    const slice = 360 / data.missions.length;
    setTurn((value) => value - (value % 360) + 1080 + next * slice);
    setPicked(next);
  }
  return (
    <Block
      id={id}
      kind="cardGrid"
      heading={data.heading}
      tagline={data.tagline}
    >
      <div className="compass-layout">
        <div className="compass-vision">
          <h3>{data.visionLabel}</h3>
          <p>{data.vision}</p>
        </div>
        <div className="compass-dial-wrap">
          <div className="compass-dial" aria-hidden="true">
            <span className="compass-point compass-n">N</span>
            <span className="compass-point compass-e">E</span>
            <span className="compass-point compass-s">S</span>
            <span className="compass-point compass-w">W</span>
            <span
              className="compass-needle"
              style={{ transform: `rotate(${turn}deg)` }}
            />
          </div>
          <button className="utility-action" type="button" onClick={spin}>
            {data.spinLabel}
          </button>
          <p className="compass-result" aria-live="polite">
            {picked === null ? null : (
              <>
                <strong>{data.pickedLabel}:</strong> {data.missions[picked]}
              </>
            )}
          </p>
        </div>
        <div className="compass-missions">
          <h3>{data.missionLabel}</h3>
          <ol>
            {data.missions.map((mission, index) => (
              <li key={index} data-picked={index === picked || undefined}>
                {mission}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Block>
  );
}

/** Department cards with group filters. */
export function CrewFilter({ id, content }: Props) {
  const data = crewsSchema.parse(content);
  const [group, setGroup] = useState("all");
  const shown = data.cards.filter(
    (card) => group === "all" || card.group === group,
  );
  const groupLabel = (key: string) =>
    data.groups.find((entry) => entry.id === key)?.label ?? "";
  return (
    <Block
      id={id}
      kind="cardGrid"
      heading={data.heading}
      tagline={data.tagline}
    >
      <div className="filter-bar" role="group" aria-label={data.filterLabel}>
        {[{ id: "all", label: data.allLabel }, ...data.groups].map((entry) => (
          <button
            key={entry.id}
            type="button"
            className="filter-chip"
            aria-pressed={group === entry.id}
            onClick={() => setGroup(entry.id)}
          >
            {entry.label}
          </button>
        ))}
        <span className="filter-count" aria-live="polite">
          {shown.length} / {data.cards.length}
        </span>
      </div>
      <ul className="crew-grid">
        {shown.map((card) => (
          <li className="crew-card" key={card.name} data-group={card.group}>
            <span className="crew-flag" aria-hidden="true">
              {card.name[0]}
            </span>
            <p className="crew-group">{groupLabel(card.group)}</p>
            <h3>{card.name}</h3>
            {card.text ? <p>{card.text}</p> : null}
          </li>
        ))}
      </ul>
    </Block>
  );
}

// Hand-placed spots on the map, as percentages, so pins never collide.
const SPOTS = [
  [14, 26],
  [36, 16],
  [60, 28],
  [84, 18],
  [86, 56],
  [64, 70],
  [40, 56],
  [18, 70],
  [30, 86],
  [70, 88],
];

/** Research centres as X marks on a treasure map. */
export function TreasureMap({ id, content }: Props) {
  const data = mapSchema.parse(content);
  const [active, setActive] = useState(0);
  const panel = useId();
  const pin = data.pins[active];
  return (
    <Block
      id={id}
      kind="cardGrid"
      heading={data.heading}
      tagline={data.tagline}
    >
      <div className="treasure-layout">
        <div className="treasure-map">
          <svg
            className="treasure-route"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points={data.pins
                .map((_, i) => SPOTS[i % SPOTS.length].join(","))
                .join(" ")}
            />
          </svg>
          {data.pins.map((entry, index) => {
            const [left, top] = SPOTS[index % SPOTS.length];
            return (
              <button
                key={entry.code}
                type="button"
                className="treasure-pin"
                style={{ left: `${left}%`, top: `${top}%` }}
                aria-pressed={index === active}
                aria-controls={panel}
                onClick={() => setActive(index)}
              >
                <span aria-hidden="true">✕</span>
                <span className="treasure-pin-label">{entry.code}</span>
                <span className="sr-only">{entry.name}</span>
              </button>
            );
          })}
          <p className="treasure-hint">{data.hint}</p>
        </div>
        <article className="treasure-panel" id={panel} aria-live="polite">
          <p className="eyebrow">{pin.code}</p>
          <h3>{pin.name}</h3>
          <p>{pin.text}</p>
        </article>
      </div>
    </Block>
  );
}

/** Searchable, tabbed list of notices, tenders and openings. */
export function NoticeSearch({ id, content }: Props) {
  const data = noticesSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const field = useId();
  const needle = query.trim().toLowerCase();
  const rows = data.rows.filter(
    (row) =>
      (tab === "all" || row.tab === tab) &&
      (!needle || `${row.text} ${row.meta}`.toLowerCase().includes(needle)),
  );
  return (
    <Block id={id} kind="table" heading={data.heading} tagline={data.tagline}>
      <div className="notice-tools">
        <label htmlFor={field}>{data.searchLabel}</label>
        <input
          id={field}
          type="search"
          value={query}
          placeholder={data.placeholder}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="filter-bar" role="group" aria-label={data.heading}>
        {[{ id: "all", label: data.allLabel }, ...data.tabs].map((entry) => (
          <button
            key={entry.id}
            type="button"
            className="filter-chip"
            aria-pressed={tab === entry.id}
            onClick={() => setTab(entry.id)}
          >
            {entry.label}
          </button>
        ))}
        <span className="filter-count" aria-live="polite">
          {data.countLabel.replace("{count}", String(rows.length))}
        </span>
      </div>
      {rows.length ? (
        <ol className="mast-list">
          {rows.map((row) => (
            <li className="mast-item" key={row.tab + row.text}>
              <span className="mast-tag">
                {data.tabs.find((entry) => entry.id === row.tab)?.label}
              </span>
              <div>
                <p>{row.text}</p>
                {row.meta ? <p className="mast-meta">{row.meta}</p> : null}
              </div>
              <SafeNavLink href={row.href} builtRoutes={builtRoutes}>
                {data.openLabel}
                <span className="sr-only">: {row.text}</span>
              </SafeNavLink>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mast-empty">{data.emptyText}</p>
      )}
    </Block>
  );
}
