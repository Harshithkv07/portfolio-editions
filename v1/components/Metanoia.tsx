import { site } from "@/content/site";
import Eyebrow from "./primitives/Eyebrow";
import SplitReveal from "./primitives/SplitReveal";
import Fade from "./primitives/Fade";

/**
 * The peak of the page. Full-bleed blue, halftone screen, almost no interface.
 * Everything else on the site is black; this section is the only place the
 * accent takes the whole viewport, which is what makes it land.
 */
export default function Metanoia() {
  const { metanoia } = site;

  return (
    <section
      id="metanoia"
      className="halftone relative flex min-h-[100svh] flex-col justify-between bg-blue py-[clamp(3rem,8vw,6rem)] text-white scroll-mt-0"
    >
      <div className="shell relative z-[2]">
        <Fade>
          <Eyebrow tone="invert">{metanoia.eyebrow}</Eyebrow>
        </Fade>
      </div>

      <div className="shell relative z-[2] py-[clamp(3rem,8vw,6rem)]">
        <Fade>
          <p className="t-micro mb-[clamp(1.5rem,4vw,2.5rem)] opacity-60">
            {metanoia.definition}
          </p>
        </Fade>

        <SplitReveal
          as="h2"
          text={metanoia.wordmark}
          className="t-d0 mb-[clamp(2rem,5vw,3.5rem)] block"
        />

        <div className="grid gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitReveal
              text={metanoia.statement}
              className="t-d3 block text-balance"
              stagger={0.06}
            />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
            {metanoia.body.map((p, i) => (
              <Fade key={i} delay={0.12 + i * 0.08}>
                <p className="t-body max-w-[44ch] opacity-80">{p}</p>
              </Fade>
            ))}
            {metanoia.href && (
              <Fade delay={0.3}>
                <a
                  href={metanoia.href}
                  target="_blank"
                  rel="noreferrer"
                  className="t-micro group mt-2 inline-flex items-center gap-3"
                >
                  Visit Metanoia
                  <span
                    aria-hidden
                    className="inline-block h-px w-8 bg-white/60 transition-all duration-500 group-hover:w-14 group-hover:bg-white"
                  />
                </a>
              </Fade>
            )}
          </div>
        </div>
      </div>

      <div className="shell relative z-[2]">
        <Fade>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/25 pt-6">
            {metanoia.principles.map((p, i) => (
              <li key={p} className="flex items-center gap-5">
                {i > 0 && (
                  <span aria-hidden className="t-micro opacity-45">
                    +
                  </span>
                )}
                <span className="t-d3">{p}</span>
              </li>
            ))}
          </ul>
        </Fade>
      </div>
    </section>
  );
}
