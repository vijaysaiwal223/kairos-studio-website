import { AboutSection } from "@/components/about-section";
import { DesignServicesSection } from "@/components/design-services-section";
import { FeaturedProjectsSection } from "@/components/featured-projects-section";
import { HeaderSection } from "@/components/header-section";
import { HERO_SLIDES } from "@/lib/hero-slides";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  return (
    <>
      {/* Only the homepage. The screen resolves into the hero, so it is given
          the same image the hero opens on rather than a copy of its own —
          whichever render that ends up being, the two stay in step. */}
      <LoadingScreen src={HERO_SLIDES[0].src} />

      <HeaderSection />
      <DesignServicesSection />

      <FeaturedProjectsSection />

      {/* Must stay opaque and paint above the pinned section: it slides over
          the featured stage at 1x while that stage climbs away at 0.5x on
          unpin. See .about-section in globals.css. */}
      <AboutSection />
    </>
  );
}
