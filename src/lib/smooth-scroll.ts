import type Lenis from "lenis";

/**
 * The page's one Lenis instance, and the handle anything that needs to hold
 * the page still reaches for.
 *
 * Lenis takes over the document's scrolling, so `overflow: hidden` is no
 * longer enough on its own to freeze the page — the wheel and touch listeners
 * are still running and Lenis will still move its own scroll value. Anything
 * that locks the page (the nav overlay, the loading screen) has to tell Lenis
 * as well, which is what these two are for.
 *
 * A module singleton rather than context: the things that need it are scattered
 * client islands with no common provider above them, and there is only ever one
 * scroller on the page.
 */

let instance: Lenis | null = null;

/** Called by SmoothScroll on mount and unmount. Nothing else should set this. */
export function setSmoothScroll(next: Lenis | null) {
  instance = next;
}

export function getSmoothScroll() {
  return instance;
}

/** No-ops when smooth scrolling is off — reduced motion, or before mount. */
export function stopSmoothScroll() {
  instance?.stop();
}

export function startSmoothScroll() {
  instance?.start();
}
