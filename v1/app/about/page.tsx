import type { Metadata } from "next";
import { site } from "@/content/site";
import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import CurrentlyStrip from "@/components/CurrentlyStrip";
import About from "@/components/About";

const page = site.pages.find((p) => p.slug === "about")!;

export const metadata: Metadata = {
  title: `${page.title} — ${site.name}`,
  description: page.hint,
  alternates: { canonical: "/about" },
};

/* The dithered portrait and the dated strip live here rather than on the hub.
   The hub has to stay a board; this is the page that gets to be a statement. */
export default function Page() {
  return (
    <PageShell slug="about">
      <Hero />
      <CurrentlyStrip />
      <About />
    </PageShell>
  );
}
