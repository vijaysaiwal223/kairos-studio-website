import { GlobalNetwork } from "@/components/home/global-network";
import { HomeArchitectSpotlight } from "@/components/home/home-architect-spotlight";
import { HomeHero } from "@/components/home/home-hero";
import { LoadingScreen } from "@/components/home/loading-screen";
import { OfferList } from "@/components/home/offer-list";
import { ProjectGallery } from "@/components/home/project-gallery";
import { ServiceCards } from "@/components/home/service-cards";
import { SiteInvitation } from "@/components/site/site-invitation";

export default function Home() {
  return (
    <>
      <LoadingScreen />

      <HomeHero />

      <OfferList />
      <HomeArchitectSpotlight />
      <ProjectGallery />

      <GlobalNetwork />
      <ServiceCards />
      <SiteInvitation showCta={false} />

    </>
  );
}
