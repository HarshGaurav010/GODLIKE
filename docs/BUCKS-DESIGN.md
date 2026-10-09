# NO Anchor University — Bucks Sauce design adaptation

Reference: https://buckssauce.com/ inspected with Firecrawl on 9 October 2026. Cached markdown, structural HTML and branding observations are in `scrape/raw/bucks-design.*`. The reference's custom logo, font files, product images and scripts are not shipped.

## Applied to Home and the shared shell

- Ink-black canvas, warm cream type, copper focal disc, sea-blue feature bands.
- Condensed, heavy uppercase display typography using Barlow Condensed through next/font; outlined NO Anchor headline, solid University headline. Source Sans 3 for readable university content.
- A compact desktop navigation with the complete source menu in the All the Decks panel, plus working search, quick links, language toggle and accessibility controls.
- Three manually controlled hero scenes: floating campus-galleon, campus panorama, deckhand. Pointer tilt, gentle sway, rotating decorative stars, scroll arrivals and card hover movement.
- A visible motion pause control, reduced-motion support, static content when JavaScript is unavailable. No scroll hijacking or sound.
- Existing university section order, source facts, ranks and links are retained. The Director's attributed message remains verbatim.

## Exact asset requirements

Everything needed for the implemented version is supplied. All 20 original Home replacements and the new transparent hero are generated and saved as WebP in `public/images/pirate/home/`. Each is below 300,000 bytes. Dimensions and descriptive alt text are in `content/images.json`; actual built-in generation prompts are in `docs/assets/home-generation-records.json`.

| Role                                | Specification                                                                                                                                                                                            | Status                                   |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Hero focal object                   | 1536 × 1024, genuine transparency, full three-quarter campus-galleon silhouette, red-brick arched university hull, parchment sails, original parrot, thick ink outlines; no lettering or official emblem | Generated: home-hero-galleon-cutout.webp |
| Hero campus panorama                | 1920 × 890, landscape illustration, campus as a grounded galleon with garden and pirate crew                                                                                                             | Generated: home-hero-galleon.webp        |
| Student cutout                      | 518 × 640, transparency, friendly fictional deckhand with books and treasure-chest backpack                                                                                                              | Generated: home-academics-deckhand.webp  |
| Shared identity                     | Existing original skull, pickaxes and book crest; wide transparent header/footer derivatives                                                                                                             | Reused                                   |
| Director                            | 832 × 863, fictional friendly pirate captain, never a real person's likeness                                                                                                                             | Generated                                |
| Campus, academics, research, events | 15 scene images at the manifest's original aspect ratios; three additional statistics assets                                                                                                             | Generated                                |

## Optional assets for richer animation later

These are upgrades, not blockers. The current version already moves using CSS and pointer input.

| Optional asset             | Exact delivery brief                                                                                                                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Animated ship              | Lottie JSON or Rive, transparent 1536 × 1024 canvas; separate hull, three sails, flag and parrot layers; seamless 6–8 second idle loop; slight sail billow and parrot blink; unchanged silhouette; static WebP fallback; target under 500 KB |
| Parrot mascot              | Lottie JSON or Rive, transparent 512 × 512 canvas; original tricorne-wearing parrot, warm cream/copper/sea-blue palette; idle blink and short wing-wave states; static WebP fallback; target under 250 KB                                    |
| Campus film                | Original pirate animation, 1920 × 1080, 8–12 second seamless silent loop; WebM plus MP4, poster WebP; under 8 MB per video; no official footage, logos, real-person likeness or baked-in text                                                |
| Reference's exact typeface | A user-supplied licence and webfont files for Peperoncino Sans would be needed to use that proprietary face. The implemented Barlow Condensed remains available without this dependency.                                                     |

No additional copy, photographs or brand details are needed. Brand: **NO Anchor University**. Slogan: **no direction full confidence**.
