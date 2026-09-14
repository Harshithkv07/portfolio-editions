import { site } from "@/content/site";

/* ============================================================================
   STRUCTURED DATA

   A machine-readable description of who you are, in the format Google and
   friends actually parse. This is what lets a search for your name return this
   site with your role and links attached, rather than a bare blue link.

   It reads entirely from content/site.ts. Fill in your GitHub and LinkedIn
   there and they are picked up here automatically.
   ========================================================================== */

export default function StructuredData() {
  const sameAs = site.contact.links.map((l) => l.href).filter(Boolean);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.meta.url,
    description: site.meta.description,
    jobTitle: site.role,
    // Deliberately no email here. The site uses a form precisely so the
    // address is not in the page source; publishing it in the structured data
    // would hand it straight back to every scraper.
    ...(sameAs.length > 0 && { sameAs }),
    ...(site.metanoia.wordmark && {
      worksFor: {
        "@type": "Organization",
        name: site.metanoia.wordmark,
        ...(site.metanoia.href && { url: site.metanoia.href }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      // The payload is built from local content, never from user input, so
      // there is nothing here that could carry markup into the page.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
