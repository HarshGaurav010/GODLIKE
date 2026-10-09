import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { loadPage, loadUi } from "../src/content/loaders";

const baseUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:3000";
const home = loadPage("home");
const ui = loadUi();
const browser = await chromium.launch();
const failures: string[] = [];
const checks: object[] = [];

async function audit(reducedMotion: "reduce" | "no-preference") {
  const context = await browser.newContext({ reducedMotion });
  // The intro voyage has its own check (check-motion.ts); start past it here.
  await context.addInitScript(() =>
    sessionStorage.setItem("isle-intro-seen", "1"),
  );
  const page = await context.newPage();
  page.on("pageerror", (error) => failures.push(error.message));
  for (const width of [375, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect((await page.goto(`${baseUrl}/`))?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    for (const mode of ["original", "pirate"] as const) {
      await page
        .getByRole("button", {
          name: mode === "pirate" ? "Pirate" : "Landlubber",
          exact: true,
        })
        .click();
      for (const section of home.sections) {
        const content = section[mode] as Record<string, unknown>;
        if (typeof content.heading === "string") {
          await expect(
            page.locator(`#${section.id}-heading`).first(),
          ).toHaveText(content.heading);
        }
      }
      const result = await page.evaluate(() => ({
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
        h1: document.querySelectorAll("h1").length,
        main: document.querySelectorAll("main").length,
        brokenImages: Array.from(document.images).filter(
          (image) => image.complete && image.naturalWidth === 0,
        ).length,
        externalLinks: Array.from(document.querySelectorAll("a[href]")).filter(
          (a) =>
            new URL((a as HTMLAnchorElement).href).origin !== location.origin,
        ).length,
        originalImages: Array.from(document.images).filter((image) =>
          image.src.includes("iitism.ac.in"),
        ).length,
      }));
      expect(result).toEqual({
        overflow: false,
        h1: 1,
        main: 1,
        brokenImages: 0,
        externalLinks: 0,
        originalImages: 0,
      });
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        ui.brand[mode],
      );
      if (width === 1440) {
        // Load every lazy illustration before auditing and taking the full page.
        for (const image of await page.locator("img").all()) {
          await image.evaluate((el) => el.scrollIntoView({ block: "center" }));
          await expect
            .poll(() =>
              image.evaluate((el) => (el as HTMLImageElement).naturalWidth),
            )
            .toBeGreaterThan(0);
        }
        await page.locator(".event-track").evaluate((el) => {
          el.scrollLeft = 0;
        });
        await page.evaluate(() => window.scrollTo(0, 0));
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        if (axe.violations.length)
          failures.push(
            `${mode} axe: ${axe.violations.map((v) => `${v.id} (${v.nodes.length})`).join(", ")}`,
          );
        await page.screenshot({
          path: `artifacts/home/home-${mode}-${width}-${reducedMotion}.png`,
          fullPage: true,
        });
      }
      checks.push({ width, mode, reducedMotion, ...result });
    }
  }

  // Interactions (pirate mode, desktop).
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole("button", { name: "Next voyage scene", exact: true })
    .click();
  await expect(page.locator(".hero-stage")).toHaveAttribute(
    "data-scene",
    "landscape",
  );
  await expect(page.locator(".hero-stage img")).toHaveAttribute(
    "data-image-id",
    "home-hero-galleon",
  );
  await page
    .getByRole("button", { name: "Next voyage scene", exact: true })
    .click();
  await expect(page.locator(".hero-stage img")).toHaveAttribute(
    "data-image-id",
    "home-academics-deckhand",
  );
  await page
    .getByRole("button", { name: "Next voyage scene", exact: true })
    .click();
  await expect(page.locator(".hero-stage img")).toHaveAttribute(
    "data-image-id",
    "home-hero-galleon-cutout",
  );
  await expect(page.locator(".hero-stage img")).toBeVisible();
  expect(
    await page
      .locator(".hero-stage img")
      .evaluate((el) => (el as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  if (reducedMotion === "no-preference") {
    await page
      .getByRole("button", { name: ui.voyagePause.pirate, exact: true })
      .click();
    expect(
      await page
        .locator(".home-hero-art")
        .evaluate((el) => getComputedStyle(el).animationPlayState),
    ).toBe("paused");
    await page
      .getByRole("button", { name: ui.voyageResume.pirate, exact: true })
      .click();
  } else {
    await expect(page.locator(".hero-motion")).toBeDisabled();
    expect(
      await page
        .locator(".home-hero-art")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
  }
  const board = page.locator(".notice-scroller");
  const toggle = page.locator("#proclamations button");
  if (reducedMotion === "no-preference") {
    await board.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const before = await board.evaluate((el) => el.scrollTop);
    await page.waitForTimeout(1500);
    expect(await board.evaluate((el) => el.scrollTop)).toBeGreaterThan(before);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    const paused = await board.evaluate((el) => el.scrollTop);
    await page.waitForTimeout(800);
    expect(await board.evaluate((el) => el.scrollTop)).toBe(paused);
  } else {
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".stat-value").first()).toHaveText("1717");
  }
  const track = page.locator(".event-track");
  await page.getByRole("button", { name: /Next events/ }).click();
  await page.waitForTimeout(700);
  expect(await track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);

  // Safe link routing.
  // The research cards rise as the band scrolls; finish the rise first.
  await page.locator("#expeditions").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    scrollTo(0, scrollY + rect.bottom - innerHeight * 1.5);
  });
  await expect(
    page.locator("#expeditions [data-slot=domino-gallery]"),
  ).toHaveAttribute("data-progress", "1.000");
  await page
    .locator("#expeditions")
    .getByRole("link", { name: /Read the paper/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/davy-jones-locker$/);
  await page.goto(`${baseUrl}/`);
  await page.locator("#isle-life .utility-action").click();
  await expect(page).toHaveURL(/\/campus-life$/);
  await page.goto(`${baseUrl}/home`);
  await expect(page).toHaveURL(`${baseUrl}/`);
  await context.close();
}

try {
  await mkdir("artifacts/home", { recursive: true });
  await audit("reduce");
  await audit("no-preference");
} finally {
  await browser.close();
  await writeFile(
    "artifacts/home/report.json",
    JSON.stringify({ checks, failures }, null, 2),
  );
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Home passed ${checks.length} width/mode/motion checks, interactions, safe routing and axe (WCAG A/AA) in both modes.`,
);
