import { site } from "@/content/site";
import Eyebrow from "./primitives/Eyebrow";
import SplitReveal from "./primitives/SplitReveal";
import Fade from "./primitives/Fade";
import ContactForm from "./ContactForm";

export default function Contact() {
  const links = site.contact.links.filter((l) => l.href);
  const hasForm = Boolean(site.contact.form.endpoint);

  return (
    // A section, not a footer: PageShell supplies the page furniture now, and
    // two copyright lines on one page is worse than none.
    <section id="contact" className="bg-black py-[clamp(4rem,10vw,7rem)]">
      <div className="shell">
        <Fade>
          <Eyebrow className="mb-[clamp(2rem,5vw,3.5rem)]">
            {site.contact.eyebrow}
          </Eyebrow>
        </Fade>

        <SplitReveal
          as="h2"
          text={site.contact.heading}
          className="t-d1 mb-[clamp(1.5rem,4vw,2.5rem)] block"
        />

        <Fade delay={0.1}>
          <p className="t-lead dim mb-[clamp(2.5rem,6vw,4rem)] max-w-[36ch]">
            {site.contact.line}
          </p>
        </Fade>

        <Fade delay={0.18}>
          <ContactForm />
        </Fade>

        {links.length > 0 && (
          <Fade delay={0.24}>
            <ul className="mt-[clamp(2rem,4vw,3rem)] -mb-2 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/14 pt-5">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="me noreferrer"
                    className="t-micro dim block py-2 transition-opacity duration-300 hover:opacity-100"
                  >
                    {l.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Fade>
        )}

        {/* With no form endpoint and no links filled in there is genuinely no
            way to make contact, and a page that only says "say something"
            while offering no means to do it is worse than an honest gap. */}
        {!hasForm && links.length === 0 && (
          <Fade delay={0.24}>
            <p className="t-small dim max-w-[46ch] border-t border-white/14 pt-5">
              No contact method is configured yet. Add a form endpoint or a
              profile link in <code className="font-mono">content/site.ts</code>.
            </p>
          </Fade>
        )}
      </div>
    </section>
  );
}
