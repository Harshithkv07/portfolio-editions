"use client";

import { useEffect, useRef } from "react";
import { onEnterView } from "@/lib/reveal";

/**
 * Fade-and-rise on first entry into view. Used for everything that is not
 * display type. Content renders visible by default and is only hidden once the
 * observer is attached, so nothing can be stranded invisible.
 */
export default function Fade({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "p";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.fade = "";
    el.style.transitionDelay = `${delay}s`;

    return onEnterView(el, () => {
      el.dataset.fade = "in";
    });
  }, [delay]);

  return (
    // @ts-expect-error -- polymorphic tag, ref type is correct at runtime
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
