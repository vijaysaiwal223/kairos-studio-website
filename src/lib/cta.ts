/**
 * The one palette every arrow CTA on the site uses.
 *
 * Defined here rather than at each call site because the two buttons drifted
 * apart the moment they were coloured separately — the About one took its
 * section's warm ink while the project slides took a neutral black, which read
 * as two different components. Spread this into ArrowFillButton and they
 * cannot diverge again.
 *
 * A white pill that fills with the site's ink, and an arrow that reverses out
 * of it. The pill sits on photography in the featured slides and on the page's
 * own ground in the About section, so the fill carries the contrast rather
 * than the pill.
 */
export const CTA_COLORS = {
  bgColor: "#ffffff",
  textColor: "#000000",
  fillBgColor: "#171717",
  fillTextColor: "#ffffff",
  hoverFillBgColor: "#171717",
  hoverFillTextColor: "#ffffff",
} as const;
