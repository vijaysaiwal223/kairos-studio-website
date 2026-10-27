"use client";

import gsap from "gsap";
import { usePathname } from "next/navigation";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * The project showcase's picture entrance: every marked image uncovers left to
 * right as it arrives on screen.
 *
 * Mounted once by the showcase rather than wrapped around anything, and only
 * by the showcase — the homepage sections have entrances of their own and are
 * not given a second one. An image is not a component here: they are scattered
 * through a server-rendered page, sit inside grids and figures whose layout a
 * wrapper element would disturb, and most of them are in .map()s. So the
 * wrapper is the marker instead — put data-image-reveal on the picture and
 * this finds it, which makes a new one an attribute and no imports.
 *
 * Deliberately not a ScrollTrigger. The trigger here is the simplest question
 * there is — is this on screen yet — and IntersectionObserver answers it
 * without measuring the document, without a refresh to keep in step with the
 * page's other triggers, and without caring what has moved above it. GSAP
 * still does the animating.
 *
 * The wipe is clip-path and nothing else — never transform, never opacity — so
 * it can play over a picture something else is already moving without the two
 * writing to the same property.
 */

/** The marker. Put it on any <Image> that should uncover on the way in. */
const MARKED = "[data-image-reveal]";

/** Covered from the right, then uncovered to nothing. */
const COVERED = "inset(0% 100% 0% 0%)";
const UNCOVERED = "inset(0% 0% 0% 0%)";

const WIPE = {
  duration: 0.9,
  ease: "power3.out",
  /** Enough that a row of collage frames arrives in sequence, not in unison. */
  stagger: 0.12,
};

/**
 * A picture counts as arrived once a sixth of it is in view, and the bottom
 * eighth of the viewport does not count — so nothing starts wiping while it is
 * still a sliver at the very bottom edge of the screen.
 */
const WATCH = { threshold: 0.16, rootMargin: "0px 0px -12% 0px" };

export function ImageReveal() {
  // The layout does not remount between routes, so the scan is keyed to the
  // path: a new page's pictures are found the moment its DOM is committed.
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const images = gsap.utils.toArray<HTMLElement>(MARKED);
    if (images.length === 0) return;

    // What is watched is the frame around each picture, not the picture.
    //
    // A covered picture has no visible area, and an element with no visible
    // area never counts as on screen — the observer would sit there waiting
    // for something that cannot happen while the thing it is waiting on is
    // the very thing being hidden. Its frame is not clipped, so the frame is
    // what reports arriving, and the pictures inside it are what move. Where
    // several pictures share a frame — the capability picker stacks its whole
    // set in one box — they arrive together, which is what you want anyway.
    const byFrame = new Map<Element, HTMLElement[]>();
    images.forEach((image) => {
      const frame = image.parentElement ?? image;
      const group = byFrame.get(frame);
      if (group) group.push(image);
      else byFrame.set(frame, [image]);
    });

    const mm = gsap.matchMedia();

    // No branch for reduced motion on purpose: if the covering below never
    // runs, the pictures are simply there, which is exactly the right result.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(images, { clipPath: COVERED, willChange: "clip-path" });

      let disposed = false;
      const tweens = new Set<gsap.core.Tween>();

      const revealWhenReady = async (arrived: HTMLElement[]) => {
        // A wipe that completes before its image decodes reveals an empty
        // frame, then the photograph pops in without animation. Project media
        // is requested eagerly, and this final gate guarantees the transition
        // still waits for real pixels on a slow connection or a fast scroll.
        await Promise.allSettled(
          arrived.map((element) => {
            if (!(element instanceof HTMLImageElement)) return Promise.resolve();
            if (element.complete && element.naturalWidth > 0) {
              return Promise.resolve();
            }
            return element.decode();
          }),
        );

        if (disposed) return;

        const tween = gsap.to(arrived, {
          ...WIPE,
          clipPath: UNCOVERED,
          overwrite: true,
          // Nothing clips these again, so the inline properties come back off
          // and the element is left as the stylesheet wrote it.
          onComplete: () => {
            gsap.set(arrived, { clearProps: "clipPath,willChange" });
            tweens.delete(tween);
          },
        });
        tweens.add(tween);
      };

      const observer = new IntersectionObserver((entries) => {
        const arrived: HTMLElement[] = [];

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // Once each. Unobserving here rather than after the tween means a
          // fast scroll cannot queue a second wipe over the first.
          observer.unobserve(entry.target);
          arrived.push(...(byFrame.get(entry.target) ?? []));
        });

        if (arrived.length === 0) return;
        void revealWhenReady(arrived);
      }, WATCH);

      byFrame.forEach((_group, frame) => observer.observe(frame));

      return () => {
        disposed = true;
        observer.disconnect();
        tweens.forEach((tween) => tween.kill());
        tweens.clear();
      };
    });

    return () => mm.revert();
  }, [pathname]);

  return null;
}
