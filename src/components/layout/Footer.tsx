"use client";
import Image from "next/image";
import { useLanguage } from "@/components/content/LanguageProvider";
import type { FooterContent, UiContent } from "@/content/global-schemas";
import type { PirateImage } from "@/content/types";
import { Brand } from "./Brand";
import { SafeNavLink } from "./SafeNavLink";

export function Footer({
  content,
  ui,
  images,
  builtRoutes,
}: {
  content: FooterContent;
  ui: UiContent;
  images: PirateImage[];
  builtRoutes: string[];
}) {
  const { mode } = useLanguage();
  const data = content[mode];
  const t = (key: string) => ui[key][mode];
  const crest = images.find((image) => image.id === data.brand.imageId);
  if (!crest) throw new Error("Shared footer identity image is missing.");
  return (
    <footer className="site-footer" data-section="global-footer">
      <div className="shell-container">
        <div className="footer-columns grid md:grid-cols-[var(--footer-columns)]">
          <nav
            className="footer-resources"
            aria-labelledby="footer-resources-heading"
          >
            <h2 id="footer-resources-heading">{data.heading}</h2>
            <ul>
              {data.resources.map((item) => (
                <li key={item.id}>
                  <SafeNavLink href={item.href} builtRoutes={builtRoutes}>
                    {item.label}
                  </SafeNavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-identity">
            <Brand name={t("brand")} slogan={t("slogan")} image={crest} />
            <div className="footer-actions">
              {data.actions.map((item) => (
                <SafeNavLink
                  key={item.id}
                  className="utility-action"
                  href={item.href}
                  builtRoutes={builtRoutes}
                >
                  {item.label}
                </SafeNavLink>
              ))}
            </div>
            <div className="footer-badges">
              {data.badges.map((badge) => {
                const image = images.find(
                  (entry) => entry.id === badge.imageId,
                );
                if (!image)
                  throw new Error(`Missing footer graphic: ${badge.imageId}`);
                return (
                  <Image
                    key={badge.imageId}
                    src={image.file}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                    sizes="80px"
                    className="footer-badge"
                  />
                );
              })}
            </div>
            <p className="footer-badge-note">{t("parodyBadge")}</p>
            <p className="footer-visit">
              {data.visit.label} <span>{data.visit.value}</span>
            </p>
          </div>
        </div>
        <p className="parody-notice">{t("notice")}</p>
      </div>
    </footer>
  );
}
