import { ArchitectNetworkGlobe } from "@/components/home/architect-network-globe";
import { Founder } from "@/components/home/founder";
import { HomeArchitectSpotlight } from "@/components/home/home-architect-spotlight";
import { HomeConversation } from "@/components/home/home-conversation";
import { HomeHero } from "@/components/home/home-hero";
import { HowWeWork } from "@/components/home/how-we-work";
import { LoadingScreen } from "@/components/home/loading-screen";
import { OfferList } from "@/components/home/offer-list";
import { ProjectGallery } from "@/components/home/project-gallery";
import { ServiceCards } from "@/components/home/service-cards";
import { StandsFor } from "@/components/home/stands-for";
import { WhyKairos } from "@/components/home/why-kairos";
import { SectionDivider } from "@/components/ui/section-divider";

export default function Home() {
  return (
    <>
      <LoadingScreen />

      <HomeHero />
      <SectionDivider />
      <StandsFor />
      <SectionDivider />
      <Founder />
      <SectionDivider />
      <OfferList />
      <SectionDivider />
      <ServiceCards />
      <SectionDivider />
      <HowWeWork />
      <SectionDivider />
      <ProjectGallery />
      <SectionDivider />
      <HomeArchitectSpotlight />
      <SectionDivider />
      <ArchitectNetworkGlobe />
      <SectionDivider />
      <WhyKairos />
      <SectionDivider />

      <HomeConversation />
      <SectionDivider />
    </>
  );
}
