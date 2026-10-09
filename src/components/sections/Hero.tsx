"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { heroSchema } from "@/content/section-schemas";
import type { Json } from "@/content/types";
import { useReducedMotion } from "@/components/content/useReducedMotion";
import { PirateFigure } from "./PirateFigure";
import { useSectionContext } from "./SectionContext";
import { HeroBarrels } from "@/components/motion/HeroBarrels";

export function Hero({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = heroSchema.parse(content);
  const { t } = useSectionContext();
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const scenes = [
    {
      image: "home-hero-galleon-cutout",
      label: t("voyageShip"),
      type: "cutout",
    },
    { image: data.imageId, label: t("voyageCampus"), type: "landscape" },
    { image: "home-academics-deckhand", label: t("voyageCrew"), type: "crew" },
  ];
  const brand = t("brand");
  const split = brand.lastIndexOf(" ");
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [paused]);
  function tilt(event: PointerEvent<HTMLDivElement>) {
    const element = stage.current;
    if (!element || reduced || paused || event.pointerType !== "mouse") return;
    const bounds = element.getBoundingClientRect();
    const limit = Number.parseFloat(
      getComputedStyle(element).getPropertyValue("--voyage-tilt-limit"),
    );
    element.style.setProperty(
      "--pointer-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * limit}deg`,
    );
    element.style.setProperty(
      "--pointer-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * -limit}deg`,
    );
  }
  function resetTilt() {
    stage.current?.style.removeProperty("--pointer-x");
    stage.current?.style.removeProperty("--pointer-y");
  }
  return (
    <section
      className="home-hero"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="hero"
    >
      <HeroBarrels />
      <div className="home-hero-panel shell-container">
        <p className="eyebrow">{t("homeIntro")}</p>
        <h1 id={`${id}-heading`}>
          <span className="hero-outline">{brand.slice(0, split)}</span>{" "}
          <span className="hero-solid">{brand.slice(split + 1)}</span>
        </h1>
        <p className="home-hero-slogan">{t("slogan")}</p>
      </div>
      <div className="hero-bearing shell-container">
        <span>
          {t("voyageNumber")} {String(scene + 1).padStart(2, "0")}
        </span>
        <span aria-live="polite">{scenes[scene].label}</span>
      </div>
      <div
        className="hero-stage shell-container"
        ref={stage}
        onPointerMove={tilt}
        onPointerLeave={resetTilt}
        data-scene={scenes[scene].type}
      >
        <div className="hero-orbit" aria-hidden="true" />
        <span className="hero-compass" aria-hidden="true">
          ✦
        </span>
        <span className="hero-coin" aria-hidden="true">
          ✦
        </span>
        <div className="hero-object" key={scene}>
          <PirateFigure
            id={scenes[scene].image}
            sizes="(min-width: 1280px) 800px, 90vw"
            className="home-hero-art"
            priority
          />
        </div>
        <button
          className="hero-step hero-step-prev"
          type="button"
          aria-label={t("voyagePrevious")}
          onClick={() => setScene((scene + scenes.length - 1) % scenes.length)}
        >
          ←
        </button>
        <button
          className="hero-step hero-step-next"
          type="button"
          aria-label={t("voyageNext")}
          onClick={() => setScene((scene + 1) % scenes.length)}
        >
          →
        </button>
      </div>
      <div className="hero-bottom shell-container">
        <a className="hero-board" href="#isle-life">
          {t("voyageExplore")} <span aria-hidden="true">↗</span>
        </a>
        <button
          className="hero-motion"
          type="button"
          disabled={reduced}
          aria-pressed={paused || reduced}
          onClick={() => {
            resetTilt();
            setPaused(!paused);
          }}
        >
          {paused || reduced ? t("voyageResume") : t("voyagePause")}
        </button>
      </div>
      <div className="ranking-groups shell-container">
        {data.rankingGroups.map((group) => (
          <div className="ranking-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.text}>
                  {item.strong ? <strong>{item.text}</strong> : item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="ranking-footnote">{data.footnote}</p>
      </div>
    </section>
  );
}
