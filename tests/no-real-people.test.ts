import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// The user asked that no real person appears anywhere on the site
// (docs/COPY-VOICE.md): names become Gold D. Roger, contacts are removed.
const files = [
  ...readdirSync("content/pages").map((f) => path.join("content/pages", f)),
  ...readdirSync("content/global").map((f) => path.join("content/global", f)),
];

function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string")
    return key === "href" || key === "sourceUrl" ? [] : [value];
  if (Array.isArray(value)) return value.flatMap((entry) => strings(entry));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, k));
  return [];
}

test("no honorific-plus-name, email, phone or roll number in visible copy", () => {
  const honorific =
    /\b(?:Prof\.|Dr\.\s|Shri\s|Smt\.|Mr\.\s|Ms\.\s|Lord\s|Swami\s)/;
  const contact = /@|\[at\]|\+91|\b0?326[\s-]?\d{7}\b/;
  const rollNumber = /\b\d{2}(?:DR|JE|MS|MT)\d{4}\b/;
  for (const file of files) {
    for (const text of strings(JSON.parse(readFileSync(file, "utf8")))) {
      assert.doesNotMatch(text, honorific, `${file}: “${text.slice(0, 80)}”`);
      assert.doesNotMatch(text, contact, `${file}: “${text.slice(0, 80)}”`);
      assert.doesNotMatch(text, rollNumber, `${file}: “${text.slice(0, 80)}”`);
    }
  }
});

test("people sections name only Gold D. Roger", () => {
  for (const file of files.filter((f) => f.startsWith("content/pages"))) {
    const page = JSON.parse(readFileSync(file, "utf8"));
    for (const section of page.sections ?? []) {
      for (const mode of ["original", "pirate"]) {
        const content = section[mode];
        const people = [
          ...(content.members ?? []),
          ...(content.person ? [content.person] : []),
          ...(section.variant === "quote" ? [content] : []),
        ];
        for (const person of people)
          assert.equal(person.name, "Gold D. Roger", `${file} ${section.id}`);
      }
    }
  }
});
