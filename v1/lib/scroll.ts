/* ============================================================================
   LAZY SCROLL RUNTIME

   GSAP, ScrollTrigger and Lenis together are the single largest piece of
   JavaScript on this site, and none of it is needed to render the page — the
   smooth scrolling is an enhancement and the pinned section is below the fold.

   Loading them eagerly cost roughly 400ms of main-thread scripting before the
   page became interactive. This module defers all three to an idle moment and
   hands back one shared instance, so the two components that need them do not
   pull in two copies or race each other.
   ========================================================================== */

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type ScrollRuntime = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
};

let runtime: Promise<ScrollRuntime> | null = null;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Loads GSAP + ScrollTrigger once and registers the plugin. */
export function loadScrollRuntime(): Promise<ScrollRuntime> {
  runtime ??= (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  })();
  return runtime;
}

/** Runs a callback when the browser is next idle, or soon, whichever comes
    first. Safari has no requestIdleCallback, hence the fallback. */
export function whenIdle(fn: () => void, timeout = 2000): () => void {
  if (typeof window === "undefined") return () => {};

  const ric = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    }
  ).requestIdleCallback;

  if (ric) {
    const id = ric(fn, { timeout });
    return () =>
      (
        window as unknown as { cancelIdleCallback?: (id: number) => void }
      ).cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}
