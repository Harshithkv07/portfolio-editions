import Link from "next/link";
import DitherImage from "../primitives/DitherImage";
import { site } from "@/content/site";

/* ============================================================================
   HUB TILE

   One door on the board. The whole tile is the link target — not a "read more"
   buried in a corner — because on a board of tiles the tile is the affordance.

   Each tile carries a different visual so the board reads as a composition
   rather than a list of identical boxes. That variety is doing the same job
   the reference brand board does: a logo lockup, a type specimen, a portrait
   and a swatch strip all sitting in one grid.
   ========================================================================== */

export type TileSpan = "hero" | "wide" | "tall" | "std" | "slim";
export type TileVisual =
  | "portrait"
  | "rows"
  | "index"
  | "blue"
  | "swatches"
  | "arrow";

const SPAN: Record<TileSpan, string> = {
  hero: "md:col-span-4",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
  std: "md:col-span-1 md:row-span-1",
  slim: "md:col-span-1 md:row-span-2",
};

/* Minimum heights per span, so a tile with little content still holds its
   share of the grid instead of collapsing. */
const MIN_H: Record<TileSpan, string> = {
  hero: "min-h-[clamp(9rem,14vw,13rem)]",
  wide: "min-h-[clamp(11rem,16vw,15rem)]",
  tall: "min-h-[clamp(17rem,32vw,30rem)]",
  std: "min-h-[clamp(11rem,16vw,15rem)]",
  slim: "min-h-[clamp(17rem,32vw,30rem)]",
};

function Visual({ kind }: { kind: TileVisual }) {
  switch (kind) {
    case "portrait":
      return (
        <>
          <DitherImage
            name="portrait"
            alt=""
            sizes="(max-width: 768px) 100vw, 25vw"
            className="pointer-events-none absolute inset-0 size-full object-cover object-[58%_38%] transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent"
          />
        </>
      );

    case "rows":
      // A miniature of the day page's numbered rows, ghosted with the same
      // scanline mask the real thing uses on inactive rows.
      //
      // This tile is two columns wide, so the preview lives in the right half
      // and the title keeps the left. Stacking them vertically collided: the
      // tile is short and wide, and there is no room above the title.
      //
      // The active row is white on a blue band rather than blue text on black.
      // That is what the real page does, and blue type on near-black cannot
      // reach 3:1 no matter how large it is set.
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] flex-col justify-center gap-1.5 pr-[clamp(1.1rem,2vw,1.75rem)] sm:flex"
        >
          {site.rhythm.rows.slice(0, 3).map((r, i) => {
            const active = i === 1;
            return (
              <div
                key={r.index}
                className={`flex items-baseline gap-3 pt-1.5 ${
                  active
                    ? "-mx-2 bg-blue px-2"
                    : "scanline border-t border-white/10 opacity-50"
                }`}
              >
                {/* No opacity of its own: on a ghost row it inherits the
                    row's dimming, and on the blue band it needs to be full
                    white to stay legible at 11px. */}
                <span className="t-micro">{r.index}</span>
                <span className="text-[clamp(1rem,2.2vw,1.5rem)] font-semibold leading-none tracking-[-0.03em]">
                  {r.label}
                </span>
              </div>
            );
          })}
        </div>
      );

    case "index":
      // Rendered through a pseudo-element rather than as a text node. At seven
      // percent opacity this is texture, not writing — putting it in the DOM
      // means every contrast checker correctly flags unreadable text, because
      // that is exactly what it is.
      return (
        <div
          aria-hidden
          className="tile-watermark pointer-events-none absolute inset-0 flex items-center justify-center"
          style={
            {
              "--watermark": `"${String(site.work.items.length).padStart(2, "0")}"`,
            } as React.CSSProperties
          }
        />
      );

    case "blue":
      return (
        <div
          aria-hidden
          className="halftone pointer-events-none absolute inset-0 bg-blue"
        />
      );

    case "swatches":
      // The palette card from the reference board, as a band across the top.
      // Filling the whole tile would put the label on white and force the type
      // to invert, which then fights every other tile on the board.
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 flex h-[42%] flex-col"
        >
          <div className="flex-1 bg-blue" />
          <div className="flex-1 bg-white" />
        </div>
      );

    case "arrow":
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[clamp(3rem,7vw,5.5rem)] leading-none opacity-10 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:opacity-20">
            ↗
          </span>
        </div>
      );
  }
}

export default function Tile({
  slug,
  index,
  title,
  hint,
  span,
  visual,
  delay = 0,
}: {
  slug: string;
  index: string;
  title: string;
  hint: string;
  span: TileSpan;
  visual: TileVisual;
  delay?: number;
}) {
  // Every visual leaves the lower half of the tile dark, so titles stay white
  // throughout. The one exception is the meta row on the palette tile, which
  // sits on the blue band and cannot afford to be dimmed at 11px.
  const onLight = false;
  const metaOpacity = visual === "swatches" ? "opacity-100" : "opacity-60";

  return (
    <Link
      href={`/${slug}`}
      className={`card card-lg tile-in group relative flex flex-col justify-between overflow-hidden border border-white/14 bg-ink p-[clamp(1.1rem,2vw,1.75rem)] transition-colors duration-500 hover:border-white/35 ${SPAN[span]} ${MIN_H[span]}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Visual kind={visual} />

      <div className="relative z-[2] flex items-start justify-between gap-3">
        <span className={`t-micro ${onLight ? "text-black" : ""} ${metaOpacity}`}>
          {index}
        </span>
        <span
          aria-hidden
          className={`t-micro opacity-0 transition-opacity duration-500 group-hover:opacity-70 ${
            onLight ? "text-black" : ""
          }`}
        >
          Open
        </span>
      </div>

      <div className="relative z-[2] mt-8">
        <h2
          className={`text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold leading-[0.95] tracking-[-0.035em] ${
            onLight ? "text-black" : ""
          }`}
        >
          {title}
        </h2>
        <p
          className={`t-small mt-2 max-w-[24ch] ${
            onLight ? "text-black/70" : "opacity-55"
          }`}
        >
          {hint}
        </p>
      </div>
    </Link>
  );
}
