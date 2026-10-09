"use client";

import { useEffect, useRef, useState } from "react";
import { noticeBoardSchema } from "@/content/section-schemas";
import type { Json } from "@/content/types";
import { SafeNavLink } from "@/components/layout/SafeNavLink";
import { useReducedMotion } from "@/components/content/useReducedMotion";
import { useSectionContext } from "./SectionContext";

/** Slowly scrolling notice list, like the source ticker; pausable. */
export function NoticeBoard({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = noticeBoardSchema.parse(content);
  const { builtRoutes } = useSectionContext();
  const box = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // "auto" follows the motion preference until the visitor chooses.
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const [held, setHeld] = useState(false);
  const playing = choice === "play" || (choice === "auto" && !reduceMotion);

  useEffect(() => {
    const element = box.current;
    if (!element || !playing || held) return;
    const speed =
      Number.parseFloat(
        getComputedStyle(element).getPropertyValue("--notice-scroll-speed"),
      ) || 0;
    let frame = 0;
    let last = performance.now();
    let offset = element.scrollTop;
    const tick = (now: number) => {
      offset += (speed * (now - last)) / 1000;
      last = now;
      if (offset >= element.scrollHeight - element.clientHeight) offset = 0;
      element.scrollTop = offset;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, held]);

  return (
    <section
      className="notice-board"
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-kind="noticeBoard"
    >
      <div className="notice-board-top">
        <h2 id={`${id}-heading`}>{data.heading}</h2>
        <button
          type="button"
          className="plain-button"
          aria-pressed={!playing}
          onClick={() => setChoice(playing ? "pause" : "play")}
        >
          {playing ? data.pauseLabel : data.playLabel}
        </button>
      </div>
      <div
        className="notice-scroller"
        ref={box}
        tabIndex={0}
        aria-labelledby={`${id}-heading`}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <ol>
          {data.items.map((item) => (
            <li key={item.href}>
              <SafeNavLink href={item.href} builtRoutes={builtRoutes}>
                {item.text}
              </SafeNavLink>
            </li>
          ))}
        </ol>
      </div>
      <SafeNavLink
        className="utility-action"
        href={data.more.href}
        builtRoutes={builtRoutes}
      >
        {data.more.label} <span aria-hidden="true">→</span>
      </SafeNavLink>
    </section>
  );
}
