import type { Metadata } from "next";
import { site } from "@/content/site";
import PageShell from "@/components/PageShell";
import DailyRhythm from "@/components/DailyRhythm";

const page = site.pages.find((p) => p.slug === "day")!;

export const metadata: Metadata = {
  title: `${page.title} — ${site.name}`,
  description: page.hint,
  alternates: { canonical: "/day" },
};

export default function Page() {
  return (
    <PageShell slug="day">
      <DailyRhythm />
    </PageShell>
  );
}
