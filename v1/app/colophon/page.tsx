import type { Metadata } from "next";
import { site } from "@/content/site";
import PageShell from "@/components/PageShell";
import Eyebrow from "@/components/primitives/Eyebrow";
import SplitReveal from "@/components/primitives/SplitReveal";
import Fade from "@/components/primitives/Fade";

const page = site.pages.find((p) => p.slug === "colophon")!;

export const metadata: Metadata = {
  title: `${page.title} — ${site.name}`,
  description: page.hint,
  alternates: { canonical: "/colophon" },
};

/* `dim` is the opacity the swatch name can afford. On the blue chip, 11px
   white at 60% falls to 3.4:1 — under the 4.5:1 that small text needs — so
   that one label stays at full strength. */
const SWATCHES = [
  { hex: "#0000FD", name: "Blue", cls: "bg-blue", ink: "text-white", dim: "opacity-100" },
  { hex: "#000000", name: "Black", cls: "bg-black", ink: "text-white", dim: "opacity-60" },
  { hex: "#FFFFFF", name: "White", cls: "bg-white", ink: "text-black", dim: "opacity-60" },
];

/**
 * The design system, stated plainly. A site that looks this deliberate should
 * be able to account for itself, and the palette card doubles as the strongest
 * visual on the page — it is lifted directly from the reference board.
 */
export default function Colophon() {
  return (
    <PageShell slug="colophon">
      <section className="py-[clamp(3rem,8vw,7rem)]">
        <div className="shell">
          <Fade>
            <Eyebrow className="mb-6">{site.colophon.eyebrow}</Eyebrow>
          </Fade>

          <SplitReveal
            as="h1"
            text={site.colophon.heading}
            className="t-d2 mb-[clamp(1.5rem,4vw,2.5rem)] block max-w-[16ch]"
          />

          <Fade delay={0.12}>
            <p className="t-lead dim max-w-[46ch]">{site.colophon.intro}</p>
          </Fade>

          {/* The palette, at the size it deserves. */}
          <Fade delay={0.2}>
            <ul className="mt-[clamp(3rem,7vw,5rem)] grid gap-[clamp(0.6rem,1vw,0.9rem)] sm:grid-cols-3">
              {SWATCHES.map((s) => (
                <li
                  key={s.hex}
                  className={`card card-lg flex min-h-[clamp(9rem,18vw,14rem)] flex-col justify-end border border-white/14 p-[clamp(1.1rem,2vw,1.75rem)] ${s.cls} ${s.ink}`}
                >
                  <span className={`t-micro ${s.dim}`}>{s.name}</span>
                  <span className="t-micro mt-1">{s.hex}</span>
                </li>
              ))}
            </ul>
          </Fade>

          {/* Type specimen, echoing the reference board's Aa card — the middle
              weight wears the scanline mask that the rest of the site uses. */}
          <Fade delay={0.26}>
            <div className="card card-lg mt-[clamp(0.6rem,1vw,0.9rem)] flex items-center justify-around gap-6 border border-white/14 bg-ink px-6 py-[clamp(2rem,5vw,3.5rem)]">
              <span className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-none tracking-[-0.04em]">
                Aa
              </span>
              <span className="scanline text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none tracking-[-0.04em] opacity-70">
                Aa
              </span>
              <span className="text-[clamp(2.5rem,8vw,6rem)] font-normal leading-none tracking-[-0.04em]">
                Aa
              </span>
            </div>
          </Fade>

          <Fade delay={0.32}>
            <dl className="mt-[clamp(3rem,7vw,5rem)] grid gap-x-12 gap-y-0 sm:grid-cols-2">
              {site.colophon.notes.map((n) => (
                <div
                  key={n.k}
                  className="border-t border-white/14 py-[clamp(1.25rem,2.5vw,2rem)]"
                >
                  <dt className="t-micro dimmer mb-3">{n.k}</dt>
                  <dd className="t-body dim max-w-[44ch]">{n.v}</dd>
                </div>
              ))}
            </dl>
          </Fade>
        </div>
      </section>
    </PageShell>
  );
}
