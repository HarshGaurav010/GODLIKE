"use client";

import { SafeNavLink } from "@/components/layout/SafeNavLink";
import { useSectionContext } from "./SectionContext";

export function SectionHeading({
  id,
  heading,
  tagline,
  more,
}: {
  id: string;
  heading: string;
  tagline?: string;
  more?: { label: string; href: string };
}) {
  const { builtRoutes } = useSectionContext();
  return (
    <div className="section-heading">
      <div>
        <h2 id={`${id}-heading`}>{heading}</h2>
        {tagline ? <p className="section-tagline">{tagline}</p> : null}
      </div>
      {more ? (
        <SafeNavLink
          className="utility-action"
          href={more.href}
          builtRoutes={builtRoutes}
        >
          {more.label} <span aria-hidden="true">→</span>
        </SafeNavLink>
      ) : null}
    </div>
  );
}
