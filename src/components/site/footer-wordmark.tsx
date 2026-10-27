"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * The oversized wordmark across the footer's bottom edge, rising a letter at a
 * time.
 * Figma: node 256:52.
 *
 * Live type now, not the outlined drawing it used to be — so the letters are
 * letters, and the stagger falls out of the markup instead of having to be cut
 * out of a set of paths.
 *
 * The design justifies a single line across the full content column, which for
 * two words is the same thing as pushing one to each end; space-between says
 * that directly and survives the letters being wrapped for masking, which
 * text-align-last: justify would not. The words keep their own boxes so the
 * stretched space stays between them and never opens up between letters.
 *
 * Each letter then sits in its own clipping box and slides up out of it, in
 * document order, so the rise reads left to right across the whole wordmark
 * rather than word by word.
 *
 * Scrubbed rather than played, to match the reveals elsewhere on the site, and
 * clamped because this is the very last thing on the page: without that the
 * scroll runs out before the tween finishes and the type is left standing
 * half-risen. The range is deliberately short — the wordmark only clears the
 * fold in the final stretch, so a long one would spend most of itself
 * off-screen.
 */

const WORDS = ["Kairos", "Studio"];

export function FooterWordmark() {
  const ref = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const letters = root.querySelectorAll<HTMLElement>(
        "[data-wordmark-letter]",
      );

      // from(), set before the browser paints, so the letters are already down
      // in their boxes on the first frame rather than flashing into place.
      const tween = gsap.from(letters, {
        yPercent: 110,
        // Linear, because the scroll position is doing the easing.
        ease: "none",
        // Tight, because there are twelve of these rather than two: the sweep
        // should read as one movement crossing the wordmark, not as twelve.
        stagger: 0.06,
        scrollTrigger: {
          trigger: root,
          start: "clamp(top 100%)",
          end: "clamp(top 74%)",
          scrub: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    // Anyone who asked for less motion just gets the wordmark.
    mm.add("(prefers-reduced-motion: reduce)", () => {});

    return () => mm.revert();
  }, []);

  return (
    <p ref={ref} className="site-footer-wordmark">
      {/* Each letter is its own box so it can be masked, which would otherwise
          be read out one letter at a time. This carries the words for anyone
          listening; the visible letters are decorative. */}
      <span className="sr-only">{WORDS.join(" ")}</span>

      {WORDS.map((word) => (
        <span key={word} aria-hidden className="site-footer-wordmark-word">
          {[...word].map((letter, index) => (
            // The mask: the letter slides up out of this, and it is what keeps
            // the travel from showing above the line.
            <span
              key={`${letter}-${index}`}
              className="site-footer-wordmark-mask"
            >
              <span data-wordmark-letter>{letter}</span>
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
