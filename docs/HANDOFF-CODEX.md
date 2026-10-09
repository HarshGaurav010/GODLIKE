# Handoff to Codex: final commit, push and deploy

Written by Claude Code on 9 October 2026. **This is the final handoff and replaces every earlier version.** It covers all the work from several Claude Code chats.

Nothing has been committed since `0cb826f chore(deploy): configure and document Vercel production`. Everything below is finished, verified locally and approved by the user.

**Your job:**

1. Verify the work.
2. Commit everything except `.claude/`.
3. Push to GitHub.
4. Deploy to Vercel production.
5. Check the live site.

**Do not change copy, layout, animation values or images.** If a check fails, stop and report it to the user instead of fixing content.

**Out of scope, as the user decided:**

- Don't add music or audio.
- Don't add the 3D ship model (`pirate_ship.glb`).
- Don't generate images.

## Everything that changed (all chats)

1. **Site cut-down.** The site is 10 merged pages plus **Safe Harbour**, served by the new dynamic route `src/app/(site)/[slug]/` and the `src/components/pages/` components:
   - About, Admissions, Departments, Research, Placements, Campus Life, Administration, Notices, Contact and Safe Harbour (`/about-overview`, `/admissions`, `/departments`, `/research`, `/career-development-centre`, `/campus-life`, `/administration`, `/all-active-notices`, `/contact-information` and `/safe-harbour`).
   - The 92-link mega-menu and 97-item mobile tree became one flat nav of 11 links, five of them shown on desktop.
   - Removed: the social rail, the quick-links popup, the visitor counter, the Hindi/English links, the top-bar "parody voyage" line and Home's empty "What's Trending" video.
2. **Copy.**
   - All pirate copy is plain English with no dialect. Voice rules are in `docs/COPY-VOICE.md`.
   - **No real people:** every person is "Gold D. Roger".
   - **No real college data:** every fact is invented, in both modes (founded 1717, 7,777 students, parrot rankings, invented notices, tenders, research and history). Landlubber mode is a stiff official tone; Pirate mode is the funny one.
   - Safe Harbour keeps accurate national help guidance and points to the official website.
   - The glossary was rebuilt.
3. **Art.**
   - The user's new logo is in the header, footer and seal.
   - The user's One Piece images: Luffy in Academics, the Straw Hat crew on the "Alive" card, basketball Luffy on the Sports Day card, and Gold D. Roger as the Director's portrait.
   - Old image files were deleted and the new ones have new filenames, so image caches can't serve the old art.
   - The sources are in `docs/assets/`.
4. **Motion.**
   - First-visit intro: the user's ship sails across and reveals the site (`src/components/motion/`).
   - Falling hero barrels.
   - The Home research band is image-free domino cards that rise as you scroll (`src/components/ui/domino-gallery.tsx`).
5. **Tests and checks.**
   - Guards for the short nav, the exact disclaimer, no dialect, no real people (`tests/no-real-people.test.ts`) and no real data (`tests/no-real-data.test.ts`).
   - New browser scripts `scripts/check-motion.ts` (part of `npm run check:browser`) and `scripts/check-controls.ts` (`npm run check:controls`).
   - `tsconfig.json` excludes `artifacts/`.
6. **Known gap, leave it:** the ten inner-page hero images (`about-hero` … `safe-harbour-hero` in `content/images.json`) are `status: "todo"` and show a striped "painting in progress" frame on purpose. Don't generate them.

Full details are in `docs/PROGRESS.md`: Tasks 2.4 and 3–7.

## 1. Check the working tree

Run `git status --short`. Commit **everything it lists except `.claude/`**:

- **Modified:** content, docs, `package.json`, `package-lock.json` (if listed), `tsconfig.json`, components, styles, schemas, tests and scripts.
- **Deleted on purpose:** old images in `public/images/pirate/global/` and `public/images/pirate/home/`, all replaced or removed.
- **New:**
  - The ten page JSONs in `content/pages/`.
  - `docs/COPY-VOICE.md` and this file.
  - The user's source pictures in `docs/assets/`.
  - New images in `public/images/pirate/{global,home,intro}/`.
  - New components and routes under `src/`.
  - New scripts and tests.
  - Source caches in `scrape/raw/`. These are tracked in this repo, like `scrape/raw/home.json`.

**Must not appear:**

- `public/models/` or `@google/model-viewer` in `package.json`. The 3D ship was abandoned; if either is present, stop and ask the user.
- Any audio file.
- `.env*`, `scrape/images/` or `scrape/screenshots/`. These are ignored.

If you see an API key or secret anywhere, stop and tell the user.

## 2. Verify before committing

All must pass:

```bash
npm run lint
```

```bash
npm test
```

```bash
npm run build
```

```bash
npx prettier --check .
```

Expected results:

- 17 tests pass.
- The build validates 13 pages, 102 glossary entries, 32 UI labels and 31 images.

If Prettier flags only formatting (for example `scripts/fetch-source.ts` or `scripts/check-controls.ts`), run `npx prettier --write` on just those files. Make no other edits.

Then start the production server with `npm run start`, setting `PREVIEW_URL` if it isn't on port 3000, and run:

```bash
npm run check:browser
```

That runs `check-browser`, `check-shell`, `check-home` (axe WCAG A/AA) and `check-motion`. All four passed locally.

`npm run check:controls` takes 20–30 minutes and is optional. If it fails only on the Home research "Read the paper" links, that's because those domino cards rise on scroll. Report it; don't change the component.

Desktop only: don't add or fix phone checks.

## 3. Commit and push

Earlier commits went straight to `main` in conventional-commit style. Make **one commit**:

```bash
git add -A -- . ':!.claude'
```

Confirm `git status --short` now shows only `?? .claude/`.

Commit message (end it with the co-author line exactly as shown):

```
feat(site): ten parody pages, invented content, new art and motion

- Cut the site to 10 merged pages plus Safe Harbour; flat 11-link nav;
  remove social rail, quick links, visitor counter and trending video
- Plain-English pirate copy (no dialect); every person is Gold D. Roger
- No real college data: all facts invented in both modes; Landlubber
  mode is a stiff official tone; Safe Harbour keeps accurate national
  guidance and points to the official site
- User art: new logo; Luffy, Straw Hat crew, basketball Luffy and
  Gold D. Roger images; renamed files so caches cannot serve old art
- Motion: first-visit ship intro, falling hero barrels, domino research
  cards that rise on scroll
- Tests: short nav, disclaimer, no dialect, no real people, no real
  data; new check-motion and check-controls browser scripts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

Push:

```bash
git fetch origin
```

```bash
git status -sb
```

If `main` is behind `origin/main`, run `git pull --rebase origin main`, re-run lint, tests and build, then push. **Never force-push.** If the rebase conflicts, stop and ask the user.

```bash
git push origin main
```

The remote is https://github.com/HarshGaurav010/GODLIKE. Report the pushed commit hash and its GitHub link.

## 4. Deploy to Vercel production

The project is already linked (`.vercel/` is local and ignored). From the repository root:

```bash
npx vercel@latest deploy --prod --yes
```

- Project: `vinayaks-projects-febcfc10/no-anchor-university`
- Production URL: https://no-anchor-university.vercel.app

If the CLI isn't logged in, stop and ask the user to run `vercel login`. Never handle their credentials.

## 5. Verify production

```bash
PREVIEW_URL=https://no-anchor-university.vercel.app npx tsx scripts/check-motion.ts
```

Then check by hand at 1440px, in a fresh private window so the intro plays:

- **Intro:** the ship sails in and reveals the site within about 3.5 s. Barrels fall beside the title.
- **Header:** five links (Our Story · Join the Crew · Treasure Hunting · Hired Hands · Life on Board). The ☰ menu lists 11 links.
- **Every page returns HTTP 200:** `/`, the ten pages listed above, `/uncharted` and `/davy-jones-locker`. `/home` redirects to `/`.
- **Home:**
  - Rankings read "Seven Seas University Rankings 2027".
  - Stats are 1717 / 7,777 / 365.
  - The Director's portrait is Gold D. Roger.
  - The research cards rise as you scroll.
  - Campus cards show basketball Luffy and the Straw Hat crew.
  - The Academics image is Luffy.
- **No real data:** no QS rankings, 1926, real notices or real names anywhere. Spot-check About, Admissions and Notices in both Landlubber and Pirate mode.
- **Logo:** the new gear-seal logo is in the header and footer.
- **Footer disclaimer, exact:** "A parody made for a hackathon. Not affiliated with IIT (ISM) Dhanbad. No real ships were harmed."

## 6. Record it

Append a short "Production deployment — final" entry to `docs/PROGRESS.md`, with the deployment ID and URL, the commit hash and the check results. Then:

```bash
git add docs/PROGRESS.md
```

```bash
git commit -m "chore(deploy): record final production deployment" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

```bash
git push origin main
```

## Watch out for

- Don't run `scripts/extract-global.ts`, which rebuilds the old 92-link header. Don't run `scripts/prepare-global-images.mjs` either; it writes the old logo filenames.
- Don't re-scrape (Firecrawl or `scripts/fetch-source.ts`). Scraped caches are reference only; the site content is invented.
- **Testing tip:** a fresh browser context plays the intro for about 3.5 s. To skip it in scripts, set `sessionStorage.setItem("isle-intro-seen", "1")` in an init script, or use reduced motion.
