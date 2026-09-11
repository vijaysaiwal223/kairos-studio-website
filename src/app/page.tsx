import { ArchitectNetwork } from "@/components/architect-network";
import { ExpandingGallery } from "@/components/expanding-gallery";
import { HomeHero } from "@/components/home-hero";
import { ImageReveal } from "@/components/image-reveal";
import { LoadingScreen } from "@/components/loading-screen";
import { OfferList } from "@/components/offer-list";
import { ServiceCards } from "@/components/service-cards";
import { SiteInvitation } from "@/components/site-invitation";

/**
 * The home page.
 * Figma: "HOME PAGE", node 288:146
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Website?node-id=288-146
 *
 * Eight bands and the footer the root layout adds: masthead, network,
 * collage, the pinned project slides, the two dark sections, and the
 * invitation the project pages also end on.
 */

/** The plate the masthead opens on, which the screen resolves into. */
const HERO_PLATE = "/home/hero-building.png";

export default function Home() {
  return (
    <>
      {/* Only the homepage. Given the same picture the masthead opens on, so
          the screen resolves into the page rather than cutting to it. */}
      <LoadingScreen src={HERO_PLATE} />

      <HomeHero />
      <ArchitectNetwork />

      {/* The collage and the featured slides are one move now: the collage
          grows until its middle card is the first project's full-bleed slide,
          then the rest of the projects cycle through it. */}
      <ExpandingGallery />

      <OfferList />
      <ServiceCards />
      <SiteInvitation />

      {/* Renders nothing. Finds every data-image-reveal picture on the page
          and gives each one its entrance — mounted once, here, rather than by
          each section that happens to have one. */}
      <ImageReveal />
    </>
  );
}
