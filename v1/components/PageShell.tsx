import Link from "next/link";
import { site } from "@/content/site";

/* ============================================================================
   CHILD PAGE SHELL

   Every page off the hub shares this frame: a way back to the board at the
   top, the content, and the neighbouring pages at the bottom.

   The sibling links at the foot are the "interlinked" part. Without them each
   page is a dead end that forces you back to the hub to go anywhere, which
   makes a six-page site feel like six separate sites.
   ========================================================================== */

export default function PageShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const pages = site.pages;
  const i = pages.findIndex((p) => p.slug === slug);
  const current = pages[i];
  // Wrap around, so the sequence never ends in a dead end.
  const prev = pages[(i - 1 + pages.length) % pages.length];
  const next = pages[(i + 1) % pages.length];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent"
        />
        <div className="shell relative flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href="/" className="group -my-2 flex items-center gap-3 py-2">
            <span
              aria-hidden
              className="inline-block size-3 bg-blue transition-transform duration-500 group-hover:-rotate-45"
            />
            <span className="t-micro">Index</span>
          </Link>

          <p className="t-micro dimmer">
            {current?.index} / {String(pages.length).padStart(2, "0")}
          </p>
        </div>
      </header>

      <main id="main" className="pt-16 md:pt-20">
        {children}

        <nav
          aria-label="Nearby pages"
          className="shell pb-[clamp(3rem,7vw,5rem)]"
        >
          <div className="grid gap-[clamp(0.6rem,1vw,0.9rem)] sm:grid-cols-2">
            {[
              { p: prev, dir: "Previous", arrow: "←" },
              { p: next, dir: "Next", arrow: "→" },
            ].map(({ p, dir, arrow }) => (
              <Link
                key={dir}
                href={`/${p.slug}`}
                className="card card-lg group flex items-end justify-between gap-4 border border-white/14 bg-ink p-[clamp(1.1rem,2vw,1.75rem)] transition-colors duration-500 hover:border-white/35"
              >
                <span>
                  <span className="t-micro dimmer mb-3 block">{dir}</span>
                  <span className="text-[clamp(1.35rem,2.6vw,2rem)] font-semibold leading-none tracking-[-0.035em]">
                    {p.title}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="t-micro dimmer transition-transform duration-500 group-hover:translate-x-1"
                >
                  {arrow}
                </span>
              </Link>
            ))}
          </div>

          <p className="t-micro dimmer mt-[clamp(2rem,4vw,3rem)] border-t border-white/14 pt-5">
            © {new Date().getFullYear()} {site.name}
          </p>
        </nav>
      </main>
    </>
  );
}
