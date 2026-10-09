# Copy voice — user decisions

Recorded preferences from the user. These override older examples in `AGENTS.md` and the earlier glossary.

## Voice (9 October 2026)

- **Plain, easy English with a pirate premise. No pirate dialect at all.** No "ye", "yer", "be" (for "is"), "o'", "arr", "ahoy", "matey", "Cap'n", or dropped g's ("diggin'").
- The joke comes from the premise: a very confident crew with no sense of direction, running a university. Ships, maps, treasure, crews and parrots are fine as ordinary English words.
- The user rejected:
  - Full dialect ("We be fosterin' inventiveness… arr!").
  - A heavier deadpan "ship's memo" voice, as too hard to read.
- One short joke per block at most. Many blocks need none.
- A test enforces the no-dialect rule (`tests/global-content.test.ts`).

## Scope (9 October 2026)

- The site is cut to 10 merged pages plus one **Safe Harbour** page for help and support. The full list is in `docs/PROGRESS.md`.
- Removed from the site: the floating social bar, the quick-links popup, the empty "What's Trending" video, the visitor counter and duplicate notices.
- The user wants nothing done for phones and no phone-width checks. Review desktop only (1280/1440/1920).

## Recurring gags in use

- "no direction full confidence": the slogan, fixed.
- The building's resident ghosts at Gold D. Roger Auditorium (formerly Penman). Used once; the user has not been asked about making it recurring.
- Gold D. Roger holds every post on the ship (approved by the user, 9 October 2026).
- "Nobody edits the Captain": framing outside the Director's message, which stays word for word.

## No real people (9 October 2026)

- **Every real person’s name is Gold D. Roger**, in both Landlubber and Pirate mode. That covers professors, officers, staff, students and researchers. The running gag: one man holds every post on the ship.
- No real bios, awards, emails, phone numbers or student roll numbers anywhere on the site.
- Heads of state and historical dignitaries appear by role only (“the then President of India”). Revered and religious figures are not renamed; their names are simply omitted.
- Buildings, centres and schemes named after people become Gold D. Roger Auditorium, Gold D. Roger Hall, Gold D. Roger Centre, or a generic “national … scheme”.
- Safe Harbour and Contact send readers to the official IIT (ISM) Dhanbad website for real help, instead of showing fake contact details.
- `tests/no-real-people.test.ts` enforces this.

## No real college data (9 October 2026)

- **Everything on the site is invented parody, in both modes.** No real dates, numbers, rankings, history, events, notices, advertisement numbers, fests, buildings, schemes, research or quotes from IIT (ISM) Dhanbad.
- Generic subject and degree names (Mining Engineering, Physics, B.Tech, MBA) stay, so pages still read like a university.
- The footer disclaimer naming IIT (ISM) Dhanbad stays exactly as it is.
- **Landlubber mode is a stiff, boring official-brochure version of the same invented facts.** Pirate mode is the funny version. Both modes state the same facts, so the toggle itself is the joke.
- The Director's message is an invented message from Gold D. Roger, the same text in both modes.
