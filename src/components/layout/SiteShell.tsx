"use client";
import type {
  HeaderContent,
  FooterContent,
  UiContent,
  SearchEntry,
} from "@/content/global-schemas";
import type { PirateImage } from "@/content/types";
import { useLanguage } from "@/components/content/LanguageProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { IntroVoyage } from "@/components/motion/IntroVoyage";

export function SiteShell({
  children,
  header,
  footer,
  ui,
  images,
  builtRoutes,
  searchEntries,
}: {
  children: React.ReactNode;
  header: HeaderContent;
  footer: FooterContent;
  ui: UiContent;
  images: PirateImage[];
  builtRoutes: string[];
  searchEntries: SearchEntry[];
}) {
  const { mode } = useLanguage();
  return (
    <div className="site-shell" data-content-mode={mode} data-phase="1">
      <IntroVoyage />
      <Header
        content={header}
        ui={ui}
        images={images}
        builtRoutes={builtRoutes}
        searchEntries={searchEntries}
      />
      {children}
      <Footer
        content={footer}
        ui={ui}
        images={images}
        builtRoutes={builtRoutes}
      />
    </div>
  );
}
