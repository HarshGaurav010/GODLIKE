// Cuts the user-supplied ship and barrel images out of their backgrounds and
// saves transparent WebPs for the intro voyage and hero barrels.
//
//   node scripts/prepare-intro-images.mjs <ship-image> <barrel-image>
//
// Background is removed by flood-filling from the image border through
// pixels that look like sky, sea, cloud, foam or a plain white backdrop, so
// enclosed details (skulls on sails, the barrel's cloth) are kept. Only the
// largest remaining shape survives, which drops islands and birds.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const [shipPath, barrelPath] = process.argv.slice(2);
if (!shipPath || !barrelPath) {
  console.error("Usage: node scripts/prepare-intro-images.mjs <ship> <barrel>");
  process.exit(1);
}
const out = "public/images/pirate/intro";
await mkdir(out, { recursive: true });

async function cutOut(
  input,
  isBackground,
  { maxWidth, feather, pocket = null, cropBottom = 0 },
) {
  const { data, info } = await sharp(input)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const total = width * height;
  const bg = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;
  const pixel = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
  const seed = (i) => {
    if (!bg[i] && isBackground(...pixel(i))) {
      bg[i] = 1;
      queue[tail++] = i;
    }
  };
  for (let x = 0; x < width; x++) {
    seed(x);
    seed((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    seed(y * width);
    seed(y * width + width - 1);
  }
  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    if (x > 0) seed(i - 1);
    if (x < width - 1) seed(i + 1);
    if (i >= width) seed(i - width);
    if (i < total - width) seed(i + width);
  }
  // Enclosed pockets (sky seen through rigging): start from pixels that are
  // unmistakably background and spread through anything background-like.
  if (pocket) {
    for (let i = 0; i < total; i++) {
      if (bg[i] || !pocket(...pixel(i))) continue;
      bg[i] = 1;
      head = tail = 0;
      queue[tail++] = i;
      while (head < tail) {
        const j = queue[head++];
        const x = j % width;
        if (x > 0) seed(j - 1);
        if (x < width - 1) seed(j + 1);
        if (j >= width) seed(j - width);
        if (j < total - width) seed(j + width);
      }
    }
  }
  // Drop the ragged waterline; the overlay's foam covers the hull's base.
  for (let i = Math.floor(height * (1 - cropBottom)) * width; i < total; i++)
    bg[i] = 1;
  // Keep only the largest foreground shape.
  const label = new Int32Array(total);
  let best = 0;
  let bestSize = 0;
  let next = 0;
  for (let start = 0; start < total; start++) {
    if (bg[start] || label[start]) continue;
    next += 1;
    let size = 0;
    head = tail = 0;
    queue[tail++] = start;
    label[start] = next;
    while (head < tail) {
      const i = queue[head++];
      size += 1;
      const x = i % width;
      for (const j of [
        x > 0 ? i - 1 : -1,
        x < width - 1 ? i + 1 : -1,
        i - width,
        i + width,
      ]) {
        if (j >= 0 && j < total && !bg[j] && !label[j]) {
          label[j] = next;
          queue[tail++] = j;
        }
      }
    }
    if (size > bestSize) {
      bestSize = size;
      best = next;
    }
  }
  const alpha = Buffer.alloc(total);
  for (let i = 0; i < total; i++) alpha[i] = label[i] === best ? 255 : 0;
  // Soften the edge a little so it sits cleanly on any background.
  const softAlpha = await sharp(alpha, { raw: { width, height, channels: 1 } })
    .blur(feather)
    .linear(1.6, -0.3 * 255)
    .extractChannel(0)
    .raw()
    .toBuffer();
  const rgba = Buffer.from(data);
  for (let i = 0; i < total; i++) rgba[i * 4 + 3] = softAlpha[i];
  return sharp(rgba, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ width: maxWidth, withoutEnlargement: true });
}

// Sky, sea, clouds and foam: blue-dominant, or pale and low-saturation.
const skyOrSea = (r, g, b) =>
  (b > r + 25 && b >= g - 12) ||
  (Math.min(r, g, b) > 165 && Math.max(r, g, b) - Math.min(r, g, b) < 75);
// A plain white or near-white studio backdrop.
const whiteBackdrop = (r, g, b) =>
  Math.min(r, g, b) > 228 && Math.max(r, g, b) - Math.min(r, g, b) < 24;

// Unmistakable sky: clearly blue and fairly bright (not the dark hull).
const sky = (r, g, b) => b > 120 && b > r + 45 && b > g + 10;

const ship = await cutOut(shipPath, skyOrSea, {
  maxWidth: 1600,
  feather: 0.8,
  pocket: sky,
  cropBottom: 0.04,
});
const shipInfo = await ship
  .webp({ quality: 86, alphaQuality: 90, effort: 6 })
  .toFile(`${out}/ship.webp`);
const barrel = await cutOut(barrelPath, whiteBackdrop, {
  maxWidth: 360,
  feather: 0.6,
});
const barrelInfo = await barrel
  .webp({ quality: 86, alphaQuality: 90, effort: 6 })
  .toFile(`${out}/barrel.webp`);
console.log(
  `ship.webp ${shipInfo.width}×${shipInfo.height} (${shipInfo.size} bytes); ` +
    `barrel.webp ${barrelInfo.width}×${barrelInfo.height} (${barrelInfo.size} bytes, aspect ${(barrelInfo.width / barrelInfo.height).toFixed(2)})`,
);
console.log(
  "Update shipWidth/shipHeight and BARRELS.aspect in src/components/motion/motion-config.ts to match.",
);
