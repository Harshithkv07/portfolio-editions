import { site } from "@/content/site";
import Tile, { type TileSpan, type TileVisual } from "@/components/hub/Tile";
import Eyebrow from "@/components/primitives/Eyebrow";
import SplitReveal from "@/components/primitives/SplitReveal";
import Fade from "@/components/primitives/Fade";

/* ============================================================================
   THE HUB

   The board. Every tile is a door to its own page, so this is the only screen
   that has to say who Harshith is at a glance — everything else has room to
   explain itself properly once you are through the door.

   There is deliberately no navigation bar here. The tiles are the navigation,
   and a menu duplicating them would only compete with the composition.
   ========================================================================== */

export default function Hub() {
  return (
    <main
      id="main"
      className="flex min-h-[100svh] flex-col justify-between gap-[clamp(2.5rem,6vw,4rem)] py-[clamp(1.75rem,4vw,3rem)]"
    >
      <header className="shell">
        <Fade>
          <Eyebrow className="mb-[clamp(1.25rem,3vw,2rem)]">
            {site.role} — {site.currently.date}
          </Eyebrow>
        </Fade>

        <div className="flex flex-col gap-x-12 gap-y-4 lg:flex-row lg:items-end lg:justify-between">
          <SplitReveal
            as="h1"
            text={site.name}
            className="t-d1 block"
          />
          <Fade delay={0.15}>
            <p className="t-lead dim max-w-[34ch] lg:pb-2">{site.positioning}</p>
          </Fade>
        </div>
      </header>

      {/* Four columns on desktop, matching the reference board's density.
          Two on tablet, one on a phone — where a bento becomes a stack and
          pretending otherwise just makes the tiles unreadably small. */}
      <div className="shell">
        <div className="grid grid-cols-1 gap-[clamp(0.6rem,1vw,0.9rem)] sm:grid-cols-2 md:auto-rows-fr md:grid-cols-4">
          {site.pages.map((p, i) => (
            <Tile
              key={p.slug}
              slug={p.slug}
              index={p.index}
              title={p.title}
              hint={p.hint}
              span={p.span as TileSpan}
              visual={p.visual as TileVisual}
              delay={0.06 * i}
            />
          ))}
        </div>
      </div>

      <footer className="shell">
        <div className="flex flex-col gap-3 border-t border-white/14 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-micro dimmer">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="t-micro dimmer">{site.currently.text}</p>
        </div>
      </footer>
    </main>
  );
}
