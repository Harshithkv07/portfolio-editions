/* ============================================================================
   DITHER PIPELINE

   Turns any photo into the blue-on-black ordered-dither dot screen that the
   reference design is built on.

   HOW YOU USE THIS:
     1. Drop a photo into  content/images/source/
     2. Run                npm run dither
     3. Done. Redeploy.

   Filenames matter: the name you give the file is the name you reference in
   content/site.ts. "portrait.jpg" becomes image: "portrait".

   WHY ORDERED (BAYER) AND NOT FLOYD-STEINBERG:
   Floyd-Steinberg gives organic grain. The reference has a visibly regular
   grid of dots, which is what a halftone screen looks like. That is Bayer.
   ========================================================================== */

import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "content", "images", "source");
const OUT = path.join(ROOT, "public", "dither");

/* --- Tuning knobs. These are the ones worth touching. --------------------- */

const CONFIG = {
  /** Output widths. Each image is emitted at both. */
  widths: [1200, 2000],
  /** Dot size in output pixels. Bigger = chunkier, more graphic. 2-4 is the
      range that reads as "designed" rather than "low resolution". */
  cell: 3,
  /** Bayer matrix order: 4 or 8. 8 gives smoother tonal range. */
  matrix: 8,
  /** Contrast shaping before dithering. Dithering throws away all tonal
      subtlety, so the input has to be pushed hard first or the result is mud. */
  gamma: 1.15,
  brightness: 1.06,
  /** Two-tone ramp: [dark, light]. */
  ramp: { dark: [0, 0, 0], light: [0, 0, 253] },
};

/* Per-file overrides, keyed by filename without extension. */
const OVERRIDES = {
  // "portrait": { cell: 2, brightness: 1.15 },
};

/* --- Bayer threshold matrices -------------------------------------------- */

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function bayer8() {
  // Recursively expand the 4x4 into an 8x8.
  const m = [];
  for (let y = 0; y < 8; y++) {
    m[y] = [];
    for (let x = 0; x < 8; x++) {
      const q = BAYER_4[Math.floor(y / 2)][Math.floor(x / 2)];
      const s = BAYER_4[y % 2][x % 2] >> 2;
      m[y][x] = q * 4 + s;
    }
  }
  return m;
}

const MATRICES = { 4: { m: BAYER_4, n: 16 }, 8: { m: bayer8(), n: 64 } };

/* --- Core ---------------------------------------------------------------- */

async function ditherOne(inputPath, name, width, cfg) {
  const { m, n } = MATRICES[cfg.matrix];

  // Work at 1/cell scale so each dithered pixel becomes a `cell`-sized dot
  // when we scale back up with nearest-neighbour.
  const workWidth = Math.max(1, Math.round(width / cfg.cell));

  const { data, info } = await sharp(inputPath)
    .rotate() // honour EXIF orientation
    .resize({ width: workWidth, withoutEnlargement: false })
    .greyscale()
    .normalise()
    .modulate({ brightness: cfg.brightness })
    .gamma(cfg.gamma)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const out = Buffer.alloc(w * h * 3);
  const { dark, light } = cfg.ramp;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = data[y * w + x] / 255;
      const threshold = (m[y % cfg.matrix][x % cfg.matrix] + 0.5) / n;
      const on = v > threshold;
      const c = on ? light : dark;
      const o = (y * w + x) * 3;
      out[o] = c[0];
      out[o + 1] = c[1];
      out[o + 2] = c[2];
    }
  }

  // Scale up with nearest-neighbour so the dots stay hard-edged. Any smooth
  // kernel here would blur the grid into grey mush and undo the whole effect.
  const upscaled = sharp(out, { raw: { width: w, height: h, channels: 3 } })
    .resize({ width, kernel: "nearest" });

  const finalMeta = { width, height: Math.round((h / w) * width) };

  const base = path.join(OUT, `${name}-${width}`);

  await Promise.all([
    // Lossless WebP. Lossy codecs smear hard-edged dot patterns badly, and
    // 1-bit content compresses extremely well losslessly anyway.
    upscaled.clone().webp({ lossless: true, effort: 6 }).toFile(`${base}.webp`),
    upscaled.clone().png({ compressionLevel: 9, palette: true }).toFile(`${base}.png`),
  ]);

  return finalMeta;
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`No source folder at ${SRC}`);
    process.exit(1);
  }
  await mkdir(OUT, { recursive: true });

  const files = (await readdir(SRC)).filter((f) =>
    /\.(jpe?g|png|webp|tiff?|avif)$/i.test(f),
  );

  if (files.length === 0) {
    console.log("No source images found in content/images/source/");
    console.log("Drop a photo in there and run this again.");
    return;
  }

  const manifest = {};

  for (const file of files) {
    const name = path.basename(file, path.extname(file));
    const cfg = { ...CONFIG, ...(OVERRIDES[name] ?? {}) };
    const inputPath = path.join(SRC, file);

    process.stdout.write(`  ${name} `);
    const sizes = {};
    for (const width of cfg.widths) {
      const meta = await ditherOne(inputPath, name, width, cfg);
      sizes[width] = meta;
      process.stdout.write(".");
    }
    manifest[name] = {
      widths: cfg.widths,
      aspect: sizes[cfg.widths[0]].width / sizes[cfg.widths[0]].height,
      height: sizes[cfg.widths[0]].height,
      width: sizes[cfg.widths[0]].width,
    };
    console.log(` ok`);
  }

  await writeFile(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );

  console.log(`\nDithered ${files.length} image(s) into public/dither/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
