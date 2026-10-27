import Image from "next/image";

import { TextReveal } from "../motion/text-reveal";

export function GlobalNetwork() {
  return (
    <section className="hp-global-network" aria-labelledby="global-network-heading">
      <TextReveal className="hp-global-network-copy">
        <p className="hp-global-network-label">Connected by design</p>
        <h2 id="global-network-heading" className="hp-global-network-heading">
          Global perspective. A project that feels yours.
        </h2>
        <p className="hp-global-network-body">
          Our international network brings new ideas to the table. Kairos keeps
          them grounded in your brief, your site and the people who will use the
          space.
        </p>
      </TextReveal>
      <div className="hp-global-network-map">
        <Image
          src="/home/global-network-map.svg"
          alt="Dotted world map highlighting Kairos Studio's global network"
          width={1440}
          height={822}
          unoptimized
        />
      </div>
    </section>
  );
}
