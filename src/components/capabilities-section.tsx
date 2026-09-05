import { CapabilityPicker } from "./capability-picker";
import { TextReveal } from "./text-reveal";

/**
 * "Our capabilities".
 * Figma: node 22:376
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Untitled?node-id=22-376
 *
 * Full-bleed on the shared --site-gutter rather than a fixed 1440px stage, so
 * the heading lines up with the nav wordmark at every viewport width. The
 * design's coordinates are reproduced as proportions of that gutter box: at
 * the 1440px frame they resolve back to the exact numbers Figma specifies.
 *
 * It follows the pinned featured-projects section, so it carries `relative
 * z-10` and an opaque background: that is what lets it slide over the pinned
 * stage at 1x while the stage climbs away at 0.5x on unpin.
 *
 * The design specifies artwork for "Architecture" only. That asset is
 * byte-identical to the project's design-04.png, so it is reused; the
 * remaining three capabilities are paired with existing project renders and
 * should be swapped for real ones when they exist.
 */
export function CapabilitiesSection() {
  return (
    <section className="bg-canvas px-gutter relative z-10 flex h-screen w-full items-center overflow-hidden">
      <div className="flex w-full flex-col">
        <TextReveal className="flex w-[600px] max-w-full flex-col items-start gap-4">
          <h2 className="text-lead font-semibold text-black">
            Our capabilities
          </h2>
          <p className="text-capability-intro text-body font-medium">
            Kairos studio offers a full range of bespoke interior design
            services — from initial concept and aesthetic counselling to
            coordination, execution and magazine-worthy finishing touches.
          </p>
        </TextReveal>

        <CapabilityPicker />
      </div>
    </section>
  );
}
