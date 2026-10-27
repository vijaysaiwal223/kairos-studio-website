/** Content for the active homepage sections. */

/** Six process steps, paired with the numbered architectural animations. */
type Offering = { title: string; body: string; video: string; poster: string };

export const OFFERINGS: Offering[] = [
  {
    title: "Architect Matching",
    body: "We connect your brief with architects whose ideas, experience and approach suit your project.",
    video: "/home/process/1.webm",
    poster: "/home/process/1.png",
  },
  {
    title: "Design Management",
    body: "We shape a shared direction and keep the architect, specialists and decisions aligned.",
    video: "/home/process/2.webm",
    poster: "/home/process/2.png",
  },
  {
    title: "Approvals & Compliance",
    body: "We coordinate local requirements and approvals while protecting the design intent.",
    video: "/home/process/3.webm",
    poster: "/home/process/3.png",
  },
  {
    title: "Technical Integration",
    body: "We bring structure, services, interiors and materials into one coherent design.",
    video: "/home/process/4.webm",
    poster: "/home/process/4.png",
  },
  {
    title: "Turnkey Construction",
    body: "We coordinate budgets, procurement and site delivery through to handover.",
    video: "/home/process/5.webm",
    poster: "/home/process/5.png",
  },
  {
    title: "Aftercare",
    body: "We remain a point of contact as the space settles into use.",
    video: "/home/process/6.webm",
    poster: "/home/process/6.png",
  },
];

/** Service cards shown on the homepage. */
export const SERVICES = [
  { title: "Interior Design", body: "Spaces shaped around the way people live, work and gather.", image: "/home/expertise/interior-design.png", imageAlt: "Bedroom with a lit headboard and floor-length curtains" },
  { title: "Commercial Spaces", body: "Places that express a business clearly and work for the people inside them.", image: "/home/expertise/commercial-spaces.jpg", imageAlt: "Terracotta retail interior with skylights, garment rails and a stone display plinth" },
  { title: "Residential Architecture", body: "Homes responsive to their site and the rhythms of everyday life.", image: "/home/expertise/residential-architecture.jpg", imageAlt: "A long timber-roofed house on a concrete base, set among mature trees" },
] as const;
