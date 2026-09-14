// A tiny local server so you can preview the site. No installs needed.
//
//   node serve.mjs          -> http://localhost:4000
//   node serve.mjs 5000     -> a different port
//
// Press Ctrl+C to stop it. Nothing here is needed once the site is online.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const port = Number(process.argv[2]) || 4000;
const root = resolve(process.argv[3] || fileURLToPath(new URL(".", import.meta.url)));

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, safe);
  if (!file.startsWith(root)) return null;
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

// Runs a file in api/ the way Vercel does, so the drop box works here too.
// It reads the same DISCORD_WEBHOOK_URL environment variable; if that is
// not set it answers "not configured", which the page explains politely.
async function runFunction(name, req, res) {
  const file = join(root, "api", name.replace(/[^a-z0-9-]/gi, "") + ".js");
  try {
    await stat(file);
  } catch {
    res.writeHead(404);
    return res.end();
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  const type = req.headers["content-type"] ?? "";
  try {
    req.body = type.includes("json") ? JSON.parse(raw || "{}") : Object.fromEntries(new URLSearchParams(raw));
  } catch {
    req.body = {};
  }
  delete require.cache[file];
  return require(file)(req, res);
}

createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;

  if (path.startsWith("/api/")) return runFunction(path.slice(5), req, res);

  // Match how real hosts behave: /about -> /about/
  if (!extname(path) && !path.endsWith("/")) {
    const dir = await resolveFile(path + "/");
    if (dir) {
      res.writeHead(301, { Location: path + "/" });
      return res.end();
    }
  }

  const file = await resolveFile(path);
  if (!file) {
    const notFound = await resolveFile("/404.html");
    res.writeHead(404, { "Content-Type": types[".html"] });
    return res.end(notFound ? await readFile(notFound) : "Not found");
  }
  res.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  res.end(await readFile(file));
}).listen(port, () => {
  console.log(`Serving ${root}\n  -> http://localhost:${port}`);
});
