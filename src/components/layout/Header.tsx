"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/content/LanguageProvider";
import type {
  HeaderContent,
  UiContent,
  SearchEntry,
} from "@/content/global-schemas";
import type { PirateImage } from "@/content/types";
import { Brand } from "./Brand";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { LandlubberToggle } from "./LandlubberToggle";
import { DialogPanel } from "./DialogPanel";
import { SiteSearch } from "./SiteSearch";
import { Icon } from "./Icons";
import { SafeNavLink } from "./SafeNavLink";

type Panel = "menu" | "search" | "quick" | "accessibility" | null;
export function Header({
  content,
  ui,
  images,
  builtRoutes,
  searchEntries,
}: {
  content: HeaderContent;
  ui: UiContent;
  images: PirateImage[];
  builtRoutes: string[];
  searchEntries: SearchEntry[];
}) {
  const { mode } = useLanguage();
  const data = content[mode];
  const t = (key: string) => ui[key][mode];
  const [panel, setPanel] = useState<Panel>(null);
  const [contrast, setContrast] = useState(false);
  const [textSize, setTextSize] = useState<"small" | "normal" | "large">(
    "normal",
  );
  useEffect(() => {
    document.documentElement.dataset.contrast = contrast ? "high" : "normal";
    document.documentElement.dataset.textSize = textSize;
  }, [contrast, textSize]);
  const crest = images.find((image) => image.id === data.brand.imageId);
  if (!crest) throw new Error("Shared header identity image is missing.");
  const close = () => setPanel(null);
  const searchProps = {
    entries: searchEntries,
    mode,
    title: data.search.title,
    placeholder: data.search.placeholder,
    hint: t("searchHint"),
    empty: t("searchEmpty"),
    resultsLabel: t("searchResults"),
    builtRoutes,
    onNavigate: close,
    buttonLabel: data.search.buttonLabel,
  };
  const title =
    panel === "menu"
      ? t("menu")
      : panel === "search"
        ? data.search.title
        : panel === "accessibility"
          ? data.accessibility.heading
          : data.quickHeading;
  function accessibilityAction(id: string) {
    if (id === "changeColor") setContrast((value) => !value);
    else if (id === "btn-increase") setTextSize("large");
    else if (id === "btn-decrease") setTextSize("small");
    else if (id === "btn-orig") setTextSize("normal");
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("skip")}
      </a>
      <header className="site-header" data-section="global-header">
        <div className="site-topbar">
          <div className="shell-container topbar-inner">
            <span className="hidden md:block">{t("sourceIdentity")}</span>
            <LandlubberToggle
              label={t("language")}
              originalLabel={t("originalMode")}
              pirateLabel={t("pirateMode")}
            />
          </div>
        </div>
        <div className="shell-container site-header-inner grid lg:grid-cols-[var(--header-columns)]">
          <Brand name={t("brand")} slogan={t("slogan")} image={crest} />
          <MegaMenu
            rows={data.desktopRows}
            builtRoutes={builtRoutes}
            label={t("mainNav")}
          />
          <div className="header-actions">
            <button
              type="button"
              className="icon-button"
              aria-label={t("openSearch")}
              aria-haspopup="dialog"
              onClick={() => setPanel("search")}
            >
              <Icon kind="search" />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label={t("quickLinks")}
              aria-haspopup="dialog"
              onClick={() => setPanel("quick")}
            >
              <Icon kind="links" />
            </button>
            <button
              type="button"
              className="icon-button mobile-menu-toggle lg:hidden"
              aria-label={t("menu")}
              aria-haspopup="dialog"
              onClick={() => setPanel("menu")}
            >
              <Icon kind="menu" />
            </button>
          </div>
        </div>
      </header>
      <nav className="social-rail hidden lg:flex" aria-label={t("socialNav")}>
        {data.socialLinks.map((item, index) => (
          <SafeNavLink
            key={item.id}
            href={item.href}
            builtRoutes={builtRoutes}
            className="social-link"
          >
            <span aria-hidden="true">{["X", "in", "ig", "f", "▶"][index]}</span>
            <span className="sr-only">{item.label}</span>
          </SafeNavLink>
        ))}
      </nav>
      <button
        type="button"
        className="accessibility-toggle icon-button"
        aria-label={t("accessibility")}
        aria-haspopup="dialog"
        onClick={() => setPanel("accessibility")}
      >
        <Icon kind="accessibility" />
      </button>
      <DialogPanel
        open={panel !== null}
        title={title}
        closeLabel={data.search.closeLabel}
        onClose={close}
      >
        {panel === "menu" ? (
          <>
            <SiteSearch {...searchProps} />
            <MobileNav
              items={data.mobileItems}
              builtRoutes={builtRoutes}
              onNavigate={close}
              label={t("mainNav")}
            />
          </>
        ) : null}
        {panel === "search" ? <SiteSearch {...searchProps} /> : null}
        {panel === "quick" ? (
          <>
            <Brand name={t("brand")} slogan={t("slogan")} image={crest} />
            <nav aria-label={data.quickHeading} className="quick-link-panel">
              <ul>
                {data.quickLinks.map((item) => (
                  <li key={item.id}>
                    <SafeNavLink
                      href={item.href}
                      builtRoutes={builtRoutes}
                      onNavigate={close}
                    >
                      {item.label}
                    </SafeNavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        ) : null}
        {panel === "accessibility" ? (
          <div className="accessibility-controls">
            {data.accessibility.controls.map((control) =>
              control.href ? (
                <SafeNavLink
                  key={control.id}
                  href={control.href}
                  builtRoutes={builtRoutes}
                  onNavigate={close}
                >
                  {control.label}
                </SafeNavLink>
              ) : (
                <button
                  key={control.id}
                  type="button"
                  className="plain-button"
                  aria-pressed={
                    control.id === "changeColor"
                      ? contrast
                      : control.id === "btn-increase"
                        ? textSize === "large"
                        : control.id === "btn-decrease"
                          ? textSize === "small"
                          : textSize === "normal"
                  }
                  onClick={() => accessibilityAction(control.id)}
                >
                  {control.label}
                </button>
              ),
            )}
          </div>
        ) : null}
      </DialogPanel>
    </>
  );
}
