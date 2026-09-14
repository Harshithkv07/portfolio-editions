import { site } from "@/content/site";
import DitherImage from "./primitives/DitherImage";
import Eyebrow from "./primitives/Eyebrow";
import SplitReveal from "./primitives/SplitReveal";
import Fade from "./primitives/Fade";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black"
    >
      <DitherImage
        name="portrait"
        alt=""
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 size-full object-cover object-[62%_42%] opacity-95"
      />

      {/* Reads the name against the brightest part of the dither. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 to-transparent"
      />

      <div className="shell relative z-10 pb-[clamp(2.5rem,6vw,5rem)] pt-40">
        <Fade>
          <Eyebrow className="mb-[clamp(1.5rem,4vw,3rem)]">
            {site.role} — {site.currently.date}
          </Eyebrow>
        </Fade>

        <SplitReveal
          as="h1"
          text={site.name}
          className="t-d0 block max-w-[16ch]"
        />

        <div className="mt-[clamp(1.75rem,4vw,3rem)] flex flex-col gap-8 border-t border-white/14 pt-6 sm:flex-row sm:items-start sm:justify-between">
          <Fade delay={0.15} className="max-w-[38ch]">
            <p className="t-lead">{site.positioning}</p>
          </Fade>

          <Fade delay={0.25}>
            <a
              href="#about"
              className="t-micro group inline-flex items-center gap-3 whitespace-nowrap"
            >
              <span className="dim transition-opacity group-hover:opacity-100">
                Scroll
              </span>
              <span
                aria-hidden
                className="inline-block h-px w-10 bg-white/40 transition-all duration-500 group-hover:w-16 group-hover:bg-blue"
              />
            </a>
          </Fade>
        </div>
      </div>
    </section>
  );
}
