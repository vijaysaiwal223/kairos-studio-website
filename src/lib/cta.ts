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

/**
 * The same pill, inverted, for CTAs that sit on the page's own ground rather
 * than on photography.
 *
 * A white pill needs the photograph behind it to be seen. The invitation at
 * the foot of the editorial project page (Figma node 299:1113) is drawn on
 * white, and the design duly draws that button in ink — so the pill and its
 * fill trade places, and the arrow reverses out of the white.
 *
 * Kept beside CTA_COLORS rather than written at the call site for the reason
 * given above: there are two grounds on this site, so there are two palettes,
 * and both of them live here.
 */
export const CTA_COLORS_INK = {
  bgColor: "#171717",
  textColor: "#ffffff",
  fillBgColor: "#ffffff",
  fillTextColor: "#171717",
  hoverFillBgColor: "#ffffff",
  hoverFillTextColor: "#171717",
} as const;
