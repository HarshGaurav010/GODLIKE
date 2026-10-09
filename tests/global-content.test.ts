import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { loadHeader, loadFooter, loadUi } from "../src/content/loaders";

test("navigation is the short merged map, with every primary item present", () => {
  for (const mode of ["original", "pirate"] as const) {
    const header = loadHeader()[mode];
    assert.ok(header.nav.length <= 12, "the menu stays short");
    for (const item of header.nav) {
      assert.equal(item.children.length, 0, `${item.id} has no sub-menu`);
      assert.match(item.href, /^\//, `${item.id} links to a local route`);
    }
    for (const id of header.primaryIds) {
      assert.ok(
        header.nav.some((item) => item.id === id),
        `${id} is in the nav`,
      );
    }
    for (const item of loadFooter()[mode].resources) {
      assert.match(item.href, /^\//, `${item.id} links to a local route`);
    }
  }
});

test("the footer keeps the exact parody disclaimer", () => {
  const notice =
    "A parody made for a hackathon. Not affiliated with IIT (ISM) Dhanbad. No real ships were harmed.";
  assert.deepEqual(loadUi().notice, { original: notice, pirate: notice });
});

test("pirate copy uses plain English, not pirate dialect", () => {
  // The user asked for a pirate premise without dialect (docs/COPY-VOICE.md).
  const dialect =
    /\b(ye|yer|matey|arr+|ahoy|yo-ho|cap'n|cap’n)\b|\bo['’] |\w+in['’](?=\s|$|[.,!?])/i;
  const files = [
    "content/glossary.json",
    ...["global", "pages"].flatMap((dir) =>
      readdirSync(`content/${dir}`).map((file) => `content/${dir}/${file}`),
    ),
  ];
  for (const file of files) {
    const visit = (value: unknown, pirate: boolean): void => {
      if (typeof value === "string") {
        if (pirate) assert.doesNotMatch(value, dialect, `${file}: “${value}”`);
      } else if (Array.isArray(value)) {
        value.forEach((entry) => visit(entry, pirate));
      } else if (value && typeof value === "object") {
        for (const [key, entry] of Object.entries(value))
          visit(entry, pirate || key === "pirate" || key === "seo");
      }
    };
    visit(JSON.parse(readFileSync(file, "utf8")), false);
  }
});
