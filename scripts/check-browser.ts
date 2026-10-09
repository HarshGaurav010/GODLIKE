import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
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
    for (const width of [375, 768, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`${baseUrl}/${slug}?from=about-history`);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      if (checks.length === 0) {
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          content.title.pirate,
        );
        await expect(
          page.getByRole("button", { name: "Pirate", exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
      }
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
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
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
      const originalAccessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(originalAccessibility.violations).toEqual([]);
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        content.title.original,
      );
      checks.push({
        slug,
        width,
        ...dimensions,
        toggleAndPersistence: "passed",
        automatedAccessibility: "passed in both modes",
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
    .getByRole("link", { name: "What happened to the documents? →" })
    .click();
  await expect(page).toHaveURL(`${baseUrl}/davy-jones-locker`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Davy Jones’ Locker",
  );
  await page.getByRole("link", { name: "Back to the home port →" }).click();
  await expect(page).toHaveURL(`${baseUrl}/`);
  // The homepage is built (task 2); the source /home alias redirects to it.
  await page.goto(`${baseUrl}/home`);
  await expect(page).toHaveURL(`${baseUrl}/`);
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
    "Passed 10 route/viewport checks, both language modes, reload/cross-route persistence, keyboard controls, local actions and /home alias.",
  );
} finally {
  await browser.close();
}
