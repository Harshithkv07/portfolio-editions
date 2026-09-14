/* ============================================================================
   SCREENSHOT HARNESS

   Drives the local dev server in headless Chrome and writes screenshots of
   each section at a given viewport. Used to check the design against the
   reference without relying on a live browser pane.

     node scripts/shoot.mjs                    # desktop
     node scripts/shoot.mjs 375 812 mobile     # width height label
     node scripts/shoot.mjs 1440 900 rm --reduced-motion

   Output goes to .shots/ which is gitignored.
   ========================================================================== */

import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, ".shots");

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

const [w = "1440", h = "900", label = "desktop", ...flags] =
  process.argv.slice(2);
const reducedMotion = flags.includes("--reduced-motion");
const URL = process.env.SHOOT_URL ?? "http://localhost:3000";

/* The site is a hub plus a page per tile, so we shoot routes rather than
   anchors. Override with SHOOT_ROUTES="/,/about" to capture a subset. */
const ROUTES = (
  process.env.SHOOT_ROUTES ??
  "/,/about,/day,/work,/metanoia,/colophon,/contact"
)
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);

const exe = CANDIDATES.find((p) => existsSync(p));
if (!exe) {
  console.error("No Chrome or Edge binary found.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
  defaultViewport: {
    width: Number(w),
    height: Number(h),
    deviceScaleFactor: 2,
  },
});

const page = await browser.newPage();
if (reducedMotion) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
}

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await mkdir(OUT, { recursive: true });

for (const route of ROUTES) {
  await page.goto(URL + route, { waitUntil: "networkidle0", timeout: 60000 });

  // Settle fonts and the entrance animations before capturing.
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));

  const name = `${label}-${route === "/" ? "hub" : route.replace(/\//g, "")}.png`;
  await page.screenshot({
    path: path.join(OUT, name),
    fullPage: process.env.SHOOT_FULL === "1",
  });
  console.log(`  ${name}`);
}

if (errors.length) {
  console.log("\nConsole errors:");
  for (const e of [...new Set(errors)]) console.log("  " + e);
} else {
  console.log("\nNo console errors.");
}

await browser.close();
