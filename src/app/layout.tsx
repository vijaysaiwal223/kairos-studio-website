import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  /* Resolves the relative image paths the project pages hand to Open Graph. */
  metadataBase: new URL(SITE_URL),
  title: "kai.ros Studio | International architecture, one clear vision",
  description:
    "kai.ros Studio brings international architects and specialists to your project, guiding the work from first brief to finished space.",
  openGraph: { type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} h-full antialiased [scrollbar-gutter:stable] [&.lenis]:h-auto [&.lenis-smooth]:scroll-auto`}>
      <body className="min-h-full bg-background font-sans text-foreground [html.lenis_&]:h-auto [&_button]:font-[inherit] [&_input]:font-[inherit] [&_select]:font-[inherit] [&_textarea]:font-[inherit] [&_h1]:[text-wrap:balance] [&_h3]:[text-wrap:balance] [&_p]:[text-wrap:pretty] motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!scroll-auto motion-reduce:[&_*::before]:!animate-none motion-reduce:[&_*::before]:!transition-none motion-reduce:[&_*::after]:!animate-none motion-reduce:[&_*::after]:!transition-none">
        {/* Renders nothing. Takes over the document's scrolling and puts
            ScrollTrigger on the same clock — see the component. */}
        <SmoothScroll />

        {children}

        <SiteNav />

        {/* Site chrome, so every route gets it — including ones added later
            and the 404 — rather than each page remembering to. */}
        <SiteFooter />
      </body>
    </html>
  );
}
