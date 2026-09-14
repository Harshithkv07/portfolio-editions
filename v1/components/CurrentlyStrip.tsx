import { site } from "@/content/site";

/**
 * The one dated thing on the page. Deliberately a single line: the cheapest
 * possible piece of content to keep current, so it actually stays current.
 */
export default function CurrentlyStrip() {
  return (
    <aside className="halftone bg-blue text-white">
      <div className="shell relative z-[2] flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-8 sm:py-4">
        <p className="t-micro flex shrink-0 items-center gap-2.5">
          <span aria-hidden className="inline-block size-2 bg-white" />
          Currently
          <span aria-hidden className="opacity-50">
            +
          </span>
          <span className="opacity-70">{site.currently.date}</span>
        </p>
        <p className="t-body font-medium tracking-[-0.01em]">
          {site.currently.text}
        </p>
      </div>
    </aside>
  );
}
