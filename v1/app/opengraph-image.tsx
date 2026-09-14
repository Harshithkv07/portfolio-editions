import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/content/site";

/* ============================================================================
   SHARE CARD

   The image that appears when this link is pasted into WhatsApp, LinkedIn,
   Slack, X, iMessage — anywhere. Generated on demand from content/site.ts, so
   it can never fall out of step with the site the way a hand-exported PNG does.

   It reuses the real dithered portrait and the real typeface, so the card and
   the page it links to are visibly the same object.

   You do not need to do anything to keep this current. Change your name or
   your positioning line in content/site.ts and the card follows.
   ========================================================================== */

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.meta.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (...p: string[]) => path.join(process.cwd(), ...p);

/* Until a real domain is set in content/site.ts, the footer would read
   "EXAMPLE.COM", which is worse than no footer at all. */
const host = new URL(site.meta.url).host;
const hasRealDomain = !/(^|\.)example\.(com|org|net)$/.test(host);

export default async function Image() {
  const [sans, mono, portrait] = await Promise.all([
    readFile(asset("assets", "fonts", "Geist-SemiBold.ttf")),
    readFile(asset("assets", "fonts", "GeistMono-Medium.ttf")),
    readFile(asset("public", "dither", "portrait-1200.png")),
  ]);

  const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000000",
          fontFamily: "Geist",
        }}
      >
        {/* The same dither the hero uses, cropped to the right half. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portraitSrc}
          alt=""
          width={700}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 700,
            height: 630,
            objectFit: "cover",
            objectPosition: "58% 42%",
          }}
        />

        {/* Holds the type against the densest part of the dot screen. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, #000000 34%, rgba(0,0,0,0.82) 56%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: 68,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 14, height: 14, background: "#0000fd" }} />
            <div
              style={{
                fontFamily: "GeistMono",
                fontSize: 20,
                letterSpacing: 3,
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              {site.role}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 108,
                fontWeight: 600,
                letterSpacing: -5,
                lineHeight: 1,
                color: "#ffffff",
              }}
            >
              {site.name}
            </div>
            <div
              style={{
                marginTop: 26,
                fontSize: 32,
                lineHeight: 1.3,
                letterSpacing: -0.6,
                color: "rgba(255,255,255,0.72)",
                maxWidth: 560,
                display: "flex",
              }}
            >
              {site.positioning}
            </div>
          </div>

          {hasRealDomain ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontFamily: "GeistMono",
                fontSize: 18,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
              }}
            >
              <div style={{ width: 44, height: 1, background: "rgba(255,255,255,0.35)" }} />
              {host}
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, style: "normal", weight: 600 },
        { name: "GeistMono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
