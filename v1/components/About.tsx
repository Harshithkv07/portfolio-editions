import { site } from "@/content/site";
import Eyebrow from "./primitives/Eyebrow";
import SplitReveal from "./primitives/SplitReveal";
import Fade from "./primitives/Fade";

export default function About() {
  const { about } = site;

  return (
    <section
      id="about"
      className="bg-black py-[clamp(5rem,12vw,10rem)] scroll-mt-20"
    >
      <div className="shell">
        <Fade>
          <Eyebrow className="mb-[clamp(2.5rem,6vw,5rem)]">
            {about.eyebrow}
          </Eyebrow>
        </Fade>

        <div className="grid gap-[clamp(2.5rem,6vw,6rem)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitReveal
              as="h2"
              text={about.statement}
              className="t-d2 block text-balance"
            />
          </div>

          <div className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            <div className="flex flex-col gap-5">
              {about.body.map((p, i) => (
                <Fade key={i} delay={0.1 + i * 0.1}>
                  <p className="t-body dim max-w-[46ch]">{p}</p>
                </Fade>
              ))}
            </div>

            <Fade delay={0.3}>
              <dl className="flex flex-col">
                {about.facts.map((f) => (
                  <div
                    key={f.k}
                    className="flex items-baseline justify-between gap-6 border-t border-white/14 py-3.5"
                  >
                    <dt className="t-micro dimmer">{f.k}</dt>
                    <dd className="t-small text-right">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
