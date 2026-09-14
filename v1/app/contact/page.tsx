import type { Metadata } from "next";
import { site } from "@/content/site";
import PageShell from "@/components/PageShell";
import Contact from "@/components/Contact";

const page = site.pages.find((p) => p.slug === "contact")!;

export const metadata: Metadata = {
  title: `${page.title} — ${site.name}`,
  description: page.hint,
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <PageShell slug="contact">
      <Contact />
    </PageShell>
  );
}
