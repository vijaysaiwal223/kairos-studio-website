/**
 * The projects the home page features, in the order it shows them.
 *
 * Both halves of the expanding gallery read this: the collage's centre card is
 * the first project's render, and the cycle that follows walks the whole list.
 * The counter and the scroll length are taken from its length, so adding a
 * project here is the only edit needed.
 */

export type FeaturedProject = {
  /** Omitted while the project has no published route. */
  href?: `/projects/${string}`;
  title: string;
  /** Full-bleed behind the preview. Also the source the hero is cropped from. */
  background: { src: string; alt: string };
  /** The preview card's picture, drawn 436x300 (node 289:329). */
  thumb: string;
};

export const FEATURED: FeaturedProject[] = [
  {
    title: "Beneath Jeoji Oreum House",
    background: {
      src: "/projects/beneath-jeoji-oreum-house/featured.jpg",
      alt: "Aerial view of a concrete and timber house set among citrus groves",
    },
    thumb: "/home/expand/thumb-01.jpg",
  },
  {
    title: "Smitskamp Gorssel",
    background: {
      src: "/projects/smitskamp-gorssel/featured.jpg",
      alt: "Travertine house with a colonnaded terrace opening onto a lawn",
    },
    thumb: "/home/expand/thumb-02.jpg",
  },
  {
    href: "/projects/casa-pura-vida",
    title: "Casa Pura Vida",
    background: {
      src: "/projects/casa-pura-vida/featured.jpg",
      alt: "Palm-shaded house with a curved timber canopy beside a pool",
    },
    thumb: "/home/expand/thumb-03.jpg",
  },
  {
    href: "/projects/house-klaus",
    title: "House Klaus",
    background: {
      src: "/projects/house-klaus/featured.jpg",
      alt: "House stepping down a fynbos slope above the sea, its roofs planted",
    },
    thumb: "/home/expand/thumb-04.jpg",
  },
];

/** The hero card of the collage: the first project's render, cropped to 4:5. */
export const EXPAND_HERO = {
  src: "/home/expand/hero.jpg",
  alt: FEATURED[0].background.alt,
};

/**
 * The collage's side cards, from the design's own image wrapper (node 297:710).
 *
 * Four columns either side of the hero. The design gives the outer pair one
 * tall photograph each and the inner pair two stacked, which is what makes the
 * edges read ragged rather than as a grid — so the columns are listed with the
 * cards they actually hold rather than forced into even pairs.
 */
export const COLLAGE_COLUMNS = [
  {
    place: "far-left",
    cards: [
      { src: "/home/collage/01-left-edge.jpg", ratio: "139 / 500" },
    ],
  },
  {
    place: "left",
    cards: [
      { src: "/home/collage/02-left-top.jpg", ratio: "328 / 340" },
      { src: "/home/collage/03-left-bottom.jpg", ratio: "328 / 340" },
    ],
  },
  {
    place: "right",
    cards: [
      { src: "/home/collage/05-right-top.jpg", ratio: "328 / 340" },
      { src: "/home/collage/06-right-bottom.jpg", ratio: "328 / 340" },
    ],
  },
  {
    place: "far-right",
    cards: [
      { src: "/home/collage/07-right-edge.jpg", ratio: "139 / 500" },
    ],
  },
] as const;
