import type { Metadata } from "next";
import { site } from "@/content/site";
import PageShell from "@/components/PageShell";
import Work from "@/components/Work";

const page = site.pages.find((p) => p.slug === "work")!;

export const metadata: Metadata = {
  title: `${page.title} — ${site.name}`,
  description: page.hint,
  alternates: { canonical: "/work" },
};

export default function Page() {
  return (
    <PageShell slug="work">
      <Work />
    </PageShell>
  );
}
