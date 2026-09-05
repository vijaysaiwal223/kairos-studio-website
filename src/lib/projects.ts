/**
 * Project records for the project showcase template.
 *
 * Figma: "PROJECT PAGE", node 139:865
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Untitled?node-id=139-865
 *
 * The design draws exactly one project — Casa Pura Vida — on a 1440px frame.
 * Everything that changes from project to project lives in this file; the
 * geometry that does not lives in ProjectShowcase and the .ps-* block in
 * globals.css. Adding a project is one entry below plus its own folder under
 * public/projects/<slug>/ — the route and the sitemap build themselves from
 * PROJECTS, and the homepage's featured slides link to whatever is defined.
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

export type Project = {
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
  /** The homepage featured-slide render. A different frame from the hero. */
  featured: ProjectImage;
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

const CASA_PURA_VIDA: Project = {
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
  featured: {
    src: "/projects/casa-pura-vida/featured.jpg",
    alt: "Palm-shaded house with a curved timber canopy beside a pool",
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

/** Every project with a showcase page, in the order they should be listed. */
export const PROJECTS: Project[] = [CASA_PURA_VIDA];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
