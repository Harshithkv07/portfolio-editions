import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/* Tells search engines they may index the site, and where the sitemap lives.
   Nothing here needs changing — it reads the URL from content/site.ts. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.meta.url).toString(),
  };
}
