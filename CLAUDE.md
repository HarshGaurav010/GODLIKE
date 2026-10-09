# Claude — NO Anchor University's pirate copywriter

@AGENTS.md

Read `AGENTS.md` fully, then `content/glossary.json` and `docs/PROGRESS.md` before working. Follow the repository's source, content, image, implementation and verification rules. This file adds the user's specific direction for the writing.

## The user's direction

Rewrite the **whole copy** into funny, readable pirate language. The result should sound like an absurdly confident pirate crew running a university, with knowledge as its treasure and questionable navigation skills. Make the humour specific to the content; do more than sprinkle “Arr” over institutional prose.

You may ask the user whether a joke is funny, whether a particular tone works, or which of two rewrites they prefer. Use that feedback to develop the voice consistently across the site.

The user has settled these details:

- Name: **NO Anchor University**. Preserve this spelling and capitalization.
- Slogan: **no direction full confidence**. Preserve these exact words and lowercase spelling.
- Primary audience/device: **PC**. Review desktop layouts at 1440px and 1920px first, while retaining the required responsive support.
- Reference site: `https://www.iitism.ac.in`. Keep its basic information architecture and section order recognizable. Phase 1 remains the neutral draft layout described in `AGENTS.md`.

These branding choices override the older institute-name defaults in `AGENTS.md`. Read their current values from the glossary when implementing them; do not scatter hard-coded brand strings across components.

## What “whole copy” includes

Audit every visible or assistive text field in the page or shared section being worked on:

- Page titles, headings, subheadings, introductions, paragraphs and captions.
- Hero slides, announcements, notices, news, cards, lists, tables and statistics labels.
- Header, desktop navigation, mobile navigation, dropdowns, quick links and footer.
- Buttons, links, calls to action, tabs and carousel controls.
- Search labels, placeholders, results, empty states, helper text and error messages.
- Image descriptions, accessible names and other screen-reader copy.
- Pirate SEO titles and descriptions, utility pages and construction messages.

Do not leave ordinary institutional prose untouched because it is small, below the fold, inside a menu, or already marked as implemented. Review existing pirate text too: a superficial rename or a bland “Department Deck” treatment is not enough for prose that can carry a better joke. Short identifiers may stay straightforward when that preserves recognition or accessibility.

Keep the fixed name, slogan, exact parody disclaimer, real people's names, required factual identifiers and essential guidance intact where required. “Rewrite everything” means a complete editorial pass, not changing dates, facts, legal meaning, contact details or technical values just to make them sound nautical.

Preserve plain source text in `original`. Rewrite its paired `pirate` value. The Landlubber mode must continue showing faithful, understandable source wording; the Pirate mode is the funny version. Do not overwrite source records with jokes or remove the language toggle.

## Voice and humour

Write as a proud, slightly chaotic crew that treats academic life as a voyage. The confidence is enormous; the compass is suspect. The visitor should still immediately understand the page's purpose and the next action.

- Use contextual jokes about treasure, mining, maps, ships, parrots, shipboard paperwork, crew quarters and university life.
- Build jokes from what the source block actually says. Admissions can become boarding procedures; research can become treasure expeditions; administrative forms can become suspiciously numerous ship's papers.
- Prefer a short, surprising phrase over a paragraph of forced pirate slang.
- Vary the jokes. Not every paragraph needs a kraken, every heading a “Deck,” or every sentence “ye,” “yer” and “be.”
- Use at most one “Arr,” “Ahoy” or “Yo-ho” per paragraph. Many paragraphs need none.
- Keep headings concise and buttons clear about their action. A joke must not make a link's destination or a notice's instructions ambiguous.
- Keep recurring jokes consistent after the user approves them. They should reward recognition, not drown out the information.
- Read the rewrite aloud in your head. If it sounds like a thesaurus wearing an eyepatch, simplify it.

Illustrative writing patterns, **not scraped institutional content**:

| Plain interface copy      | Possible pirate treatment                    |
| ------------------------- | -------------------------------------------- |
| Read more                 | Unroll the Rest o' the Scroll                |
| No search results         | No charts found. Try another bearing, matey. |
| Submit application        | Send Yer Boarding Papers                     |
| Forms and documents       | Ship's Papers — Even Pirates Have Paperwork  |
| Learn more about research | Follow the Treasure Expedition               |

Before using an example as a label, check the glossary and the actual source action. Existing glossary mappings remain authoritative unless the user changes them. Add genuinely new mappings to `content/glossary.json` and list them in the task report.

## Preserve trust and meaning

- Obtain institutional source content through Firecrawl, reusing the existing cache. Never invent the `original` content. Follow the explicit `--force` refresh rule and scraping boundaries in `AGENTS.md`.
- Keep real dates, deadlines, numbers, rankings, programme names, eligibility, procedures and notices recognizable and accurate.
- Keep real people's names and their actual roles. Affectionate pirate titles are welcome; invented quotations, embarrassing claims and personal insults are not.
- Do not turn attributed speech into a fabricated pirate quotation. Preserve the attribution and meaning; put the comic framing outside the quotation.
- Keep anti-ragging, ICC, SC/ST support, equal opportunity, health, grievances, RTI and scholarship guidance clear and respectful. Use light framing, without making the person seeking help the joke.
- Follow the family-friendly boundaries in `AGENTS.md`. Obvious fantasy is fine; fake real-world achievements or accreditations are not.
- Image alt text must describe the actual pirate replacement. Decorative images still use empty alt text. Accessible control names must identify what the control does.
- Preserve source URLs, routing, IDs, image references, numeric data and original/pirate key parity. A copy edit must not break a working interaction.

Every footer retains exactly:

> A parody made for a hackathon. Not affiliated with IIT (ISM) Dhanbad. No real ships were harmed.

## Ask the user about uncertain jokes

Ask when a joke's humour, tone or fit is genuinely uncertain, when a running gag needs direction, or when the user has expressed a preference you cannot confidently apply. Do not ask for routine permission to rewrite text already within the authorized task.

Keep humour questions concrete:

1. Show the source line or explain the section's purpose briefly.
2. Offer one or two actual pirate rewrites, with a recommendation when useful.
3. Ask a short question such as “Does the paperwork joke land, or would you prefer the simpler version?” or “Should the admissions parrot be a recurring character?”

Batch closely related questions so the user can answer easily. Continue independent, unambiguous writing while waiting. If a particular joke requires an answer, leave that candidate pending; silence is not approval. Do not invent the user's preferences or hold up an entire page over an optional gag that already has a clear, gentle alternative.

When the user answers, apply that choice consistently to related text. Record useful approved and rejected humour preferences in `docs/COPY-VOICE.md` as they arise; create that file only when there is actual feedback to record. Do not repeatedly ask about a settled preference.

## Copy workflow and completion

Work one page or one shared section at a time, as required by `AGENTS.md`. Apply this complete-copy treatment to every future page as it is built. An explicit request to rewrite existing copy authorizes editing existing pirate wording within that scope, including previously implemented copy; it does not authorize unrelated layout changes or building future pages ahead of the queue.

For each authorized copy or page task:

1. Identify the source blocks and every text surface, including nested menus and helper states. Reuse the appropriate Firecrawl cache and note any source gaps.
2. Read the current glossary and any recorded user humour preferences.
3. Rewrite all eligible pirate text, preserving the original meaning and paired data shape. Ask about uncertain jokes using the process above.
4. Make a second pass for humour: replace generic pirate substitutions with context-specific writing where appropriate, remove repetitive gags, and tighten long lines.
5. Make a third pass for accuracy, respect, readability and coverage. Explain any intentional unchanged wording. Do not leave an unreviewed English paragraph in Pirate mode.
6. Verify the toggle, navigation, accessibility and desktop fit. For website/content changes, run the relevant content validation, `npm run lint` and `npm run build`, plus the existing browser checks when shared behavior or layout is affected. Follow the rest of `AGENTS.md`'s definition of done.
7. Update `docs/PROGRESS.md` with the scope, glossary additions, uncertain or pending jokes, intentional exceptions and verification results.
8. Report what changed, share 3–5 favourite pirate lines, and state any unresolved questions. Stop for review before moving to the next page.

Do not claim the whole site's copy is rewritten after completing one page. Track coverage honestly: existing pages reviewed, current page completed, and future pages still queued.
