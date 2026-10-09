import { chromium, expect, type BrowserContext } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { BARRELS, INTRO } from "../src/components/motion/motion-config";
import { loadUi } from "../src/content/loaders";

const ui = loadUi();

/**
 * Intro voyage and hero barrels: lifecycle, skipping, failure fallbacks,
 * reduced motion, no-JS, containment, pausing and cleanup (desktop widths).
 */
const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
const results: Record<string, unknown> = {};
const failures: string[] = [];
const check = async (name: string, run: () => Promise<unknown>) => {
  try {
    results[name] = (await run()) ?? "passed";
  } catch (error) {
    failures.push(
      `${name}: ${(error as Error).message.split("\n").slice(0, 12).join("\n")}`,
    );
  }
};
const fresh = async (
  options: Parameters<typeof browser.newContext>[0] = {},
): Promise<BrowserContext> => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...options,
  });
  // tsx adds a __name helper to functions passed to the page.
  await context.addInitScript("window.__name = (fn) => fn");
  return context;
};
const shipX = (transform: string) =>
  Number(/translate3d\((-?[\d.]+)px/.exec(transform)?.[1] ?? NaN);

await mkdir("artifacts/motion", { recursive: true });

for (const width of [1440, 1920]) {
  await check(`intro plays, reveals and hands over (${width}px)`, async () => {
    const context = await fresh({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const started = Date.now();
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-intro", "playing");
    await expect(page.locator(".intro-voyage")).toBeVisible();
    const ship = page.locator(".intro-ship");
    const curtain = page.locator(".intro-curtain");
    const samples: number[][] = [];
    for (let i = 0; i < 8; i++) {
      samples.push([
        shipX(await ship.evaluate((el) => el.style.transform)),
        shipX(await curtain.evaluate((el) => el.style.transform)),
      ]);
      await page.waitForTimeout(250);
    }
    const ships = samples.map(([s]) => s).filter((n) => !Number.isNaN(n));
    const seams = samples.map(([, c]) => c).filter((n) => !Number.isNaN(n));
    expect(ships.length).toBeGreaterThan(4);
    // Ship moves left to right; the reveal seam only ever advances.
    ships.slice(1).forEach((x, i) => expect(x).toBeGreaterThan(ships[i]));
    seams
      .slice(1)
      .forEach((x, i) => expect(x).toBeGreaterThanOrEqual(seams[i]));
    await expect(page.locator(".intro-voyage")).toHaveCount(0, {
      timeout: INTRO.durationMs + INTRO.maxWaitForShipMs + 1500,
    });
    const total = Date.now() - started;
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done");
    // The site is interactive straight away.
    await page
      .getByRole("button", { name: ui.originalMode.pirate, exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: ui.originalMode.pirate, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    // Once per tab session.
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
    await expect(page.locator(".intro-voyage")).toBeHidden();
    expect(errors).toEqual([]);
    await context.close();
    return { overlayGoneAfterMs: total };
  });
}

await check("click skips the intro", async () => {
  const context = await fresh();
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.mouse.click(700, 450);
  await expect(page.locator(".intro-voyage")).toHaveCount(0, {
    timeout: INTRO.skipFadeMs + 800,
  });
  await context.close();
});

await check("missing ship image never blocks the site", async () => {
  const context = await fresh();
  await context.route("**/images/pirate/intro/ship.webp", (route) =>
    route.fulfill({ status: 404 }),
  );
  const page = await context.newPage();
  const started = Date.now();
  await page.goto(`${base}/`);
  await expect(page.locator(".intro-voyage")).toHaveCount(0, {
    timeout: INTRO.maxWaitForShipMs + 1000,
  });
  await context.close();
  return { revealedAfterMs: Date.now() - started };
});

await check("stalled script: CSS failsafe uncovers the site", async () => {
  const context = await fresh();
  // Block the app's JavaScript bundles; the pre-paint script still runs.
  await context.route("**/_next/static/chunks/**/*.js", (route) =>
    route.abort(),
  );
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-intro", "playing");
  await page.waitForTimeout(7500);
  const state = await page
    .locator(".intro-voyage")
    .evaluate((el) => getComputedStyle(el).visibility);
  expect(state).toBe("hidden");
  await context.close();
});

await check("no JavaScript: no overlay at all", async () => {
  const context = await fresh({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${base}/`);
  await expect(page.locator(".intro-voyage")).toBeHidden();
  await expect(page.locator("h1")).toBeVisible();
  await context.close();
});

await check("reduced motion: no intro, no barrels", async () => {
  const context = await fresh({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/`);
  await expect(page.locator(".intro-voyage")).toBeHidden();
  await page.waitForTimeout(BARRELS.spawnEveryMs[1] + 1500);
  await expect(page.locator(".hero-barrel")).toHaveCount(0);
  await context.close();
});

await check("barrels: drop, stay contained, never block or cover", async () => {
  const context = await fresh();
  await context.addInitScript(() =>
    sessionStorage.setItem("isle-intro-seen", "1"),
  );
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/`);
  await page.waitForLoadState("networkidle");
  let maxAlive = 0;
  let tallest = 0;
  let seen = 0;
  const problems = new Set<string>();
  const sides = new Set<string>();
  for (let i = 0; i < 170; i++) {
    const frame = await page.evaluate(() => {
      const hero = document
        .querySelector(".home-hero")!
        .getBoundingClientRect();
      const shelf = document
        .querySelector(".hero-bearing")!
        .getBoundingClientRect();
      const barrels = Array.from(document.querySelectorAll(".hero-barrel")).map(
        (b) => b.getBoundingClientRect(),
      );
      const solid = Array.from(
        document.querySelectorAll(".home-hero a, .home-hero button"),
      ).map((el) => el.getBoundingClientRect());
      const hit = (a: DOMRect, b: DOMRect) =>
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top;
      return {
        count: barrels.length,
        sides: barrels.map((b) =>
          b.left + b.width / 2 < innerWidth / 2 ? "left" : "right",
        ),
        heights: barrels.map((b) => b.height),
        overflow: document.documentElement.scrollWidth > innerWidth,
        belowShelf: barrels.some(
          (b) => b.bottom > shelf.top + 4 && b.top > shelf.top - 400,
        ),
        outsideHero: barrels.some(
          (b) => b.left < hero.left - 1 || b.right > hero.right + 1,
        ),
        onControl: barrels.some((b) => solid.some((s) => hit(b, s))),
        pointer: Array.from(
          document.querySelectorAll(".hero-barrels, .hero-barrel"),
        ).some((el) => getComputedStyle(el).pointerEvents !== "none"),
      };
    });
    maxAlive = Math.max(maxAlive, frame.count);
    frame.sides.forEach((side) => sides.add(side));
    tallest = Math.max(tallest, ...frame.heights);
    seen += frame.count ? 1 : 0;
    if (frame.overflow) problems.add("horizontal overflow");
    if (frame.belowShelf) problems.add("barrel sank below its landing line");
    if (frame.outsideHero) problems.add("barrel outside the hero");
    if (frame.onControl) problems.add("barrel over a link or button");
    if (frame.pointer) problems.add("barrel layer takes pointer events");
    await page.waitForTimeout(100);
  }
  expect(seen).toBeGreaterThan(0);
  expect(maxAlive).toBeLessThanOrEqual(BARRELS.maxAlive);
  expect([...sides].sort()).toEqual(["left", "right"]);
  expect([...problems]).toEqual([]);
  // Text in front of barrels: the slogan is still what sits on top.
  const sloganOnTop = await page.evaluate(() => {
    const slogan = document.querySelector(".home-hero-slogan")!;
    const r = slogan.getBoundingClientRect();
    const top = document.elementFromPoint(
      r.left + r.width / 2,
      r.top + r.height / 2,
    );
    return !!top && (top === slogan || slogan.contains(top));
  });
  expect(sloganOnTop).toBe(true);
  await page.screenshot({ path: "artifacts/motion/barrels-check.png" });

  // Pause control freezes them.
  await page
    .getByRole("button", { name: ui.voyagePause.pirate, exact: true })
    .click();
  const before = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".hero-barrel")).map(
      (b) => b.style.transform,
    ),
  );
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".hero-barrel")).map(
      (b) => b.style.transform,
    ),
  );
  expect(after).toEqual(before);
  await page
    .getByRole("button", { name: ui.voyageResume.pirate, exact: true })
    .click();

  // Off-screen: nothing new spawns.
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(400);
  const offscreen = await page.locator(".hero-barrel").count();
  await page.waitForTimeout(BARRELS.spawnEveryMs[1] + 1000);
  expect(await page.locator(".hero-barrel").count()).toBeLessThanOrEqual(
    offscreen,
  );

  // Leaving the page cleans everything up; coming back starts afresh.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.goto(`${base}/uncharted?from=home`);
  await expect(page.locator(".hero-barrel")).toHaveCount(0);
  await page.goBack();
  await page.waitForTimeout(BARRELS.spawnEveryMs[1] + 1500);
  expect(await page.locator(".hero-barrel").count()).toBeLessThanOrEqual(
    BARRELS.maxAlive,
  );
  expect(errors).toEqual([]);
  await context.close();
  return {
    maxAlive,
    framesWithBarrels: seen,
    sides: [...sides],
    tallestBarrelPx: Math.round(tallest),
  };
});

await check("missing barrel image: no barrels, no errors", async () => {
  const context = await fresh();
  await context.addInitScript(() =>
    sessionStorage.setItem("isle-intro-seen", "1"),
  );
  await context.route("**/images/pirate/intro/barrel.webp", (route) =>
    route.fulfill({ status: 404 }),
  );
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/`);
  await page.waitForTimeout(BARRELS.spawnEveryMs[1] + 1500);
  await expect(page.locator(".hero-barrel")).toHaveCount(0);
  expect(errors).toEqual([]);
  await context.close();
});

await check("intro frame rate", async () => {
  const context = await fresh();
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const gaps = await page.evaluate(
    () =>
      new Promise<number[]>((resolve) => {
        const times: number[] = [];
        const tick = (t: number) => {
          times.push(t);
          if (times.length < 120) requestAnimationFrame(tick);
          else resolve(times.slice(1).map((v, i) => v - times[i]));
        };
        requestAnimationFrame(tick);
      }),
  );
  await context.close();
  const sorted = [...gaps].sort((a, b) => a - b);
  return {
    medianFrameMs: Number(sorted[Math.floor(sorted.length / 2)].toFixed(1)),
    worstFrameMs: Number(sorted[sorted.length - 1].toFixed(1)),
  };
});

await browser.close();
await writeFile(
  "artifacts/motion/report.json",
  JSON.stringify({ results, failures }, null, 2),
);
console.log(JSON.stringify(results, null, 2));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Motion checks passed.");
