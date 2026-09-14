"use client";

import { useEffect, useRef } from "react";
import { onEnterView, onWidthChange } from "@/lib/reveal";

/**
 * Masked per-line entrance for display type.
 *
 * The text is rendered plainly on the server and only split on the client after
 * mount, so there is no hydration mismatch and the content is present and
 * readable even if JavaScript never runs.
 *
 * Lines are found by measuring where words actually wrap rather than by
 * guessing at breakpoints, so it stays correct at any viewport width and
 * re-splits on resize.
 *
 * The measurement uses a Range over the existing text node rather than wrapping
 * every word in a probe element. Both approaches find the line breaks, but the
 * probe version writes to the DOM and reads it back repeatedly, which forces the
 * browser to recompute layout over and over. With six of these on the page that
 * was the single most expensive thing on the site. A Range mutates nothing, so
 * every read comes from one cached layout.
 */
export default function SplitReveal({
  text,
  className = "",
  as: Tag = "span",
  stagger = 0.07,
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let shown = false;

    const build = () => {
      // Back to a single flat text node so we measure the natural wrapping.
      el.textContent = text;
      const node = el.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) return;

      const range = document.createRange();
      const words = text.split(/\s+/).filter(Boolean);

      // Read-only pass: group words by the vertical position of their box.
      const grouped: string[][] = [];
      let lastTop: number | null = null;
      let cursor = 0;

      for (const word of words) {
        const start = text.indexOf(word, cursor);
        if (start < 0) continue;
        cursor = start + word.length;
        range.setStart(node, start);
        range.setEnd(node, cursor);
        const top = range.getBoundingClientRect().top;

        if (lastTop === null || Math.abs(top - lastTop) > 1) {
          grouped.push([]);
          lastTop = top;
        }
        grouped[grouped.length - 1].push(word);
      }

      if (grouped.length === 0) return;

      // Single write: rebuild as one overflow-hidden wrapper per line, each
      // holding an inner span that slides up out of it.
      const frag = document.createDocumentFragment();
      grouped.forEach((lineWords, i) => {
        const line = document.createElement("span");
        line.className = "reveal-line";
        const inner = document.createElement("span");
        inner.textContent = lineWords.join(" ");
        inner.style.transition = `transform 0.95s var(--ease-out-expo) ${
          delay + i * stagger
        }s`;
        line.append(inner);
        frag.append(line);
      });

      el.textContent = "";
      el.append(frag);
      el.dataset.reveal = shown ? "in" : "";
    };

    build();

    const stopEnter = onEnterView(el, () => {
      shown = true;
      el.dataset.reveal = "in";
    });

    // Re-split when the element's width changes, since that is what changes
    // where the lines break.
    let frame = 0;
    const stopResize = onWidthChange(el, () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(build);
    });

    return () => {
      stopEnter();
      stopResize();
      cancelAnimationFrame(frame);
    };
  }, [text, stagger, delay]);

  return (
    // @ts-expect-error -- polymorphic tag, ref type is correct at runtime
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
