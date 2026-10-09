import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// The user asked that the site use no real IIT (ISM) Dhanbad data: every
// fact is invented parody (docs/COPY-VOICE.md). Only the disclaimer and the
// pointers to the official website may name the real institute.
const files = [
  ...readdirSync("content/pages").map((f) => path.join("content/pages", f)),
  ...readdirSync("content/global").map((f) => path.join("content/global", f)),
  "content/images.json",
];
const allowed = [
  /Not affiliated with IIT \(ISM\) Dhanbad/g,
  /(?:parody|parodies) of IIT \(ISM\) Dhanbad/g,
  /official IIT \(ISM\) Dhanbad website/g,
  /at IIT \(ISM\) Dhanbad, use the official website/g,
  /www\.iitism\.ac\.in/g,
];
const real =
  /Dhanbad|IIT ?\(ISM\)|Indian School of Mines|\b(?:1926|1901|1964|2016)\b|393 acres|9,071|12,000|Kolkata|Jharkhand|\bQS\b|ONGC|\bIIM\b|\bJEE\b|\bJAM\b|Viceroy|Jasper|Penman|LightsCameraISM|Manthan|KHANAN|INGWC|ABHIKALP|LDCE|411002|WRIS|TEXMiN|Bhilai|Shillong|LRRK2|Unnat|Coal India|\bCIL\b|STQC|Indian National Congress|MHRD/;

function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string")
    return [
      "href",
      "sourceUrl",
      "prompt",
      "originalAlt",
      "role",
      "file",
    ].includes(key)
      ? []
      : [value];
  if (Array.isArray(value)) return value.flatMap((entry) => strings(entry));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, k));
  return [];
}

test("no real college data in visible copy, in either mode", () => {
  for (const file of files) {
    for (const text of strings(JSON.parse(readFileSync(file, "utf8")))) {
      const stripped = allowed.reduce((t, re) => t.replace(re, ""), text);
      assert.doesNotMatch(stripped, real, `${file}: “${text.slice(0, 90)}”`);
    }
  }
});

test("home statistics are invented", () => {
  const home = JSON.parse(readFileSync("content/pages/home.json", "utf8"));
  const stats = home.sections.find((s: { kind: string }) => s.kind === "stats");
  for (const mode of ["original", "pirate"])
    for (const item of stats[mode].items)
      assert.ok(
        ![1926, 9071, 448].includes(item.value),
        `${mode} ${item.label}`,
      );
});
