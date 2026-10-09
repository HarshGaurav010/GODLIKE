import { chromium, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

/**
 * Exhaustive control audit: every link and button on every built page, in
 * both copy modes, at desktop and phone widths. A button must visibly change
 * something; a link must lead to a working local page or an existing anchor;
 * nothing clickable may be covered by another element.
 */
const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:3000";
const routes = [
  "/",
  "/about-overview",
  "/admissions",
  "/departments",
  "/research",
  "/career-development-centre",
  "/campus-life",
  "/administration",
  "/all-active-notices",
  "/contact-information",
  "/safe-harbour",
  "/uncharted?from=home",
  "/davy-jones-locker",
];
const widths = [1440, 1920];
const browser = await chromium.launch();
const failures: string[] = [];
const stats = { links: 0, buttons: 0, covered: 0, pages: 0 };
const checkedHrefs = new Map<string, number>();

async function hrefStatus(href: string) {
  const url = new URL(href, base);
  const key = url.pathname + url.search;
  if (!checkedHrefs.has(key)) {
    const response = await fetch(new URL(key, base), { redirect: "follow" });
    checkedHrefs.set(key, response.status);
  }
  return checkedHrefs.get(key)!;
}

/** A cheap fingerprint of everything a control could plausibly change. */
function snapshot(page: Page) {
  return page.evaluate(() => {
    const attrs = (el: Element) =>
      Array.from(el.attributes)
        .filter(
          (a) => !["style"].includes(a.name) || el === document.documentElement,
        )
        .map((a) => `${a.name}=${a.value}`)
        .join("|");
    const interesting = Array.from(
      document.querySelectorAll(
        "html, [aria-expanded], [aria-pressed], details, dialog, [data-scene], [data-motion], [role=dialog], .event-track, .notice-scroller",
      ),
    ).map(
      (el) =>
        `${el.tagName}:${attrs(el)}:${(el as HTMLElement).scrollLeft}:${(el as HTMLElement).scrollTop}:${(el as HTMLElement).offsetParent ? 1 : 0}`,
    );
    return [
      location.href,
      window.scrollY,
      document.body.innerText.length,
      ...interesting,
    ].join("\n");
  });
}

async function controls(page: Page) {
  return page.evaluate(() =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        "a[href], button, summary, input, select, textarea, [role=button], [tabindex]:not([tabindex='-1'])",
      ),
    ).map((el, index) => {
      el.dataset.auditIndex = String(index);
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        index,
        tag: el.tagName.toLowerCase(),
        name: (
          el.getAttribute("aria-label") ||
          el.textContent ||
          el.getAttribute("title") ||
          ""
        )
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 70),
        href: el.getAttribute("href"),
        visible:
          r.width > 0 &&
          r.height > 0 &&
          style.visibility !== "hidden" &&
          !el.closest("[hidden], [inert], details:not([open]) > :not(summary)"),
        disabled: (el as HTMLButtonElement).disabled === true,
      };
    }),
  );
}

async function coveredBy(page: Page, index: number) {
  return page.evaluate((i) => {
    const el = document.querySelector<HTMLElement>(
      `[data-audit-index="${i}"]`,
    )!;
    el.scrollIntoView({ block: "center", inline: "center" });
    const r = el.getBoundingClientRect();
    const points = [
      [r.left + r.width / 2, r.top + r.height / 2],
      [r.left + 3, r.top + r.height / 2],
      [r.right - 3, r.top + r.height / 2],
    ];
    for (const [x, y] of points) {
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      const hit = document.elementFromPoint(x, y);
      if (hit && hit !== el && !el.contains(hit) && !hit.contains(el)) {
        const label = (h: Element) =>
          `${h.tagName.toLowerCase()}.${String(h.className).split(" ")[0]}`;
        return label(hit.closest("a,button,nav,aside,div,section") ?? hit);
      }
    }
    return null;
  }, index);
}

/** Text that sits underneath fixed/sticky chrome (e.g. the social rail). */
async function textUnderFixedChrome(page: Page) {
  return page.evaluate(async () => {
    const fixed = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((el) => {
        const p = getComputedStyle(el).position;
        // The sticky header and floating accessibility button only pass over
        // text while scrolling; anything else fixed (the social rail) must not.
        return (
          (p === "fixed" || p === "sticky") &&
          el.offsetWidth > 0 &&
          !el.matches(".site-header, .accessibility-toggle")
        );
      })
      .filter((el) => !el.closest("[role=dialog]"));
    const hits = new Set<string>();
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const rects = fixed.map((el) => el.getBoundingClientRect());
      const walker = document.createTreeWalker(
        document.querySelector("main") ?? document.body,
        NodeFilter.SHOW_TEXT,
      );
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const t of Array.from(range.getClientRects())) {
          if (t.bottom < 0 || t.top > innerHeight) continue;
          if (
            rects.some(
              (f) =>
                t.left < f.right &&
                t.right > f.left &&
                t.top < f.bottom &&
                t.bottom > f.top,
            )
          ) {
            hits.add(node.textContent.trim().slice(0, 50));
          }
        }
      }
    }
    window.scrollTo(0, 0);
    return Array.from(hits);
  });
}

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  const context = await browser.newContext({ reducedMotion });
  // The intro voyage has its own check (check-motion.ts); start past it here.
  await context.addInitScript(() =>
    sessionStorage.setItem("isle-intro-seen", "1"),
  );
  // tsx keeps function names with a __name helper that the page lacks.
  await context.addInitScript("window.__name = (fn) => fn");
  const page = await context.newPage();
  page.on("pageerror", (error) => failures.push(`JS error: ${error.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error")
      failures.push(`console error on ${page.url()}: ${msg.text()}`);
  });
  for (const width of widths) {
    if (reducedMotion === "no-preference" && width !== 1440) continue;
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      for (const mode of ["pirate", "original"] as const) {
        await page.goto(base + route);
        await page.waitForLoadState("networkidle");
        await page.evaluate(
          (m) => localStorage.setItem("isle-content-mode", m),
          mode,
        );
        await page.reload();
        await page.waitForLoadState("networkidle");
        stats.pages++;
        const where = `${route} ${mode} ${width}px ${reducedMotion}`;
        for (const text of await textUnderFixedChrome(page)) {
          failures.push(`${where}: text hidden under fixed chrome: "${text}"`);
        }
        const list = await controls(page);
        for (const control of list) {
          const label = `${where}: <${control.tag}> "${control.name}"`;
          if (!control.name) failures.push(`${label} has no accessible name`);
          if (control.tag === "a") {
            stats.links++;
            const href = control.href ?? "";
            if (href.startsWith("#")) {
              const exists = await page.evaluate(
                (id) => !!document.getElementById(id),
                href.slice(1),
              );
              if (!exists)
                failures.push(`${label} points at missing anchor ${href}`);
            } else if (/^https?:/.test(href) && !href.startsWith(base)) {
              failures.push(`${label} leaves the site: ${href}`);
            } else {
              const status = await hrefStatus(href);
              if (status !== 200)
                failures.push(`${label} → ${href} returned ${status}`);
            }
          }
          if (!control.visible || control.disabled) continue;
          const cover = await coveredBy(page, control.index);
          if (cover) {
            stats.covered++;
            failures.push(`${label} is covered by ${cover}`);
          }
        }
        // Click every visible button/summary and require a visible effect,
        // then do the same for every control that the click revealed.
        const isButton = (c: (typeof list)[number]) =>
          (c.tag === "button" || c.tag === "summary") &&
          c.visible &&
          !c.disabled;
        const fresh = async () => {
          await page.goto(base + route);
          await page.waitForLoadState("networkidle");
          return controls(page);
        };
        const press = async (index: number, label: string) => {
          const target = page.locator(`[data-audit-index="${index}"]`);
          if (!(await target.count()) || !(await target.isVisible())) {
            failures.push(`${label} vanished before it could be clicked`);
            return false;
          }
          const before = await snapshot(page);
          try {
            await target.click({ timeout: 3000 });
          } catch (error) {
            failures.push(
              `${label} could not be clicked: ${(error as Error).message.split("\n")[0]}`,
            );
            return false;
          }
          await page.waitForTimeout(700);
          if (before === (await snapshot(page)))
            failures.push(`${label} did nothing visible`);
          return true;
        };
        for (const button of list.filter(isButton)) {
          stats.buttons++;
          const label = `${where}: button "${button.name}"`;
          await fresh();
          // The current mode's own toggle is already pressed; it is a no-op.
          if (
            (mode === "pirate" && button.name === "Pirate") ||
            (mode === "original" && button.name === "Landlubber")
          )
            continue;
          // Controls revealed by the click (menu items, dialog buttons) are
          // found by element, not by index, since opening a panel adds nodes.
          const markSeen = () =>
            page.evaluate(() =>
              document.querySelectorAll("button, summary").forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.width && r.height) el.setAttribute("data-audit-seen", "");
              }),
            );
          const revealed = () =>
            page.evaluateHandle(() =>
              Array.from(
                document.querySelectorAll<HTMLElement>(
                  "button:not([data-audit-seen]), summary:not([data-audit-seen])",
                ),
              ).filter((el) => {
                const r = el.getBoundingClientRect();
                return (
                  r.width > 0 &&
                  r.height > 0 &&
                  !(el as HTMLButtonElement).disabled
                );
              }),
            );
          await markSeen();
          if (!(await press(button.index, label))) continue;
          const count = await (
            await revealed()
          ).evaluate((list) => list.length);
          for (let n = 0; n < count; n++) {
            stats.buttons++;
            await fresh();
            await markSeen();
            await press(button.index, label);
            const el = (
              await (await revealed()).evaluateHandle((list, k) => list[k], n)
            ).asElement();
            if (!el) {
              failures.push(
                `${label}: revealed control #${n} disappeared on reopen`,
              );
              continue;
            }
            const name = (
              await el.evaluate((node) =>
                (
                  node.getAttribute("aria-label") ||
                  node.textContent ||
                  ""
                ).trim(),
              )
            ).slice(0, 60);
            const before = await snapshot(page);
            try {
              await el.click({ timeout: 3000 });
            } catch (error) {
              failures.push(
                `${label} → "${name}" could not be clicked: ${(error as Error).message.split("\n")[0]}`,
              );
              continue;
            }
            await page.waitForTimeout(700);
            if (before === (await snapshot(page)))
              failures.push(`${label} → "${name}" did nothing visible`);
          }
          // Escape must close anything the button opened.
          await fresh();
          await press(button.index, label);
          if (
            await page.locator("[role=dialog]:visible, dialog[open]").count()
          ) {
            await page.keyboard.press("Escape");
            await page.waitForTimeout(200);
            if (
              await page.locator("[role=dialog]:visible, dialog[open]").count()
            )
              failures.push(`${label}: Escape did not close its dialog`);
          }
        }
        // Click each visible link once per page/mode at desktop width.
        if (width === 1440 && reducedMotion === "reduce") {
          const links = list.filter((c) => c.tag === "a" && c.visible);
          for (const link of links) {
            await page.goto(base + route);
            await page.waitForLoadState("networkidle");
            await controls(page);
            const target = page.locator(`[data-audit-index="${link.index}"]`);
            if (!(await target.isVisible())) continue;
            const expected = new URL(link.href!, base + route);
            try {
              if (link.name.startsWith("Skip")) {
                await target.focus();
                await page.keyboard.press("Enter");
              } else await target.click({ timeout: 3000 });
              const want =
                expected.pathname === "/home" ? "/" : expected.pathname;
              await page
                .waitForURL((u) => u.pathname === want, { timeout: 5000 })
                .catch(() => {});
              await page.waitForLoadState("networkidle");
            } catch (error) {
              failures.push(
                `${where}: link "${link.name}" not clickable: ${(error as Error).message.split("\n")[0]}`,
              );
              continue;
            }
            const now = new URL(page.url());
            const okRedirect =
              expected.pathname === "/home" && now.pathname === "/";
            if (now.pathname !== expected.pathname && !okRedirect)
              failures.push(
                `${where}: link "${link.name}" went to ${now.pathname}, expected ${expected.pathname}`,
              );
          }
        }
      }
    }
  }
  await context.close();
}
await browser.close();
await mkdir("artifacts", { recursive: true });
const unique = Array.from(new Set(failures));
await writeFile(
  "artifacts/controls-report.json",
  JSON.stringify(
    { stats, hrefs: Object.fromEntries(checkedHrefs), failures: unique },
    null,
    2,
  ),
);
if (unique.length) {
  console.error(unique.join("\n"));
  console.error(`\n${unique.length} control problems.`);
  process.exit(1);
}
console.log(
  `Controls passed: ${stats.pages} page renders, ${stats.links} links and ${stats.buttons} button clicks, nothing covered, no JS errors.`,
);
