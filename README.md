# Harshith K V · Every edition

Each edition of my portfolio site, kept side by side. Every version lives in
its own folder and runs on its own.

| Folder | Edition |
|---|---|
| [`v1/`](v1/) | The first edition: three colours, one typeface and a dithering pipeline. A board of tiles, built with Next.js. |
| [`v2/`](v2/) | The second edition: a book. A sealed leather cover that burns away, a title page, five chapters and one red ink. |

## Looking at a version

Open a terminal in the version's folder, then:

- **v1** is a Next.js app: run `npm install` once, then `npm run dev`, and open
  **http://localhost:3000**.
- **v2** needs no installs: run `node serve.mjs` and open
  **http://localhost:4000**.

## Putting a version online

Import this repository in [Vercel](https://vercel.com) and set **Root
Directory** to the version's folder (for example `v2`). Each version can be its
own Vercel project. The version's README covers anything else it needs.
