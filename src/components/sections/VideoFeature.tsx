"use client";

import { videoSchema } from "@/content/section-schemas";
import type { Json } from "@/content/types";
import { SafeNavLink } from "@/components/layout/SafeNavLink";
import { SectionHeading } from "./SectionHeading";
import { useSectionContext } from "./SectionContext";

export function VideoFeature({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = videoSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  return (
    <section
      className="home-band"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="gallery"
      data-variant="video"
    >
      <div className="shell-container">
        <SectionHeading id={id} heading={data.heading} tagline={data.tagline} />
        <div className="video-frame">
          <p>{data.frameText}</p>
          <SafeNavLink
            className="utility-action"
            href={data.link.href}
            builtRoutes={builtRoutes}
          >
            {data.link.label} <span aria-hidden="true">→</span>
          </SafeNavLink>
        </div>
      </div>
    </section>
  );
}
