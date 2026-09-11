/**
 * Project records.
 *
 * The design has drawn "PROJECT PAGE" twice, and the two are different pages
 * rather than one page with different content — different hero, different
 * facts, a different drawing rail, a different ending. So there are two
 * templates, and a record says which one it is through `layout`:
 *
 *   "showcase"  node 139:865 — ProjectShowcase. Casa Pura Vida.
 *   "editorial" node 299:948 — ProjectEditorial. House Klaus.
 *
 * Both share the slug/title/architect/hero head of the record, so the route
 * can handle metadata and template selection without knowing either body.
 *
 * ─── The showcase template ───────────────────────────────────────────────
 *
 * Figma: "PROJECT PAGE", node 139:865
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Untitled?node-id=139-865
 *
 * The design draws exactly one project — Casa Pura Vida — on a 1440px frame.
 * Everything that changes from project to project lives in this file; the
 * geometry that does not lives in ProjectShowcase and the .ps-* block in
 * globals.css. Adding a project is one entry below plus its own folder under
 * public/projects/<slug>/ — the route builds itself from PROJECTS.
 *
 * Lengths below are the design's own pixel values on that 1440 frame. Nothing
 * consumes them as pixels: the showcase converts each one to a percentage of
 * the 1360px content column, which reproduces the design exactly at 1440 and
 * scales it intact at every other width. Keeping the raw numbers means a value
 * here can still be checked against the Figma node it came from.
 */

export type SpecIconName =
  | "architects"
  | "area"
  | "year"
  | "topology"
  | "location";

export type ProjectImage = {
  src: string;
  alt: string;
  /**
   * CSS object-position, for the images the design crops by hand rather than
   * centring. Figma calls this fill mode "Crop" and returns it as an
   * imageTransform matrix; the equivalent object-position goes here. Omit it
   * and the image is centred, which is what Figma's "Fill" mode does.
   */
  position?: string;
};

/** One row of the left-hand fact table (Figma node 156:1384). */
export type SpecRow = {
  icon: SpecIconName;
  label: string;
  value: string;
};

/**
 * One image in the scattered gallery (Figma nodes 171:1552–171:1560).
 *
 * The design places these six by hand rather than on a grid, so the record
 * carries the drawn rectangle verbatim, in COLLAGE_FRAME coordinates.
 */
export type CollageItem = ProjectImage & {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** The box the collage rectangles are measured inside. */
export const COLLAGE_FRAME = { width: 1360, height: 2694 } as const;

/** The content column: the 1440 frame less the 40px site gutter on both sides. */
export const CONTENT_WIDTH = 1360;

/**
 * The drawings stage (Figma nodes 156:1266 and 191:1697).
 *
 * Measured from the left edge of the content column, not of the 1440 frame —
 * the stage already sits inside the 40px site gutter, so every x below is the
 * drawn coordinate less that gutter. ProjectPlans lays the stage out from
 * these and nothing else, so the rail re-centres on its own when a project
 * carries a different number of drawings.
 */
export const PLAN_STAGE = {
  /** Full width of the stage, so the rail's right edge lands where drawn. */
  width: CONTENT_WIDTH,
  height: 636,
  /** The main frame, top-left of the stage. */
  main: { width: 1131, height: 636 },
  /** The rail of everything not currently in the main frame (drawn at 1187). */
  thumb: { x: 1147, width: 204, height: 120, gap: 8 },
  /** Previous / Next, sitting one gap below the last thumbnail. */
  nav: { height: 24 },
} as const;

export type ShowcaseProject = {
  layout: "showcase";
  slug: string;
  /** Shown in the hero, the tab title and the featured slide. */
  title: string;
  /** Bottom-left of the homepage's featured slide, not drawn on this page. */
  location: string;
  /** Hero paragraph under the title (node 162:1485). */
  summary: string;
  architect: {
    name: string;
    /** The practice's own base, not the project's location. */
    base: string;
    portrait: string;
  };
  /**
   * Full-bleed 1440x900 hero (node 154:1205).
   *
   * `src` is the still — the poster the hero paints on first frame, and the
   * image Open Graph gets. Give `video` a file and the hero plays it once over
   * that still and rests on its last frame; leave it off and the hero stays
   * the still alone.
   */
  hero: ProjectImage & { video?: string };
  specs: SpecRow[];
  overview: { heading: string; body: string };
  /**
   * The drawing set (nodes 156:1266 and 191:1697).
   *
   * One list, not a main plus thumbnails: the design draws four thumbnails
   * beside a main frame for a set of five, because the rail holds every
   * drawing *except* the one currently in the main frame. Clicking a thumbnail
   * trades it with whatever is showing, which is also why the design draws no
   * "selected" state on the rail — the selected drawing is the big one.
   *
   * The first entry is what the page opens on. Adding or removing one is
   * enough on its own; the rail lengthens and the stage re-centres.
   */
  plans: { drawings: ProjectImage[] };
  /** The two full-width plates, before and after the collage. */
  features: { first: ProjectImage; second: ProjectImage };
  collage: CollageItem[];
  /** Closing paragraphs, right-aligned at 672px (node 171:1547). */
  closing: string[];
};

const CASA_PURA_VIDA: ShowcaseProject = {
  layout: "showcase",
  slug: "casa-pura-vida",
  title: "Casa Pura Vida",
  location: "Madrid, Spain",
  summary:
    "A house held between the palm canopy and the sea. Heavy in plan, weightless in section — the roof does the work, and the walls step back until the building is mostly threshold.",
  architect: {
    name: "Zozaya Arquitectos",
    base: "Madrid, Spain",
    portrait: "/projects/casa-pura-vida/architect.jpg",
  },
  hero: {
    src: "/projects/casa-pura-vida/hero.jpg",
    alt: "The house seen from above at golden hour, its roofs buried in dense jungle canopy",
    // The still is frame one of this footage, so playback starts from exactly
    // the image the poster paints and there is no jump when it begins.
    video: "/projects/casa-pura-vida/hero.mp4",
  },
  specs: [
    { icon: "architects", label: "Architects", value: "Zozaya Arquitectos" },
    { icon: "area", label: "Area", value: "670 m2" },
    { icon: "year", label: "Year", value: "2026" },
    { icon: "topology", label: "Topology", value: "Private residence" },
    { icon: "location", label: "Location", value: "Pacific coast, Mexico" },
  ],
  overview: {
    heading: "Project Overview",
    body: "The site gives more than a plan can hold: a beach edge, a run of palms, a prevailing wind that arrives from one direction all year. The response is not a volume placed on the ground but a roof lifted over it — a horizon line pinned at one height, with the living floor slid underneath.",
  },
  plans: {
    drawings: [
      {
        src: "/projects/casa-pura-vida/plan-ground-floor.jpg",
        alt: "Ground floor plan showing the house set into its planted site",
      },
      {
        src: "/projects/casa-pura-vida/plan-first-level.jpg",
        alt: "First level plan",
      },
      // The design's rail carries the first-level drawing twice. Kept so the
      // rail is four deep as drawn — replace it once there is a fifth drawing.
      {
        src: "/projects/casa-pura-vida/plan-first-level.jpg",
        alt: "First level plan",
      },
      { src: "/projects/casa-pura-vida/plan-roof.jpg", alt: "Roof plan" },
      {
        src: "/projects/casa-pura-vida/plan-section-xx.jpg",
        alt: "Section XX through the house and pool terrace",
      },
    ],
  },
  features: {
    first: {
      src: "/projects/casa-pura-vida/feature-01.jpg",
      alt: "Living terrace under a deep timber soffit, opening to the pool and palms",
    },
    second: {
      src: "/projects/casa-pura-vida/feature-02.jpg",
      alt: "The house among palms, its pool terrace set against the hillside beyond",
      // Node 156:1316 is the one plate the design crops by hand: its
      // imageTransform keeps the top 83.3% of the frame, starting 0.8px down,
      // rather than the middle 83.3% that centring would take.
      position: "50% 0.23%",
    },
  },
  collage: [
    {
      src: "/projects/casa-pura-vida/gallery-01.jpg",
      alt: "Planted walkway running beside full-height glazing under a timber soffit",
      x: 0,
      y: 0,
      width: 328,
      height: 492,
    },
    {
      src: "/projects/casa-pura-vida/gallery-02.jpg",
      alt: "Kitchen with a fluted stone island and dark timber cabinetry",
      x: 344,
      y: 0,
      width: 443,
      height: 663,
    },
    {
      src: "/projects/casa-pura-vida/gallery-03.jpg",
      alt: "Rendered wall pierced by a round window above an external stair",
      x: 917,
      y: 560,
      width: 443,
      height: 669,
    },
    {
      src: "/projects/casa-pura-vida/gallery-04.jpg",
      alt: "Courtyard beneath a deep timber canopy, planted with cactus and palm",
      x: 0,
      y: 1079,
      width: 787,
      height: 524,
    },
    // The design places the same photograph twice; kept as drawn.
    {
      src: "/projects/casa-pura-vida/gallery-04.jpg",
      alt: "",
      x: 573,
      y: 1803,
      width: 787,
      height: 525,
    },
    {
      src: "/projects/casa-pura-vida/gallery-05.jpg",
      alt: "Two-storey rendered facade shaded by a timber canopy above desert planting",
      x: 0,
      y: 2030,
      width: 443,
      height: 664,
    },
  ],
  // Verbatim from node 171:1547, which carries the same paragraph twice and
  // still names a different project. Replace with this project's own copy.
  closing: [
    "High end CGI imagery and animation were created for use across various marketing platforms, sales-suite environments and project websites to introduce Mirasol during its development phase. By clearly communicating the project’s location, architectural character, and lifestyle offering, the collatoral supported sales and promotional efforts throughout launch and beyond.",
    "High end CGI imagery and animation were created for use across various marketing platforms, sales-suite environments and project websites to introduce Mirasol during its development phase. By clearly communicating the project’s location, architectural character, and lifestyle offering, the collatoral supported sales and promotional efforts throughout launch and beyond.",
  ],
};

/* ─── The editorial template ───────────────────────────────────────────────
 *
 * Figma: "PROJECT PAGE", node 299:948
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Website?node-id=299-948
 *
 * Drawn on the same 1440 frame as the showcase, but the body is not a stack of
 * sections: node 299:987 is one 1360x7338 box with photographs and paragraphs
 * placed across it by hand, overlapping and staggering. So the run below is
 * carried the way the showcase's collage already is — every block keeps the
 * rectangle it was drawn in, as a share of the frame, and the whole
 * composition scales as one drawing.
 *
 * The one thing that does not scale with it is the copy. The site holds text
 * at its drawn pixel size on purpose (see the type scale in globals.css), so
 * a narrower column gives the same words more lines and a paragraph grows
 * taller than the slot it was drawn in. Which is why copy carries `bottom`
 * rather than `y`: it is pinned by its last line, and the growth goes up into
 * the whitespace the design leaves above every one of these blocks instead of
 * down onto the photograph beneath it.
 */

/** The box the run's blocks are measured inside (node 299:987). */
export const EDITORIAL_FRAME = { width: CONTENT_WIDTH, height: 7338 } as const;

/**
 * A photograph in the run, as drawn in EDITORIAL_FRAME coordinates — measured
 * from the left edge of the content column, so each x is the drawn coordinate
 * less the 40px site gutter.
 */
export type EditorialPlate = ProjectImage & {
  kind: "plate";
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * Figma's "Fit" rather than "Fill" — the whole frame is shown and the box
   * takes the letterboxing. Set on the cutaway, which must not be cropped.
   */
  contain?: boolean;
};

/** A paragraph in the run. See the note above on why this is bottom-anchored. */
export type EditorialCopy = {
  kind: "copy";
  x: number;
  width: number;
  /** The drawn BOTTOM edge of the block, not its top. */
  bottom: number;
  /** The design gives only the first block a heading (node 310:1350). */
  heading?: string;
  body: string;
};

/**
 * One thing in the run.
 *
 * Photographs and paragraphs are one list rather than two, and the list is in
 * the order the page reads top to bottom — which on the drawn frame is the
 * order they are placed in, and below the width where that frame stacks is the
 * order they appear in. Two lists would render every picture and then every
 * paragraph once stacked.
 */
export type EditorialBlock = EditorialPlate | EditorialCopy;

/**
 * The drawing stage at the foot of the run (nodes 310:1397–310:1403).
 *
 * Unlike the showcase's rail, this one lists every drawing including the one
 * in the main frame — the design draws the first thumbnail as a copy of what
 * is showing. Three equal cells and two 16px gaps come to the drawn 672px.
 */
export const EDITORIAL_DRAWINGS = {
  main: { x: 115, y: 6316, width: 1130, height: 565 },
  rail: { x: 115, y: 6913, width: 672, height: 107, gap: 16 },
} as const;

export type EditorialProject = {
  layout: "editorial";
  slug: string;
  title: string;
  location: string;
  /** Hero paragraph under the title (node 310:1407). */
  summary: string;
  /** Bottom-right of the hero (node 299:964). Not drawn on the showcase. */
  typology: string;
  architect: {
    name: string;
    /** The practice's own base, not the project's location. */
    base: string;
    portrait: string;
  };
  /**
   * Full-bleed 1440x900 hero (node 299:950).
   *
   * `src` is the still: what paints first, and what Open Graph is given. Give
   * `sequence` a folder of frames and the hero becomes a scroll-scrubbed shot
   * instead — see HeroSequence, and note that the still has to be frame one of
   * that sequence or the canvas will jump when it takes over.
   */
  hero: ProjectImage & {
    sequence?: {
      /** Folder of zero-padded frames, 0001.webp upward. */
      dir: string;
      count: number;
      /** Screenfuls of scroll the scrub is spread over, the first included. */
      track: number;
    };
  };
  /**
   * The strip under the hero (node 346:2): five values spread across the
   * column with no labels drawn, over the site outline. The labels below are
   * not drawn either — they are read out and nothing else, so that "480 m²"
   * is not announced on its own.
   */
  facts: { label: string; value: string }[];
  /** The site outline the strip is set over (node 346:23). */
  siteOutline: string;
  /** The run itself, in reading order. */
  blocks: EditorialBlock[];
  /** The drawing set. The first entry is what the main frame opens on. */
  drawings: ProjectImage[];
};

const HOUSE_KLAUS: EditorialProject = {
  layout: "editorial",
  slug: "house-klaus",
  title: "House Klaus",
  location: "Western Cape, South Africa",
  summary:
    "The project brief called for the design of a contemporary six-bedroom coastal residence on a steeply sloping site within the Romansbaai Estate.",
  typology: "Private Residence",
  architect: {
    name: "Neo Architects",
    base: "Western Cape, South Africa",
    // The one portrait the design uses for every architect on the site.
    portrait: "/images/architect-portrait.png",
  },
  hero: {
    // Frame one of the sequence below, so the still the page opens on and the
    // first frame the canvas draws are the same picture.
    src: "/projects/house-klaus/hero.jpg",
    alt: "The entry walk of the house, stone paving between planting and a stone wall",
    sequence: {
      dir: "/projects/house-klaus/hero-sequence",
      count: 121,
      track: 3,
    },
  },
  facts: [
    { label: "Architects", value: "Neo Architects" },
    { label: "Area", value: "480 m²" },
    { label: "Location", value: "Western Cape, South Africa" },
    { label: "Year", value: "2025" },
    { label: "Typology", value: "Private residence" },
  ],
  siteOutline: "/projects/house-klaus/site-outline.svg",
  // In reading order, which on the drawn frame is also placement order.
  blocks: [
    {
      kind: "copy",
      x: 803,
      width: 557,
      // Drawn 120..428: a 32px heading, the 12px gap and eleven lines of 24.
      bottom: 428,
      heading: "Introduction",
      body: "The project brief called for the design of a contemporary six-bedroom coastal residence on a steeply sloping site within the Romansbaai Estate. The client's vision was to maximise panoramic sea views while creating a home that responds sensitively to the site's topography, prevailing winds and strict height restrictions. The residence was required to integrate generous indoor and outdoor living spaces, wellness facilities, guest accommodation and sustainable design strategies, including solar energy, rainwater harvesting and green roofs. The architectural response sought to balance luxury with environmental sensitivity, producing a durable, low-maintenance home that seamlessly connects with the surrounding fynbos landscape and evolving coastal context.",
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/coastal-slope.jpg",
      alt: "The house on its fynbos slope, glazed gable turned to the open sea",
      x: 0,
      y: 548,
      width: 1360,
      height: 473,
      // Node 310:1312 is cropped by hand: its imageTransform fits the source
      // to the width and takes the band 63.37% of the way down the overflow.
      position: "50% 63.37%",
    },
    {
      kind: "copy",
      x: 0,
      width: 557,
      // Drawn 1141..1309, seven lines.
      bottom: 1309,
      body: "The architectural concept is founded on the idea of Fragmented Living—a collection of distinct spatial volumes carefully composed to respond to the site's dramatic topography, panoramic ocean views, and indigenous landscape. Rather than presenting the residence as a single monolithic form, the programme is broken into a series of interconnected pavilions that separate public, private, and recreational functions while maintaining a unified architectural language.",
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/pool-terrace.jpg",
      alt: "A parasol on the pool deck, the terrace running out to a glass balustrade above the bay",
      x: 803,
      y: 1253,
      width: 557,
      height: 835,
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/green-roof-pavilion.jpg",
      alt: "A glazed pavilion under a low gable, its roof and terrace planted with fynbos",
      x: 0,
      y: 1531,
      width: 787,
      height: 557,
    },
    {
      kind: "copy",
      x: 803,
      width: 557,
      // Drawn 2274..2466, eight lines.
      bottom: 2466,
      body: "A central circulation spine serves as the organising element of the house, physically and visually linking these fragmented spaces into a cohesive whole. This connective axis extends beyond the building envelope, reinforcing the relationship between architecture and landscape and encouraging a seamless transition between interior and exterior living. Courtyards, terraces and framed vistas become integral components of the spatial experience, allowing the surrounding fynbos and coastline to permeate the home.",
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/entry-walk.jpg",
      alt: "The entry walk, stone paving set in gravel between a rubble wall and planting",
      x: 0,
      y: 2466,
      width: 672,
      height: 616,
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/outdoor-living.jpg",
      alt: "The sheltered outdoor room, its seating turned to the fire and the pool beyond",
      x: 688,
      y: 2625,
      width: 672,
      height: 457,
    },
    {
      kind: "copy",
      x: 0,
      width: 557,
      // Drawn 3252..3420, seven lines. The axonometric below starts 44px
      // before this block ends; they overlap in the drawing too, on the white
      // margin the drawing carries down its left side.
      bottom: 3420,
      body: "The building is carefully embedded within the steep site, stepping with the natural contours to minimise visual impact, satisfy height restrictions, and reduce the extent of excavation. Green roofs and retained landscape further soften the building's presence, enabling the architecture to become an extension of the terrain rather than an object placed upon it. The result is a contemporary coastal residence that balances openness with shelter, celebrates the unique qualities of its setting, and creates a sequence of connected yet intimate living environments.",
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/axonometric-site.jpg",
      alt: "Axonometric of the house set into its slope, the pavilions read as separate volumes",
      x: 229,
      y: 3376,
      width: 1131,
      height: 566,
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/axonometric-cutaway.jpg",
      alt: "Cutaway axonometric with the roofs lifted, showing the rooms and the circulation spine",
      x: 0,
      y: 4079,
      width: 1016,
      height: 581,
      contain: true,
    },
    {
      kind: "copy",
      x: 803,
      width: 557,
      // Drawn 4604..4796, eight lines.
      bottom: 4796,
      body: "The section demonstrates how the building responds to the site's natural slope while complying with the estate's height restrictions. Stepped floor levels organise the programme across the terrain, creating clear relationships between the living spaces, private accommodation and outdoor terraces. Double-volume spaces enhance natural daylight and spatial connectivity, while the circulation spine links the fragmented building volumes into a cohesive whole. The section also highlights the integration of the built form with the surrounding landscape and green roofs.",
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/seaward-view.jpg",
      alt: "The house from the seaward side, low against the fynbos above the surf",
      x: 0,
      y: 4916,
      width: 1360,
      height: 400,
      // Node 310:1393, cropped the same way: 69.05% down the overflow.
      position: "50% 69.05%",
    },
    {
      kind: "plate",
      src: "/projects/house-klaus/approach.jpg",
      alt: "The approach, the garage cut into the slope below the planted roofs and the sea",
      x: 0,
      y: 5396,
      width: 1360,
      height: 800,
      // Node 310:1395 keeps the foot of the frame rather than its middle.
      position: "50% 100%",
    },
  ],
  drawings: [
    {
      src: "/projects/house-klaus/section-long.jpg",
      alt: "Long section through the house, its floors stepping down the slope under gabled roofs",
    },
    {
      src: "/projects/house-klaus/elevation-approach.jpg",
      alt: "Elevation from the approach, the house cut into the slope above the garage",
    },
    {
      src: "/projects/house-klaus/elevation-seaward.jpg",
      alt: "Sectional elevation of the seaward face, two living levels under the long roof",
    },
  ],
};

/**
 * A project, whichever template it renders through. The route reads the
 * shared head, while ProjectShowcase and ProjectEditorial narrow the body.
 */
export type Project = ShowcaseProject | EditorialProject;

/** Every project with a page, in the order they should be listed. */
export const PROJECTS: Project[] = [CASA_PURA_VIDA, HOUSE_KLAUS];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
