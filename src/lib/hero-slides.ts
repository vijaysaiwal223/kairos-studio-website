/**
 * The homepage hero's rotating renders.
 *
 * Plain data in its own module rather than inside HeroShowcase, because the
 * homepage is a Server Component and needs the first slide to hand to the
 * loading screen — importing a value out of a "use client" module gives you a
 * client reference, not the value.
 */

export const HERO_SLIDES = [
  {
    src: "/images/hero-main.png",
    alt: "Brick townhouse entry framed by mature trees",
  },
  {
    src: "/images/slide-2.png",
    alt: "Aerial view of a white gabled house with a pool",
  },
  {
    src: "/images/slide-3.png",
    alt: "Brick house at dusk with a lit glass garden room extension",
  },
];
