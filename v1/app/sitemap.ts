import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/* The hub plus every page hanging off it. Adding an entry to `pages` in
   content/site.ts puts it in here automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.meta.url.replace(/\/$/, "");

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...site.pages.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
