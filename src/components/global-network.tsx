import ScrollReveal from "@/components/ui/scroll-reveal";
import { WorldMap } from "@/components/ui/world-map";

import { TextReveal } from "./text-reveal";

const NETWORK_SITES = [
  { lat: 19.076, lng: 72.8777, label: "Mumbai" },
  { lat: 51.5072, lng: -0.1276, label: "London" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  { lat: 38.7223, lng: -9.1393, label: "Lisbon" },
  { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
  { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
] as const;

export function GlobalNetwork() {
  return <section className="hp-global-network">
    <TextReveal className="hp-global-network-copy">
      <p className="hp-eyebrow hp-eyebrow-light">Our global network</p>
      <ScrollReveal rotationEnd="top 58%" wordAnimationEnd="center 58%" containerClassName="hp-heading hp-heading-light">Good ideas know no borders.</ScrollReveal>
      <p className="hp-body hp-body-light">Our network brings together architects, designers and specialists across continents, selected for the perspective they can bring to your project.</p>
    </TextReveal>
    <WorldMap locations={[...NETWORK_SITES]} />
  </section>;
}
