# Phase 1 progress

Updated: 9 October 2026 (Asia/Kolkata).

## Current state

Planning and source inspection complete. Application implementation has not started.
The repository initially contained only AGENTS.md; no package.json or Git repository was present.
The next implementation task is **0 — Setup**. Complete and report that task before starting the global shell.

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

| Order      | Task                                                                           | Route                                                     | Status              |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------- |
| 0          | Setup: Next.js, tokens, loaders, scraping tools, glossary, fallback routes     | /uncharted; /davy-jones-locker                            | Planned             |
| 1          | Global shell: shared header, navigation, toggle, footer, original parody crest | Shared section                                            | Planned             |
| 2.1        | Home                                                                           | /                                                         | Planned; URL mapped |
| 3.1        | About                                                                          | /about-overview                                           | Planned; URL mapped |
| 3.2        | About                                                                          | /about-history                                            | Planned; URL mapped |
| 3.3        | About                                                                          | /vision                                                   | Planned; URL mapped |
| 4.1        | Leadership                                                                     | /director                                                 | Planned; URL mapped |
| 4.2        | Leadership                                                                     | /chairman                                                 | Planned; URL mapped |
| 4.3        | Leadership                                                                     | /deputy-director                                          | Planned; URL mapped |
| 4.4        | Leadership                                                                     | /registrar                                                | Planned; URL mapped |
| 4.5        | Leadership                                                                     | /deans                                                    | Planned; URL mapped |
| 4.6        | Leadership                                                                     | /associate-deans                                          | Planned; URL mapped |
| 4.7        | Leadership                                                                     | /hods                                                     | Planned; URL mapped |
| 4.8        | Leadership                                                                     | /administration                                           | Planned; URL mapped |
| 5.1        | Departments                                                                    | /departments                                              | Planned; URL mapped |
| 5.template | Shared department template, after departments index                            | Select one mapped department source when this task begins | Planned             |
| 6.1        | Admissions & Programmes                                                        | /jeea                                                     | Planned; URL mapped |
| 6.2        | Admissions & Programmes                                                        | /phdadmission                                             | Planned; URL mapped |
| 6.3        | Admissions & Programmes                                                        | /home-mba                                                 | Planned; URL mapped |
| 6.4        | Admissions & Programmes                                                        | /home-m-sc                                                | Planned; URL mapped |
| 6.5        | Admissions & Programmes                                                        | /home-ma                                                  | Planned; URL mapped |
| 6.6        | Admissions & Programmes                                                        | /executive-masters-programmes                             | Planned; URL mapped |
| 6.7        | Admissions & Programmes                                                        | /ai-courses                                               | Planned; URL mapped |
| 7.1        | Research                                                                       | /research-cluster                                         | Planned; URL mapped |
| 7.2        | Research                                                                       | /center                                                   | Planned; URL mapped |
| 7.3        | Research                                                                       | /project-opening                                          | Planned; URL mapped |
| 8.1        | Placements                                                                     | /career-development-centre                                | Planned; URL mapped |
| 9.1        | Faculty & Staff                                                                | /all-faculty                                              | Planned; URL mapped |
| 9.2        | Faculty & Staff                                                                | /staff-and-officers                                       | Planned; URL mapped |
| 10.1       | Student life                                                                   | /home-dsw                                                 | Planned; URL mapped |
| 10.2       | Student life                                                                   | /library                                                  | Planned; URL mapped |
| 10.3       | Student life                                                                   | /geological-museum                                        | Planned; URL mapped |
| 11.1       | Notices & Recruitment                                                          | /all-active-notices                                       | Planned; URL mapped |
| 11.2       | Notices & Recruitment                                                          | /tenders                                                  | Planned; URL mapped |
| 11.3       | Notices & Recruitment                                                          | /facultycareers                                           | Planned; URL mapped |
| 11.4       | Notices & Recruitment                                                          | /career-non-faculty                                       | Planned; URL mapped |
| 12.1       | Governance & Compliance                                                        | /nirf                                                     | Planned; URL mapped |
| 12.2       | Governance & Compliance                                                        | /annual-reports                                           | Planned; URL mapped |
| 12.3       | Governance & Compliance                                                        | /right-to-information                                     | Planned; URL mapped |
| 12.4       | Governance & Compliance                                                        | /sc-st-cell                                               | Planned; URL mapped |
| 12.5       | Governance & Compliance                                                        | /equal-opportunity-cell                                   | Planned; URL mapped |
| 12.6       | Governance & Compliance                                                        | /icc-1                                                    | Planned; URL mapped |
| 13         | Additional mapped pages selected by the user                                   | To be selected                                            | Backlog             |

AGENTS.md group numbers remain the source of truth; the row identifiers above only indicate sequential implementation order. The department template belongs immediately after the /departments index, before admissions.

## Additional discovered paths

Leave these in the user-selected backlog: /professor-in-charge, /general-administration, /rules-and-guidelines, /student-verification, /institute-video, /dean-iie, /seminar-1, /online-payment, /ariia-report, /iit-council-data, /minutes-of-bog-meeting, sustainability pages, programme subpages, and departmental newsletters. The map also includes alternate paths such as /home, /history, /vision-and-mission and /faculty-positions. Use actual header targets for navigation; resolve aliases in the relevant page task rather than implementing duplicate pages.

## Routes and components added

None. Only planning documents, source caches, the image reference manifest and .gitignore were added.

## Glossary and images

- No new glossary mappings or pirate copy have been approved or implemented.
- No generated images or placeholders yet.
- .gitignore excludes .env*, node_modules, Next.js outputs, scrape/images and scrape/screenshots.

## Open items

1. Recover a genuinely full-page layout reference during the global-shell/home task if needed, without silently re-scraping the cached page. Explicit --force is required for a new scrape.
2. Measure image dimensions and classify shared assets versus home-only assets when those tasks begin.
3. The active hero is one animated GIF. Old hero-carousel markup is commented out; do not treat it as active content.
4. The Director's message is attributed speech. Preserve its meaning and real name, and avoid inventing quotes; handle pirate framing outside the attribution.
5. Treat the homepage's STQC badge and QR code as original-site references only. A parody replacement must not suggest the hackathon site is officially audited.
6. The trending section contains a YouTube embed. Route its action to /davy-jones-locker under the external-link policy.
7. No build or lint run yet: no application has been scaffolded.
