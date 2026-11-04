/** Content for the active homepage sections. */

/** Six process steps, paired with the Kairos process animations. */
type Offering = { title: string; body: string; video: string; poster: string };

export const OFFERINGS: Offering[] = [
  {
    title: "Idea",
    body: "We listen to your ambitions and extraordinary, study the site and define what the project could become.",
    video: "/home/Kairos%20Process%20WebM/01_Kairos_Idea.webm",
    poster: "/home/Kairos%20Process%20WebM/01_Kairos_Idea.jpg",
  },
  {
    title: "Strategy",
    body: "We turn the brief into a clear direction and bring the right architects and specialists together.",
    video: "/home/Kairos%20Process%20WebM/02_Kairos_Strategy.webm",
    poster: "/home/Kairos%20Process%20WebM/02_Kairos_Strategy.jpg",
  },
  {
    title: "Design",
    body: "We shape the concept around its place, purpose and the people who will use it.",
    video: "/home/Kairos%20Process%20WebM/03_Kairos_Design.webm",
    poster: "/home/Kairos%20Process%20WebM/03_Kairos_Design.jpg",
  },
  {
    title: "Development",
    body: "We coordinate drawings, details, approvals and technical input to make the design buildable.",
    video: "/home/Kairos%20Process%20WebM/04_Kairos_Development.webm",
    poster: "/home/Kairos%20Process%20WebM/04_Kairos_Development.jpg",
  },
  {
    title: "Execution",
    body: "We align the team, budget, procurement and site work as the project takes shape.",
    video: "/home/Kairos%20Process%20WebM/05_Kairos_Execution.webm",
    poster: "/home/Kairos%20Process%20WebM/05_Kairos_Execution.jpg",
  },
  {
    title: "Delivery",
    body: "We guide the final handover and help the finished space settle into use.",
    video: "/home/Kairos%20Process%20WebM/06_Kairos_Delivery.webm",
    poster: "/home/Kairos%20Process%20WebM/06_Kairos_Delivery.jpg",
  },
];

/** Service categories in the Figma 25:470 overview. */
export const SERVICES = [
  {
    title: "Strategy / Consulting",
    heading: "A clear direction for every decision that follows.",
    body: "We test the possibilities, sharpen the brief and bring the right people together so each project begins with purpose.",
    image: "/home/expertise/consulting-figma.png",
  },
  {
    title: "Design",
    heading: "Spaces shaped around the people who use them.",
    body: "We guide the creative work from first concept to considered detail, balancing imagination with the needs of the place.",
    image: "/home/expertise/interior.jpg",
  },
  {
    title: "Project Management",
    heading: "One team, one plan, every detail in view.",
    body: "We keep architects, specialists, budgets and decisions aligned throughout the project, with a clear point of contact.",
    image: "/home/expertise/procurement.jpg",
  },
  {
    title: "Execution",
    heading: "The design intent carried through to the site.",
    body: "We coordinate the work on the ground, resolve details as they arise and keep delivery moving toward the shared vision.",
    image: "/home/expertise/architecture.jpg",
  },
  {
    title: "Bespoke / End-to-End Solutions",
    heading: "A complete service shaped around your ambition.",
    body: "From the earliest conversation to final handover, we assemble the right expertise and guide the entire journey.",
    image: "/home/expertise/marketing.jpg",
  },
] as const;
