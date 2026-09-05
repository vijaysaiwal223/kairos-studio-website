import { HeroShowcase } from "./hero-showcase";
import { TextReveal } from "./text-reveal";
import { SiteNav } from "./site-nav";

/**
 * Header / hero section.
 * Figma: "section", node 14:322
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Untitled?node-id=14-322
 *
 * Spacing, radii and type sizes below map 1:1 onto the Figma values
 * (Tailwind v4 default scale: p-3 = 12px, p-10 = 40px, gap-6 = 24px, w-40 = 160px,
 * rounded-lg = 8px, rounded-xl = 12px, rounded-2xl = 16px).
 */

function HeroCopy() {
  return (
    <TextReveal
      trigger="load"
      className="flex min-w-0 flex-col items-start gap-4 [word-break:break-word]"
    >
      {/* Deliberately not wrapped in TextReveal. This headline sets its own
          two-line break with a <br>, and SplitText re-flows it to three lines
          and folds the break out of the aria-label it generates ("today" and
          "and" run together). Drop the <br> and let the 800px column do the
          breaking, and the reveal can go on. */}
      <h1 className="w-[800px] max-w-full text-display font-semibold text-white">
        Designing for today
        <br />
        and building for tomorrow
      </h1>
      <p className="text-hero-subtext w-[800px] max-w-full text-subhead font-medium">
        Kai.ros Studio is a India based Architecture &amp; Interior Design
        studio, designing various project typologies across Australia and
        Internationally.
      </p>
    </TextReveal>
  );
}

export function HeaderSection() {
  return (
    <section className="bg-canvas">
      <HeroShowcase nav={<SiteNav />} copy={<HeroCopy />} />
    </section>
  );
}
