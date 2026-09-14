// The drop box on the Contact page posts here; this relays the note to a
// private channel on Harshith's Discord. Vercel runs every file in api/ as a
// small server function, so the webhook address stays on the server and
// never reaches the page.
//
// It needs one environment variable, set in Vercel (Project > Settings >
// Environment Variables), never written into any file:
//   DISCORD_WEBHOOK_URL  the webhook address Discord gives your channel
// The README walks through getting it.

const LIMITS = { message: 2000, name: 80 };

// Forms filled in faster than a person could type are almost always bots.
const TOO_FAST_MS = 1500;

// The site's red, down the edge of each note.
const RUBRIC = 0xff4d3d;

module.exports = async function drop(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(req, res, 405, { ok: false, error: "method" });
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return reply(req, res, 503, { ok: false, error: "not-configured" });

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

  // One card per note: the message, and who sent it if they said. What the
  // visitor typed is shown exactly as typed, and nobody can be pinged.
  const note = {
    username: "Website drop box",
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: "New message from your website",
        description: literally(message),
        color: RUBRIC,
        ...(name ? { fields: [{ name: "From", value: literally(name) }] } : {}),
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const discord = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (!discord.ok) return reply(req, res, 502, { ok: false, error: "discord" });
  } catch {
    return reply(req, res, 502, { ok: false, error: "discord" });
  }

  return reply(req, res, 200, { ok: true });
};

// Discord reads *, _, [links](...), > and the like as formatting. A backslash
// before each makes it show as the character itself.
function literally(text) {
  return text.replace(/[\\*_~`|<>[\]()#-]/g, "\\$&");
}

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
