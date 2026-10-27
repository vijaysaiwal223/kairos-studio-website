"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { OFFERINGS } from "@/data/home";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import { Eyebrow } from "../ui/eyebrow";

import "./offer-journey.css";

export function OfferList() {
  const journeyRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const journey = journeyRef.current;
    if (!journey) return;

    gsap.registerPlugin(ScrollTrigger);
    const stage = journey.querySelector<HTMLElement>(".offer-journey-stage")!;
    const cards = Array.from(journey.querySelectorAll<HTMLElement>(".offer-journey-card"));
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const enterX = () => stage.clientWidth * 0.6;
      const enterY = () => stage.clientHeight * 0.55;
      const exitX = () => -stage.clientWidth * 0.6;
      const exitY = () => -stage.clientHeight * 0.55;

      gsap.set(cards, {
        x: enterX,
        y: enterY,
        rotation: 9,
        scale: 0.82,
        opacity: 1,
        visibility: "hidden",
      });

      // The clipped window holds the cards as they cross from bottom right
      // to top left. The stagger leaves several cards in view at once.
      const sequence = gsap.timeline({
        onUpdate: () => {
          cards.forEach((card) => {
            const video = card.querySelector("video");
            if (!video) return;
            if (card.style.visibility === "visible") {
              if (video.paused) void video.play().catch(() => {});
            } else if (!video.paused) {
              video.pause();
            }
          });
        },
        scrollTrigger: {
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        const at = 0.55 + index * 0.7;
        sequence.set(card, { visibility: "visible" }, at);
        sequence.to(
          card,
          { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.95, ease: "none" },
          at,
        );
        sequence.to(
          card,
          { x: exitX, y: exitY, rotation: -9, scale: 1.08, duration: 0.95, ease: "none" },
          at + 0.95,
        );
        sequence.set(card, { visibility: "hidden" }, at + 1.9);
      });

      let active = true;
      void document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });
      return () => {
        active = false;
        cards.forEach((card) => card.querySelector("video")?.pause());
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section className="hp-offer" id="what-we-do" aria-labelledby="hp-offer-heading">
      <div ref={journeyRef} className="offer-journey">
        <div className="offer-journey-stage">
          <div className="hp-offer-label">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="hp-heading hp-heading-light" id="hp-offer-heading">The right team. Thoughtfully led.</h2>
            <p className="hp-body hp-body-light">
              We listen to what you want to build, bring together the expertise it
              needs and keep every decision moving in the same direction.
            </p>
          </div>
          <ol className="offer-journey-list">
            {OFFERINGS.map((offer, index) => (
              <li key={offer.title} className="offer-journey-step" style={{ zIndex: index + 1 }}>
                <article className="offer-journey-card">
                  <div className="offer-journey-copy">
                    <h3>{offer.title}</h3>
                    <p>{offer.body}</p>
                  </div>
                  <div className="offer-journey-image" aria-hidden="true">
                    <video src={offer.video} poster={offer.poster} muted loop playsInline preload="metadata" />
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
