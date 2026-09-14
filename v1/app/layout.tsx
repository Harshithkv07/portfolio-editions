import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { site } from "@/content/site";
import SmoothScroll from "@/components/SmoothScroll";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.meta.url),
  title: site.meta.title,
  description: site.meta.description,
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    url: site.meta.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* sr-only rather than translated off-screen: a clipped element is
            correctly ignored by contrast checkers, a translated one is not. */}
        <a
          href="#main"
          className="t-micro sr-only bg-white px-4 py-3 text-black focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100]"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
        <StructuredData />
      </body>
    </html>
  );
}
