import Image from "next/image";
import Link from "next/link";

import { FooterNewsletter } from "./footer-newsletter";
import { FooterWordmark } from "./footer-wordmark";

const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/#project-gallery" },
  { label: "Architects", href: "/#projects" },
  { label: "About us", href: "/#about" },
];

const FEATURED_PROJECTS = [
  { label: "Casa Pura Vida", href: "/projects/casa-pura-vida" },
  { label: "House Klaus", href: "/projects/house-klaus" },
];

const SOCIALS = ["google", "instagram", "facebook", "linkedin", "pinterest"];

function FooterHeading({ children }: { children: string }) {
  return <h2 className="font-[family-name:var(--font-geist-mono)] text-[14px] leading-[20px] font-normal tracking-[1px] text-white uppercase">[{children}]</h2>;
}

function CornerMarks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-[#ff4800]">
      <span className="absolute top-0 left-0 h-[16px] w-[16px] border-t border-l border-current" />
      <span className="absolute top-0 right-0 h-[16px] w-[16px] border-t border-r border-current" />
      <span className="absolute bottom-0 left-0 h-[16px] w-[16px] border-b border-l border-current" />
      <span className="absolute right-0 bottom-0 h-[16px] w-[16px] border-r border-b border-current" />
    </div>
  );
}

/** Figma 140:2769 — shared site footer. */
export function SiteFooter() {
  return (
    <footer className="bg-[#1a1a1a] px-[40px] font-[family-name:var(--font-geist)] text-white max-[700px]:px-[20px]">
      <div className="grid min-h-[544px] grid-cols-[684fr_636fr] gap-[40px] py-[40px] max-[1100px]:grid-cols-1 max-[1100px]:gap-[48px]">
        <div className="relative flex min-h-[464px] flex-col justify-between border border-[#313131] bg-black p-[23px] max-[700px]:min-h-[430px]">
          <CornerMarks />

          <div>
            <div className="flex items-center gap-[20px] pb-[24px]">
              <Image src="/home/hero/header-mark.png" alt="" width={48} height={48} className="h-[48px] w-[48px] object-contain" />
              <p className="text-[32px] leading-[48px] font-medium tracking-[-0.02em] max-[480px]:text-[28px]">kai.ros Studio</p>
            </div>
            <p className="max-w-[636px] text-[16px] leading-[24px] tracking-[-0.02em] text-[#a8a8a8]">
              kai.ros Studio connects your project with architects and specialists whose expertise fits its ambition. From the earliest conversation, we help clarify the brief, assemble the right team, and guide every decision through design and delivery. Our process keeps the vision coherent, the details considered, and the people who will use the space at the centre of the work.
            </p>
            <p className="mt-[16px] max-w-[636px] text-[16px] leading-[24px] tracking-[-0.02em] text-[#717171]">
              Every project is a collaboration. We listen closely, bring the right people together and make each decision count.
            </p>
          </div>

          <div className="flex items-end justify-between gap-[20px] max-[700px]:flex-col max-[700px]:items-start">
            <p className="text-[14px] leading-[20px] tracking-[-0.02em] text-[#717171]">
              Based in Chandigarh, India<br />
              Working worldwide
            </p>
            <div className="flex items-center gap-[16px]" aria-label="Social media">
              {SOCIALS.map((name) => (
                <span key={name} className="block h-[32px] w-[32px]" title={name}>
                  <Image src={"/icons/social/" + name + ".svg"} alt={name} width={32} height={32} className="h-[32px] w-[32px]" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 content-start gap-x-0 gap-y-[40px] max-[700px]:gap-x-[24px] max-[600px]:grid-cols-1">
          <nav aria-label="Footer navigation">
            <FooterHeading>Navigation</FooterHeading>
            <ul className="mt-[32px] space-y-[8px] text-[16px] leading-[24px] tracking-[-0.02em] text-[#717171]">
              {NAVIGATION.map((item) => <li key={item.label}><Link href={item.href} className="transition-colors hover:text-white focus-visible:text-white">{item.label}</Link></li>)}
            </ul>
          </nav>

          <div>
            <FooterHeading>Newsletter</FooterHeading>
            <p className="mt-[32px] text-[16px] leading-[24px] tracking-[-0.02em] text-[#717171]">Stay in the loop</p>
            <FooterNewsletter />
          </div>

          <nav aria-label="Featured projects">
            <FooterHeading>Featured projects</FooterHeading>
            <ul className="mt-[32px] space-y-[8px] text-[16px] leading-[24px] tracking-[-0.02em] text-[#717171]">
              {FEATURED_PROJECTS.map((item) => <li key={item.label}><Link href={item.href} className="transition-colors hover:text-white focus-visible:text-white">{item.label}</Link></li>)}
            </ul>
          </nav>

          <address className="not-italic">
            <FooterHeading>Contact</FooterHeading>
            <div className="mt-[32px] flex flex-col gap-[8px] text-[16px] leading-[24px] tracking-[-0.02em] text-[#717171]">
              <p>064 Second Floor, Sector 40B, Chandigarh,<br />Chandigarh, 160036</p>
              <a href="tel:+9107087087999" className="w-fit transition-colors hover:text-white focus-visible:text-white">+91 070870 87999</a>
              <a href="mailto:hello@kairostudios.in" className="w-fit transition-colors hover:text-white focus-visible:text-white">hello@kairostudios.in</a>
            </div>
          </address>
        </div>
      </div>

      <div className="border-t border-[#313131]">
        <FooterWordmark />
      </div>

      <div className="flex min-h-[57px] items-center justify-between gap-[24px] border-t border-[#313131] text-[16px] leading-[24px] tracking-[-0.02em] max-[900px]:flex-col max-[900px]:items-start max-[900px]:justify-center max-[900px]:py-[16px]">
        <p>kai.ros Studio © 2026</p>
        <nav aria-label="Footer legal" className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
          <a href="mailto:hello@kairostudios.in?subject=Support" className="text-white/50 transition-colors hover:text-white">Support</a>
          <Link href="/privacy-policy" className="text-white/50 transition-colors hover:text-white">Privacy Policy</Link>
          <Link href="/terms-of-service" className="text-white/50 transition-colors hover:text-white">Terms of service</Link>
          <span aria-hidden="true" className="text-white/50">|</span>
          <span>Crafted by Vijay Saiwal</span>
        </nav>
      </div>
    </footer>
  );
}
