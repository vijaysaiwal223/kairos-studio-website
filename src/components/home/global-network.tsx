import Image from "next/image";

import { TextReveal } from "../motion/text-reveal";
import { Eyebrow } from "../ui/eyebrow";

export function GlobalNetwork() {
  return (
    <section className="hp-global-network [box-sizing:border-box] [position:relative] [z-index:4] [display:flex] [min-height:100dvh] [flex-direction:column] [align-items:center] [gap:80px] [overflow:hidden] [padding:80px_0] [background:var(--ink-ground)] max-[700px]:[gap:48px] max-[700px]:[padding-block:64px]" aria-labelledby="global-network-heading">
      <TextReveal className="hp-global-network-copy [display:flex] [width:min(850px,_calc(100%_-_40px))] [flex-direction:column] [align-items:center] [gap:12px] [text-align:center] max-[700px]:[width:calc(100%_-_40px)]">
        <Eyebrow>Connected by design</Eyebrow>
        <h2 id="global-network-heading" className="hp-global-network-heading [width:100%] [margin:0] [color:#fff] [font-size:clamp(40px,_4.45vw,_64px)] [line-height:1.125] [font-weight:400] [letter-spacing:-1.28px] [text-wrap:balance] max-[700px]:[font-size:clamp(36px,_9vw,_48px)]">
          Global perspective. A project that feels yours.
        </h2>
        <p className="hp-global-network-body [width:100%] [margin:0] [color:#fff] [font-size:16px] [line-height:24px] [font-weight:400] [letter-spacing:0]">
          Our international network brings new ideas to the table. kai.ros keeps
          them grounded in your brief, your site and the people who will use the
          space.
        </p>
      </TextReveal>
      <div className="hp-global-network-map [display:flex] [width:min(1200px,_100%)] [aspect-ratio:1200_/_685.07] [flex:none] [align-items:stretch] [justify-content:center] [&_img]:[display:block] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:contain] [&_img]:[object-position:center_top] max-[700px]:[width:100%] max-[700px]:[max-width:100%]">
        <Image
          src="/home/global-network-map.svg"
          alt="Dotted world map highlighting kai.ros Studio's global network"
          width={1440}
          height={822}
          unoptimized
        />
      </div>
    </section>
  );
}
