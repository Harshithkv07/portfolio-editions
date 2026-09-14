/* ============================================================================
   PLACEHOLDER IMAGE GENERATOR

   Writes stand-in source images so the site has something real to dither
   before you have supplied photos.

   TO REPLACE THE PORTRAIT WITH A REAL PHOTO:
     1. Delete  content/images/source/portrait.png
     2. Put your photo there as  portrait.jpg  (or .png)
     3. Run     npm run dither

   What dithers well: a clear silhouette, a plain or simple background, and
   good separation between subject and background. Busy backgrounds turn to
   noise once they are reduced to two colours.
   ========================================================================== */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "content", "images", "source");

/* A head-and-shoulders silhouette against a lit backdrop. Greyscale, because
   the dither pipeline discards colour anyway — what matters here is tonal
   structure, which is what survives into the dot screen. */
const portraitSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1750" viewBox="0 0 1400 1750">
  <defs>
    <!-- Light pooled behind and to the right of the subject, falling off to
         black on the left, where the name and the body copy sit. -->
    <radialGradient id="pool" cx="68%" cy="30%" r="66%">
      <stop offset="0%"   stop-color="#ffffff"/>
      <stop offset="30%"  stop-color="#dcdcdc"/>
      <stop offset="58%"  stop-color="#7d7d7d"/>
      <stop offset="82%"  stop-color="#2a2a2a"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="washL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#000000" stop-opacity="0.95"/>
      <stop offset="42%"  stop-color="#000000" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="washB" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"   stop-color="#000000" stop-opacity="0.98"/>
      <stop offset="34%"  stop-color="#000000" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="13"/></filter>
    <filter id="halo"><feGaussianBlur stdDeviation="26"/></filter>
    <filter id="softer"><feGaussianBlur stdDeviation="46"/></filter>
  </defs>

  <rect width="1400" height="1750" fill="#000000"/>
  <rect width="1400" height="1750" fill="url(#pool)"/>

  <!-- Ambient shapes so the field is not a clean ramp; gives the dither
       something to describe rather than a smooth gradient to band across. -->
  <g filter="url(#softer)" opacity="0.42">
    <ellipse cx="1120" cy="300"  rx="290" ry="250" fill="#ffffff"/>
    <ellipse cx="1330" cy="900"  rx="250" ry="330" fill="#9a9a9a"/>
    <ellipse cx="300"  cy="1450" rx="380" ry="300" fill="#000000"/>
  </g>

  <!-- Subject, right of centre so the left third stays clear for type. -->
  <g>
    <g filter="url(#halo)" opacity="0.85">
      <ellipse cx="930" cy="800" rx="235" ry="288" fill="#6e6e6e"/>
      <path d="M 470 1750 C 470 1345, 640 1200, 830 1158
               L 830 1046 L 1040 1046 L 1040 1158
               C 1235 1200, 1395 1345, 1400 1750 Z" fill="#5a5a5a"/>
    </g>
    <g filter="url(#soft)">
      <path d="M 480 1750 C 480 1350, 648 1206, 836 1164
               L 836 1052 L 1034 1052 L 1034 1164
               C 1228 1206, 1386 1350, 1391 1750 Z" fill="#050505"/>
      <ellipse cx="930" cy="800" rx="216" ry="270" fill="#050505"/>
      <path d="M 726 712 C 742 560, 843 498, 945 502
               C 1082 508, 1150 602, 1144 732
               C 1122 660, 1062 610, 962 606
               C 842 602, 766 642, 726 712 Z" fill="#020202"/>
    </g>
  </g>

  <rect width="1400" height="1750" fill="url(#washL)"/>
  <rect width="1400" height="1750" fill="url(#washB)"/>
</svg>`;

/* Abstract organic field, echoing the halftone card in the reference. Used as
   the fallback visual for project cards that have no screenshot yet. */
const abstractSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200">
  <defs>
    <radialGradient id="a1" cx="34%" cy="34%" r="72%">
      <stop offset="0%"   stop-color="#ffffff"/>
      <stop offset="45%"  stop-color="#c4c4c4"/>
      <stop offset="100%" stop-color="#3a3a3a"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000000" stop-opacity="0"/>
      <stop offset="70%"  stop-color="#000000" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.7"/>
    </linearGradient>
    <filter id="b1"><feGaussianBlur stdDeviation="58"/></filter>
  </defs>
  <rect width="1800" height="1200" fill="#2e2e2e"/>
  <g filter="url(#b1)">
    <ellipse cx="520"  cy="400" rx="470" ry="360" fill="url(#a1)"/>
    <ellipse cx="1250" cy="720" rx="500" ry="380" fill="#e8e8e8" opacity="0.8"/>
    <ellipse cx="960"  cy="220" rx="360" ry="270" fill="#ffffff" opacity="0.7"/>
    <ellipse cx="1660" cy="290" rx="300" ry="320" fill="#b0b0b0" opacity="0.75"/>
    <ellipse cx="230"  cy="960" rx="380" ry="280" fill="#d2d2d2" opacity="0.65"/>
    <ellipse cx="820"  cy="1120" rx="420" ry="240" fill="#161616" opacity="0.8"/>
  </g>
  <rect width="1800" height="1200" fill="url(#fade)"/>
</svg>`;

async function write(name, svg) {
  const out = path.join(SRC, `${name}.png`);
  if (existsSync(out)) {
    console.log(`  ${name}.png already exists, leaving it alone`);
    return;
  }
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`  wrote ${name}.png`);
}

async function main() {
  await mkdir(SRC, { recursive: true });
  await write("portrait", portraitSvg);
  await write("work-pgpilot", abstractSvg);
  console.log("\nPlaceholders ready. Run `npm run dither` next.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
