import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { load } from "cheerio";
import { loadHeader, loadFooter } from "../src/content/loaders";
import type { NavItem } from "../src/content/global-schemas";
import { normalizeDocument } from "../scripts/lib/scrape-cache";

test("shared navigation and footer retain the cached source link labels, order and destinations", () => {
  const doc = normalizeDocument(
    JSON.parse(readFileSync("scrape/raw/home.json", "utf8")),
  );
  const $ = load(doc.html);
  const flatten = (items: NavItem[]): { label: string; href: string }[] =>
    items.flatMap((item) => [
      { label: item.label, href: item.href },
      ...flatten(item.children),
    ]);
  const sourceLinks = (selector: string) =>
    $(selector)
      .toArray()
      .map((a) => ({
        label: $(a).text().replace(/\s+/g, " ").trim(),
        href: $(a).attr("href") ?? "#",
      }));
  const header = loadHeader().original;
  $("header nav").each((i, nav) => {
    assert.deepEqual(
      flatten(header.desktopRows[i]),
      $(nav)
        .find("a")
        .toArray()
        .map((a) => ({
          label: $(a).text().replace(/\s+/g, " ").trim(),
          href: $(a).attr("href") ?? "#",
        })),
    );
  });
  assert.deepEqual(
    flatten(header.quickLinks),
    sourceLinks("#megaModal .modal-body a"),
  );
  assert.deepEqual(
    flatten(header.socialLinks),
    sourceLinks("nav.social-float a"),
  );
  assert.deepEqual(
    flatten(loadFooter().original.resources),
    sourceLinks("footer .foot-link li a"),
  );
  assert.deepEqual(
    flatten(loadFooter().original.actions),
    sourceLinks("footer .btn a"),
  );
  const sourceMobile = $(".stellarnav .accordion-item")
    .toArray()
    .map((item) =>
      $(item)
        .children(".accordion-header")
        .find("a,button")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim(),
    );
  assert.deepEqual(
    header.mobileItems.map((item) => item.label),
    sourceMobile,
  );
});
