import { site, type WorkItem } from "@/content/site";
import DitherImage from "./primitives/DitherImage";
import Eyebrow from "./primitives/Eyebrow";
import SplitReveal from "./primitives/SplitReveal";
import Fade from "./primitives/Fade";

/* Surfaces cycle so the grid never reads as a uniform list of boxes. Three
   colours only — the variety comes from arrangement, not from new hues. */
const SURFACES = [
  { card: "bg-ink text-white", rule: "border-white/14", meta: "text-white" },
  { card: "bg-blue text-white halftone", rule: "border-white/25", meta: "text-white" },
  { card: "bg-off text-black", rule: "border-black/14", meta: "text-black" },
] as const;

function Card({ item, i }: { item: WorkItem; i: number }) {
  const surface = SURFACES[i % SURFACES.length];
  const span =
    item.span === "full"
      ? "md:col-span-3"
      : item.span === "wide"
        ? "md:col-span-2"
        : item.span === "tall"
          ? "md:row-span-2"
          : "";

  const Wrapper = item.href ? "a" : "div";

  return (
    <Fade
      as="li"
      delay={i * 0.08}
      className={`${span} group relative`}
    >
      <Wrapper
        {...(item.href
          ? { href: item.href, target: "_blank", rel: "noreferrer" }
          : {})}
        className={`card card-lg flex h-full min-h-[clamp(15rem,26vw,22rem)] flex-col justify-between p-[clamp(1.25rem,2.4vw,2rem)] ${surface.card} ${
          item.href ? "transition-transform duration-700 hover:-translate-y-1" : ""
        }`}
      >
        {item.image && (
          <>
            <DitherImage
              name={item.image}
              alt=""
              sizes="(max-width: 768px) 100vw, 66vw"
              className="pointer-events-none absolute inset-0 size-full object-cover opacity-100 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
            />
            {/* Just enough scrim to hold the copy. Any heavier and it kills
                the dither, which is the point of having the image at all. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent"
            />
            {/* The meta row sits in the densest part of the dither; without
                this it is unreadable. */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 to-transparent"
            />
          </>
        )}

        <div className="relative z-[2] flex items-start justify-between gap-4">
          <span className={`t-micro ${surface.meta} opacity-65`}>
            {item.index}
          </span>
          <span className={`t-micro ${surface.meta} text-right opacity-65`}>
            {item.kind}
            <span aria-hidden className="mx-2 opacity-60">
              +
            </span>
            {item.year}
          </span>
        </div>

        <div className="relative z-[2] mt-10">
          <h3 className="t-d3 mb-3">{item.title}</h3>
          <p
            className={`t-small max-w-[46ch] ${
              item.image ? "opacity-85" : "opacity-75"
            }`}
          >
            {item.blurb}
          </p>

          <ul
            className={`mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 ${surface.rule}`}
          >
            {item.stack.map((s) => (
              <li key={s} className={`t-micro ${surface.meta} opacity-70`}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Wrapper>
    </Fade>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      className="bg-black py-[clamp(5rem,12vw,10rem)] scroll-mt-20"
    >
      <div className="shell">
        <div className="mb-[clamp(2.5rem,6vw,4.5rem)]">
          <Fade>
            <Eyebrow className="mb-6">{site.work.eyebrow}</Eyebrow>
          </Fade>
          <SplitReveal
            as="h2"
            text={site.work.heading}
            className="t-d2 block max-w-[16ch]"
          />
        </div>

        <ul className="grid auto-rows-fr gap-[clamp(0.75rem,1.4vw,1.25rem)] md:grid-cols-3">
          {site.work.items.map((item, i) => (
            <Card key={item.index} item={item} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
