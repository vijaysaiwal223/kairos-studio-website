"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import { SERVICES } from "@/data/home";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/** Figma 250:6260 — a staggered constellation of the studio's three services. */

export function ServiceCards() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 1101px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = section.querySelector<HTMLElement>(".hp-services-stage");
      const cards = section.querySelectorAll<HTMLElement>(".hp-service-card");
      if (!stage) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(section.offsetHeight * 1.05)}`,
          pin: section,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        const at = 0.22 + index * 0.07;
        timeline.fromTo(card,
          { y: () => stage.offsetHeight * 0.8, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.3, ease: "none" }, at)
          .to(card,
            {
              y: () => -(card.offsetTop + card.offsetHeight + 80),
              duration: 0.5,
              ease: "none",
            }, at + 0.3);
      });
    });

    media.add("(max-width: 1100px) and (prefers-reduced-motion: no-preference)", () => {
      section.querySelectorAll<HTMLElement>(".hp-service-card").forEach((card) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 48 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hp-services"
      aria-labelledby="hp-services-title"
    >
      <div className="hp-services-stage">
        <header className="hp-services-heading">
          <p className="hp-services-eyebrow">
            <span aria-hidden="true" />
            Our expertise
          </p>
          <h2 id="hp-services-title">Expertise for every stage</h2>
        </header>

        <ul className="hp-service-cards">
          {SERVICES.map((service, index) => (
            <li
              key={service.title}
              className={`hp-service-card hp-service-card--${index + 1}`}
            >
              <article>
                <div className="hp-service-image">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 600px) calc(100vw - 64px), 320px"
                  />
                </div>
                <div className="hp-service-copy">
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
