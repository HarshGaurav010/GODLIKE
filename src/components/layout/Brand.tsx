import Image from "next/image";
import Link from "next/link";
import type { PirateImage } from "@/content/types";

export function Brand({
  name,
  slogan,
  image,
}: {
  name: string;
  slogan: string;
  image: PirateImage;
}) {
  return (
    <Link href="/uncharted?from=home" className="site-brand" aria-label={name}>
      <Image
        src={image.file}
        width={image.width}
        height={image.height}
        alt=""
        sizes="(min-width: 1280px) 280px, 250px"
        className="brand-art"
        priority={image.id === "global-header-identity"}
      />
      <span className="brand-wordmark">
        <strong>{name}</strong>
        <span>{slogan}</span>
      </span>
    </Link>
  );
}
