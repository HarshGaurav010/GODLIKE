# IIT (ISM) Dhanbad — pirate parody

Phase 1 uses Next.js App Router, strict TypeScript, Tailwind CSS, token-based parchment styles and validated bilingual JSON. Follow [AGENTS.md](AGENTS.md), [the plan](docs/PLAN.md) and [the progress tracker](docs/PROGRESS.md).

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. During setup, the root temporarily redirects to /uncharted?from=home. The actual homepage is a later task. Available routes: /uncharted and /davy-jones-locker.

```sh
npm run lint
npm run test
npm run build
npm run format:check
```

Content validation runs before every build. To repeat browser verification, start the app, install Chromium with `npx playwright install chromium`, then run `npm run check:browser`. Screenshots and the report are saved under ignored artifacts/setup.

## Content and styles

- content/pages: one JSON per page, original and pirate section data.
- Utility pages use sourceKind: authoredUtility. Their original text is authored plain-language UI, not text extracted from the institution.
- content/global/ui.json: paired shared utility labels. Header and footer source datasets belong to the next task.
- content/glossary.json: mappings copied from AGENTS.md. Brand rendering reads this glossary.
- content/images.json: replacement image inventory, currently empty because setup pages contain no images.
- content/image-style.txt: shared image prompt prefix.
- src/styles/tokens.css: all visual values. next/font supplies Source Serif 4 and Source Sans 3.
- src/content: Zod validation, filesystem loaders and safe link routing.
- The language mode defaults to Pirate and persists in localStorage. It also works within the current tab if storage is disabled.
- SectionRenderer currently supports richText and cta; add other kinds only when a page needs them.

## Firecrawl source workflow

The connected Firecrawl MCP was used for the map and homepage inspection. Both are cached; setup requires no new request or local API key.

The portable SDK runner uses @mendable/firecrawl-js 4.46.0's `scrape` and `map` methods, including the screenshot format object. For a new SDK scrape, set FIRECRAWL_API_KEY in .env.local. This file is ignored; never commit or print the key.

```sh
npm run scrape -- --map
npm run scrape -- --slug home --url https://www.iitism.ac.in/ --shell
npm run scrape -- --slug about-history --url https://www.iitism.ac.in/about-history
```

A saved cache is reused without network calls or credentials. Re-scraping requires the explicit `--force` flag. Only scrape the page currently being worked on. Do not run the examples for future pages ahead of their task.

The runner accepts public HTML pages on https://www.iitism.ac.in only; rejects PDFs, storage files, login/portal paths, subsites and query URLs; preserves raw responses; and derives markdown, screenshot and image reference inventory. It does not download original images.

The existing homepage screenshot is only 1440 × 1000 despite a full-page request. HTML still includes the lower sections. Recover full-page reference coverage when working on the shell/home, without silently replacing the cache.

## Images

Generate replacements through the available image generation tool when a page is worked on. Prefix every prompt with content/image-style.txt, save optimized local WebP files in public/images/pirate/<slug>, and record dimensions, descriptive alt text and status in content/images.json. Refer to image IDs in page data. Validate local files before rendering with next/image.

Setup contains no generated images, original images, logos, badges or placeholders. The original parody crest belongs to the global shell task.
