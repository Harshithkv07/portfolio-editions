/* ============================================================================
   SHARED OBSERVERS

   There are roughly twenty revealed elements on this page. Giving each one its
   own IntersectionObserver and ResizeObserver means twenty of each, all set up
   during hydration, all delivering callbacks separately.

   One observer per kind, shared across every element, does the same work for a
   fraction of the main-thread cost. The API is deliberately the same shape as
   the per-element version it replaces: call it, get a cleanup function back.
   ========================================================================== */

type Callback = () => void;

let enterObserver: IntersectionObserver | null = null;
const enterCallbacks = new WeakMap<Element, Callback>();

function getEnterObserver() {
  enterObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = enterCallbacks.get(entry.target);
        // One-shot: these are entrances, not toggles.
        enterCallbacks.delete(entry.target);
        enterObserver?.unobserve(entry.target);
        cb?.();
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
  );
  return enterObserver;
}

/** Runs `cb` once, the first time `el` scrolls into view. */
export function onEnterView(el: Element, cb: Callback): Callback {
  const io = getEnterObserver();
  enterCallbacks.set(el, cb);
  io.observe(el);
  return () => {
    enterCallbacks.delete(el);
    io.unobserve(el);
  };
}

let resizeObserver: ResizeObserver | null = null;
const resizeCallbacks = new WeakMap<Element, Callback>();
const lastWidths = new WeakMap<Element, number>();

function getResizeObserver() {
  resizeObserver ??= new ResizeObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target;
      const width = Math.round(entry.contentRect.width);
      // Width only. Height changes are usually a consequence of the re-split
      // itself, and reacting to them would loop.
      if (lastWidths.get(el) === width) continue;
      lastWidths.set(el, width);
      resizeCallbacks.get(el)?.();
    }
  });
  return resizeObserver;
}

/** Runs `cb` whenever the element's width changes (not on first observation). */
export function onWidthChange(el: Element, cb: Callback): Callback {
  const ro = getResizeObserver();
  lastWidths.set(el, Math.round(el.getBoundingClientRect().width));
  resizeCallbacks.set(el, cb);
  ro.observe(el);
  return () => {
    resizeCallbacks.delete(el);
    lastWidths.delete(el);
    ro.unobserve(el);
  };
}
