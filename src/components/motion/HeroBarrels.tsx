"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/content/useReducedMotion";
import { BARRELS } from "./motion-config";

type Barrel = {
  art: HTMLImageElement;
  shadow: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  w: number;
  h: number;
  minX: number;
  maxX: number;
  grounded: boolean;
  tumble: boolean;
  bounces: number;
  squash: number;
  restAt: number | null;
};

type Span = [number, number];

const random = (min: number, max: number) => min + Math.random() * (max - min);
const DEG = 180 / Math.PI;

/** Subtract blocked ranges from [from, to], returning the free spans. */
function freeSpans(from: number, to: number, blocked: Span[]): Span[] {
  let spans: Span[] = [[from, to]];
  for (const [a, b] of blocked) {
    spans = spans.flatMap(([s, e]): Span[] =>
      b <= s || a >= e
        ? [[s, e]]
        : (
            [
              [s, a],
              [b, e],
            ] as Span[]
          ).filter(([l, r]) => r - l > 0),
    );
  }
  return spans;
}

/**
 * Barrels drop into the hero, bounce, wobble or tumble, rest, then fade away.
 * They render behind the hero's text and controls, land only in gaps beside
 * headings, buttons and the ship, never take pointer events, and run only
 * while the hero is on screen, the intro has finished and motion is allowed.
 */
export function HeroBarrels() {
  const layer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const field = layer.current;
    const hero = field?.parentElement;
    if (reduced || !field || !hero) return;
    const html = document.documentElement;
    let barrels: Barrel[] = [];
    let onScreen = false;
    let loaded = false;
    let frame = 0;
    let spawnTimer = 0;
    let last = 0;
    /** Landing line, in layer pixels; refreshed whenever a barrel spawns. */
    let floor = 0;
    /** Alternate drops between the left and right of the hero. */
    let nextSide: "left" | "right" = Math.random() < 0.5 ? "left" : "right";

    const running = () =>
      loaded &&
      onScreen &&
      !document.hidden &&
      html.dataset.intro !== "playing" &&
      html.dataset.motion !== "paused";

    function geometry() {
      const box = field!.getBoundingClientRect();
      // Barrels land on the rule under the slogan ("Voyage no."), which is
      // inside the first screen; fall back to the bottom of the hero.
      const shelf = hero!
        .querySelector(".hero-bearing")
        ?.getBoundingClientRect();
      const ground = (shelf ? shelf.top : box.bottom) - box.top;
      const rect = (el: Element) => {
        // Headings and paragraphs: measure the text itself, not the wide
        // block box, so centred lines leave their real side gutters free.
        let r = el.getBoundingClientRect();
        if (el.matches("h1, p")) {
          const glyphs = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const range = document.createRange();
          let l = Infinity;
          let rt = -Infinity;
          while (glyphs.nextNode()) {
            if (!glyphs.currentNode.textContent?.trim()) continue;
            range.selectNodeContents(glyphs.currentNode);
            const t = range.getBoundingClientRect();
            l = Math.min(l, t.left);
            rt = Math.max(rt, t.right);
          }
          if (rt > l) r = new DOMRect(l, r.top, rt - l, r.height);
        }
        return {
          l: r.left - box.left,
          r: r.right - box.left,
          t: r.top - box.top,
          b: r.bottom - box.top,
        };
      };
      const keepOut = Array.from(
        hero!.querySelectorAll(
          "h1, p, a, button, .hero-bearing span, .hero-object img, .hero-object .art-pending",
        ),
      )
        .filter((el) => (el as HTMLElement).offsetWidth > 0)
        .map(rect);
      return { width: box.width, ground, keepOut };
    }

    function spawn() {
      const { width, ground, keepOut } = geometry();
      floor = ground;
      const margin = BARRELS.keepOutMargin;
      const base = Math.min(
        Math.max(width * BARRELS.sizeOfWidth, BARRELS.sizePx[0]),
        BARRELS.sizePx[1],
      );
      const h = base * random(BARRELS.sizeJitter[0], BARRELS.sizeJitter[1]);
      const w = h * BARRELS.aspect;
      const occupied: Span[] = barrels.map((b) => [b.x - b.w, b.x + b.w]);
      const widen = (l: number, r: number): Span => [l - margin, r + margin];
      const from = margin;
      // Prefer a clear column all the way down; otherwise only a clear landing.
      const column = freeSpans(from, width - margin, [
        ...keepOut.filter((k) => k.t < ground).map((k) => widen(k.l, k.r)),
        ...occupied,
      ]);
      const landing = freeSpans(from, width - margin, [
        ...keepOut
          .filter((k) => k.b > ground - h * 1.6 && k.t < ground)
          .map((k) => widen(k.l, k.r)),
        ...occupied,
      ]);
      // Room for the barrel even when it ends up tipped on its side.
      const fits = (spans: Span[]) =>
        spans.filter(([l, r]) => r - l >= h * 1.3);
      const all = fits(column).length ? fits(column) : fits(landing);
      const onSide = all.filter(([l, r]) =>
        nextSide === "left"
          ? (l + r) / 2 < width / 2
          : (l + r) / 2 >= width / 2,
      );
      const options = onSide.length ? onSide : all;
      if (!options.length) return;
      const total = options.reduce((sum, [l, r]) => sum + r - l, 0);
      let pick = Math.random() * total;
      const [minX, maxX] =
        options.find(([l, r]) => (pick -= r - l) <= 0) ?? options[0];
      nextSide = (minX + maxX) / 2 < width / 2 ? "right" : "left";
      const art = document.createElement("img");
      art.src = BARRELS.src;
      art.alt = "";
      art.decoding = "async";
      art.draggable = false;
      art.className = "hero-barrel";
      art.style.width = `${w}px`;
      art.style.height = `${h}px`;
      const shadow = document.createElement("span");
      shadow.className = "hero-barrel-shadow";
      shadow.style.width = `${w * 1.1}px`;
      shadow.style.height = `${w * 0.22}px`;
      field!.append(shadow, art);
      barrels.push({
        art,
        shadow,
        x: random(minX + w / 2, maxX - w / 2),
        y: -h,
        vx: random(-20, 20),
        vy: random(0, 120),
        angle: random(-12, 12),
        spin: random(-BARRELS.fallSpin, BARRELS.fallSpin),
        w,
        h,
        minX,
        maxX,
        grounded: false,
        tumble: Math.random() < BARRELS.tumbleChance,
        bounces: 0,
        squash: 0,
        restAt: null,
      });
    }

    function step(now: number) {
      const dt = Math.min((now - (last || now)) / 1000, 1 / 30);
      last = now;
      const ground = floor;
      barrels = barrels.filter((b) => {
        const rad = b.angle / DEG;
        const half =
          0.5 * (Math.abs(Math.cos(rad)) * b.h + Math.abs(Math.sin(rad)) * b.w);
        if (!b.grounded) {
          b.vy += BARRELS.gravity * dt;
          b.y += b.vy * dt;
          if (b.y + half >= ground) {
            b.y = ground - half;
            const impact = b.vy;
            b.squash = Math.min(impact / 1400, 1) * BARRELS.squash;
            if (impact > BARRELS.minBounceSpeed) {
              b.vy = -impact * BARRELS.restitution;
              b.bounces += 1;
              if (b.bounces === 1) {
                const direction = b.x < (b.minX + b.maxX) / 2 ? 1 : -1;
                if (b.tumble)
                  b.vx =
                    direction *
                    random(BARRELS.tumbleSpeed[0], BARRELS.tumbleSpeed[1]);
                else
                  b.spin += (Math.random() < 0.5 ? -1 : 1) * BARRELS.wobbleKick;
              }
            } else {
              b.vy = 0;
              b.grounded = true;
            }
          }
        } else {
          b.y = ground - half;
          if (b.tumble && Math.abs(b.vx) > 25) {
            // Roll: rotation follows the distance travelled.
            b.spin = (b.vx / half) * DEG;
            const slowed = Math.abs(b.vx) - BARRELS.rollFriction * dt;
            b.vx = Math.sign(b.vx) * Math.max(slowed, 0);
          } else {
            b.vx *= Math.exp(-8 * dt);
            const target = Math.round(b.angle / 90) * 90;
            b.spin +=
              (-BARRELS.settleStiffness * (b.angle - target) -
                BARRELS.settleDamping * b.spin) *
              dt;
            if (Math.abs(b.spin) < 4 && Math.abs(b.angle - target) < 0.6) {
              b.angle = target;
              b.spin = 0;
              b.restAt ??= now;
            }
          }
        }
        b.angle += b.spin * dt;
        b.x += b.vx * dt;
        const turned = b.angle / DEG;
        const halfW =
          0.5 *
          (Math.abs(Math.cos(turned)) * b.w + Math.abs(Math.sin(turned)) * b.h);
        if (b.x - halfW < b.minX) {
          b.x = b.minX + halfW;
          b.vx = Math.abs(b.vx) * 0.45;
        } else if (b.x + halfW > b.maxX) {
          b.x = b.maxX - halfW;
          b.vx = -Math.abs(b.vx) * 0.45;
        }
        b.squash *= Math.exp(-14 * dt);
        const fading =
          b.restAt === null
            ? 0
            : Math.min(
                Math.max((now - b.restAt - BARRELS.restMs) / BARRELS.fadeMs, 0),
                1,
              );
        if (fading >= 1) {
          b.art.remove();
          b.shadow.remove();
          return false;
        }
        const s = b.squash;
        // Fade and shrink in place, keeping the base on the landing line.
        const shrink = 1 - fading * 0.35;
        b.art.style.opacity = String(1 - fading);
        b.art.style.transform = `translate3d(${b.x - b.w / 2}px, ${b.y - b.h / 2 + half * (s + 1 - shrink)}px, 0) scale(${(1 + s) * shrink}, ${(1 - s) * shrink}) rotate(${b.angle}deg)`;
        const lift = Math.max(ground - (b.y + half), 0);
        const near = Math.max(1 - lift / 420, 0.3);
        b.shadow.style.opacity = String(near * 0.55 * (1 - fading));
        b.shadow.style.transform = `translate3d(${b.x - b.w * 0.55}px, ${ground - b.w * 0.11}px, 0) scale(${near})`;
        return true;
      });
      frame = barrels.length && running() ? requestAnimationFrame(step) : 0;
      if (!frame) last = 0;
    }

    function scheduleSpawn(delay: number) {
      window.clearTimeout(spawnTimer);
      spawnTimer = window.setTimeout(() => {
        if (!running()) return;
        if (barrels.length < BARRELS.maxAlive) spawn();
        if (barrels.length && !frame) frame = requestAnimationFrame(step);
        scheduleSpawn(random(BARRELS.spawnEveryMs[0], BARRELS.spawnEveryMs[1]));
      }, delay);
    }

    /** Start or stop everything whenever any gating condition changes. */
    function sync() {
      if (running()) {
        if (barrels.length && !frame) frame = requestAnimationFrame(step);
        if (!spawnTimer) scheduleSpawn(BARRELS.firstDropDelayMs);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        window.clearTimeout(spawnTimer);
        spawnTimer = 0;
      }
    }

    function clear() {
      barrels.forEach((b) => {
        b.art.remove();
        b.shadow.remove();
      });
      barrels = [];
    }

    const preload = new Image();
    preload.onload = () => {
      loaded = true;
      sync();
    };
    preload.src = BARRELS.src;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    visibility.observe(hero);
    const flags = new MutationObserver(sync);
    flags.observe(html, {
      attributes: true,
      attributeFilter: ["data-intro", "data-motion"],
    });
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(clear, 150);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);

    return () => {
      preload.onload = null;
      cancelAnimationFrame(frame);
      window.clearTimeout(spawnTimer);
      window.clearTimeout(resizeTimer);
      visibility.disconnect();
      flags.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync);
      clear();
    };
  }, [reduced]);

  return <div className="hero-barrels" ref={layer} aria-hidden="true" />;
}
