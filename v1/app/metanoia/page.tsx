import type { Metadata } from "next";
import { site } from "@/content/site";
import PageShell from "@/components/PageShell";
import Metanoia from "@/components/Metanoia";

const page = site.pages.find((p) => p.slug === "metanoia")!;

export const metadata: Metadata = {
  title: `${page.title} — ${site.name}`,
  description: page.hint,
  alternates: { canonical: "/metanoia" },
};

export default function Page() {
  return (
    <PageShell slug="metanoia">
      <Metanoia />
    </PageShell>
  );
}
