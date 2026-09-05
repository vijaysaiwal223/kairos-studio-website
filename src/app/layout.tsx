import type { Metadata } from "next";
import { Pinyon_Script } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";

/**
 * ITC Avant Garde Gothic Pro is the single typeface for the whole site.
 *
 * The four supplied faces are mapped onto the standard CSS weight steps so the
 * normal Tailwind utilities resolve to a real face and the browser never has to
 * synthesise one:
 *   Book (OS/2 300, the family's text weight) -> 400  font-normal
 *   Medium                                    -> 500  font-medium
 *   Demi  (shipped as "ITC Semibold.otf")     -> 600  font-semibold
 *   Bold                                      -> 700  font-bold
 */
const avantGarde = localFont({
  src: [
    { path: "../../public/font/ITC Book.otf", weight: "400", style: "normal" },
    {
      path: "../../public/font/ITC Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/ITC Semibold.otf",
      weight: "600",
      style: "normal",
    },
    { path: "../../public/font/ITC Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-avant-garde",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

/**
 * Pinyon Script is the one exception to the ITC-only rule: the design calls for
 * it by name for the script word in the "high-end interiors & exteriors Design"
 * heading (Figma node 12:164), and no weight of Avant Garde can stand in for it.
 */
const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
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
    <html
      lang="en"
      className={`${avantGarde.variable} ${pinyonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}

        {/* Site chrome, so every route gets it — including ones added later
            and the 404 — rather than each page remembering to. */}
        <SiteFooter />
      </body>
    </html>
  );
}
