"use client";

import { SafeNavLink } from "@/components/layout/SafeNavLink";
import { PirateFigure } from "@/components/sections/PirateFigure";
import {
  useImage,
  useSectionContext,
} from "@/components/sections/SectionContext";
import {
  contactsSchema,
  helpSchema,
  listSchema,
  pageHeroSchema,
  quoteSchema,
  rosterSchema,
  storySchema,
  tableSchema,
  ticketsSchema,
  timelineSchema,
} from "@/content/page-schemas";
import type { Json } from "@/content/types";

type Props = { id: string; content: Record<string, Json> };

/** Section wrapper with the shared heading pattern. */
function Block({
  id,
  kind,
  heading,
  tagline,
  className = "",
  children,
}: {
  id: string;
  kind: string;
  heading: string;
  tagline?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`page-block ${className}`}
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind={kind}
    >
      <div className="shell-container">
        <div className="section-heading">
          <div>
            <h2 id={`${id}-heading`}>{heading}</h2>
            {tagline ? <p className="section-tagline">{tagline}</p> : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .replace(/^(Prof\.|Dr\.?|Mr\.|Ms\.|Shri|Smt\.)\s*/i, "")
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function PageHero({ id, content }: Props) {
  const data = pageHeroSchema.parse(content);
  const image = useImage(data.imageId);
  // Hero art is optional: until it is generated the hero simply runs wide.
  const hasArt = image.status !== "todo";
  return (
    <section
      className={`page-hero ${hasArt ? "page-hero-with-art" : ""}`}
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="hero"
    >
      <div className="shell-container page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow">{data.eyebrow}</p>
          <h1 id={`${id}-heading`}>{data.title}</h1>
          <p className="page-hero-lede">{data.lede}</p>
          {data.facts.length ? (
            <dl className="page-facts">
              {data.facts.map((fact) => (
                <div key={fact.value + fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {hasArt ? (
          <PirateFigure
            id={data.imageId}
            sizes="(min-width: 1280px) 36rem, 45vw"
            className="page-hero-art"
            priority
          />
        ) : null}
      </div>
    </section>
  );
}

export function Story({ id, content }: Props) {
  const data = storySchema.parse(content);
  return (
    <Block id={id} kind="richText" heading={data.heading} tagline={data.kicker}>
      <div className={`story ${data.aside.text ? "story-with-aside" : ""}`}>
        <div className="story-body">
          {data.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {data.aside.text ? (
          <aside className="story-aside">
            {data.aside.label ? <strong>{data.aside.label}</strong> : null}
            <p>{data.aside.text}</p>
          </aside>
        ) : null}
      </div>
    </Block>
  );
}

export function Timeline({ id, content }: Props) {
  const data = timelineSchema.parse(content);
  return (
    <Block
      id={id}
      kind="timeline"
      heading={data.heading}
      tagline={data.tagline}
    >
      <ol className="voyage-log">
        {data.items.map((item, index) => (
          <li key={index} className="voyage-entry">
            <span className="voyage-when">{item.when}</span>
            <div className="voyage-body">
              <p>{item.text}</p>
              {item.note ? <p className="voyage-note">{item.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </Block>
  );
}

export function DataTable({ id, content }: Props) {
  const data = tableSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  const linked = data.rows.some((row) => row.href);
  return (
    <Block id={id} kind="table" heading={data.heading} tagline={data.tagline}>
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-labelledby={`${id}-caption`}
      >
        <table className="data-table">
          <caption id={`${id}-caption`}>{data.caption}</caption>
          <thead>
            <tr>
              {data.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
              {linked ? (
                <th scope="col">
                  <span className="sr-only">{data.linkLabel}</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                {linked ? (
                  <td>
                    {row.href ? (
                      <SafeNavLink href={row.href} builtRoutes={builtRoutes}>
                        {data.linkLabel}
                        <span className="sr-only">: {row.cells.join(" ")}</span>
                      </SafeNavLink>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.note ? <p className="table-note">{data.note}</p> : null}
    </Block>
  );
}

export function ListBlock({
  id,
  content,
  variant,
}: Props & { variant?: string }) {
  const data = listSchema.parse(content);
  return (
    <Block
      id={id}
      kind="linkList"
      heading={data.heading}
      tagline={data.tagline}
    >
      <ul className={variant === "chips" ? "chip-list" : "bullet-list"}>
        {data.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Block>
  );
}

export function Contacts({ id, content }: Props) {
  const data = contactsSchema.parse(content);
  return (
    <Block
      id={id}
      kind="linkList"
      heading={data.heading}
      tagline={data.tagline}
    >
      <div className="contact-grid">
        {data.cards.map((card) => (
          <article className="contact-card" key={card.title}>
            <h3>{card.title}</h3>
            {card.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </article>
        ))}
      </div>
    </Block>
  );
}

export function Roster({ id, content }: Props) {
  const data = rosterSchema.parse(content);
  return (
    <Block id={id} kind="people" heading={data.heading} tagline={data.tagline}>
      <ul className="roster">
        {data.members.map((member) => (
          <li className="roster-card" key={member.role + member.title}>
            <span className="roster-badge" aria-hidden="true">
              {initials(member.name)}
            </span>
            <div>
              {member.title ? (
                <p className="roster-title">{member.title}</p>
              ) : null}
              <h3>{member.name}</h3>
              <p className="roster-role">{member.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </Block>
  );
}

export function Quote({ id, content }: Props) {
  const data = quoteSchema.parse(content);
  return (
    <Block id={id} kind="people" heading={data.heading} tagline={data.kicker}>
      <figure className="letter">
        <blockquote>
          <p className="letter-salutation">{data.salutation}</p>
          {data.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p className="letter-closing">{data.closing}</p>
        </blockquote>
        <figcaption>
          <strong>{data.name}</strong>
          <span>{data.role}</span>
        </figcaption>
      </figure>
    </Block>
  );
}

export function Tickets({ id, content }: Props) {
  const data = ticketsSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  return (
    <Block
      id={id}
      kind="cardGrid"
      heading={data.heading}
      tagline={data.tagline}
    >
      <ul className="ticket-grid">
        {data.cards.map((card) => (
          <li className="ticket" key={card.code + card.title}>
            <div className="ticket-stub" aria-hidden="true">
              {card.code}
            </div>
            <div className="ticket-body">
              <h3>{card.title}</h3>
              <p className="ticket-via">{card.via}</p>
              <p className="ticket-date">{card.date}</p>
              <p>{card.text}</p>
              <SafeNavLink
                className="ticket-cta"
                href={card.cta.href}
                builtRoutes={builtRoutes}
              >
                {card.cta.label} <span aria-hidden="true">→</span>
              </SafeNavLink>
            </div>
          </li>
        ))}
      </ul>
    </Block>
  );
}

export function HelpCards({ id, content }: Props) {
  const data = helpSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  return (
    <Block
      id={id}
      kind="cardGrid"
      heading={data.heading}
      tagline={data.tagline}
    >
      <div className="help-grid">
        {data.cards.map((card) => (
          <article className="help-card" id={card.id} key={card.id}>
            <h3>{card.name}</h3>
            <p className="help-purpose">{card.purpose}</p>
            {card.details.length ? (
              <ul className="bullet-list">
                {card.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
            {card.contacts.length ? (
              <div className="help-contacts">
                <strong>{data.contactsLabel}</strong>
                {card.contacts.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ) : null}
            {card.links.map((item) => (
              <SafeNavLink
                key={item.label}
                className="help-link"
                href={item.href}
                builtRoutes={builtRoutes}
              >
                {item.label} <span aria-hidden="true">→</span>
              </SafeNavLink>
            ))}
          </article>
        ))}
      </div>
    </Block>
  );
}

export { Block };
