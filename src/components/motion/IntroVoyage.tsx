"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { INTRO } from "./motion-config";

const TAU = Math.PI * 2;
/** Mostly ease-in-out, with enough linear drift that the ship never stalls. */
const ease = (t: number) =>
  0.35 * t + 0.65 * (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * First-visit overlay: the ship sails left to right and the sea behind it is
 * pulled away, revealing the site. A pre-paint script in the root layout sets
 * html[data-intro]; CSS only shows this overlay while it is "playing", and a
 * CSS failsafe hides it even if this script never runs.
 */
export function IntroVoyage() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const ship = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const overlay = root.current;
    const sea = curtain.current;
    const vessel = ship.current;
    if (html.dataset.intro !== "playing" || !overlay || !sea || !vessel) {
      setDone(true);
      return;
    }
    let frame = 0;
    let waitTimer = 0;
    let finished = false;

    function finish(fade: boolean) {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(waitTimer);
      removeSkipListeners();
      html.dataset.intro = "done";
      try {
        if (INTRO.oncePerSession) sessionStorage.setItem(INTRO.storageKey, "1");
      } catch {
        // Private browsing: the intro simply plays again next time.
      }
      if (!fade) return setDone(true);
      overlay!
        .animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: INTRO.skipFadeMs,
          easing: "ease-out",
          fill: "forwards",
        })
        .finished.finally(() => setDone(true));
    }

    function sail() {
      const width = innerWidth;
      const shipWidth = vessel!.offsetWidth;
      const from = -shipWidth;
      const to = width;
      let start = 0;
      const step = (now: number) => {
        start ||= now;
        const elapsed = now - start;
        const t = Math.min(elapsed / INTRO.durationMs, 1);
        const x = from + (to - from) * ease(t);
        const seconds = elapsed / 1000;
        const rock = Math.sin(seconds * TAU * INTRO.rockHz) * INTRO.rockDeg;
        const bob = Math.sin(seconds * TAU * INTRO.bobHz) * INTRO.bobPx;
        // Bow up while accelerating, down while easing off (bow faces right).
        const pitch = -INTRO.pitchDeg * Math.cos(t * Math.PI);
        vessel!.style.transform = `translate3d(${x}px, ${bob}px, 0) rotate(${rock + pitch}deg)`;
        const seam = Math.min(Math.max(x + shipWidth * INTRO.seamAt, 0), width);
        sea!.style.transform = `translate3d(${seam}px, 0, 0)`;
        if (t < 1) frame = requestAnimationFrame(step);
        else finish(false);
      };
      frame = requestAnimationFrame(step);
    }

    const skip = () => finish(true);
    const skipEvents = ["pointerdown", "wheel", "keydown", "touchstart"];
    function removeSkipListeners() {
      skipEvents.forEach((name) => window.removeEventListener(name, skip));
    }
    skipEvents.forEach((name) =>
      window.addEventListener(name, skip, { passive: true }),
    );

    const art = vessel.querySelector("img");
    if (art?.complete && art.naturalWidth > 0) sail();
    else if (art?.complete) finish(false);
    else {
      art?.addEventListener("load", sail, { once: true });
      art?.addEventListener("error", () => finish(false), { once: true });
      waitTimer = window.setTimeout(() => finish(true), INTRO.maxWaitForShipMs);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(waitTimer);
      removeSkipListeners();
      art?.removeEventListener("load", sail);
    };
  }, []);

  if (done) return null;
  return (
    <div className="intro-voyage" ref={root} aria-hidden="true">
      <div className="intro-curtain" ref={curtain}>
        <span className="intro-waves" />
        <span className="intro-waves intro-waves-front" />
      </div>
      <div className="intro-ship" ref={ship}>
        <Image
          src={INTRO.shipSrc}
          alt=""
          width={INTRO.shipWidth}
          height={INTRO.shipHeight}
          sizes="(min-width: 1280px) 44rem, 56vw"
          className="intro-ship-art"
          data-mirror={INTRO.mirrorShip ? "" : undefined}
          draggable={false}
          priority
          unoptimized
        />
        <span className="intro-ship-wake" />
      </div>
    </div>
  );
}
