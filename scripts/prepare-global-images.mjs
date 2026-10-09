import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const [crestSource, parrotSource] = process.argv.slice(2);
if (!crestSource || !parrotSource) {
  throw new Error(
    "Usage: node scripts/prepare-global-images.mjs <generated-crest.png> <generated-parrot.png>",
  );
}
const folder = "public/images/pirate/global";
await mkdir(folder, { recursive: true });
const crestPrompt = (
  await readFile("docs/assets/global-crest-prompt.txt", "utf8")
).trim();
const parrotPrompt = (
  await readFile("docs/assets/global-parrot-prompt.txt", "utf8")
).trim();
const specs = [
  {
    id: "global-header-identity",
    section: "header",
    width: 1307,
    height: 304,
    originalAlt: "",
    role: "Header identity, same 2614:608 ratio as original; generated crest beside live wordmark",
    alt: "The crew’s skull, book and crossed-pickaxe crest",
    source: crestSource,
    prompt: crestPrompt,
    wide: true,
  },
  {
    id: "global-footer-identity",
    section: "footer",
    width: 616,
    height: 144,
    originalAlt: "",
    role: "Footer identity, same 616:144 ratio as original; generated crest beside live wordmark",
    alt: "The university’s friendly pirate crest, guardin’ the footer",
    source: crestSource,
    prompt: crestPrompt,
    wide: true,
  },
  {
    id: "global-parrot-badge",
    section: "footer",
    width: 262,
    height: 261,
    originalAlt: "",
    role: "Decorative parody replacement for original 524:522 certification badge; no certification claim",
    alt: "A tricorne-wearin’ parrot perched on a treasure map inside a playful seal",
    source: parrotSource,
    prompt: parrotPrompt,
  },
  {
    id: "global-treasure-seal",
    section: "footer",
    width: 140,
    height: 140,
    originalAlt: "",
    role: "Decorative pirate crest replacing the original square QR graphic; no QR destination",
    alt: "A friendly skull above crossed pickaxes and an open book; no secret QR scroll",
    source: crestSource,
    prompt: crestPrompt,
  },
];
const entries = [];
for (const spec of specs) {
  const file = `/images/pirate/global/${spec.id}.webp`;
  if (spec.wide) {
    const artwork = await sharp(spec.source)
      .resize(spec.height, spec.height, { fit: "contain" })
      .png()
      .toBuffer();
    await sharp({
      create: {
        width: spec.width,
        height: spec.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: artwork, left: 0, top: 0 }])
      .webp({ quality: 85 })
      .toFile(`public${file}`);
  } else {
    await sharp(spec.source)
      .resize(spec.width, spec.height, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 85 })
      .toFile(`public${file}`);
  }
  const { source, wide, ...content } = spec;
  void source;
  void wide;
  entries.push({ ...content, page: "global", file, status: "generated" });
}
const prior = JSON.parse(await readFile("content/images.json", "utf8"));
await writeFile(
  "content/images.json",
  JSON.stringify(
    [...prior.filter((entry) => entry.page !== "global"), ...entries],
    null,
    2,
  ) + "\n",
);
console.log(`Prepared ${entries.length} generated shared images.`);
