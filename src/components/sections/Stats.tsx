"use client";

import { useEffect, useRef, useState } from "react";
import { statsSchema } from "@/content/section-schemas";
import type { Json } from "@/content/types";
import { PirateFigure } from "./PirateFigure";

function durationMs(element: HTMLElement) {
  const value = getComputedStyle(element).getPropertyValue("--duration-count");
  return Number.parseFloat(value) || 0;
}

/** Counts up once when scrolled into view; static with reduced motion. */
function Counter({
  value,
  format,
}: {
  value: number;
  format: "year" | "count";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const total = durationMs(element);
    if (!total) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / total);
        setShown(Math.round(value * (1 - (1 - progress) ** 3)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  const text =
    format === "year" ? String(shown) : shown.toLocaleString("en-IN");
  return (
    <span ref={ref} className="stat-value" aria-hidden="true">
      {text}
    </span>
  );
}

export function Stats({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = statsSchema.parse(content);
  return (
    <section className="home-stats" id={id} data-section-kind="stats">
      <PirateFigure
        id={data.backdropImageId}
        sizes="100vw"
        className="home-stats-backdrop"
        decorative
      />
      <ul className="shell-container stat-list">
        {data.items.map((item) => {
          const exact =
            item.format === "year"
              ? String(item.value)
              : item.value.toLocaleString("en-IN");
          return (
            <li className="stat-card" key={item.iconId}>
              <PirateFigure
                id={item.iconId}
                sizes="56px"
                className="stat-icon"
                decorative
              />
              <span className="stat-text">
                <span className="stat-label">{item.label}</span>
                <Counter value={item.value} format={item.format} />
                <span className="sr-only">{exact}</span>
                {item.note ? (
                  <span className="stat-note">{item.note}</span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
