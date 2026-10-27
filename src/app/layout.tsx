import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  /* Resolves the relative image paths the project pages hand to Open Graph. */
  metadataBase: new URL(SITE_URL),
  title: "Kairos Studio | International architecture, one clear vision",
  description:
    "Kairos Studio brings international architects and specialists to your project, guiding the work from first brief to finished space.",
  openGraph: { type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} h-full antialiased`}>
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
