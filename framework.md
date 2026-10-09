# Project Framework — "IIT (ISM) Dhanbad, as built by Pirates" 🏴‍☠️

This is the roadmap for the whole project: phases, who does what, the loop for each page, ready-to-paste Codex prompts, review checklists, and the demo plan.
The detailed rules Codex follows are in [AGENTS.md](AGENTS.md). This file is for **you** (the human captain).

---

## 1. The big picture

```
 STAGE 0         STAGE 1             STAGE 2               STAGE 3            STAGE 4
 Setup     →     Content Build   →   Design Pass     →    Chaos & Polish →   Demo
 (1 task)        (page by page)      (your design)        (effects, QA)      (pitch)
 ─────────       ─────────────       ─────────────        ─────────────      ──────
 scaffold        scrape → pirate     tokens + theme       animations         deploy
 firecrawl       copy → images →     component skins      easter eggs        rehearse
 sitemap         route → review      per-page tweaks      perf + a11y QA     backup video
```

| Stage             | Output                                                                                          | Who leads                          | Gate to move on                                         |
| ----------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| 0. Setup          | Running Next.js app, Firecrawl script, sitemap, glossary, fallback pages                        | Codex                              | App runs locally, `scrape/sitemap.json` exists          |
| 1. Content Build  | Every page in the queue has pirate copy + pirate images + working routes, plain parchment style | Codex builds, you review each page | All queue pages approved in `docs/PROGRESS.md`          |
| 2. Design Pass    | Final look: colours, type, layout personality, component styling                                | You decide, Codex implements       | Design applied across all pages without content changes |
| 3. Chaos & Polish | Dynamic effects, easter eggs, QA, performance                                                   | You pick effects, Codex builds     | QA checklist (§7) passes                                |
| 4. Demo           | Deployed URL, demo script, backup recording                                                     | You                                | Rehearsed twice                                         |

**Golden rule:** content first, looks later. Never let design work start on a page whose content isn't approved, and never change content during the design pass.

---

## 2. Roles

| You (Captain)                              | Codex (Crew)                                                |
| ------------------------------------------ | ----------------------------------------------------------- |
| Pick the next page and kick off the task   | Scrape, extract, piratify, generate images, build the route |
| Review copy for humour + taste             | Follow AGENTS.md rules exactly                              |
| Approve or send back each page             | Stop after each page and report                             |
| Own the glossary (`content/glossary.json`) | Add new terms it invents and tell you                       |
| Decide the Phase 2 design direction        | Implement design through tokens + component variants        |
| Handle API keys in `.env.local`            | Never print or commit keys                                  |

---

## 3. Stage 0 — Setup (one session)

**Before you start**

- [ ] `.env.local` with `FIRECRAWL_API_KEY=...`
- [ ] (Optional, for real images) `OPENAI_API_KEY=...` in `.env.local`
- [ ] Node.js 20+ installed
- [ ] `git init` in the folder so every page is a clean commit you can roll back

**Codex prompt**

> Read AGENTS.md fully. Do task 0 (Setup): scaffold the Next.js project, design tokens, content types + zod loaders, the Firecrawl scrape script, map the site into `scrape/sitemap.json`, create `content/glossary.json` from §6, and build the `/uncharted` and `/davy-jones-locker` pages. Create `docs/PROGRESS.md` with the page queue from §9 confirmed against the sitemap. Then stop and report.

**You check**

- [ ] `npm run dev` opens a page
- [ ] `scrape/sitemap.json` looks like the real site
- [ ] `docs/PROGRESS.md` lists the page queue — reorder or cut pages now if you want
- [ ] Glossary reads well — this is the cheapest moment to change names

---

## 4. Stage 1 — Content Build (the page loop)

Every page goes through the same loop. One page per Codex task.

```
 ┌──────────┐   ┌───────────┐   ┌──────────┐   ┌──────────┐   ┌─────────┐   ┌─────────┐
 │ 1 SCRAPE │ → │ 2 EXTRACT │ → │ 3 PIRATE │ → │ 4 IMAGES │ → │ 5 BUILD │ → │ 6 CHECK │
 │ Firecrawl│   │ original  │   │ rewrite  │   │ generate │   │ route + │   │ lint,   │
 │ + cache  │   │ JSON      │   │ copy     │   │ or SVG   │   │ comps   │   │ build,  │
 └──────────┘   └───────────┘   └──────────┘   └──────────┘   └─────────┘   │ widths  │
                                                                            └────┬────┘
                                                      ┌──────────────────────────┘
                                                      ▼
                                      ┌───────────────────────────────┐
                                      │ 7 REPORT → YOU REVIEW (§6)    │
                                      │  ✅ approve → next page         │
                                      │  🔁 changes → same page again   │
                                      └───────────────────────────────┘
```

### Page queue & milestones

Track status in `docs/PROGRESS.md` (`todo → in progress → review → approved`).

| #   | Task                    | Routes                                                                                                               | Milestone                                                             |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Global shell            | header, mega-menu, mobile nav, toggle, footer, crest                                                                 | 🟡 **M1 — "The ship floats"** (shell + home = a demoable site)        |
| 2   | Home                    | `/`                                                                                                                  | 🟡 M1                                                                 |
| 3   | About                   | `/about-overview`, `/about-history`, `/vision`                                                                       |                                                                       |
| 4   | Leadership              | `/director`, `/chairman`, `/deputy-director`, `/registrar`, `/deans`, `/associate-deans`, `/hods`, `/administration` |                                                                       |
| 5   | Departments             | `/departments` + department template                                                                                 | 🟠 **M2 — "Core crew aboard"** (the pages judges are likely to click) |
| 6   | Admissions & Programmes | `/jeea`, `/phdadmission`, `/home-mba`, `/home-m-sc`, `/home-ma`, `/executive-masters-programmes`, `/ai-courses`      | 🟠 M2                                                                 |
| 7   | Research                | `/research-cluster`, `/center`, `/project-opening`                                                                   |                                                                       |
| 8   | Placements              | `/career-development-centre`                                                                                         | 🟠 M2                                                                 |
| 9   | Faculty & Staff         | `/all-faculty`, `/staff-and-officers`                                                                                |                                                                       |
| 10  | Student life            | `/home-dsw`, `/library`, `/geological-museum`                                                                        |                                                                       |
| 11  | Notices & Recruitment   | `/all-active-notices`, `/tenders`, `/facultycareers`, `/career-non-faculty`                                          |                                                                       |
| 12  | Governance & Compliance | `/nirf`, `/annual-reports`, `/right-to-information`, cells                                                           | 🟢 **M3 — "Full fleet"**                                              |
| 13  | Leftovers               | your pick                                                                                                            |                                                                       |

**If time runs short:** stop after M2, and let every other link land on `/uncharted` ("Here Be Dragons"). That's a feature, not a gap.

### Codex prompt for each page (copy, change the task number)

> Read AGENTS.md. Do task **N** (<name>) from §9, following the per-page workflow in §10. Only this task — don't touch other pages. When done, update `docs/PROGRESS.md` and stop with your report.

### Codex prompt to send a page back

> Page **<name>** needs changes before approval:
>
> 1. <copy change>
> 2. <image change>
> 3. <layout/structure issue>
>    Fix only these, re-run the §10 checks, update PROGRESS.md, and report again.

### Codex prompt to approve

> Page **<name>** is approved. Mark it approved in `docs/PROGRESS.md` and commit it. Don't start the next page yet.

---

## 5. Content standards (the quick version)

| Area            | Rule of thumb                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Copy            | A visitor should still know what the page is for. Funny _and_ readable.                                                       |
| Pirate density  | Max one "Arr/Ahoy" per paragraph. Puns in headings, clarity in body text.                                                     |
| Facts           | Real numbers stay real (1926, rankings, programmes). Absurd jokes must be _obviously_ absurd.                                 |
| Real people     | Real names + affectionate pirate titles only. No mocking, no invented quotes. Cartoon pirate portraits, never their likeness. |
| Sensitive pages | Anti-ragging, ICC, SC/ST cell, EOC, health, RTI: light theme, real guidance intact.                                           |
| Images          | Same role + aspect ratio as the original, one shared cartoon style, descriptive pirate alt text.                              |
| Branding        | No official logo or seal. Parody crest + "not affiliated" footer on every page.                                               |

---

## 6. Your review checklist (per page, ~5 minutes)

Open the page in the browser and go through:

**Copy**

- [ ] Laughed at least twice
- [ ] Still understand what every section is for
- [ ] No joke that would embarrass you in front of the judges or anyone from ISM
- [ ] Glossary names used consistently
- [ ] Landlubber toggle shows the real text correctly

**Images**

- [ ] No original photos or logos left
- [ ] Style matches earlier pages
- [ ] No real person's face recreated
- [ ] Nothing broken, stretched, or blurry

**Structure**

- [ ] Section order matches the real page (compare with `scrape/screenshots/<slug>.png`)
- [ ] All links go somewhere (real route, `/uncharted`, or `/davy-jones-locker`)
- [ ] Looks fine on your phone (or browser at 375px)

All ticked → approve. Anything else → send back with numbered fixes.

---

## 7. Stage 2 — Design Pass (after content is approved)

Phase 1 left everything restyleable through `src/styles/tokens.css` and component variants. The design pass goes in this order:

1. **Pick the direction** (you). Write a short brief in `docs/DESIGN.md`:
   - Mood (e.g. "treasure map chaos", "rum-soaked newspaper", "90s GeoCities pirate fan site", "cursed government portal")
   - Colour palette (4–6 colours), display font, body font
   - 3–5 reference images or sites
   - What "chaotic" means for us — and what must stay readable (nav, body text, sensitive pages)
2. **Tokens first** — Codex updates `tokens.css` only. Check the whole site; everything should change at once.
3. **Components next** — header, footer, hero, cards, notice board, people cards. One component per task.
4. **Page-specific touches last** — only where a page needs something special (home hero, history timeline).

**Codex prompt**

> Read AGENTS.md and docs/DESIGN.md. We're now in Phase 2. Apply the design brief to tokens.css only, without changing any content JSON or page logic. Rebuild, check all approved pages at 375/768/1440, then report.

---

## 8. Stage 3 — Chaos & Polish

### Effect menu (pick a few, don't do all)

| Effect                                                                  | Effort | Where        |
| ----------------------------------------------------------------------- | ------ | ------------ |
| Landlubber ↔ Pirate toggle with a splash/flip transition                | Low    | Global       |
| Cursor becomes a hook / cutlass                                         | Low    | Global       |
| Parrot that randomly squawks a glossary term                            | Low    | Global       |
| Notice ticker that occasionally "gets stolen" and scrolls the wrong way | Medium | Home         |
| Ship-rocking sway on hero, stronger on hover                            | Low    | Home         |
| "Walk the plank" 404 animation                                          | Medium | `/uncharted` |
| Hidden treasure: click 5 hidden doubloons across pages → secret page    | Medium | Site-wide    |
| Konami code → full "Kraken attack" screen takeover                      | Medium | Global       |
| Sound toggle (sea, creaks, "Arr") — **off by default**                  | Low    | Global       |

**Chaos rules:** every effect respects `prefers-reduced-motion`, nothing blocks navigation, nothing autoplays sound, sensitive pages stay calm.

### Final QA checklist

- [ ] `npm run build` and `npm run lint` clean
- [ ] Every nav link works (no real-site links leaking)
- [ ] Mobile: nav, toggle, carousels all usable
- [ ] Lighthouse on home: Performance ≥ 85, Accessibility ≥ 95
- [ ] No original images/logos anywhere in `public/`
- [ ] No secrets in the repo (`git grep -i "api_key"`)
- [ ] Parody disclaimer visible on every page

---

## 9. Stage 4 — Demo

**Deploy:** Vercel (works well with Next.js). Set env vars there only if needed at runtime; content and images should already be static.

**Demo script (~3 minutes)**

1. **Hook (20s)** — show the real iitism.ac.in for 5 seconds, then "…and here's what it would look like if pirates built it."
2. **Home (40s)** — hero, notice ticker, a couple of the best lines.
3. **The toggle (20s)** — flip Landlubber ↔ Pirate live. It shows we kept the real structure.
4. **Deep dive (60s)** — Departments → a department page, Placements ("The Plunder Port"), Leadership ("Cap'n").
5. **Chaos moment (20s)** — the Konami code or hidden-treasure easter egg.
6. **How we built it (20s)** — Firecrawl scrape → structured content → AI pirate copy and images → page-by-page review.

**Backup:** record a screen video of the demo in case Wi-Fi or the deploy fails.

---

## 10. Files you'll touch vs. files Codex owns

| File                                          | Owner                   | Purpose                       |
| --------------------------------------------- | ----------------------- | ----------------------------- |
| `AGENTS.md`                                   | You                     | Rules Codex follows           |
| `framework.md`                                | You                     | This roadmap                  |
| `content/glossary.json`                       | You (Codex adds terms)  | Pirate names                  |
| `content/image-style.txt`                     | You                     | Shared art style prompt       |
| `docs/PROGRESS.md`                            | Codex updates, you read | Page tracker                  |
| `docs/DESIGN.md`                              | You                     | Phase 2 design brief          |
| `.env.local`                                  | You                     | API keys (never committed)    |
| `content/pages/*.json`, `content/images.json` | Codex                   | Page content + image manifest |
| `src/**`, `scripts/**`, `scrape/**`           | Codex                   | Code and scraped data         |

---

## 11. Risks & fallbacks

| Risk                                       | Fallback                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Firecrawl credits run out                  | Cache means each page is scraped only once. Prioritise M1/M2 pages.                                    |
| Site blocks or changes pages               | Use the cached `scrape/raw/` copy. Skip a page and mark it `/uncharted`.                               |
| Image generation unavailable or slow       | SVG placeholders (AGENTS.md §7.6), swap in real images later in one batch task.                        |
| Running out of time                        | Ship at M2, with everything else on "Here Be Dragons".                                                 |
| A joke goes too far                        | Landlubber toggle + per-page review catch it. When in doubt, cut it.                                   |
| Shared component change breaks an old page | Codex rebuilds and checks approved pages (AGENTS.md §11), and git commits per page make rollback easy. |
