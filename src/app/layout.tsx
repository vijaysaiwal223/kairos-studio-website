import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";

/**
 * Beausite Fit Trial is the single typeface for the whole site.
 *
 * The family ships three faces here, mapped onto the CSS weight steps the site
 * already asks for so the browser never has to synthesise one:
 *   Regular -> 400  font-normal
 *   Medium  -> 500  font-medium
 *   Bold    -> 600  font-semibold  and  700  font-bold
 *
 * Bold is listed twice on purpose. The site was built against ITC Avant Garde
 * Gothic Pro, which carried a Demi between Medium and Bold, so its headings
 * ask for 600 — including the nav wordmark and section headings.
 * Beausite has no Demi and the design sets every one of those in Bold, so 600
 * is pointed at the real Bold face rather than left to be synthesised.
 */
const beausite = localFont({
  src: [
    {
      path: "../../public/font/BeausiteFitTrial-Regular-BF6424edbf3b5a2.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/BeausiteFitTrial-Medium-BF6424edbf043fd.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/BeausiteFitTrial-Bold-BF6424edbf2ecf2.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/BeausiteFitTrial-Bold-BF6424edbf2ecf2.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-beausite",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  /* Resolves the relative image paths the project pages hand to Open Graph.
     Set NEXT_PUBLIC_SITE_URL for preview and production deploys. */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Kai.ros Studio | Designing for today and building for tomorrow",
  description:
    "Kai.ros Studio is a India based Architecture & Interior Design studio, designing various project typologies across Australia and Internationally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${beausite.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/* Renders nothing. Takes over the document's scrolling and puts
            ScrollTrigger on the same clock — see the component. */}
        <SmoothScroll />

        {children}

        {/* Site chrome, so every route gets it — including ones added later
            and the 404 — rather than each page remembering to. */}
        <SiteFooter />
      </body>
    </html>
  );
}
