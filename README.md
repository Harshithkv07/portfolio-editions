# Harshith K V · Every edition

Each edition of my portfolio site, kept side by side. Every version lives in
its own folder and runs on its own.

| Folder | Edition |
|---|---|
| [`v2/`](v2/) | The second edition: a book. A sealed leather cover that burns away, a title page, five chapters and one red ink. |

## Looking at a version

No installs. Open a terminal in the version's folder and run:

```bash
node serve.mjs
```

Then open **http://localhost:4000**.

## Putting a version online

Import this repository in [Vercel](https://vercel.com) and set **Root
Directory** to the version's folder (for example `v2`). Each version can be its
own Vercel project. The version's README covers anything else it needs.
