"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { loadScrollRuntime, prefersReducedMotion, whenIdle } from "@/lib/scroll";

/**
 * Drives Lenis smooth scrolling and hands its RAF loop to GSAP, so ScrollTrigger
 * and the smooth scroller step off the same clock. Running two separate loops is
 * the usual cause of pinned sections drifting a frame behind the page.
 *
 * Everything here is loaded lazily at an idle moment: smooth scrolling is an
 * enhancement, and making the page wait on it before becoming interactive is a
 * bad trade. Native scrolling works perfectly in the meantime.
 *
 * Does nothing at all when the visitor prefers reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let disposed = false;
    const teardown: Array<() => void> = [];

    const cancelIdle = whenIdle(() => {
      void (async () => {
        const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([
          loadScrollRuntime(),
          import("lenis"),
        ]);
        if (disposed) return;

        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          gestureOrientation: "vertical",
        });

        lenis.on("scroll", ScrollTrigger.update);

        // Exposed so the scroller can be paused from the console while debugging
        // layout, and so automated capture can settle the page deterministically.
        (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        // Anchor links have to go through Lenis or they fight the smooth scroller.
        const onClick = (e: MouseEvent) => {
          const anchor = (e.target as HTMLElement)?.closest?.(
            'a[href^="#"]',
          ) as HTMLAnchorElement | null;
          if (!anchor) return;
          const id = anchor.getAttribute("href");
          if (!id || id === "#") return;
          const el = document.querySelector(id);
          if (!el) return;
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.3 });
        };
        document.addEventListener("click", onClick);

        // ScrollTrigger measured the page before Lenis existed; tell it to
        // remeasure now that the scroll proxy is in place.
        ScrollTrigger.refresh();

        teardown.push(() => {
          document.removeEventListener("click", onClick);
          gsap.ticker.remove(raf);
          lenis.destroy();
          delete (window as unknown as { __lenis?: Lenis }).__lenis;
        });
      })();
    });

    return () => {
      disposed = true;
      cancelIdle();
      teardown.forEach((fn) => fn());
    };
  }, []);

  return null;
}
