import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server.
 *
 * Two reasons anything touching GSAP reaches for this rather than useEffect,
 * and the second one is the one that bites.
 *
 * It runs before the browser paints, so an element that a timeline is about to
 * move is never shown for a frame in its unstyled position.
 *
 * And its cleanup runs at the right moment on the way out. When React deletes
 * a subtree it calls the layout cleanups of a component *before* it walks into
 * that component's DOM and removes it, but it defers useEffect cleanups until
 * after the removal has already happened. Anything that has re-parented or
 * rewritten React's own nodes — a ScrollTrigger pin, which lifts the pinned
 * element into a pin-spacer, or a SplitText, which replaces an element's
 * children — therefore has to undo that work from a layout cleanup. From a
 * useEffect cleanup it is simply too late: React has already tried to remove a
 * node from a parent that no longer holds it, and thrown
 *
 *     NotFoundError: Failed to execute 'removeChild' on 'Node'
 *
 * which on this site meant navigating off the homepage crashed the app.
 *
 * React logs a warning if useLayoutEffect is called during a server render, so
 * this swaps in useEffect there — the effect is client-only either way.
 */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
