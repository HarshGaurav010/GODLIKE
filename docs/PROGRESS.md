# Site progress — structure and Home design

Updated: 9 October 2026 (Asia/Kolkata).

## Current state

Task 0 — Setup is complete. Task 1 — Global shell is implemented from the cached Firecrawl source and ready for review, with one documented footer source gap.
The user selected the name **NO Anchor University** and slogan **no direction full confidence**, overriding the initial glossary identity. Both language modes keep that parody identity visible; the original institutional identity remains in source data for provenance.
The user clarified that this site is mainly for PC. Desktop at 1440 and 1920px is the primary review target; the required 375/768/1280px responsive behavior remains supported.
Task 2.1 — Home is implemented and ready for review. All 20 briefed illustrations plus a transparent galleon hero are generated. The user authorized a Bucks Sauce-inspired visual pass on Home and the shared shell; this is now implemented (see Task 2.2). The root now serves Home; `/home` redirects to `/`. The next page, 3.1 — About overview, waits for the user's approval of Home.

## Source inspection

- Firecrawl map: 460 returned URL records; saved in `scrape/sitemap.json`.
- All 39 source routes explicitly named in AGENTS.md §9 were found in the map.
- The inventory includes 28 PDF URLs and 3 Hindi route records. These were discovered only, not scraped. URL discovery does not prove that every mapped page currently works.
- Only the root homepage was scraped, with `onlyMainContent: false`, markdown, HTML, links and a requested full-page screenshot.
- Root homepage: HTTP 200; 129 extracted link URLs.
- Cache: `scrape/raw/home.json` (full MCP response) and `scrape/raw/home.md`.
- Map response: `scrape/raw/sitemap-map.json`.
- Image reference manifest: `scrape/images/home/manifest.json` — 40 active img occurrences, 27 unique img sources, and 3 additional CSS background images. Commented-out image markup is excluded.
- Screenshot: `scrape/screenshots/home.png`. **Limitation:** Firecrawl returned 1440 × 1000 pixels despite the full-page request; this is an upper-page reference, not a verified full-page image.
- Most source image dimensions are absent from HTML. Manifest values remain null until measured; do not assume an aspect ratio.
- No PDFs, logins, people subsite pages, or other page bodies were scraped. No original image assets were downloaded or shipped.

## Implementation queue

Groups below preserve AGENTS.md ordering. Each route is a separate task with its own report and user approval before advancing.

| Order      | Task                                                                           | Route                                                     | Status                                |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------- |
| 0          | Setup: Next.js, tokens, loaders, scraping tools, glossary, fallback routes     | /uncharted; /davy-jones-locker                            | Complete                              |
| 1          | Global shell: shared header, navigation, toggle, footer, original parody crest | Shared section                                            | Implemented; footer source gap noted  |
| 2.1        | Home                                                                           | /                                                         | Complete; Home design ready to review |
| 3.1        | About                                                                          | /about-overview                                           | Planned; URL mapped                   |
| 3.2        | About                                                                          | /about-history                                            | Planned; URL mapped                   |
| 3.3        | About                                                                          | /vision                                                   | Planned; URL mapped                   |
| 4.1        | Leadership                                                                     | /director                                                 | Planned; URL mapped                   |
| 4.2        | Leadership                                                                     | /chairman                                                 | Planned; URL mapped                   |
| 4.3        | Leadership                                                                     | /deputy-director                                          | Planned; URL mapped                   |
| 4.4        | Leadership                                                                     | /registrar                                                | Planned; URL mapped                   |
| 4.5        | Leadership                                                                     | /deans                                                    | Planned; URL mapped                   |
| 4.6        | Leadership                                                                     | /associate-deans                                          | Planned; URL mapped                   |
| 4.7        | Leadership                                                                     | /hods                                                     | Planned; URL mapped                   |
| 4.8        | Leadership                                                                     | /administration                                           | Planned; URL mapped                   |
| 5.1        | Departments                                                                    | /departments                                              | Planned; URL mapped                   |
| 5.template | Shared department template, after departments index                            | Select one mapped department source when this task begins | Planned                               |
| 6.1        | Admissions & Programmes                                                        | /jeea                                                     | Planned; URL mapped                   |
| 6.2        | Admissions & Programmes                                                        | /phdadmission                                             | Planned; URL mapped                   |
| 6.3        | Admissions & Programmes                                                        | /home-mba                                                 | Planned; URL mapped                   |
| 6.4        | Admissions & Programmes                                                        | /home-m-sc                                                | Planned; URL mapped                   |
| 6.5        | Admissions & Programmes                                                        | /home-ma                                                  | Planned; URL mapped                   |
| 6.6        | Admissions & Programmes                                                        | /executive-masters-programmes                             | Planned; URL mapped                   |
| 6.7        | Admissions & Programmes                                                        | /ai-courses                                               | Planned; URL mapped                   |
| 7.1        | Research                                                                       | /research-cluster                                         | Planned; URL mapped                   |
| 7.2        | Research                                                                       | /center                                                   | Planned; URL mapped                   |
| 7.3        | Research                                                                       | /project-opening                                          | Planned; URL mapped                   |
| 8.1        | Placements                                                                     | /career-development-centre                                | Planned; URL mapped                   |
| 9.1        | Faculty & Staff                                                                | /all-faculty                                              | Planned; URL mapped                   |
| 9.2        | Faculty & Staff                                                                | /staff-and-officers                                       | Planned; URL mapped                   |
| 10.1       | Student life                                                                   | /home-dsw                                                 | Planned; URL mapped                   |
| 10.2       | Student life                                                                   | /library                                                  | Planned; URL mapped                   |
| 10.3       | Student life                                                                   | /geological-museum                                        | Planned; URL mapped                   |
| 11.1       | Notices & Recruitment                                                          | /all-active-notices                                       | Planned; URL mapped                   |
| 11.2       | Notices & Recruitment                                                          | /tenders                                                  | Planned; URL mapped                   |
| 11.3       | Notices & Recruitment                                                          | /facultycareers                                           | Planned; URL mapped                   |
| 11.4       | Notices & Recruitment                                                          | /career-non-faculty                                       | Planned; URL mapped                   |
| 12.1       | Governance & Compliance                                                        | /nirf                                                     | Planned; URL mapped                   |
| 12.2       | Governance & Compliance                                                        | /annual-reports                                           | Planned; URL mapped                   |
| 12.3       | Governance & Compliance                                                        | /right-to-information                                     | Planned; URL mapped                   |
| 12.4       | Governance & Compliance                                                        | /sc-st-cell                                               | Planned; URL mapped                   |
| 12.5       | Governance & Compliance                                                        | /equal-opportunity-cell                                   | Planned; URL mapped                   |
| 12.6       | Governance & Compliance                                                        | /icc-1                                                    | Planned; URL mapped                   |
| 13         | Additional mapped pages selected by the user                                   | To be selected                                            | Backlog                               |

AGENTS.md group numbers remain the source of truth; the row identifiers above only indicate sequential implementation order. The department template belongs immediately after the /departments index, before admissions.

## Additional discovered paths

Leave these in the user-selected backlog: /professor-in-charge, /general-administration, /rules-and-guidelines, /student-verification, /institute-video, /dean-iie, /seminar-1, /online-payment, /ariia-report, /iit-council-data, /minutes-of-bog-meeting, sustainability pages, programme subpages, and departmental newsletters. The map also includes alternate paths such as /home, /history, /vision-and-mission and /faculty-positions. Use actual header targets for navigation; resolve aliases in the relevant page task rather than implementing duplicate pages.

## Task 0 — Setup report

### What was built

- Next.js 16.4.0 App Router, React 19.3.0, strict TypeScript, Tailwind 4, ESLint and Prettier using npm and a lockfile.
- Next.js automatic agent-rule writing is disabled, preserving the user-owned AGENTS.md exactly.
- Prettier normalized table spacing in framework.md; its wording was preserved, and it is now excluded from blanket formatting.
- Token-driven parchment layout, Source Serif 4 and Source Sans 3 via next/font. No Phase 2 effects.
- Static /uncharted and /davy-jones-locker pages. The root temporarily redirects to /uncharted?from=home until Home is implemented.
- Paired authored utility content in content/pages, clearly marked sourceKind: authoredUtility. This is original parody UI, not attributed institutional copy.
- LanguageProvider and LandlubberToggle: default Pirate, localStorage persistence, keyboard-operable pressed buttons.
- RichText, Cta and SectionRenderer components. Other section kinds wait for the page that needs them.
- Zod schemas and content loaders covering all section kinds, deep original/pirate shape parity, unique section/image IDs, glossary validation, local image lookup and build-time validation.
- Centralized safe link routing for built routes, pending internal pages and external/document/login destinations.
- scripts/scrape.ts using the installed SDK's verified scrape/map API; accepts the existing MCP caches, reuses cached data without credentials or network calls, and requires --force for re-scraping.
- Source image inventory extraction supports img and CSS background images. No original image assets are downloaded.
- README with local commands, scraping workflow and image generation workflow. No Git repository was initialized, so no commit was made.

### Verification

- npm run lint: passed with no warnings.
- npm run build: passed; both fallback routes prerender as static pages.
- npm run test: all 6 foundation tests passed (bilingual shape validation, duplicate IDs, safe link routing, scrape guards, MCP/SDK cache normalization, image extraction).
- npm run format:check: passed.
- npm run scrape -- --slug home --url https://www.iitism.ac.in/ --shell: existing cache reused, no API request.
- npm run scrape -- --map: saved sitemap reused, no API request.
- Browser checks: both routes at 375, 768, 1280 and 1440px; no horizontal overflow, one h1/main, no broken images or external links.
- Pirate default, both language modes, reload/cross-route persistence, skip link, keyboard toggle and local action links: passed.
- Automated WCAG A/AA checks with axe: zero violations in both modes at all four widths. This is automated coverage, not a comprehensive manual accessibility certification.
- Browser screenshots and machine-readable report: artifacts/setup (ignored). Mobile and desktop screenshots visually inspected.
- Production dependency audit: zero reported vulnerabilities. Five reported high-severity development dependency findings remain in ESLint's fast-glob/micromatch/braces chain; no patched braces release was available from npm during setup. The SDK's Axios finding was fixed with the patched 1.20.0 override. No forced major-version downgrades were applied.

### New glossary mappings

The original 36 mappings were copied from AGENTS.md. Added 10 authored utility labels:

| Original                                   | Pirate                              |
| ------------------------------------------ | ----------------------------------- |
| Phase 1 · Site under construction          | Phase 1 · Still chartin’ the waters |
| Skip to main content                       | Skip to the main deck               |
| Choose language style                      | Choose yer tongue                   |
| Build status                               | The shipbuilder’s log               |
| This page is still being built             | Here Be Dragons                     |
| A destination for another day              | Beyond the edge o’ the map          |
| About unavailable documents                | Inspect the missing scrolls →       |
| This document is unavailable here          | Davy Jones’ Locker                  |
| External resources are outside this parody | This scroll be lost at sea          |
| Return to the site preview                 | Back to chartin’ the waters →       |

### Favourite pirate lines

- “This stretch o’ The Isle is still uncharted. Our crew be rebuilding the institute one page at a time, with knowledge as the treasure. Mostly.”
- “Yer browser hasn’t sprung a leak. This shore will appear here once the shipbuilders reach it.”
- “Those scrolls stay outside this parody; the kraken has strict filing policies.”
- “The keel be laid. The shared navigation and home port be next on the shipbuilder’s list.”

### Images and uncertainty

No images are needed for setup, so content/images.json is empty. No placeholders or official logos were shipped. The parody crest belongs to the global-shell task. No new ambiguity blocked setup. The previously noted homepage screenshot limitation remains for the shell/home tasks.

## Open items

1. Recover a genuinely full-page layout reference during the global-shell/home task if needed, without silently re-scraping the cached page. Explicit --force is required for a new scrape.
2. Measure image dimensions and classify shared assets versus home-only assets when those tasks begin.
3. The active hero is one animated GIF. Old hero-carousel markup is commented out; do not treat it as active content.
4. The Director's message is attributed speech. Preserve its meaning and real name, and avoid inventing quotes; handle pirate framing outside the attribution.
5. Treat the homepage's STQC badge and QR code as original-site references only. A parody replacement must not suggest the hackathon site is officially audited.
6. The trending section contains a YouTube embed. Route its action to /davy-jones-locker under the external-link policy.
7. The local SDK runner needs FIRECRAWL_API_KEY in .env.local only for new live requests. The connected MCP and existing caches are usable without that local key.

## Task 1 — Global shell report

### What was built

- Reused the existing full-shell Firecrawl cache. No new page bodies, PDFs, logins or subsites were scraped.
- Extracted 12 + 8 desktop navigation groups, 21 mobile groups, 10 modal quick links, 5 social destinations, 6 accessibility controls, 8 footer resources and 2 footer actions into paired JSON. Desktop and mobile retain their different source order and nesting. Desktop is the primary experience, per the latest user instruction.
- Shared SiteShell, Header, MegaMenu, MobileNav, DialogPanel, SiteSearch, SafeNavLink, Brand, Footer and native SVG icons. Existing utility pages now use one shared header and footer.
- Neutral token-driven layout follows the source: identity on the left, two nav rows on desktop, search and quick-link controls on the right, floating social links, a mobile accordion menu and a footer with resources alongside identity/actions/badges. No Phase 2 animation or chaos effects.
- Working native keyboard dropdowns, outside-click and Escape dismissal, focus restoration for modal panels, local navigation search, quick links, contrast and text-size controls. The existing language toggle persists across routes and reloads.
- Unknown internal destinations preserve their source slug in /uncharted?from=...; documents, external resources and login destinations open /davy-jones-locker. No source-site links are shipped as active external anchors.
- New original cartoon skull/book/crossed-pickaxes crest and decorative parrot seal, prepared as four WebP assets with explicit dimensions and source aspect ratios. Assets are approximately 11–31 KB each. No placeholders, real portraits, official emblems, QR codes or certification claims are shipped.
- User branding is read from content/glossary.json: NO Anchor University; no direction full confidence. Header, footer and metadata use the name, and header/footer display the exact slogan.
- Source labels are preserved in content/global/header.json and footer.json. Paired shared schemas and manifest checks run at build time. The website visitor number is an honest dash, not an invented count.
- The final browser run also passed against the production build, including the 1920px PC viewport.
- No new routes or homepage sections were added. Home remains the next task.

### Source and image records

- Source extraction script: scripts/extract-global.ts. Reruns preserve the cumulative glossary additions report.
- Supplementary full browser screenshot: scrape/screenshots/home-browser-full.png, 1440 × 5940. Header/footer crops were inspected alongside the cached screenshot. This browser reference does not replace the Firecrawl content cache.
- Original shared image measurements: scrape/images/global/measurements.json. Original images were fetched for dimensions only and never copied into public.
- Shared source manifest: scrape/images/global/manifest.json. Native accessibility/menu/link/search icons replace UI glyphs; the repeated source identity images use the generated parody crest.
- Prompts: docs/assets/global-crest-prompt.txt and global-parrot-prompt.txt. Derivative preparation: scripts/prepare-global-images.mjs.
- Generated files: global-header-identity.webp (1307 × 304), global-footer-identity.webp (616 × 144), global-parrot-badge.webp (262 × 261), global-treasure-seal.webp (140 × 140).

### Glossary changes

The institute name mapping now reads **NO Anchor University**, and the short-name mapping reads **NO Anchor University / The Isle**, per the user's override. The slogan mapping is **University slogan → no direction full confidence**.

Added 141 global-shell/source-alias and interface mappings; the complete list is in docs/assets/global-glossary-additions.json. Examples: Home → Home Port; Academics → The Learning Deck; Sustainability → Keep the Isle Afloat; Donation → Add to the Treasure Chest; Search → Search the Ship’s Charts; Health Centre → Health Centre — Crew Care. Sensitive support and policy labels retain their clear meaning.

### Verification

- npm run lint, npm run build, npm run test and npm run format:check pass. Seven tests include an independent comparison of cached source link labels/order/URLs against the rendered-content datasets.
- Both utility routes render with one h1/main, no horizontal overflow, no broken images and no external anchors at 375, 768, 1280, 1440 and 1920px.
- Pirate default, both language modes, reload/cross-route persistence, skip link, local actions and root redirect pass.
- Every desktop dropdown, mobile menu groups, search matching in either vocabulary, search empty state, local result navigation, quick links, contrast/text controls, Escape/focus restoration and outside-click dismissal pass at all five widths in both modes.
- Automated axe WCAG A/AA checks report zero violations for the utility pages in both modes and quick-link dialogs. Hover opacity was removed after browser checks exposed reduced text contrast; the mobile search input now has its own full row.
- Screenshots and machine-readable reports: artifacts/setup and artifacts/global (ignored). Mobile/desktop shell and open menus visually inspected. Automated coverage does not constitute a full accessibility certification.

### Favourite pirate lines

- “no direction full confidence” — the user's university slogan.
- “Search the Ship’s Charts”
- “The Plunder Port (Bounty Placements)”
- “Keep the Isle Afloat”
- “Send a Message in a Bottle”

### Remaining uncertainty

The live website includes a government-logo/link strip and extra lower-footer links absent from the cached Firecrawl response. The cached primary footer is implemented; that additional strip is not invented or copied from browser text. A question about an explicit --force Firecrawl refresh remains unanswered. No refresh was performed. This source gap should be resolved when the user chooses refresh; it is not a claim that the entire live footer has been mirrored.

The root /home alias must resolve to / once the Home page is built. The source's active hero is an animated GIF rather than the commented-out carousel; settle the exact Home behavior during its own task.

## Task 2.1 — Home report

Built by Claude Code (per `CLAUDE.md`). Source: cached Firecrawl homepage (`scrape/raw/home.json`); no new scrape or network request to Firecrawl was made. No `.env.local` exists in the project, so no Firecrawl or image API key was available.

### What was built

- Route `/` (static) from `content/pages/home.json`, nine sections in source order: hero + QS ranking strip, Director's message, stats counters, Campus Life, Academics, Research, Important Notices + Events (one shared band, as on the source), What's Trending.
- New section components in `src/components/sections/`: Hero, LeaderMessage (`people`), Stats (count-up once in view; static with reduced motion), CardGrid (`campus`, `academics` variants), NewsList (`research`, `events` carousel variants), NoticeBoard (slow auto-scroll ticker with a pause/play toggle; pauses on hover/focus; off by default with reduced motion), VideoFeature (`gallery:video`), shared SectionHeading, SectionContext and PirateFigure.
- `PirateFigure` renders manifest images; entries with status `todo` show a striped, labelled frame at the final aspect ratio (“Paintin’ in progress. The artist be at sea.”). Swapping in generated art needs no code change: set `status` to `generated` and add the file.
- Sections may now carry an optional `variant`. Per-kind/variant zod schemas live in `src/content/section-schemas.ts`; the content validator parses every section with them and accepts `todo` images (it lists them), while generated/placeholder images still require their file.
- Routing: the root redirect to `/uncharted` was removed; `/home` (the source's alias) redirects to `/`, and source links to `/home` resolve to `/`. The header brand now links to `/`. Search lists Home at `/`.
- The source's Events items link to `#` only, so the parody cards have no link. The source YouTube embed is replaced by a frame that routes to `/davy-jones-locker` (no outside embeds). Its link label is authored, because the source iframe had none.
- Home-specific tokens were added to `tokens.css`; all styles use tokens.
- UI labels added: `artPending`, `homeIntro`.

### Copy decisions

- The Director's message (paragraphs, Sanskrit verse, translation, name) is word-for-word in both modes; the humour sits only in the heading (“A Word from the Cap’n”), a kicker outside the quote and his pirate title. A unit test enforces this.
- Notices keep every identifier (advertisement numbers, PL levels, dates, roll number, venue, time). The not-shortlisted notice and the viva-voce notice carry no joke at anyone's expense.
- Youth Awakening (Swami Vivekananda lecture) and the Parkinson's research card are written respectfully, with only light framing.
- QS ranking numbers are unchanged; the ranking name “QS” is untouched.
- The source tagline “inventivenes s” spacing glitch was normalised to “inventiveness” in `original`.

### Glossary additions (17)

Director’s Message → A Word from the Cap’n; Campus Life → Life on the Isle; More about campus life → More shore-leave stories; Read More → Unroll the Scroll; More about academics → Survey the Learning Deck; Undergraduate → Undergraduate Deck: Fresh Deckhands; Postgraduate → Postgraduate Deck: Seasoned Navigators; Doctoral Degree Programs → Doctoral Voyages: Draw Yer Own Map; More on research → Follow the Treasure Expedition; Important Notices → Proclamations from the Quarterdeck; All Active Notices → All Active Proclamations; Events → Shore Parties; What's Trending → What’s Makin’ Waves; Started in → Set sail in; Medical Officer → Ship’s Surgeon; LDCE promotion → Promotion trial (LDCE); Recruitment → Crew wanted.

### Codex image handoff

Completed by Codex: all 20 handoff images are now generated, plus the transparent hero added for Task 2.2. The following steps record the original handoff. Each image has a prompt beginning with `content/image-style.txt`, the target size (the original's aspect ratio, measured from the source images; the stats backdrop is estimated from the screenshot band), a pirate alt text and a role note. For each:

1. Generate the image from its `prompt` at `width` × `height`, save it as WebP at `public/images/pirate/home/<id>.webp` (ideally under 300 KB).
2. Set `status` to `generated`; adjust `alt` if the result differs from the description.
3. Run `npm run build` and `npm run check:browser`.

Rules carried in every prompt: original characters only, with no copying of or resemblance to existing anime/manga/film/game characters (the user suggested Luffy images; One Piece characters are copyrighted, so a final decision on that rests with the user, and the prompts are written for original “straw-hat-energy” pirates). No real person's likeness (the Director portrait and the event photos become generic cartoon pirates), and no text, logos or emblems.

The stats “Started in” icon reuses the existing `global-treasure-seal` in place of the official logo.

### Verification

- `npm run validate:content`, `npm run lint`, `npm run test` (11 tests, 4 new for Home) and `npm run build` pass.
- `scripts/check-home.ts` (now part of `npm run check:browser`) on the production build: 375/768/1280/1440/1920px × Original/Pirate × reduced/normal motion. It checks for no horizontal overflow, one h1, one main, no broken or original images, no external anchors, and section headings matching each mode. It also covers ticker motion and pause, the carousel's next button, research links → `/davy-jones-locker`, campus links → `/uncharted?from=home-dsw` and `/home` → `/`. Axe WCAG A/AA: zero violations in both modes at 1440px.
- `check-browser.ts` (root expectation updated to the `/home` alias) and `check-shell.ts` still pass.
- Full-page screenshots: `artifacts/home/` (ignored).

### Favourite pirate lines

- “Mineral & Mining: #21 globally, #1 in India — diggin’ be our birthright”
- “Deckhands aboard: 9,071 — parrots not counted”
- “The galley pickles are officially under watch.”
- “Finally, a treasure map that points down instead o’ sideways.”
- “Predict the alloy first, then forge it: the one time this ship has ever planned ahead.”

### Pending questions for the user (not applied)

- Add a clearly labelled “ship’s parrot’s summary” box next to the Director’s message? (Currently not added.)
- Give “QS” a pirate backronym such as “Quite Seaworthy”? (Currently plain.)
- Make Penman Auditorium's “resident ghosts” a recurring gag? (Used once on Home.)
- Luffy/One Piece imagery: see the copyright note above.

## Task 2.2 — Bucks Sauce design and Home image completion

The user explicitly requested the design of https://buckssauce.com/ be applied to our pirate site and made dynamic, authorizing the visual phase for Home and its shared shell. About and later pages remain unbuilt.

### What changed

- Firecrawl inspected Bucks Sauce with markdown, HTML, links, branding and a full-page screenshot request. The cache lives in `scrape/raw/bucks-design.*`; the screenshot URL is retained in the JSON. Live browser inspection confirmed the outlined/solid condensed headline, cream-on-black palette, floating product over a circle and compact navigation.
- Applied these design patterns with NO Anchor branding, copper and sea-blue accents, Barlow Condensed through next/font, an original campus-galleon, and the existing pirate content. Design values remain in tokens; new CSS is `src/styles/voyage.css`.
- Compact primary navigation retains all source destinations in the All the Decks panel on desktop and mobile. Search, mega menus, language toggle and accessibility controls remain working.
- Three-scene hero, pointer tilt, gently swaying illustrations, spinning decorative stars, scroll arrivals and hover motion. The visible pause control stops decorative animations; reduced motion disables them. No sound or scroll hijacking.
- Generated all 20 Home handoff images plus the new 1536 × 1024 transparent galleon. All 21 are WebP, exact manifest sizes and below 300,000 bytes. No Home todos, placeholders, real-person likenesses or official images remain. Final generation briefs/source filenames: `docs/assets/home-generation-records.json`. Preparation script: `scripts/prepare-home-images.mjs`.
- Director message and sensitive content retained; the previous optional copy suggestions remain pending.

### Assets and remaining uncertainty

`docs/BUCKS-DESIGN.md` contains exact asset specs. No additional assets are required for the implemented design. Optional Lottie/Rive ship and parrot loops and a silent campus animation have precise specs for later. The reference uses a proprietary font; our implementation uses Barlow Condensed.

### New glossary entries

- Explore campus life → Board the Isle
- Pause decorative motion → Batten down the motion
- Resume decorative motion → Let the ship sway
- Meet the students → Good books. Questionable navigation.

### Favourite lines

- “Welcome aboard. Mind the missing anchor.”
- “Good books. Questionable navigation.”
- “Batten down the motion”

### Verification

- `npm run lint`, `npm test` (11 tests), content validation and `npm run build` pass.
- Production browser checks cover 375/768/1280/1440/1920px, both copy modes, normal/reduced motion, safe links, shared menus/search/accessibility, all hero scenes, pause control, event carousel and notice ticker. Axe WCAG A/AA reports zero violations in both modes.
- Every Home WebP was checked for exact dimensions, bytes and alpha where required. Browser screenshot/audit loads all lazy images; no broken images or horizontal overflow.
- Screenshots and browser reports are in ignored `artifacts/home/` and `artifacts/global/`.

## Production deployment — 9 October 2026

- Live site: https://no-anchor-university.vercel.app
- Vercel project: `vinayaks-projects-febcfc10/no-anchor-university`.
- Deployment: `dpl_452Cpx4k5ANncVE9tFriJ9fEJ8Di`, production status READY. Deployed the Home implementation from Git commit `40baaef` with `vercel.json` explicitly selecting Next.js and `npm run build`.
- The first deployment used the generic framework preset and returned 404; corrected the project preset to Next.js and redeployed successfully.
- Vercel's production build and content validation passed. Public, unauthenticated checks returned HTTP 200 for `/`, `/uncharted`, `/davy-jones-locker` and the `/home` redirect.
- Production browser verification at 1440px passed: hero scenes, motion pause, both copy modes, all 25 image assets, lazy image rendering, no horizontal overflow and no browser errors. Screenshot and report are in ignored `artifacts/vercel/`.
- `.vercelignore` excludes environment files, local tool configuration, build artifacts and reference images/screenshots. Local project linkage is in ignored `.vercel/`.
- Deployment uses the Vercel CLI; GitHub automatic deployments are not configured. Future production deployment: `npx vercel@latest deploy --prod --yes` from the linked repository.
