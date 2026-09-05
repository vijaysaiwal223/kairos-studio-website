import Link from "next/link";

import { FooterWordmark } from "./footer-wordmark";
import { TextReveal } from "./text-reveal";

/**
 * Site footer.
 * Figma: "FOOTER" component, node 219:2019.
 *
 * Site chrome rather than showcase furniture — the project pages are just the
 * first to use it. The wordmark is drawn oversized and deliberately runs past
 * the footer's bottom edge; the frame clips it, which is the effect.
 *
 * Everything above the rule reads as two halves: what the studio is and where
 * to find it on the left, where to go next on the right. The copyright and the
 * legal links sit on one line below both, in a quieter grey than the rest, so
 * the eye takes them last.
 */

/** Node 219:1989. The nav's own links less Home, which the wordmark covers. */
const SITE_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Architects", href: "#architects" },
  { label: "About us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Node 219:1994. */
const CONTACT_LINKS = [
  { label: "+91 9876543210", href: "tel:+919876543210" },
  { label: "mail@kairos.studio", href: "mailto:mail@kairos.studio" },
];

const ADDRESS =
  "742 Evergreen Terrace, Springfield, Oregon (OR), 97477 [United States]";

/** Node 219:1986. */
const LEGAL_LINKS = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
];

/**
 * Node 219:1998. The design supplies the marks but no destinations — point
 * these at the studio's real accounts.
 */
const SOCIAL_LINKS = [
  { label: "Google", icon: "google", href: "#" },
  { label: "Instagram", icon: "instagram", href: "#" },
  { label: "Facebook", icon: "facebook", href: "#" },
  { label: "LinkedIn", icon: "linkedin", href: "#" },
  { label: "Pinterest", icon: "pinterest", href: "#" },
];

/** Node 219:1985. */
const FOOTER_BLURB =
  "Kairos studio offers a full range of bespoke interior design services — from initial concept and aesthetic counselling to coordination, execution and magazine-worthy finishing touches.";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-intro">
          <TextReveal>
            <p className="site-footer-blurb">{FOOTER_BLURB}</p>
          </TextReveal>

          <ul className="site-footer-social">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.icon}>
                <a href={social.href} aria-label={social.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/icons/social/${social.icon}.svg`}
                    alt=""
                    width={40}
                    height={40}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-columns">
          <nav className="site-footer-column" aria-label="Footer">
            {SITE_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <address className="site-footer-column site-footer-contact">
            {CONTACT_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <span>{ADDRESS}</span>
          </address>
        </div>
      </div>

      <div className="site-footer-meta">
        <p>All rights reserved © Kai.ros Studio 2026</p>
        <nav className="site-footer-legal" aria-label="Legal">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div aria-hidden className="site-footer-rule" />

      <FooterWordmark />
    </footer>
  );
}
