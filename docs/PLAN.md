# Build plan — IIT (ISM) Dhanbad, as built by Pirates

Source of truth: [AGENTS.md](../AGENTS.md). Prepared on 9 October 2026.
Source website: https://www.iitism.ac.in/
Progress and per-route queue: [PROGRESS.md](PROGRESS.md).

## Scope and stopping points

Phase 1 builds the real information architecture, readable pirate copy, replacement images, responsive structure and functioning interactions in a neutral parchment draft. Phase 2 visual design and chaos effects wait for the user's direction.

Do setup first, then one shared shell task, then one page per task. The multi-page categories in AGENTS.md are ordering groups, not permission to build several pages at once. Stop after each task, report the result and wait for the user before advancing.

This planning task inspected sources and wrote the plan. It does not mark setup or any page as implemented.

## What the inspection established

Firecrawl returned 460 URL records. All 39 explicitly queued source routes occur in that inventory; no queue substitutions are necessary at this stage. This is an indexed inventory, not an exhaustive crawl or verification of all route responses.

The homepage scrape contains the complete HTML structure and markdown, including duplicate desktop/mobile navigation. Use those two presentations to build one shared navigation dataset with separate desktop and mobile renderers. Ignore commented-out HTML when extracting active sections.

### Global shell

The desktop header has two rows of links, an institute identity area, search and a quick-link modal. Mobile uses nested accordion navigation with search. Shared utilities include accessibility controls and social links.

The main groups are Admission, Alumni, Centres, CE&O, Department, Faculty, Officers & Staff, Students, Sustainability, The Institute, Academics, Research, Innovation, International Relations, Faculty & Staff Opening, Placement and Centenary Events. The Institute has Overview, Administration and Reports subgroups; Admission has UG, PG and PhD entries. Preserve individual labels, ordering and nesting from the source data when implementation starts.

The footer contains eight quick links/resources, an identity area, Donation and Contact actions, an audit badge/QR area and User Visit label. A separate quick-link modal includes policies, tenders, RTI, anti-ragging, cells and museum links. All real logos, seals and certification imagery need original parody replacements.

### Homepage order from active HTML

| Position | Source block                                               | Proposed Section kinds and structure                                  |
| -------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| 1        | Animated banner GIF and QS rankings bands                  | hero + marquee/table; keep sourced rankings recognisable              |
| 2        | Director's Message, Prof. Sukumar Mishra, portrait         | richText/people; generic pirate portrait                              |
| 3        | Started in, Students, Faculty                              | stats; HTML targets are 1926, 9071 and 448                            |
| 4        | Campus Life, intro/CTA and three story cards               | cardGrid, three columns on desktop                                    |
| 5        | Academics intro/CTA, illustration and UG/PG/Doctoral tiles | cardGrid with supporting illustration                                 |
| 6        | Research intro/CTA and four research cards                 | cardGrid, four columns on desktop                                     |
| 7        | Important Notices and Events, paired columns               | noticeBoard + newsList/gallery; 15 notices and four events            |
| 8        | What's Trending and video embed                            | cta; preserve context and use the locker route for the external video |
| 9        | Shared footer                                              | Global footer dataset, rendered only once                             |

The banner's earlier carousel and several popup/testimonial blocks are commented out. The active events block has carousel markup. Rankings use event-bar/event-item bands rather than active carousel markup. Confirm ticker behavior when working on Home; do not infer animation solely from a CSS class. Use accessible controls for any reproduced movement.

Markdown shows stats as zero before the source counter script runs. Extract data-countto values from HTML instead. These figures are source content captured on the inspection date, not independently verified institutional statistics.

## Task 0 — Setup

1. Scaffold the latest stable Next.js App Router + strict TypeScript project using npm. Keep the existing instructions, scrape cache and documents. Configure Tailwind, ESLint and Prettier, with working lint/build commands.
2. Create src/styles/tokens.css for parchment, ink, a single accent, next/font-backed body/display families, spacing, sizes, radii, shadows, breakpoints and motion. Components consume tokens; later design work changes tokens and variants.
3. Create content/glossary.json faithfully from AGENTS.md §6, and content/image-style.txt with the shared illustration prefix.
4. Implement src/content/types.ts, Zod schemas and loaders. Validate required fields, supported section kinds and recursive original/pirate shape parity, including arrays and nested objects. Validate at build time; generated pages load validated data.
5. Establish image-manifest validation and lookup by ID. Track original references, prompts, dimensions, pirate alt text, local files and status in content/images.json. Enforce local pirate assets for rendered page images.
6. Add scripts/scrape.ts with page URL/slug options, cache reuse and explicit --force handling. Use the available Firecrawl MCP for current source inspection; a portable SDK runner can support local per-page work using FIRECRAWL_API_KEY in .env.local. Inspect the installed SDK API before writing calls. Preserve existing MCP response caches or normalize their wrapper without refetching.
7. The script requests markdown, HTML, links and full-page screenshot; stores required files; inventories img and CSS background assets; rejects unsupported PDFs/logins/subsites; runs requests sequentially. Reuse the saved map instead of mapping again.
8. Centralize link routing: built internal pages → their routes; pending internal pages → /uncharted?from=<source-slug>; external URLs, files and logins → /davy-jones-locker. Hash-only menu parents are buttons; legitimate local anchors stay local. Keep the original destination in source content for provenance.
9. Build /uncharted and /davy-jones-locker as deliberate local fallback pages with paired original/pirate UI strings. These are authored parody utility pages, not scraped institutional content. Preserve the exact parody disclaimer.
10. Verify lint/build, schema validation and fallback pages at 375, 768, 1280 and 1440px. Report setup and stop.

## Task 1 — Global shell

Reuse scrape/raw/home.json. Extract active desktop/mobile navigation, search, accessibility utility labels, quick-link modal and footer data into content/global/header.json and footer.json.

Implement semantic header/nav/footer, keyboard-usable mega-menu and mobile accordion, visible focus states, Escape dismissal and focus handling. Share navigation data across both views. Search should operate on the local built-page index rather than sending people to the original institution. Preserve the source entry point.

Add Landlubber ↔ Pirate mode, default Pirate, persisted through cookie or localStorage. Keep shell and page language state consistent. Add an original skull/pickaxes/book crest and replace all shared original graphics. Keep labels readable and never imply official certification.

Generate replacements through the available image generation capability with the shared style. Preserve aspect ratio, use next/image with dimensions and sizes, and save optimized local WebP files. Use correctly sized placeholders only if generation is unavailable, and report them.

Check all four widths, menu/search/toggle behavior, safe route destinations, required parody footer, image integrity and lint/build. Report 3–5 favourite lines, glossary additions, placeholders and unresolved issues, then stop.

## Task 2 onward — One page per task

1. Load cached source if present; otherwise scrape only the selected page with Firecrawl.
2. Extract every active heading, paragraph, card, list item, table cell and action label into the original data. Record provenance, section ordering and image roles.
3. Write shape-matched pirate data using the glossary. Keep numbers, names, procedures and sensitive guidance intact. New glossary terms are saved and included in the report.
4. Measure source image aspect ratios without shipping original assets. Generate humorous role-matched replacements; use generic friendly portraits for real people. Add descriptive pirate alt text.
5. Add only the section components needed for that page. Use a section renderer and thin static route; leave data attributes/variant hooks for Phase 2.
6. Confirm all visible strings switch language, all image IDs resolve locally, and all links follow the centralized routing policy.
7. Run lint/build and browser checks at 375, 768, 1280 and 1440px. Inspect keyboard interactions, overflow, headings, contrast, reduced motion and image loading.
8. Update PROGRESS.md, report what changed, 3–5 favourite lines and uncertainties, then wait for the user.

## Questions to resolve in the relevant task

- The screenshot is only 1440 × 1000 despite requesting fullPage. Recover a full-page reference or inspect lower sections in a browser when layout work begins. Do not silently force a re-scrape.
- Most image dimensions are absent; measure them before generating replacements.
- Director's attributed message and its quoted Sanskrit line require respectful handling. Pirate framing must not create a new statement attributed to him.
- Programme aliases and department variations need inspection one at a time. Pick the first department source at the template task rather than scraping all departments now.
- No UI, glossary rewrites or art direction beyond AGENTS.md defaults have been approved in this planning task.
