import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { loadHeader, loadFooter, loadUi } from "../src/content/loaders";

const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:3000";
const header = loadHeader();
const footer = loadFooter();
const ui = loadUi();
const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (error) => errors.push(error.message));
const checks: object[] = [];
await mkdir("artifacts/global", { recursive: true });
try {
  for (const width of [375, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/uncharted`);
    await page.waitForLoadState("networkidle");
    for (const mode of ["pirate", "original"] as const) {
      const t = (key: string) => ui[key][mode];
      await page
        .getByRole("button", {
          name: mode === "pirate" ? "Pirate" : "Landlubber",
          exact: true,
        })
        .click();
      await expect(page.locator("header .brand-wordmark strong")).toHaveText(
        t("brand"),
      );
      await expect(page.locator("footer .brand-wordmark > span")).toHaveText(
        t("slogan"),
      );
      await expect(page).toHaveTitle(new RegExp(t("brand")));
      await expect(page.locator("footer .footer-resources a")).toHaveCount(
        footer[mode].resources.length,
      );
      const menuToggle = page.getByRole("button", {
        name: t("menu"),
        exact: true,
      });
      if (width >= 1280) {
        await expect(menuToggle).toBeHidden();
        for (const row of header[mode].desktopRows) {
          for (const item of row.filter((node) => node.children.length)) {
            const summary = page
              .locator(".desktop-nav summary")
              .filter({ hasText: item.label })
              .first();
            await summary.focus();
            await page.keyboard.press("Enter");
            const dropdown = summary.locator("..");
            await expect(dropdown).toHaveAttribute("open", "");
            await expect(
              page.locator(".desktop-nav details[open]"),
            ).toHaveCount(1);
            const overflow = await page.evaluate(
              () =>
                document.documentElement.scrollWidth >
                document.documentElement.clientWidth,
            );
            expect(overflow).toBe(false);
            await page.keyboard.press("Escape");
            await expect(dropdown).not.toHaveAttribute("open", "");
            await expect(summary).toBeFocused();
          }
        }
        const first = page.locator(".desktop-nav summary").first();
        await first.click();
        await page.mouse.click(width - 8, 300);
        await expect(first.locator("..")).not.toHaveAttribute("open", "");
      } else {
        await expect(page.locator(".desktop-nav")).toBeHidden();
        await menuToggle.click();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await expect(dialog.locator(".mobile-nav > ul > li")).toHaveCount(
          header[mode].mobileItems.length,
        );
        const branch = dialog
          .locator(".mobile-branch")
          .filter({
            has: page.locator("summary", {
              hasText: header[mode].mobileItems.find(
                (item) => item.children.length,
              )!.label,
            }),
          })
          .first();
        await branch.locator(":scope > summary").click();
        await expect(branch).toHaveAttribute("open", "");
        await page.screenshot({
          path: `artifacts/global/menu-${width}-${mode}.png`,
        });
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(menuToggle).toBeFocused();
      }
      await page
        .getByRole("button", { name: t("openSearch"), exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      const input = dialog.getByRole("searchbox");
      await expect(input).toBeFocused();
      await input.fill("unlikely-search-with-no-matches");
      await expect(dialog.getByText(t("searchEmpty"))).toBeVisible();
      await input.fill("Library");
      const results = dialog.getByRole("navigation", {
        name: t("searchResults"),
      });
      await expect(results.getByRole("link").first()).toHaveAttribute(
        "href",
        "/uncharted?from=library",
      );
      await results.getByRole("link").first().click();
      await expect(page).toHaveURL(`${base}/uncharted?from=library`);
      await expect(dialog).not.toBeVisible();
      await page
        .getByRole("button", { name: t("quickLinks"), exact: true })
        .click();
      await expect(dialog.locator(".quick-link-panel a")).toHaveCount(
        header[mode].quickLinks.length,
      );
      await expect(dialog.locator("a[href^='http']")).toHaveCount(0);
      const panelAxe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(panelAxe.violations).toEqual([]);
      await page.keyboard.press("Escape");
      await page
        .getByRole("button", { name: t("accessibility"), exact: true })
        .click();
      const controls = header[mode].accessibility.controls;
      await dialog
        .getByRole("button", {
          name: controls.find((c) => c.id === "btn-increase")!.label,
          exact: true,
        })
        .click();
      expect(await page.locator("html").getAttribute("data-text-size")).toBe(
        "large",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await dialog
        .getByRole("button", {
          name: controls.find((c) => c.id === "btn-orig")!.label,
          exact: true,
        })
        .click();
      await dialog
        .getByRole("button", {
          name: controls.find((c) => c.id === "changeColor")!.label,
          exact: true,
        })
        .click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-contrast",
        "high",
      );
      await dialog
        .getByRole("button", {
          name: controls.find((c) => c.id === "changeColor")!.label,
          exact: true,
        })
        .click();
      await page.keyboard.press("Escape");
      await page.screenshot({
        path: `artifacts/global/shell-${width}-${mode}.png`,
        fullPage: true,
      });
      checks.push({
        width,
        mode,
        menus: "passed",
        search: "passed",
        quickLinks: "passed",
        accessibilityControls: "passed",
        brandAndSlogan: "passed",
      });
    }
  }
  expect(errors).toEqual([]);
  await writeFile(
    "artifacts/global/browser-checks.json",
    JSON.stringify({ checks, errors }, null, 2) + "\n",
  );
  console.log(
    "Passed shared-shell interactions in both modes at 375, 768, 1280, 1440 and 1920px.",
  );
} finally {
  await browser.close();
}
