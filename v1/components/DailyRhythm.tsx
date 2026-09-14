"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { loadScrollRuntime, prefersReducedMotion } from "@/lib/scroll";
import Eyebrow from "./primitives/Eyebrow";
import SplitReveal from "./primitives/SplitReveal";

const rows = site.rhythm.rows;

export default function DailyRhythm() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  // Set once GSAP has arrived; until then the band stays parked and the rows
  // render in their static state.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;
    if (prefersReducedMotion()) return;

    let disposed = false;
    let revert: (() => void) | null = null;

    // GSAP is only fetched once this section is within a screen or so of the
    // viewport. On first load it is well below the fold, so the visitor never
    // waits on it.
    const preload = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        preload.disconnect();

        void loadScrollRuntime().then(({ gsap, ScrollTrigger }) => {
          if (disposed) return;

          const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Desktop: pin the section and let scroll distance drive the index.
            mm.add("(min-width: 768px)", () => {
              ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: () => `+=${rows.length * 62}%`,
                pin: true,
                pinSpacing: true,
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  // Bias slightly so the last row is reachable without
                  // overscrolling.
                  const i = Math.min(
                    rows.length - 1,
                    Math.floor(self.progress * rows.length * 1.001),
                  );
                  setActive(i);
                },
              });
            });

            // Mobile: no pin. Whichever row is nearest the middle wins.
            mm.add("(max-width: 767px)", () => {
              const items = Array.from(
                list.querySelectorAll<HTMLLIElement>("[data-row]"),
              );
              const io = new IntersectionObserver(
                (entries) => {
                  for (const e of entries) {
                    if (e.isIntersecting) {
                      setActive(Number((e.target as HTMLElement).dataset.row));
                    }
                  }
                },
                { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
              );
              items.forEach((el) => io.observe(el));
              return () => io.disconnect();
            });
          }, section);

          revert = () => ctx.revert();
          setReady(true);
        });
      },
      { rootMargin: "150% 0px 150% 0px" },
    );
    preload.observe(section);

    return () => {
      disposed = true;
      preload.disconnect();
      revert?.();
    };
  }, []);

  // The band is a single element that slides and resizes between rows. Using
  // one moving element rather than a background per row is what produces the
  // liquid travel in the reference instead of a crossfade.
  useLayoutEffect(() => {
    const list = listRef.current;
    const band = bandRef.current;
    if (!list || !band || reduced || !ready) return;

    const target = list.querySelector<HTMLElement>(`[data-row="${active}"]`);
    if (!target) return;

    // loadScrollRuntime is already resolved by the time `ready` is set, so this
    // resolves synchronously from cache and the band never lags a frame.
    void loadScrollRuntime().then(({ gsap }) => {
      gsap.to(band, {
        y: target.offsetTop,
        height: target.offsetHeight,
        duration: 0.62,
        ease: "expo.out",
        overwrite: true,
      });
    });
  }, [active, reduced, ready]);

  return (
    <section
      ref={sectionRef}
      id="day"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-black py-[clamp(4rem,9vw,7rem)] scroll-mt-0"
    >
      <div className="shell w-full">
        <div className="mb-[clamp(2rem,5vw,4rem)] flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow className="mb-6">{site.rhythm.eyebrow}</Eyebrow>
            <SplitReveal
              as="h2"
              text={site.rhythm.heading}
              className="t-d3 block max-w-[20ch]"
            />
          </div>
          <p className="t-micro dimmer shrink-0">
            {String(active + 1).padStart(2, "0")} / {String(rows.length).padStart(2, "0")}
          </p>
        </div>

        <ul ref={listRef} className="relative">
          {/* The travelling highlight. Full-bleed via negative inline margins
              so it breaks the gutter the way the reference does. */}
          {!reduced && (
            <div
              ref={bandRef}
              aria-hidden
              className="pointer-events-none absolute left-[calc(var(--gutter)*-1)] right-[calc(var(--gutter)*-1)] top-0 z-0 bg-blue"
            />
          )}

          {rows.map((row, i) => {
            const isActive = reduced || i === active;
            return (
              <li
                key={row.index}
                data-row={i}
                className="relative z-[1] border-t border-white/14 last:border-b"
              >
                <div className="flex flex-col gap-2 py-[clamp(0.9rem,2vw,1.5rem)] md:flex-row md:items-center md:gap-8">
                  <span
                    className={`t-micro w-8 shrink-0 transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-55"
                    }`}
                  >
                    {row.index}
                  </span>

                  <h3
                    className={`t-row shrink-0 transition-opacity duration-500 md:w-[42%] ${
                      isActive
                        ? "opacity-100"
                        : // The scanline mask does the ghosting; opacity stays
                          // high enough for the label to clear contrast.
                          "scanline opacity-60"
                    }`}
                  >
                    {row.label}
                  </h3>

                  <span
                    className={`t-micro hidden w-16 shrink-0 transition-opacity duration-500 md:block ${
                      isActive ? "opacity-80" : "opacity-55"
                    }`}
                  >
                    {row.time}
                  </span>

                  {/* On mobile the detail collapses to nothing rather than
                      just fading, or every inactive row leaves a hole the
                      height of two lines of text. Desktop keeps it always
                      open and dims it instead. */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] md:grid-rows-[1fr] ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <p
                      className={`t-small max-w-[52ch] overflow-hidden transition-opacity duration-500 ${
                        isActive ? "opacity-90" : "opacity-0 md:opacity-55"
                      }`}
                    >
                      {row.detail}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
