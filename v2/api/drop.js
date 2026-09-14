// The drop box on the Contact page posts here; this relays the note to
// Harshith's Telegram. Vercel runs every file in api/ as a small server
// function, so the Telegram token stays on the server and never reaches
// the page.
//
// It needs two environment variables, set in Vercel (Project > Settings >
// Environment Variables), never written into any file:
//   TELEGRAM_BOT_TOKEN  the token @BotFather gives your bot
//   TELEGRAM_CHAT_ID    your own chat id with that bot
// The README walks through getting both.

const LIMITS = { message: 2000, name: 80 };

// Forms filled in faster than a person could type are almost always bots.
const TOO_FAST_MS = 1500;

module.exports = async function drop(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(req, res, 405, { ok: false, error: "method" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return reply(req, res, 503, { ok: false, error: "not-configured" });

  const body = readBody(req);

  // The hidden "website" field is left empty by people and filled in by bots.
  // Either way the sender is told it worked, so bots learn nothing.
  const elapsed = Number(body.elapsed);
  if (body.website || (Number.isFinite(elapsed) && elapsed < TOO_FAST_MS)) {
    return reply(req, res, 200, { ok: true });
  }

  const message = String(body.message ?? "").trim().slice(0, LIMITS.message);
  const name = String(body.name ?? "").trim().slice(0, LIMITS.name);
  if (!message) return reply(req, res, 400, { ok: false, error: "empty" });

  // The name (if given) and the message as one note. Plain text, so nothing
  // a visitor types can be read as formatting.
  const text = ["New message from your website", ...(name ? [`From: ${name}`] : []), "", message].join("\n");

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (!telegram.ok) return reply(req, res, 502, { ok: false, error: "telegram" });
  } catch {
    return reply(req, res, 502, { ok: false, error: "telegram" });
  }

  return reply(req, res, 200, { ok: true });
};

// Vercel hands over the body already parsed; accept a raw string too.
function readBody(req) {
  const body = req.body ?? {};
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body);
  } catch {
    return Object.fromEntries(new URLSearchParams(body));
  }
}

// The page's script asks for JSON. A plain form post (no JavaScript) is sent
// back to the Contact page instead, with the outcome in the address.
function reply(req, res, status, result) {
  const wantsJson = String(req.headers?.accept ?? "").includes("application/json");
  if (wantsJson) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(result));
  }
  res.statusCode = 303;
  res.setHeader("Location", `/contact/?${result.ok ? "sent" : "unsent"}#dropbox`);
  return res.end();
}
