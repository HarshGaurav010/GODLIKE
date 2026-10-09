import test from "node:test";
import assert from "node:assert/strict";
import {
  pageSchema,
  sameShape,
  imageManifestSchema,
} from "../src/content/schemas";
import { loadPage } from "../src/content/loaders";
import { resolveLink } from "../src/content/links";
import {
  extractImages,
  normalizeDocument,
  validateSourceUrl,
} from "../scripts/lib/scrape-cache";

test("recursive bilingual validation rejects missing fields, array entries and changed primitive types", () => {
  const value = {
    nested: { title: "Title", cards: [{ number: 1926, text: "Test" }] },
  };
  assert.equal(
    sameShape(value, {
      nested: { title: "Ahoy", cards: [{ number: 1926, text: "Scroll" }] },
    }),
    true,
  );
  assert.equal(
    sameShape(value, { nested: { title: "Ahoy", cards: [] } }),
    false,
  );
  assert.equal(
    sameShape(value, {
      nested: { title: "Ahoy", cards: [{ number: "1926", text: "Scroll" }] },
    }),
    false,
  );
  const page = structuredClone(loadPage("uncharted"));
  delete page.sections[0].pirate.heading;
  assert.equal(pageSchema.safeParse(page).success, false);
});

test("duplicate section and image IDs are rejected", () => {
  const page = loadPage("uncharted");
  assert.equal(
    pageSchema.safeParse({
      ...page,
      sections: [...page.sections, page.sections[0]],
    }).success,
    false,
  );
  const image = {
    id: "test-image",
    page: "home",
    section: "hero",
    originalAlt: "",
    role: "hero",
    width: 1920,
    height: 720,
    prompt: "Test",
    alt: "A friendly pirate ship",
    file: "/images/pirate/home/test-image.webp",
    status: "todo",
  };
  assert.equal(imageManifestSchema.safeParse([image, image]).success, false);
});

test("link routing protects documents, logins, subsites and unsafe protocols", () => {
  for (const href of [
    "https://people.iitism.ac.in/~academics",
    "https://other.example/",
    "/storage/file.pdf",
    "/login",
    "javascript:alert(1)",
    "mailto:example@example.com",
    "//other.example",
  ]) {
    assert.equal(
      resolveLink(href, ["/director"], "home"),
      "/davy-jones-locker",
      href,
    );
  }
  assert.equal(
    resolveLink("https://www.iitism.ac.in/director", ["/director"]),
    "/director",
  );
  assert.equal(
    resolveLink("/library", [], "about-history"),
    "/uncharted?from=about-history",
  );
  assert.equal(
    resolveLink("/home-mba", [], "space & slash/"),
    "/uncharted?from=space%20%26%20slash%2F",
  );
  assert.equal(resolveLink("#status"), "#status");
  assert.equal(resolveLink("/davy-jones-locker"), "/davy-jones-locker");
});

test("scrape guard rejects out-of-scope and encoded document/login URLs", () => {
  assert.equal(
    validateSourceUrl("https://www.iitism.ac.in/about-history"),
    "https://www.iitism.ac.in/about-history",
  );
  for (const url of [
    "https://people.iitism.ac.in/",
    "http://www.iitism.ac.in/",
    "https://www.iitism.ac.in/login",
    "https://www.iitism.ac.in/storage/test.pdf",
    "https://www.iitism.ac.in/file%2epdf",
    "https://www.iitism.ac.in/faculty-portal",
    "https://www.iitism.ac.in/search?query=test",
  ]) {
    assert.throws(() => validateSourceUrl(url), Error, url);
  }
});

test("SDK, structured MCP and text MCP caches normalize without a network request", () => {
  const doc = { markdown: "Hello", html: "<main>Hello</main>", links: [] };
  assert.deepEqual(normalizeDocument(doc), doc);
  assert.deepEqual(normalizeDocument({ structuredContent: doc }), doc);
  assert.deepEqual(
    normalizeDocument({
      content: [{ type: "text", text: JSON.stringify(doc) }],
    }),
    doc,
  );
  assert.throws(() => normalizeDocument({ success: false, data: doc }));
});

test("image inventory includes CSS backgrounds, excludes comments and preserves location", () => {
  const manifest = extractImages(
    `<section id="hero"><img src="/banner.png" alt="Building" width="1920" height="720"><!-- <img src="/old.png"> --><div style="background-image:url('/card.png')"></div></section>`,
    "https://www.iitism.ac.in/",
  );
  assert.equal(manifest.images.length, 2);
  assert.equal(manifest.images[0].width, 1920);
  assert.equal(manifest.images[0].height, 720);
  assert.equal(manifest.images[0].section, "hero");
  assert.equal(manifest.images[1].rendering, "css-background");
  assert.equal(manifest.images[1].width, null);
});
