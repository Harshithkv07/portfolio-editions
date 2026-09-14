import type { Metadata } from "next";
import { site } from "@/content/site";
import Eyebrow from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: `Not found — ${site.name}`,
  robots: { index: false, follow: true },
};

/**
 * Shown for any URL that does not exist. Built in the same language as the rest
 * of the site, because a stock framework error page is the fastest way to break
 * the impression everything else works to create.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-between bg-black py-[clamp(2rem,5vw,3rem)]">
      <div className="shell">
        <a href="/" className="group -my-2 flex items-center gap-3 py-2">
          <span
            aria-hidden
            className="inline-block size-3 bg-blue transition-transform duration-500 group-hover:rotate-45"
          />
          <span className="t-micro">{site.shortName}</span>
        </a>
      </div>

      <div className="shell">
        <Eyebrow className="mb-[clamp(1.5rem,4vw,2.5rem)]">Error 404</Eyebrow>

        {/* The scanline treatment the rhythm section uses for inactive rows.
            Here it does the work of saying "this page is not really here"
            without needing a sentence to say it. */}
        <p aria-hidden className="scanline t-d0 mb-[clamp(1.5rem,4vw,2.5rem)] select-none">
          404
        </p>

        <h1 className="t-d3 mb-5 max-w-[20ch]">This page does not exist.</h1>
        <p className="t-body dim max-w-[42ch]">
          The link is either wrong, or it pointed at something that has since
          been taken down.
        </p>

        <a
          href="/"
          className="t-micro group mt-[clamp(2.5rem,6vw,4rem)] inline-flex items-center gap-3 border-t border-white/14 pt-6"
        >
          Back to the start
          <span
            aria-hidden
            className="inline-block h-px w-10 bg-white/40 transition-all duration-500 group-hover:w-16 group-hover:bg-blue"
          />
        </a>
      </div>

      <div className="shell">
        <p className="t-micro dimmer">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </main>
  );
}
