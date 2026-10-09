"use client";

import Image from "next/image";
import { useImage, useSectionContext } from "./SectionContext";

/**
 * Renders a manifest image. Images still marked "todo" show a labelled frame
 * at the final aspect ratio, so the layout is stable before the art lands.
 */
export function PirateFigure({
  id,
  sizes,
  className,
  priority = false,
  decorative = false,
}: {
  id: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const image = useImage(id);
  const { t } = useSectionContext();
  const alt = decorative ? "" : image.alt;
  if (image.status === "todo") {
    return (
      <span
        className={["art-pending", className].filter(Boolean).join(" ")}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        data-image-id={image.id}
        data-image-status="todo"
      >
        <span className="art-pending-label">{t("artPending")}</span>
      </span>
    );
  }
  return (
    <Image
      src={image.file}
      width={image.width}
      height={image.height}
      alt={alt}
      sizes={sizes}
      className={className}
      priority={priority}
      data-image-id={image.id}
    />
  );
}
