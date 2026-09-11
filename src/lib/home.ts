/**
 * Home page content.
 * Figma: "HOME PAGE", node 288:146
 * https://www.figma.com/design/IgGKIxIUSVPAgpdPb8wGk1/Website?node-id=288-146
 *
 * Everything the home page says, in one file, so the sections stay markup and
 * geometry. Copy is the design's own except where a note says otherwise.
 *
 * A warning on the copy: the design carries placeholder text in three places —
 * it names ELEMENTIS, which is not this studio, and it gives all three service
 * cards and both drawn project slides the same paragraph. It is reproduced
 * verbatim below rather than invented around, and each instance is flagged.
 * Replace the flagged strings and nothing else has to change.
 */

/**
 * Node 298:721. Four cards on one row, hung from the top on alternating 450
 * and 500px portraits — which is where the stagger in the design comes from,
 * not from any offset applied to the cards.
 */
export const ARCHITECTS = [
  {
    name: "Salvador Rivas Trujillo",
    role: "Principal Architect",
    portrait: "/home/architects/salvador-rivas-trujillo.jpg",
    height: 450,
  },
  {
    name: "Brian Schaer",
    role: "Associate",
    portrait: "/home/architects/brian-schaer.jpg",
    height: 500,
  },
  {
    name: "Gonzalo Tudanca",
    role: "Principal & Director",
    portrait: "/home/architects/gonzalo-tudanca.jpg",
    height: 450,
  },
  {
    name: "Supernita Kalra",
    role: "Associate",
    portrait: "/home/architects/supernita-kalra.jpg",
    height: 500,
  },
] as const;

/**
 * Node 295:499. Six numbered rows.
 *
 * The design draws a photograph behind the first row and none behind the other
 * five, which reads as one row caught in its hover state rather than as a row
 * that is permanently different — so `image` is what a row reveals on hover,
 * and the five without one simply do not reveal anything yet. Give them a file
 * and they will.
 */
type Offering = { title: string; body: string; image?: string };

export const OFFERINGS: Offering[] = [
  {
    title: "Architect Matching",
    body: "We identify the practice whose approach, experience and sensibility best fit your site.",
    image: "/home/offer-architect-matching.jpg",
  },
  {
    title: "Design Management",
    body: "We turn a brief into a considered design process, keeping every decision focused and moving.",
  },
  {
    title: "Approvals & Compliance",
    body: "We navigate local requirements, consultants and authorities without losing what made the design special.",
  },
  {
    title: "Technical Integration",
    body: "Structure, services, lighting, interiors and material detail resolved as one coherent whole.",
  },
  {
    title: "Turnkey Construction",
    body: "Budgets, procurement, specialists and site execution managed with rigour from beginning to handover.",
  },
  {
    title: "Aftercare",
    body: "We stay involved after completion to ensure the place performs as beautifully as it was intended to.",
  },
];

/**
 * Node 295:564. Placeholder copy: the design gives all three cards the same
 * paragraph, which is also the paragraph above them. Kept as drawn.
 */
export const SERVICES = [
  { title: "Interior Design", body: "Spaces with character, precision and a strong sense of how they will be lived in.", image: "/home/services/interior-design.jpg" },
  { title: "Residential Architecture", body: "Homes shaped around their site, their inhabitants and the rituals of everyday life.", image: "/home/services/residential-design.jpg" },
  { title: "Commercial Spaces", body: "Environments that give a business presence, purpose and a lasting impression.", image: "/home/services/commercial-design.jpg" },
] as const;

/**
 * Placeholder: names ELEMENTIS rather than this studio. Drawn on the network
 * section (node 298:816) and on every project slide (node 289:324).
 */
export const ELEMENTIS_PLACEHOLDER =
  "At ELEMENTIS, we use the Integrative Wellness approach, that considers psychological, physical, and nutritional aspects of your life to improve overall well-being and balance.";
