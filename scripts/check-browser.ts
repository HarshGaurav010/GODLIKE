import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { loadPage } from "../src/content/loaders";

const baseUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const failures: string[] = [];
page.on("pageerror", (error) => failures.push(error.message));
const checks: object[] = [];

try {
  await mkdir("artifacts/setup", { recursive: true });
  for (const slug of ["uncharted", "davy-jones-locker"]) {
    const content = loadPage(slug);
    for (const width of [375, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`${baseUrl}/${slug}?from=about-history`);
      expect(response?.status()).toBe(200);
      await page.getByRole("button", { name: "Pirate", exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        content.title.pirate,
      );
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        page: document.documentElement.scrollWidth,
        main: document.querySelectorAll("main").length,
        h1: document.querySelectorAll("h1").length,
        brokenImages: Array.from(document.images).filter(
          (img) => !img.complete || img.naturalWidth === 0,
        ).length,
        outsideLinks: Array.from(
          document.querySelectorAll<HTMLAnchorElement>("a"),
        ).filter((anchor) => anchor.origin !== location.origin).length,
      }));
      expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.main).toBe(1);
      expect(dimensions.h1).toBe(1);
      expect(dimensions.brokenImages).toBe(0);
      expect(dimensions.outsideLinks).toBe(0);
      await page.screenshot({
        path: `artifacts/setup/${slug}-${width}.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Landlubber", exact: true })
        .click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        content.title.original,
      );
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        content.title.original,
      );
      checks.push({
        slug,
        width,
        ...dimensions,
        toggleAndPersistence: "passed",
      });
    }
  }
  // Keyboard focus, cross-route persistence and real local action destinations.
  await page.goto(`${baseUrl}/uncharted`);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("button", { name: "Pirate", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Here Be Dragons",
  );
  await page
    .getByRole("link", { name: "Inspect the missing scrolls →" })
    .click();
  await expect(page).toHaveURL(`${baseUrl}/davy-jones-locker`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Davy Jones’ Locker",
  );
  await page
    .getByRole("link", { name: "Back to chartin’ the waters →" })
    .click();
  await expect(page).toHaveURL(`${baseUrl}/uncharted`);
  await page.goto(baseUrl);
  await expect(page).toHaveURL(`${baseUrl}/uncharted?from=home`);
  expect(failures).toEqual([]);
  await writeFile(
    "artifacts/setup/browser-checks.json",
    JSON.stringify(
      {
        checks,
        keyboard: "passed",
        localActions: "passed",
        rootRedirect: "passed",
        pageErrors: failures,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Passed 8 route/viewport checks, both language modes, reload/cross-route persistence, keyboard controls, local actions and root redirect.",
  );
} finally {
  await browser.close();
}
