"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

import "./project-gallery.css";

const GALLERY = [
  {
    src: "/projects/casa-pura-vida/feature-01.jpg",
    alt: "Open living terrace at Casa Pura Vida beneath a timber ceiling",
    caption: "01 — Casa Pura Vida · Living terrace",
    href: "/projects/casa-pura-vida",
  },
  {
    src: "/projects/house-klaus/hero.jpg",
    alt: "Stone and timber entry courtyard at House Klaus",
    caption: "02 — House Klaus · Entry courtyard",
    href: "/projects/house-klaus",
  },
  {
    src: "/projects/casa-pura-vida/gallery-02.jpg",
    alt: "Timber kitchen with a fluted stone island at Casa Pura Vida",
    caption: "03 — Casa Pura Vida · Kitchen",
    href: "/projects/casa-pura-vida",
  },
  {
    src: "/projects/house-klaus/outdoor-living.jpg",
    alt: "Outdoor living terrace and pool at House Klaus",
    caption: "04 — House Klaus · Pool terrace",
    href: "/projects/house-klaus",
  },
] as const;

export function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const frames = section.querySelectorAll<HTMLElement>(".project-gallery-image");

      frames.forEach((frame) => {
        const image = frame.querySelector("img");
        if (!image) return;

        gsap.fromTo(
          image,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="project-gallery" className="project-gallery" aria-labelledby="project-gallery-title">
      <div className="project-gallery-inner">
        <div className="project-gallery-header">
          <div>
            <p className="project-gallery-eyebrow">Selected projects</p>
            <h2 className="project-gallery-title" id="project-gallery-title">
              <span>Architecture,</span>
              <span>up close.</span>
            </h2>
          </div>
          <p className="project-gallery-description">
            Explore the spaces and details behind Casa Pura Vida and House Klaus.
          </p>
        </div>

        <div className="project-gallery-grid">
          {GALLERY.map((item, index) => (
            <figure className={`project-gallery-item project-gallery-item--${index + 1}`} key={item.src}>
              <Link href={item.href} className="project-gallery-link">
                <div className="project-gallery-image">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 43vw, 44vw"
                  />
                </div>
                <figcaption>{item.caption} <span aria-hidden="true">↗</span></figcaption>
              </Link>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
