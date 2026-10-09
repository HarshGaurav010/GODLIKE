import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import Firecrawl from "@mendable/firecrawl-js";
import { config } from "dotenv";
import {
  extractImages,
  normalizeDocument,
  validateSourceUrl,
} from "./lib/scrape-cache";

class ScrapeError extends Error {}

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function run() {
  const { values } = parseArgs({
    options: {
      slug: { type: "string" },
      url: { type: "string" },
      map: { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      shell: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(
      "Usage: npm run scrape -- --slug home --url https://www.iitism.ac.in/ --shell\nMap once: npm run scrape -- --map\nExisting caches are reused. --force explicitly re-scrapes.",
    );
    return;
  }
  if (values.map) {
    if (values.url || values.slug || values.shell)
      throw new ScrapeError("--map cannot be combined with page arguments.");
    const file = "scrape/sitemap.json";
    if ((await exists(file)) && !values.force) {
      console.log("Reusing scrape/sitemap.json; no Firecrawl request.");
      return;
    }
    const client = makeClient();
    const result = await client.map("https://www.iitism.ac.in", {
      includeSubdomains: false,
      ignoreQueryParameters: true,
      limit: 5000,
      sitemap: "include",
    });
    await mkdir("scrape/raw", { recursive: true });
    await writeFile(
      "scrape/raw/sitemap-map.json",
      JSON.stringify(result, null, 2) + "\n",
    );
    await writeFile(file, JSON.stringify(result.links, null, 2) + "\n");
    console.log(`Saved ${result.links.length} mapped URLs.`);
    return;
  }
  if (!values.slug || !/^[a-z0-9-]+$/.test(values.slug) || !values.url) {
    throw new ScrapeError(
      "Provide --slug (lowercase letters, numbers and hyphens) and --url; see --help.",
    );
  }
  const sourceUrl = validateSourceUrl(values.url);
  if (values.shell && new URL(sourceUrl).pathname !== "/")
    throw new ScrapeError("--shell is only for the root homepage.");
  const file = path.join("scrape/raw", `${values.slug}.json`);
  let raw: unknown;
  if ((await exists(file)) && !values.force) {
    raw = JSON.parse(await readFile(file, "utf8"));
    console.log(`Reusing ${file}; no Firecrawl request.`);
  } else {
    const client = makeClient();
    raw = await client.scrape(sourceUrl, {
      formats: [
        "markdown",
        "html",
        "links",
        {
          type: "screenshot",
          fullPage: true,
          viewport: { width: 1440, height: 1000 },
        },
      ],
      onlyMainContent: !values.shell,
      maxAge: 0,
      timeout: 60000,
    });
    // Validate before replacing a working cache.
    normalizeDocument(raw);
    await mkdir("scrape/raw", { recursive: true });
    await writeFile(file, JSON.stringify(raw, null, 2) + "\n");
  }
  const doc = normalizeDocument(raw);
  const cachedUrl = doc.metadata?.sourceURL ?? doc.metadata?.url;
  if (
    typeof cachedUrl === "string" &&
    new URL(cachedUrl).href.replace(/\/$/, "") !== sourceUrl.replace(/\/$/, "")
  ) {
    throw new ScrapeError(
      "Requested source URL does not match cached page. Use a different slug.",
    );
  }
  const markdownFile = `scrape/raw/${values.slug}.md`;
  if (values.force || !(await exists(markdownFile)))
    await writeFile(markdownFile, doc.markdown + "\n");
  const imageDirectory = `scrape/images/${values.slug}`;
  await mkdir(imageDirectory, { recursive: true });
  if (values.force || !(await exists(`${imageDirectory}/manifest.json`))) {
    await writeFile(
      `${imageDirectory}/manifest.json`,
      JSON.stringify(extractImages(doc.html, sourceUrl), null, 2) + "\n",
    );
  }
  const screenshotFile = `scrape/screenshots/${values.slug}.png`;
  if (doc.screenshot && (values.force || !(await exists(screenshotFile)))) {
    const screenshotUrl = new URL(doc.screenshot);
    if (screenshotUrl.protocol !== "https:")
      throw new ScrapeError("Firecrawl screenshot URL must use HTTPS.");
    const response = await fetch(screenshotUrl, {
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok)
      throw new ScrapeError(
        "Screenshot download failed; source cache preserved.",
      );
    const bytes = Buffer.from(await response.arrayBuffer());
    if (
      !bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ) {
      throw new ScrapeError(
        "Firecrawl did not return a PNG screenshot; source cache preserved.",
      );
    }
    await mkdir("scrape/screenshots", { recursive: true });
    await writeFile(screenshotFile, bytes);
    console.log(
      `Saved screenshot ${bytes.readUInt32BE(16)} × ${bytes.readUInt32BE(20)}; inspect to confirm full-page coverage.`,
    );
  }
  console.log(`Source artifacts ready for ${values.slug}.`);
}

function makeClient() {
  config({ path: ".env.local", quiet: true });
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey)
    throw new ScrapeError(
      "FIRECRAWL_API_KEY is missing. Add it to .env.local for a live SDK request, or use the connected Firecrawl MCP. Cache reuse needs no key.",
    );
  return new Firecrawl({ apiKey });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  run().catch((error: unknown) => {
    // SDK/HTTP error objects and messages may expose authentication headers.
    console.error(
      error instanceof ScrapeError
        ? error.message
        : "Scrape failed. Check options, cached source format, or the Firecrawl connection; source caches were preserved.",
    );
    process.exitCode = 1;
  });
}
