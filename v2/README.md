# Harshith K V — v. II

The second edition of the site. The first was three colours, one typeface and a
dithering pipeline. This one is a **book**: a sealed leather cover that burns
away, a title page, a table of contents, five chapters, one red ink, and a page
that stretches when you pull on the edge of the window.

Built after the idea behind [lynnandtonic.com](https://lynnandtonic.com) (a
site redesigned every year), with its own type, code and ornaments.

---

## Looking at it

No installs. Open a terminal in this folder and run:

```bash
node serve.mjs
```

Then open **http://localhost:4000**. Press `Ctrl+C` to stop.

**Try this:** grab the edge of the browser window and drag it. The whole page
stretches with you and springs back when you let go.

---

## Changing the words

There is no build step. **Each page is one HTML file**, and what you see in the
browser is what is in the file. Open it, change the text, save, refresh.

| Page | File |
|---|---|
| Title page and contents | `index.html` |
| I. About | `about/index.html` |
| II. Metanoia | `metanoia/index.html` |
| III. Work | `work/index.html` |
| IV. Contact | `contact/index.html` |
| V. Colophon | `colophon/index.html` |
| Page not found | `404.html` |

Comments in the files (`<!-- like this -->`) explain the parts that are not
obvious. They never show on the page.

---

## Still to fill in

None of it is broken; it is waiting on you.

1. **The drop box** (Contact). Connect it to your Discord: see "The drop box"
   below. About two minutes. Until then, sending a message explains that the
   box is not connected yet and points people to your email.
2. **Currently** (`about/index.html`). The one dated line on the site.
3. **The availability line** (`index.html`). "Metanoia is taking on new
   projects." Change or delete it when that stops being true.

Everything else comes from your résumé and your project READMEs. Read it once
and correct anything that is not quite right.

---

## How the pieces work

**Colours.** The first block of `assets/css/main.css`. `--paper` and `--ink`
are the whole palette, and `--rubric` is the colour of titles, numerals and
initials. There is a set for candlelight (the default), one for daylight
(parchment), and one for Metanoia, which is printed the other way round:
parchment with dark text and red titles while the rest of the book is dark.

**Type.** One family, the IM Fell types: IM Fell English small capitals for
titles, the contents, labels and navigation, and IM Fell DW Pica for
paragraphs and italic lines. Neither has a bold, so avoid `font-weight: bold`
anywhere; the browser would fake one and it smudges.

**Chapter tabs.** On wide screens, every chapter has tabs on its right edge,
like a dictionary's thumb index. They are the `<nav class="thumb-index">` just
before `</body>` in each chapter; add a line there if you add a chapter.

**Daylight / candlelight.** The button at the foot of every page. The choice is
remembered in the reader's browser. Every page opens in candlelight by default;
to make daylight the default, change `data-mode="dark"` to `data-mode="light"`
in the `<html>` tag of each page.

**The cover.** The first time someone opens the home page in a browser tab,
the book is closed: a leather cover titled *The Forge and the Flame*, a
tooled frame and a red wax seal. Clicking or tapping it (or Enter, or Esc)
cracks the seal; the cover catches fire where the seal was and burns away to
the title page, in about two seconds, with embers rising off the edge. It
only shows once per tab, so moving around the site never replays it; open the
site in a new tab to see it again. People who ask their device for less
motion get a quick fade instead, and without JavaScript it never appears. The
title is the `cover-title` line in `index.html`. To remove the cover, delete
the `<div class="opening">` block and the cover `<script>` in the `<head>` of
`index.html`.

**The stretch.** In `assets/js/main.js`. It only answers a mouse or trackpad (on
a phone or tablet, turning the screen would smear the page), is switched off
for anyone whose device asks for reduced motion, and never affects printing.

**Reach Me.** The list at the foot of `contact/index.html`: each line is a
name, a dot leader and an address. Leave a line's `href=""` empty and that line
is hidden. The email is written as HTML character codes so simple scrapers miss
it; to change it, replace both codes (in `href` and in the text) with the new
address typed normally, or encode it the same way.

**The drop box.** On Contact, a visitor writes a message, adds their name if
they like, and presses Send; both arrive as one note in a private channel on
your Discord, which pings your phone. Nobody gets a reply through it; it only
relays to you.

The page posts to `api/drop.js`, a tiny function Vercel runs for you. It holds
the channel's webhook address, which must never go in the page itself (anyone
who has it can post into your channel). To connect it:

1. In Discord, make a server just for yourself if you do not have one (the
   **+** at the bottom of the server list, then **Create My Own**), with a text
   channel in it, such as `#website`.
2. Open that channel's settings (the gear beside its name), then
   **Integrations > Webhooks > New Webhook**, and press **Copy Webhook URL**.
3. In Vercel, open the project, then **Settings > Environment Variables**, and
   add `DISCORD_WEBHOOK_URL` with that address. Deploy again.

Never paste the webhook address into any file in this folder. If it ever
leaks, delete the webhook in the channel's settings, make a new one, and set
the new address in Vercel.

It ignores forms that bots fill in (a hidden field people never see, and a
check for impossibly fast sending), caps each message at 2,000 characters, and
shows what visitors type exactly as typed: no formatting, and no pinging
anyone.

To try it on your own machine, set the same variable in the terminal before
`node serve.mjs`; the local server runs the function too.

**Metanoia and Work.** Professional products (PGPilot, Aero-Logic, Proteus)
are listed on the Metanoia page. Personal projects and research are plates on
the Work page, each linking to its code or live demo.

**Pictures.** Photos are printed in the page's ink by the `.inked` style. A
Work plate with `class="plate-art has-image"` holds a screenshot that turns
true colour when pointed at; `assets/img/work-pgpilot.jpg` is kept for that.

**Page turns.** Moving between pages fades softly in browsers that support it
(Chrome, Edge, Safari). Others just change page.

---

## Adding a chapter

1. Copy one of the chapter folders, e.g. `work/` to `talks/`, and change its
   words, its numeral and its `<title>`.
2. Add a line for it to the contents list in `index.html`.
3. Add a tab for it to the `<nav class="thumb-index">` at the end of every
   chapter page.

---

## Putting it on the internet

Use **Vercel**: it serves the pages and also runs `api/drop.js`, the drop box's
function. This edition lives in the `v2` folder of the repository, so when you
import the repository in Vercel, set **Root Directory** to `v2`. (Or, in this
folder, run `npx vercel`, accept the defaults, then `npx vercel --prod`.) Set
`DISCORD_WEBHOOK_URL` first (see "The drop box").

Any static host (Netlify Drop, GitHub Pages) can serve the pages, but not the
drop box function, so the box would only ever say it is not connected.

Host it at the root of a domain (`yourname.com`, not `yourname.com/site/`) and
the "page torn out" 404 page will find its styles. Every other page works at
any address.

`serve.mjs` is only for previewing on your own machine; uploading it does no
harm.

---

## Type and credits

- **IM Fell English SC** and **IM Fell DW Pica**, Igino Marini's revivals of
  the Fell types, served by Google Fonts under the SIL Open Font License.
- The grain, ornaments, icons and favicon are drawn in code in this folder.
- Inspired by Lynn Fisher's [lynnandtonic.com](https://lynnandtonic.com).
