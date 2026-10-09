"use client";

import * as React from "react";

/*
 * Domino cards: a row of cards that lie back and rise upright one after
 * another as the section is scrolled through (scroll back up and they lie
 * down again). Adapted from the 21st.dev DominoGallery for text cards: each
 * child is one card, so cards can hold headings and links instead of images.
 * Visual values (perspective, shadow, colours) live in tokens.css.
 */
export interface DominoGalleryProps {
  /** One child per card. */
  children: React.ReactNode[];
  /** Extra scroll distance, in pixels, over which the whole row rises. */
  scrollLength?: number;
  /** Angle the resting cards lean back, in degrees. */
  standAngle?: number;
  /** Rise and fall on their own while nobody scrolls. */
  autoplay?: boolean;
  /** Milliseconds for one autoplay rise (the fall takes the same). */
  autoplayDuration?: number;
  /** Content kept above the cards inside the sticky stage, e.g. a heading. */
  header?: React.ReactNode;
  className?: string;
  /** Accessible name for the card list. */
  label?: string;
}

const OVERLAP = 0.45;
/** Progress starts when the section top is this far down the viewport. */
const START_AT_VIEWPORT = 0.55;
/** Cards are fully upright after this share of the sticky travel. */
const FINISH_AT_TRAVEL = 0.8;
const IDLE_BEFORE_AUTOPLAY_MS = 3500;
const AUTOPLAY_HOLD_MS = 1400;

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

// Gravity, then a short bounce: the card accelerates and overshoots by 6%
// before settling.
function rise(t: number) {
  if (t < 0.72) {
    const u = t / 0.72;
    return u * u;
  }
  const u = (t - 0.72) / 0.28;
  return 1 + 0.06 * Math.sin(u * Math.PI) * (1 - u);
}

function cardProgress(progress: number, index: number, count: number) {
  if (count <= 1) return clamp01(progress);
  const window = 1 / (1 + OVERLAP * (count - 1));
  const start = index * window * OVERLAP;
  return clamp01((progress - start) / window);
}

export function DominoGallery({
  children,
  scrollLength = 900,
  standAngle = 94,
  autoplay = false,
  autoplayDuration = 2600,
  header,
  className,
  label,
}: DominoGalleryProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const live = React.useRef({
    shown: -1,
    lastScrollAt: -Infinity,
    auto: { t: 0, dir: 1, hold: 0 },
    raf: 0,
    last: 0,
  });
  const count = children.length;

  React.useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReducedMotion(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);
    return () => motion.removeEventListener("change", onMotion);
  }, []);

  const paint = React.useCallback(
    (progress: number) => {
      const s = live.current;
      const rounded = Math.round(progress * 1000) / 1000;
      if (rounded === s.shown) return;
      s.shown = rounded;
      rootRef.current?.setAttribute("data-progress", rounded.toFixed(3));
      for (let i = 0; i < count; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const t = rise(cardProgress(rounded, i, count));
        // --fall lives on the slot so the card and its floor shadow share it.
        card.parentElement?.style.setProperty(
          "--fall",
          String(Math.round(t * 1000) / 1000),
        );
        card.style.transform = `rotateX(${standAngle * (1 - t)}deg)`;
      }
    },
    [count, standAngle],
  );

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const s = live.current;
    s.shown = -1;
    if (reducedMotion) {
      // Reduced motion: a plain, static row of upright cards.
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "";
        card.parentElement?.style.removeProperty("--fall");
      });
      root.setAttribute("data-progress", "1.000");
      return;
    }

    const scrollProgress = () => {
      const rect = root.getBoundingClientRect();
      const lead = window.innerHeight * START_AT_VIEWPORT;
      const travel = Math.max(1, rect.height - window.innerHeight);
      return clamp01((lead - rect.top) / (lead + travel * FINISH_AT_TRAVEL));
    };

    const frame = (now: number) => {
      s.raf = 0;
      const dt = s.last ? Math.min(now - s.last, 80) : 16;
      s.last = now;
      let target: number;
      let keepGoing = false;
      const fromScroll = scrollProgress();
      if (autoplay && now - s.lastScrollAt > IDLE_BEFORE_AUTOPLAY_MS) {
        const a = s.auto;
        if (a.hold > 0) a.hold -= dt;
        else {
          a.t = clamp01(a.t + (dt / autoplayDuration) * a.dir);
          if (a.t === 1 || a.t === 0) {
            a.dir *= -1;
            a.hold = AUTOPLAY_HOLD_MS;
          }
        }
        target = a.t;
        keepGoing = true;
      } else {
        target = fromScroll;
        s.auto.t = fromScroll;
        s.auto.dir = fromScroll >= 0.999 ? -1 : 1;
        keepGoing = autoplay;
      }
      paint(target);
      if (keepGoing && !document.hidden) s.raf = requestAnimationFrame(frame);
      else s.last = 0;
    };
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      s.lastScrollAt = performance.now();
      kick();
    };
    // Paint synchronously first so the row never flashes upright.
    paint(scrollProgress());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    kick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", kick);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.last = 0;
    };
  }, [paint, autoplay, autoplayDuration, reducedMotion]);

  return (
    <div
      ref={rootRef}
      data-slot="domino-gallery"
      data-motion={reducedMotion ? "static" : "scroll"}
      className={["domino-gallery", className].filter(Boolean).join(" ")}
      style={
        reducedMotion
          ? undefined
          : ({
              "--domino-scroll-length": `${scrollLength}px`,
            } as React.CSSProperties)
      }
    >
      <div className="domino-stage">
        {header}
        <ul className="domino-row" aria-label={label}>
          {children.map((child, index) => (
            <li className="domino-slot" key={index}>
              <div
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="domino-card"
                data-card
              >
                {child}
              </div>
              <span aria-hidden="true" className="domino-shadow" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DominoGallery;
