import sharp from "sharp";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

// Resize/encode built-in image-tool output; this script does not generate art.
const [id, sourceFile] = process.argv.slice(2);
if (!id || !sourceFile) {
  throw new Error(
    "Usage: node scripts/prepare-home-images.mjs <home-image-id> <generated-image.png>",
  );
}
const manifestFile = "content/images.json";
const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
const image = manifest.find(
  (entry) => entry.id === id && entry.page === "home",
);
if (!image || image.status !== "todo")
  throw new Error(`Expected a pending Home image: ${id}`);
const destination = path.join("public", image.file);
try {
  await access(destination);
  throw new Error(`Asset already exists; refusing to overwrite ${destination}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await mkdir(path.dirname(destination), { recursive: true });
const transparent = image.prompt.includes("transparent background");
let data;
let quality;
for (quality of [86, 80, 74, 68, 62, 56, 50]) {
  data = await sharp(sourceFile)
    .rotate()
    .resize(image.width, image.height, {
      fit: transparent ? "contain" : "cover",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality, effort: 6 })
    .toBuffer();
  if (data.length < 300_000) break;
}
const metadata = await sharp(data).metadata();
if (metadata.width !== image.width || metadata.height !== image.height)
  throw new Error("Unexpected output dimensions.");
if (transparent && !metadata.hasAlpha)
  throw new Error("Transparent artwork lost its alpha channel.");
await writeFile(destination, data);
// Reload so edits by another collaborator to unrelated fields are retained.
const current = JSON.parse(await readFile(manifestFile, "utf8"));
const entry = current.find((item) => item.id === id);
if (!entry || entry.status !== "todo")
  throw new Error(
    "Manifest changed; inspect the saved asset before changing its status.",
  );
entry.status = "generated";
await writeFile(manifestFile, JSON.stringify(current, null, 2) + "\n");
console.log(
  JSON.stringify({
    id,
    file: image.file,
    width: metadata.width,
    height: metadata.height,
    bytes: data.length,
    quality,
    alpha: metadata.hasAlpha,
  }),
);
