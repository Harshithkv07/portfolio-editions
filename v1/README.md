# Harshith K V — v. I

The first edition of the site: three colours, one typeface, and a dithering
pipeline. The second edition, a book, is in `../v2`.

---

## Running it

You need [Node.js](https://nodejs.org) 20 or newer. Open a terminal
in this folder and run:

```bash
npm install
```

You only ever do that once. After that, to work on the site:

```bash
npm run dev
```

Then open **http://localhost:3000**. Leave it running — every time you save a
file, the page updates by itself.

Press `Ctrl+C` in the terminal to stop it.

---

## Changing the words

**Everything you can read on the site lives in one file: `content/site.ts`.**

Open it, change the text between the quote marks, save. That is the whole
workflow. You do not need to touch anything else.

Lines marked `// <- VERIFY` are facts still to be checked. Go through those
first.

Lines marked `// <- REPLACE ME` are placeholders that need real content before
you show this to anyone. There are two, both in the Metanoia section.

---

## Changing the pictures

Photos on this site are not shown as photos. They are run through a **dithering
pipeline** that converts them to the blue-and-black dot screen the design is
built around. Right now they are generated placeholders.

To use a real photo:

1. Put it in `content/images/source/` named **`portrait.jpg`** (delete the
   existing `portrait.png` first).
2. Run:

```bash
npm run dither
```

That is it. The site picks it up automatically.

**What dithers well:** a clear silhouette, a plain or simple background, strong
separation between you and what is behind you. Backgrounds with a lot of detail
turn to noise once everything is reduced to two colours.

If it comes out too dark or too light, open `scripts/dither.mjs` and adjust
`brightness` in the `CONFIG` block near the top, then run `npm run dither`
again. `cell` in the same block controls how big the dots are.

To add a picture to a project card: drop it in the same folder, run
`npm run dither`, then set `image: "your-filename-without-extension"` on that
project in `content/site.ts`.

---

## Putting it on the internet

1. Make a free account at [vercel.com](https://vercel.com).
2. Install the Vercel command-line tool and deploy:

```bash
npx vercel
```

Answer the prompts (accept the defaults). It gives you a live URL.

To publish changes after that:

```bash
npx vercel --prod
```

You can connect a custom domain later from the Vercel dashboard.

This edition lives in the `v1` folder of the repository, so if you import the
repository in Vercel instead, set **Root Directory** to `v1`.

---

## The link preview

When you paste your link into WhatsApp, LinkedIn, Slack or X, they show a card
with an image. That card is generated from `content/site.ts` — your name, your
positioning line, and the same dithered portrait the site uses.

You do not have to do anything to keep it current. Change your name in
`content/site.ts` and the card changes with it. To see it, run the site and open:

```
http://localhost:3000/opengraph-image
```

One thing it needs from you: set `meta.url` in `content/site.ts` to your real
domain. Until you do, the card leaves its footer blank rather than printing
`example.com`, and `sitemap.xml` and `robots.txt` will point at the wrong place.

---

## How the site is arranged

The home page is a **hub**: a board of tiles. Each tile is a door to its own
page. Six pages hang off it, and every one of them links to its neighbours at
the foot, so you can walk the whole site without going back to the board.

```
/                 the hub — the board of tiles
├── /about        portrait, the dated strip, the longer writing
├── /day          the pinned rows, one per part of the day
├── /work         the projects grid
├── /metanoia     the full-bleed blue panel
├── /colophon     the design system, explained
└── /contact      the form
```

**To add a page:** add an entry to `pages` in `content/site.ts`, then create
`app/<slug>/page.tsx` next to the others — copy any existing one, they are four
lines of real content. The tile, the sitemap entry, and the previous/next links
all follow automatically.

**To remove one:** delete its entry from `pages` and delete its folder in
`app/`. Nothing else references it.

**To reorder the board:** move entries around in `pages`. The `span` field
controls each tile's footprint. The six tiles currently tile a 4×2 grid exactly
— if you add a seventh, check the board still fills cleanly rather than leaving
a tile stranded in a half-empty row.

---

## How it is built

| | |
|---|---|
| Framework | Next.js 15 (App Router), fully static output |
| Styling | Tailwind CSS v4, tokens in `app/globals.css` |
| Motion | GSAP + ScrollTrigger, Lenis for smooth scrolling |
| Type | Geist Sans and Geist Mono |
| Images | Bayer-dithered at build time by `scripts/dither.mjs` |

### The rules the design follows

If you change things, these are the ones worth keeping — they are most of why
it looks the way it does:

- **Three colours only.** `#0000FD`, `#000000`, `#FFFFFF`. Dim states are
  opacity on white, never a new grey. Adding a fourth colour is the fastest way
  to make this look ordinary.
- **Tracking tightens as type gets bigger.** Handled by the `.t-d0` … `.t-d3`
  classes. Use those rather than setting font sizes by hand.
- **Blue is rationed.** On the board it appears only on the palette tile and
  one row of the day preview. Beyond it: the "Currently" strip, the active row
  on `/day`, one project card, and the whole of `/metanoia`. That scarcity is
  what makes the Metanoia page land.
- **Nothing animates for people who ask it not to.** Everything checks
  `prefers-reduced-motion` and falls back to a static, fully readable layout.

### Files worth knowing about

```
content/site.ts             all copy, links and the tile list   <- you edit this
content/images/source/      drop photos here                    <- and this
app/page.tsx                the hub
app/<slug>/page.tsx         one per child page
components/hub/Tile.tsx     a tile on the board
components/PageShell.tsx    the frame every child page shares
components/DailyRhythm.tsx  the pinned rows on /day
scripts/dither.mjs          the dithering pipeline
app/globals.css             colours, type scale, motifs
app/opengraph-image.tsx     the link-preview card
app/not-found.tsx           the 404 page
lib/scroll.ts               loads GSAP and Lenis lazily
assets/fonts/               fonts used by the preview card only
```

---

## Checking your work

```bash
npm run build
```

If that finishes without errors, the site is deployable.

To screenshot every page at once (they land in `.shots/`, which is gitignored):

```bash
node scripts/shoot.mjs 1440 900 desktop
```

Swap the numbers for other sizes, e.g. `node scripts/shoot.mjs 390 844 mobile`.
Add `--reduced-motion` to check the no-animation version.

---

## Current scores

Measured with Lighthouse against a production build, desktop preset, every page:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 |
| `/about` | 100 | 100 | 100 | 100 |
| `/day` | 99 | 100 | 100 | 100 |
| `/work` | 100 | 100 | 100 | 100 |
| `/metanoia` | 100 | 100 | 100 | 100 |
| `/colophon` | 100 | 100 | 100 | 100 |
| `/contact` | 99 | 100 | 100 | 100 |

On Lighthouse's mobile preset performance sits around 80. That preset runs the
CPU at a quarter speed and the network at slow 4G; the cost there is React
starting up, not anything the page draws. Observed paint is about 1.4s and
layout shift is effectively zero. These numbers also come from a local
`next start`, which adds roughly 400ms of latency a real deployment will not.

Reproduce with:

```bash
npx lighthouse http://localhost:3000/ --preset=desktop --view
```

Drop `--preset=desktop` for the mobile run.

**A note on contrast, if you edit the tiles.** Small text (the 11px mono
labels) needs a 4.5:1 ratio, and white at 60% opacity on the blue does not
reach it — it lands at 3.4:1. That is why a few labels sit at full opacity
while their neighbours are dimmed. Decorative type that is genuinely unreadable
by design, like the watermark numeral on the Work tile, is set through CSS
`content` rather than as real text, so it is treated as the decoration it is.

Worth re-checking after you swap in real photos — a large unoptimised source
image is the easiest way to lose the performance score.
