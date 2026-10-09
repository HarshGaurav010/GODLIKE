# Site progress — structure and Home design

Updated: 9 October 2026 (Asia/Kolkata).

## Current state

Task 0 — Setup is complete. Task 1 — Global shell is implemented from the cached Firecrawl source and ready for review, with one documented footer source gap.
The user selected the name **NO Anchor University** and slogan **no direction full confidence**, overriding the initial glossary identity. Both language modes keep that parody identity visible; the original institutional identity remains in source data for provenance.
The user clarified that this site is mainly for PC. Desktop at 1440 and 1920px is the primary review target; the required 375/768/1280px responsive behavior remains supported.
Task 3 (9 October 2026) cut the site to 10 merged pages + Safe Harbour and rewrote all copy without pirate dialect; see the queue below. Task 2.1 — Home is implemented and ready for review. All 20 briefed illustrations plus a transparent galleon hero are generated. The user authorized a Bucks Sauce-inspired visual pass on Home and the shared shell; this is now implemented (see Task 2.2). The root now serves Home; `/home` redirects to `/`. The next page, 3.1 — About overview, waits for the user's approval of Home.

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

## Implementation queue (cut down 9 October 2026)

The user found the site had far too many destinations: 92 desktop nav links, 97 mobile links, 10 quick links, 5 social links and 8 footer links, almost all leading to `/uncharted`. They approved cutting it to **10 merged pages + one Safe Harbour page**. Everything else is removed from the nav, footer and queue. The old 40-route queue no longer applies.

| Order | Page                            | Route                      | Merges                                                                                                                       | Status                                                 |
| ----- | ------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1     | Home ("Home Port")              | /                          | —                                                                                                                            | Built; copy rewritten                                  |
| 2     | About ("Our Story")             | /about-overview            | overview, history, vision & mission                                                                                          | Planned                                                |
| 3     | Admissions ("Join the Crew")    | /admissions                | JEE/UG, PG (M.Tech, MBA, M.Sc, MA, executive), PhD, AI courses                                                               | Planned                                                |
| 4     | Departments ("The Crews")       | /departments               | departments index (no per-department pages)                                                                                  | Planned                                                |
| 5     | Research ("Treasure Hunting")   | /research                  | research clusters, centres, project openings                                                                                 | Planned                                                |
| 6     | Placements ("Hired Hands")      | /career-development-centre | —                                                                                                                            | Planned                                                |
| 7     | Campus Life ("Life on Board")   | /campus-life               | student welfare, hostels, library, Geological Museum, fests                                                                  | Planned                                                |
| 8     | Leadership ("Who’s Steering")   | /administration            | chairman, director, deputy director, registrar, deans, HoDs                                                                  | Planned                                                |
| 9     | Notices ("Notices on the Mast") | /all-active-notices        | notices, tenders, faculty/staff openings                                                                                     | Planned                                                |
| 10    | Contact ("Message in a Bottle") | /contact-information       | —                                                                                                                            | Planned                                                |
| 11    | Safe Harbour                    | /safe-harbour              | anti-ragging, ICC, SC/ST cell, Equal Opportunity cell, RTI, health centre; plain guidance, light framing in the heading only | Planned (authored merged route; no single source slug) |

**Removed for good:** alumni portal and insurance, CE&O, In Media, institute video, sustainability subpages (MoTA, CSM, rainwater, waste), innovation, international relations, centenary events and seminar, 17 departmental newsletters, faculty portal/handbook/forms, ARK portal, online payment, Professor In-Charge, General Administration, statutes, the 1961 Act, IIT Council data, BoG minutes, ARIIA, NIRF, annual reports, CVO, BIS corner, policy, the separate leadership/about pages, foreign-student fees, Study in India, student verification, contingency rules, GJLT booking and IInvenTiv. Links to them are gone from the site.

Phones: the user asked for no phone work and no phone-width checks. Desktop (1280/1440/1920) is the only review target.

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

## Task 3 — Site audit, cut-down and copy rewrite (9 October 2026)

The user asked for a complete audit: "the copy sucks and there are too many options and subsites". Their answers:

- **Size:** about 10 merged pages, plus one plain Safe Harbour page for the support cells.
- **Voice:** "not very tough to understand… pirate tone… funny… don't use pirate dialects at all". Recorded in `docs/COPY-VOICE.md`.
- **Home:** remove the floating social bar and the quick-links popup. I decided to also drop the empty trending-video section and trim the notices.

### What changed

- **Header:** `content/global/header.json` is now one flat `nav` of 11 items plus `primaryIds`. The desktop row shows five: Our Story, Join the Crew, Treasure Hunting, Hired Hands, Life on Board. The menu panel ("The Whole Map") lists all 11 with no sub-menus. Every href is a local route; unbuilt ones still resolve to `/uncharted`.
- **Removed:** the desktop two-row mega-menu data, the 97-item mobile tree, the quick-links popup, the floating social rail, the Hindi/English accessibility links and the "User Visit: —" footer counter. Their CSS and the uncommitted rail-gutter rules are gone too.
- **Footer:** four resources (notices, campus tour, admissions, Safe Harbour). The Donation and Contact buttons stay; Contact now points to `/contact-information`.
- **Home:**
  - The empty "What's Trending" video section is removed.
  - Notices are cut from 15 to 8 (dropped one duplicate Medical Officer notice, four of five LDCE promotions, TEXMiN and the not-shortlisted list).
  - Campus links now go to `/campus-life`, "more academics" to `/departments`, and "more research" to `/research`.
- **Copy:** every pirate string in the shell, footer, UI labels, Home, `/uncharted` and `/davy-jones-locker` is rewritten without dialect. The Director's message stays word for word.
- **Glossary:** rebuilt from 208 to 90 entries. All dialect is removed (Cap'n → Captain, o' → of, and so on), stale nav entries are dropped, and current labels are added.
- **Tests and checks:** the obsolete source-mirroring nav test is replaced with tests for the short nav, the exact disclaimer and no dialect in pirate copy. The browser checks now read labels from content, and `tsconfig.json` excludes the ignored `artifacts/` copy.
- **Schema:** the CTA schema accepts `/` as an href.

### New or changed glossary terms

Our Story (About), The Crews (Departments), Treasure Hunting (Research), Hired Hands (Placements), Life on Board (Campus Life), Who’s Steering (Administration), Notices on the Mast (Notices), Message in a Bottle (Contact), Safe Harbour (help & support), The Whole Map (Menu), Useful Maps (Quick Links), Captain (Commodore of the Fleet) (Director), Search the map / Where are we going? (search), Stop the ship rocking / Let the ship rock (motion controls).

### Verification

- `npm run build`, `npm run lint` and `npm test` (13 tests) pass.
- `check-browser`, `check-shell` and `check-home` pass against the production build, including axe WCAG A/AA in both modes.
- At 1280/1440/1920 the header nav has no overflow and doesn't overlap the brand in either mode. Six primary items overflowed at 1440, so the row is five.

### Open

- Penman Auditorium's "resident ghosts" is used once; whether to make it recurring is still unasked.
- Earlier optional questions (parrot summary box, "QS" backronym, One Piece imagery) stay pending.
- Not yet deployed to Vercel.

## Task 2.4 — Intro ship voyage, hero barrels and control audit

The user asked for two animations built from their own ship and barrel pictures: a ship that sails across and reveals the site on load, and barrels that fall into the hero. They also asked for every button to be tested rigorously. Desktop (1440/1920) is the priority; phones only need to keep working.

### What was built

- **Intro voyage** (`src/components/motion/IntroVoyage.tsx`, mounted in `SiteShell`). A full-screen sea overlay. The user's ship, mirrored so its bow leads, sails left to right in about 3 s, rocking, bobbing and pitching. A foam-edged seam that follows the ship pulls the sea away and reveals the page behind it. When it finishes, the overlay is removed.
  - It plays once per browser tab (`sessionStorage`). A click, wheel, key or touch skips it with a short fade.
  - A pre-paint script in `src/app/layout.tsx` sets `html[data-intro]`, so returning visitors and reduced-motion users never see a flash. With JavaScript off the overlay never shows.
  - If the ship image fails, or isn't ready within 1.5 s, the site appears immediately. A CSS failsafe hides the overlay after 7 s even if the app's scripts never load.
- **Hero barrels** (`src/components/motion/HeroBarrels.tsx`, mounted in `Hero`).
  - Barrels drop on alternating sides of the slogan and land on the "Voyage no." rule, so they show up in the first screen. Each one bounces with a squash, then either wobbles upright or tumbles and settles on its side.
  - After resting, a barrel fades and shrinks in place. At most 3 exist at once, roughly 92–130 px tall at 1440 px.
  - They render behind all hero text and controls, never take pointer events, and only land in gaps measured from the actual title, slogan, button and ship-art positions. They're clipped to the hero, so there's no page scroll.
  - They pause when the hero is off-screen, the tab is hidden, the hero's pause-motion button is pressed or the intro is still playing. They are disabled for reduced motion. Observers, timers and nodes are cleaned up on unmount.
- **Tuning:** every timing and physics value is in `src/components/motion/motion-config.ts`. Colours, sizes and the layer are `--intro-*` / `--barrel-*` tokens in `src/styles/tokens.css`. Styles are in `src/styles/voyage.css`.
- **Assets:** the user's pictures are kept as sources in `docs/assets/intro-source/`. `scripts/prepare-intro-images.mjs` cuts them out with a deterministic flood fill (no AI generation) into `public/images/pirate/intro/ship.webp` (669×551, 67 KB) and `barrel.webp` (238×293, 18 KB). The ship cut-out loses its thinnest rigging lines and two tiny pennants. A cleaner hand or Codex cut-out of the same ship can replace `ship.webp` with no code change. A larger ship source would also look sharper on high-density screens.
- **Removed:** the "A parody voyage inspired by IIT (ISM) Dhanbad" top-bar line, its UI string and its glossary entry, at the user's request. The required footer disclaimer is unchanged.

### Verification

- `npm run lint`, `npm test` (13) and `npm run build` pass.
- `check-browser`, `check-shell` and `check-home` pass, including axe WCAG A/AA. Full-motion contexts start past the intro; it has its own check.
- New `scripts/check-motion.ts`, now part of `npm run check:browser`, passes at 1440 and 1920:
  - The intro reveals left to right and hands over in about 3.5 s, and the site is clickable immediately. It doesn't replay on reload, and a click skips it.
  - Fallbacks all work: missing ship image (site shown in about 0.1 s), stalled scripts (CSS failsafe), no JS, and reduced motion.
  - Barrels land on both sides and never pass over links or buttons, below their landing line or outside the hero. There's no overflow, the slogan stays on top, the pause button freezes them, nothing spawns off-screen, and they clean up across navigation. A missing barrel image just means no barrels.
  - Frame time is a steady 16.7 ms (60 fps).
- New `scripts/check-controls.ts` (`npm run check:controls`) covers all built pages in both modes at 1440 and 1920px. It checks:
  - every link resolves to a working local route or anchor, and clicking it lands there
  - every visible button, plus every button revealed inside the panels it opens, visibly changes something
  - Escape closes dialogs
  - nothing clickable is covered
  - no text sits under fixed chrome
  - no JS or console errors

## Task 4 — Logo replacement (9 October 2026)

- The user supplied a new logo: a straw-hat skull over a ship's wheel and crossed swords, a broken anchor on an open book, a gear-edged seal, and the text "NO ANCHOR UNIVERSITY / NO DIRECTION. FULL CONFIDENCE."
- The source is kept at `docs/assets/global-logo-source.webp`. Its cream background was removed by flood fill from the edges, then the logo was resized into the three existing shared slots. The parrot badge is unchanged.
  - Header: `global-header-logo.webp`, 1307 × 304, logo at left.
  - Footer: `global-footer-logo.webp`, 616 × 144.
  - Footer seal and "Started in" stat icon: `global-logo-seal.webp`, 140 × 140.
- Files were renamed (the old `global-*-identity.webp` and `global-treasure-seal.webp` were deleted) so the Next.js and Vercel image caches cannot serve the old crest. Image IDs are unchanged, so no content or code references changed.
- Manifest alts were rewritten in plain English. The parrot badge alt lost its "wearin’" dialect.
- `scripts/prepare-global-images.mjs` still writes the old filenames from generated crests. Don't rerun it for the logo.
- Note: the logo artwork's slogan reads "NO DIRECTION. FULL CONFIDENCE." in caps with periods. The site's text slogan stays the user-fixed "no direction full confidence".
- Verified on a production build at 1440px: the new logo renders in the header, footer and seal with no broken images. `npm test` and lint pass.

## Task 5 — User-supplied One Piece images on Home (9 October 2026)

- `home-academics-deckhand` (Academics feature): the student hugging books is replaced with the user's Luffy artwork. It was cropped from a screenshot (the grey border removed) to the 518:640 portrait slot, given rounded corners and saved as `home-academics-luffy.webp` (777 × 960).
- `home-campus-alive` (the Manthan "Alive" campus card): the pirate band with ghosts is replaced with the user's Straw Hat crew artwork, used as supplied in `home-campus-alive-crew.webp` (736 × 736, square like the original slot).
- The sources are in `docs/assets/home-academics-luffy-source.webp` and `docs/assets/home-campus-alive-crew-source.webp`. The old WebPs are deleted, and the new filenames stop image caches from serving the old art. Alts describe the new images.
- These are copyrighted One Piece characters supplied by the user, which reverses the earlier original-characters-only rule for these slots. `tests/home-content.test.ts` now exempts images whose prompt says "user-supplied".
- Verified at 1440px on a production build: both images render, with no broken images. Tests and build pass.
- Later the same day: `home-campus-sports-day` (the National Sports Day card) was replaced with the user's basketball Luffy artwork.
  - It was cropped from a tall screenshot to the 4:3 slot and saved as `home-campus-sports-day-luffy.webp` (1125 × 844). The source is in `docs/assets/home-campus-sports-day-luffy-source.webp`, and the old WebP is deleted.
  - The source carries a TikTok creator watermark (“@aniverse_00”). It was left in place, not removed.

## Task 6 — Research cards without images, domino scroll effect (9 October 2026)

- The user asked to remove all images from the Home research section ("Treasure Hunting") and turn it into simple cards with the 21st.dev DominoGallery effect.
- New `src/components/ui/domino-gallery.tsx`, adapted from the pasted component:
  - Each child is a text card (an `article` with a heading, paragraph and "Read the paper" link) instead of an image button, so links inside cards are valid and the cards keep heading semantics.
  - Cards rest leaning back and rise upright one after another as the band scrolls, using the source's gravity-and-bounce easing and 45% overlap.
  - The band is `100svh + 900px` tall with a sticky stage under the 150px sticky header (`--domino-sticky-top`). Rising starts when the band is 55% down the viewport, and all cards are upright at 80% of the sticky travel, before the stage releases.
  - Autoplay is off so the text stays readable. It's one prop away (`autoplay`).
- The source component's shadcn classes, Unsplash images and selection state weren't used. The project has no shadcn setup, and colours, shadow and perspective come from `tokens.css` (`--domino-*`). The `components/ui` folder was created for this component.
- Accessibility:
  - Reduced motion renders a plain static row.
  - The server-rendered HTML is upright, so cards are readable without JavaScript.
  - A focused link forces its card upright (`:focus-within`).
- Content: `imageId` was removed from the research items in both modes, and from the schema. The four `home-research-*` images were removed from the manifest and `public/` (25 → 21 images). Unused research-art CSS and tokens were removed.
- Verified at 1440 and 1920px:
  - The rise is correct at 0/25/50/80/100% of the band, with no horizontal overflow.
  - Lint, 13 tests and the build pass, along with `check-browser`, `check-shell`, `check-home` (now scrolls the band upright before clicking a paper link; axe has zero violations in both modes) and `check-motion`.
  - A keyboard focus check shows the focused card upright.

## Task 7 — Gold D. Roger portrait and no real college data (9 October 2026)

- **Portrait:** the Home "Director’s Message" image is the user’s Gold D. Roger artwork. It was centre-cropped to the 832:863 slot with rounded corners and saved as `home-director-roger.webp`; the source is in `docs/assets/home-director-roger-source.webp`, and the old portrait is deleted.
- **Decision (user):** no real IIT (ISM) Dhanbad data anywhere, in either mode. Landlubber mode is a stiff official-brochure version of the invented facts; Pirate mode is the funny version. Recorded in `docs/COPY-VOICE.md`.
- **The invented facts, used consistently:**
  - Founded 1717, "the year the anchor went missing".
  - A 612-acre island campus (480 at high tide).
  - 7,777 students, 365 professors and 17 departments.
  - Rankings come from the "Seven Seas University Rankings" and the "Parrot Rankings Board".
  - Admission is through the Great Sea Trials, with reporting at the first high tide of August.
  - Fictional notices and tenders (NAU/… numbers, "One anchor. Any anchor, really") and fictional research centres: the Centre for Finding Things, Applied Knot Theory and Parrot Linguistics.
- **Rewritten:**
  - Home: rankings, Director’s message (invented, with the slogan as its verse), stats, campus cards, research, notices and events.
  - About: history timeline cut from 24 to 8 entries, vision and mission, campus, governance.
  - Admissions: every date, seat count and notice; the IIM dual degree became an MBA in Treasure Logistics; the real eligibility rules were removed.
  - Notices: 53 real rows became 24 invented ones, all linking to `/davy-jones-locker`.
  - Campus Life, Placements (invented messages and a 1717 "first placement drive"), Contact (no real hours or address), Departments (stiff one-line descriptions in Landlubber mode) and Research (8 invented outposts).
  - Header, footer and UI subtitles, and one image alt.
- **Safe Harbour:** college-specific procedures were removed. What remains is accurate national guidance, the anti-ragging website and helpline, and the relevant laws, plus a pointer to the official IIT (ISM) Dhanbad website for the real cells. No invented help procedures.
- **Kept on purpose:** generic subject and degree names; the footer disclaimer; the pointers to the official website; and "a hackathon parody of IIT (ISM) Dhanbad" in SEO descriptions.
- **New test:** `tests/no-real-data.test.ts` fails on real names, dates, numbers, events, schemes and codes in visible copy or image alts, and on the old Home stats.
- **Verification:**
  - Lint, 17 tests and the build pass; content validation covers 13 pages, 102 glossary entries and 31 images.
  - `check-browser`, `check-shell`, `check-home` (the year assertion is now 1717) and `check-motion` pass.
- **Known gap:** the ten inner-page hero images (`about-hero` … `safe-harbour-hero`) are still `status: "todo"` and show the striped "painting in progress" frame. Their prompts are in `content/images.json`.
