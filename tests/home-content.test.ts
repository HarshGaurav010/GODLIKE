import { test } from "node:test";
import assert from "node:assert/strict";
import { loadImages, loadPage } from "../src/content/loaders";
import { resolveLink } from "../src/content/links";
import {
  sectionContentSchemas,
  sectionSchemaKey,
} from "../src/content/section-schemas";

test("home sections match their kind/variant schemas in both modes", () => {
  const home = loadPage("home");
  for (const section of home.sections) {
    const schema =
      sectionContentSchemas[sectionSchemaKey(section.kind, section.variant)];
    assert.ok(schema, `${section.id} has a schema`);
    schema.parse(section.original);
    schema.parse(section.pirate);
  }
});

test("the director's attributed message is never rewritten", () => {
  const message = loadPage("home").sections.find((s) => s.kind === "people");
  assert.ok(message);
  for (const key of ["paragraphs", "verse", "verseTranslation"]) {
    assert.deepEqual(message.pirate[key], message.original[key]);
  }
  assert.equal(
    (message.pirate.person as { name: string }).name,
    (message.original.person as { name: string }).name,
  );
});

test("the source /home alias and the source root resolve to the built homepage", () => {
  assert.equal(resolveLink("https://www.iitism.ac.in/home", ["/"]), "/");
  assert.equal(resolveLink("https://www.iitism.ac.in/#", ["/"]), "/");
  assert.equal(
    resolveLink("https://www.iitism.ac.in/home", []),
    "/uncharted?from=home",
  );
});

test("every home image is in the manifest with the shared style and original-character rule", () => {
  const images = loadImages().filter((image) => image.page === "home");
  assert.ok(images.length > 0);
  for (const image of images) {
    assert.match(image.file, /^\/images\/pirate\/home\//);
    // Art the user supplied themselves (e.g. One Piece) is exempt.
    if (!image.prompt.includes("user-supplied"))
      assert.match(image.prompt, /do not copy or resemble any existing/);
  }
});
