# AGENTS.md — "IIT (ISM) Dhanbad, as built by Pirates" 🏴‍☠️

Instructions for Codex (or any coding agent) working in this repo. Read this file fully before doing anything.

## 1. What we're building

A hackathon parody: a re-imagining of the official **IIT (ISM) Dhanbad** website (https://www.iitism.ac.in) as if it had been built by pirates.

- Same information architecture as the real site (nav, pages, sections, notice boards, departments, people, footer).
- **Every piece of copy** is rewritten in pirate speak (funny, but still readable and recognisably "the same page").
- **Every image** is replaced with a funny, pirate-themed image that plays the same role as the original (hero banner → hero banner, building photo → pirate version of that building, etc.).
- Names, titles, and labels are piratified using the glossary in §6.
- It should feel chaotic and alive, but chaos is a *design choice*, not broken code.

### Two phases — do NOT mix them

| Phase | Goal | Styling |
|---|---|---|
| **Phase 1 (now)** | Full site structure, all pirate copy, all pirate images, working navigation, responsive layout | Neutral "draft parchment" style driven entirely by design tokens. Clean, readable, no fancy visual design yet. |
| **Phase 2 (later, user-led)** | Final visual design, animations, chaos effects | The user will define this. Phase 1 code must make it easy to restyle without touching content or page logic. |

### We go page by page

Work on **one page (or one shared section) per task**. When a page is done, stop, report (see §10), and wait for the user before starting the next one. Never build ahead.

---

## 2. Tech stack

- **Next.js (latest stable, App Router) + TypeScript (strict)**
- **Tailwind CSS**, with every colour / font / radius / shadow / spacing value coming from CSS variables in `src/styles/tokens.css` (no hard-coded hex values or magic numbers in components)
- `next/image` for all images, `next/font` for fonts
- **Firecrawl** for scraping (§3)
- npm as the package manager
- ESLint + Prettier; `npm run build` and `npm run lint` must pass after every page

Scaffold once (first task only) if `package.json` doesn't exist.

---

## 3. Scraping with Firecrawl (mandatory)

All source content comes from the real site via **Firecrawl**. Do not hand-type or invent the original content.

### Setup
- If a Firecrawl MCP server is available in your environment, you may use it.
- Otherwise use the official JS SDK (`@mendable/firecrawl-js`) from a script at `scripts/scrape.ts` (run with `npx tsx`). Check the installed SDK version's API before writing calls — method names differ between major versions.
- API key lives in `.env.local` as `FIRECRAWL_API_KEY`. Never commit it, never print it, add `.env*` to `.gitignore`. If the key is missing, stop and ask the user.

### Procedure
1. **Map once** (first task): map `https://www.iitism.ac.in` and save the URL list to `scrape/sitemap.json`. Use it to confirm the page queue in §9.
2. **Scrape per page, only when that page is being worked on** (saves credits). For each URL request:
   - `markdown` (main copy), `html` (to recover section structure, cards, tables), `links`, and a **full-page screenshot** (layout reference).
   - For the global shell (header/nav/footer), scrape the homepage with main-content-only **off** so nav and footer are captured.
3. Save outputs:
   ```
   scrape/raw/<slug>.json        # full Firecrawl response
   scrape/raw/<slug>.md          # markdown only
   scrape/screenshots/<slug>.png # layout reference
   scrape/images/<slug>/manifest.json  # every original image: src, alt, width/height, which section it sits in
   ```
4. **Cache**: if `scrape/raw/<slug>.json` exists, reuse it. Re-scrape only with an explicit `--force` flag.
5. Be polite: sequential requests, no crawling of the whole domain, no scraping of PDFs, logins or the `people.iitism.ac.in` subsites unless the user asks.
6. Original images are **reference only** (to know what to replace). They are never shipped in `public/`.

---

## 4. Content model

Content is data, separate from components. One file per page:

```
content/pages/<slug>.json
content/global/header.json
content/global/footer.json
content/glossary.json        # the name/label mapping from §6
```

Shape (TypeScript types in `src/content/types.ts`, validated with zod at build time):

```ts
type Page = {
  slug: string;
  sourceUrl: string;           // real iitism.ac.in URL
  title: { original: string; pirate: string };
  seo: { pirateTitle: string; pirateDescription: string };
  sections: Section[];
};

type Section = {
  id: string;
  kind: "hero" | "richText" | "cardGrid" | "newsList" | "noticeBoard" | "stats"
      | "people" | "gallery" | "linkList" | "table" | "cta" | "marquee";
  original: Record<string, unknown>;  // faithful copy extracted from the scrape
  pirate:   Record<string, unknown>;  // same shape, pirate version
};
```

- Keep `original` alongside `pirate` for every string. This powers a **"Landlubber ↔ Pirate" toggle** in the header (Phase 1: a simple working toggle, stored in a cookie/localStorage, default = Pirate).
- `pirate` must have the same keys as `original` — no missing fields.
- Images in content reference IDs from the image manifest (§7), never raw URLs.

---

## 5. Pirate copywriting rules

Voice: a boisterous, slightly unhinged pirate crew who are *very proud* of their institute. Funny first, but a visitor should still understand what each page is for.

**Do**
- Keep the meaning and structure of every block. A notice stays a notice; a department description still says what the department studies.
- Keep real numbers and facts recognisable (founded 1926, NIRF ranks, departments, programme names). You can wrap them in jokes ("Founded in the year o' 1926, back when Dhanbad's coal still had treasure maps in it").
- Use pirate vocabulary with restraint: at most one "Arr"/"Ahoy"/"Yo-ho" per paragraph. Readability > density.
- Make headings short and punny; make buttons/CTAs funny but still clear ("Board the Ship →" for Apply, "Read the Scroll" for Read More).
- Running gags are welcome (the parrot who handles admissions, the cursed Penman Auditorium, the treasure being "knowledge, mostly").
- Mining/geology heritage of ISM is gold — lean into "digging for treasure" jokes.

**Don't**
- No profanity, slurs, sexual content, or jokes about religion, caste, region, gender, or disability.
- **Real people** (Director, Chairman, Deans, HoDs, faculty, staff): keep their real names, give them an affectionate pirate *title* only ("Cap'n Director Prof. X"). Never insult them, never invent embarrassing quotes or claims about them.
- **Sensitive pages stay kind**: anti-ragging, ICC, SC/ST cell, Equal Opportunity Cell, health centre, grievance, RTI, scholarships. Light pirate framing is fine; the actual guidance (who to contact, rights, procedures) must stay intact and unmocked.
- Don't invent fake real-world facts presented as true (fake rankings, fake accreditations). Obvious absurdity ("ranked #1 in Kraken Defence") is fine.

Save each page's rewrite into `content/pages/<slug>.json`. Before finalising, re-read every string and fix any where the original meaning got lost.

---

## 6. Glossary (single source of truth: `content/glossary.json`)

Use these consistently everywhere. The user may edit this list — always read the JSON, don't hard-code.

| Real | Pirate |
|---|---|
| IIT (ISM) Dhanbad | **IIT (ISM) Dhanbad — Infamous Isle o' Treasure (Indian School o' Mutineers), Dhanbad Cove** |
| Short name | **The Isle** / **ISM — Isle o' Scallywag Mutineers** |
| Indian Institute of Technology | Infamous Isle o' Treasure |
| Indian School of Mines | Indian School o' Mutineers (est. 1926, still diggin') |
| Director | Cap'n (Commodore o' the Fleet) |
| Deputy Director | First Mate |
| Chairman, Board of Governors | Admiral o' the Admiralty |
| Registrar | Quartermaster |
| Deans / Associate Deans | Bosuns / Under-Bosuns |
| Heads of Department | Masters o' the Deck |
| Faculty | The Officers' Mess |
| Staff & Officers | The Crew |
| Students | Deckhands |
| Alumni | Old Salts |
| Departments | The Decks |
| Admissions / JEE | Join the Crew / The Great Sea Trials |
| PhD Admission | Navigator's Apprenticeship |
| Research / Research clusters | Expeditions / Treasure Expeditions |
| Centres | Outposts |
| Career Development Centre (placements) | The Plunder Port (Bounty Placements) |
| Library | The Map Room |
| Geological Museum | Davy Jones' Rock Collection |
| Notices / Active notices | Proclamations from the Quarterdeck |
| Tenders | Bounties & Contracts |
| Careers / Faculty careers | Now Recruitin' Scallywags |
| Convocation | The Grand Plank Walk (to freedom) |
| Annual Reports | Captain's Logs |
| NIRF | The Royal Fleet Rankings |
| Online Payment | Pay Yer Doubloons |
| Contact Us | Send a Message in a Bottle |
| Fees / money | doubloons |
| Hostels | Crew Quarters |
| Mess | The Galley |
| Campus | The Isle |
| Dhanbad | Dhanbad Cove |
| Fests (Srijan, Concetto, Parakram) | keep names, add "Grog Festival" / "Gadget Armada" / "Battle o' the Brawny" subtitles |

New mappings you invent while working must be added to `glossary.json` and listed in your page report.

**Legal/parody hygiene:** do not use the official logo, emblem, or seal. Create an original parody crest (skull + crossed pickaxes + book is a good starting point). Every page footer shows: *"A parody made for a hackathon. Not affiliated with IIT (ISM) Dhanbad. No real ships were harmed."*

---

## 7. Images

Every original image gets a pirate replacement that serves the same purpose and has the same aspect ratio.

1. From `scrape/images/<slug>/manifest.json`, create entries in `content/images.json`:
   ```json
   {
     "id": "home-hero-1",
     "page": "home",
     "section": "hero",
     "originalAlt": "Main building",
     "role": "hero banner, 16:6",
     "width": 1920, "height": 720,
     "prompt": "...",
     "alt": "Pirate-ship version of the heritage main building flying a skull-and-pickaxe flag",
     "file": "/images/pirate/home/home-hero-1.webp",
     "status": "todo | generated | placeholder"
   }
   ```
2. **Generation**: use the image generation tool/API available to you (e.g. OpenAI Images API with `OPENAI_API_KEY` from `.env.local`). Save as WebP in `public/images/pirate/<slug>/`, sized to the needed dimensions, ideally < 300 KB each.
3. **Consistent art style** across the whole site — put a shared style prefix in `content/image-style.txt` and prepend it to every prompt. Default style: *"Bright, humorous cartoon illustration, thick ink outlines, warm parchment and sea-blue palette, slightly chaotic, family-friendly pirate theme, no text in image."*
4. **Real people's photos** (Director, faculty, etc.): never generate their likeness. Use a generic cartoon pirate portrait (parrot, eyepatch, tricorne) — vary them, keep them friendly.
5. Campus/buildings: pirate-ify the *idea* (main building as a galleon, library as a treasure vault, labs as alchemist dens).
6. If generation is unavailable, create a tasteful SVG placeholder (correct aspect ratio, short caption from the prompt), mark `status: "placeholder"`, and list it in the report. Never leave a broken image or an original image.
7. Every image has a pirate-voiced **but descriptive** `alt` text. Decorative images use `alt=""`.

---

## 8. Phase 1 design principles (structure now, looks later)

- **Tokens only**: colours, fonts, spacing, radius, shadows, motion durations live in `src/styles/tokens.css`. Phase 2 restyles by editing tokens and component variants, not pages.
- **Draft look**: parchment background, dark ink text, one accent colour, one serif display font + one readable body font. Generous whitespace, clear hierarchy. Nothing fancy.
- **Components, not pages**: build reusable section components in `src/components/sections/` matching the `Section.kind` list. Pages are thin: load JSON → map sections to components.
- **Mirror the real layout**: use the screenshot in `scrape/screenshots/` to match section order and rough layout (columns, carousels, tickers, tabs).
- **Responsive**: must work at 375px, 768px, 1280px, 1440px. No horizontal scroll. Mobile nav is a working menu.
- **Accessible**: semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one `h1` per page, logical heading order, keyboard-usable nav/menus/carousels, visible focus states, WCAG AA contrast, `prefers-reduced-motion` respected.
- **Performant**: `next/image` with explicit sizes, lazy-load below the fold, no layout shift, static generation for all pages.
- **"Dynamic" in Phase 1** = working interactions the real site has (carousels, notice tickers, tabs, dropdown mega-menu) + the Landlubber↔Pirate toggle. Leave hooks (`data-*` attributes / variant props) for Phase 2 chaos effects; don't build them yet.
- **Links**:
  - Internal links to pages we've built → real routes.
  - Internal links to pages not built yet → `/uncharted?from=<slug>`, a funny "Here Be Dragons" page.
  - External links, PDFs, and logins → do not link to the real site's documents; show the pirate label and route to `/davy-jones-locker` ("This scroll be lost at sea").

### Suggested structure
```
src/app/(site)/layout.tsx          # header + footer shell
src/app/(site)/page.tsx            # home
src/app/(site)/<route>/page.tsx    # one per page
src/components/layout/             # Header, MegaMenu, MobileNav, Footer, LandlubberToggle
src/components/sections/           # Hero, CardGrid, NoticeBoard, People, ...
src/content/                       # types, zod schemas, loaders
src/styles/tokens.css
content/                           # JSON content (see §4)
scrape/                            # Firecrawl outputs (see §3)
scripts/                           # scrape.ts, generate-images.ts
docs/PROGRESS.md                   # page tracker (see §10)
```
Route paths mirror the real site's slugs (e.g. `/about-history`, `/director`, `/career-development-centre`) so the map is easy to follow.

---

## 9. Page queue (do in order, one per task)

Confirm against `scrape/sitemap.json` in task 0 and update this list in `docs/PROGRESS.md` if the real site differs.

0. **Setup** — scaffold project, tokens, content loaders, Firecrawl script, sitemap map, glossary JSON, `/uncharted` and `/davy-jones-locker` pages.
1. **Global shell** — top bar, header, mega-menu nav, mobile nav, Landlubber toggle, footer, parody crest.
2. **Home** — `/` (hero carousel, notices/news ticker, highlights, research news, stats, quick links, everything in the real order).
3. **About** — `/about-overview`, `/about-history`, `/vision`.
4. **Leadership** — `/director`, `/chairman`, `/deputy-director`, `/registrar`, `/deans`, `/associate-deans`, `/hods`, `/administration`.
5. **Departments** — `/departments` index + one shared department template.
6. **Admissions & Programmes** — `/jeea`, `/phdadmission`, `/home-mba`, `/home-m-sc`, `/home-ma`, `/executive-masters-programmes`, `/ai-courses`.
7. **Research** — `/research-cluster`, `/center`, `/project-opening`.
8. **Placements** — `/career-development-centre`.
9. **Faculty & Staff** — `/all-faculty`, `/staff-and-officers`.
10. **Student life** — `/home-dsw`, `/library`, `/geological-museum`.
11. **Notices & Recruitment** — `/all-active-notices`, `/tenders`, `/facultycareers`, `/career-non-faculty`.
12. **Governance & Compliance** — `/nirf`, `/annual-reports`, `/right-to-information`, cells (`/sc-st-cell`, `/equal-opportunity-cell`, `/icc-1`) — remember the sensitive-page rules in §5.
13. **Leftovers** — anything else the user picks from the sitemap.

---

## 10. Per-page workflow & definition of done

For each page:
1. Scrape (or load cache) → save to `scrape/`.
2. Extract `original` content into `content/pages/<slug>.json` faithfully (every heading, paragraph, card, list item, button label).
3. Write the `pirate` version (§5, §6).
4. Build image manifest entries and generate images (§7).
5. Build/extend section components and the route (§8).
6. Verify:
   - `npm run lint` and `npm run build` pass
   - Page renders at 375 / 768 / 1440 widths with no overflow (check in a browser; screenshot if you can)
   - No original images or official logos shipped; no broken images; no dead links (all go to real routes, `/uncharted`, or `/davy-jones-locker`)
   - Every string has both `original` and `pirate`; toggle works on this page
   - Zod validation passes
7. Update `docs/PROGRESS.md`: page status, routes added, new components, new glossary terms, images that are placeholders, open questions.
8. **Stop and report** to the user with: what was built, 3–5 favourite pirate lines from the page, anything you were unsure about. Wait for approval before the next page.

## 11. General rules for the agent

- If something is ambiguous (a section you can't map, an image you can't interpret, a joke that might be in poor taste), **ask** — don't guess.
- Don't modify pages already approved unless asked; shared component changes must not break earlier pages (rebuild and check them).
- Don't touch Phase 2 visual design unprompted.
- Keep commits small and per-page if git is initialised (`feat(home): pirate home page`).
- Never commit secrets, scraped screenshots larger than needed, or the `scrape/images` originals (add `scrape/images/` and `scrape/screenshots/` to `.gitignore`).
