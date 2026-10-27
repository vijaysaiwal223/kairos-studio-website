import { SiteCta } from "@/components/ui/site-cta";
import { SiteNav } from "../site/site-nav";

/** Home masthead, Figma node 220:1050. */
export function HomeHero() {
  return (
    <section id="about" className="hp-hero">
      <div className="hp-hero-stage">
        <video
          src="/home/hero/intro-video.mp4"
          poster="/home/hero/intro-video-poster.jpg"
          className="hp-hero-image hp-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div aria-hidden className="hp-hero-scrim" />

        <div className="hp-hero-nav">
          <SiteNav />
        </div>

        <div className="hp-hero-copy">
          <p className="hp-hero-eyebrow">Kairos Studio — Architecture without borders</p>
          <h1 className="hp-hero-title">
            <span>International architects.</span>
            <span>One clear vision.</span>
          </h1>
          <p className="hp-hero-blurb">
            We bring the right architects and specialists from around the world
            to your project, then guide their ideas from brief to built space.
          </p>
          <SiteCta className="site-cta--hero" href="#what-we-do">Explore our approach</SiteCta>
        </div>

        <dl className="hp-hero-facts">
          <div>
            <dt>250<span>+</span></dt>
            <dd>Projects Complete</dd>
          </div>
          <div>
            <dt>90<span>+</span></dt>
            <dd>Satisfied Clients</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
