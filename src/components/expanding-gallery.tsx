"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import {
  COLLAGE_COLUMNS,
  EXPAND_HERO,
  FEATURED,
} from "@/lib/featured";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

const HOME_FEATURED_BODY =
  "Each project begins with a specific way of living, a particular landscape and a clear point of view. The result is architecture that belongs nowhere else.";

/**
 * The expanding collage, and the project cycle it hands over to.
 * Figma: nodes 297:705 (the collage) and 289:298 (the slide it becomes).
 *
 * One pinned screenful and one timeline, in two phases. The first holds the
 * collage still and scales it about its own centre until the middle card —
 * which is the first project's render — fills the screen, then fades the
 * preview in over it. The second walks the rest of the projects through that
 * same frame.
 *
 * One pin rather than two, and that is not a detail. Pinning them separately
 * leaves a screenful between the two in which the first section has released
 * and scrolls away while the second has not yet caught the top of the
 * viewport — so the reader watches one card slide up and another slide in
 * behind it, which is precisely the seam the whole section exists to avoid.
 * A single trigger holds the frame still across the whole move.
 *
 * The first project's preview has no background of its own for the same
 * reason. It is painted over the hero, which is already that project's
 * photograph at full bleed — giving it a second copy of that image to fade in
 * would mean crossfading one crop of a picture into a different crop of the
 * same picture, which reads as a lurch. Only the projects after it bring a
 * background, and those crossfade over the hero.
 *
 * WHY THE SCALE IS MEASURED, NOT CHOSEN
 * The end scale is whatever makes the hero cover the viewport — max(vw/w, vh/h)
 * — and that depends on the window, so it cannot be a number in a stylesheet.
 * It is read at refresh through a function-based tween value, which with
 * invalidateOnRefresh means a resize re-measures rather than re-using the
 * scale from the old viewport.
 *
 * It is read from offsetWidth/offsetHeight rather than getBoundingClientRect:
 * the hero's box is inside the element being scaled, so its rect is already
 * multiplied by whatever the collage is at when asked. The offsets are the
 * untransformed layout size, which is the number the ratio needs.
 *
 * WHY THE HERO SCALES BY ITS PARENT
 * Nothing animates the hero itself. The collage scales about 50% 50%, and the
 * hero is the middle child of a symmetric row — the outer columns are the same
 * width as each other and so are the inner pair — so the collage's centre and
 * the hero's centre are the same point, and that point is the middle of the
 * screen. Scaling the parent therefore grows the hero about the centre of the
 * viewport, and carries the rest of the collage off the edges for free.
 */

/** Screenfuls of scroll the expansion is spread over. */
const EXPAND_SCROLL = { wide: 200, narrow: 140 };

/** And one more for each project after the first. */
const CYCLE_SCROLL_EACH = 100;

/**
 * Below this the outer columns are dropped and the move is given less scroll.
 *
 * There is no matching constant for the 640 breakpoint, and that is the point:
 * below it the stylesheet gives the hero the whole section, so the measured end
 * scale comes out at 1 on its own and the expansion skips itself. Nothing here
 * has to know about it.
 */
const BREAK_TABLET = 1024;

export function ExpandingGallery() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // The whole thing is motion. Reduced motion gets the finished state, which
    // the stylesheet already paints — so there is nothing to set up.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const expand = root.querySelector<HTMLElement>(".expand-gallery");
      const collage = root.querySelector<HTMLElement>(".collage");
      const hero = root.querySelector<HTMLElement>(".hero");
      const heroImg = root.querySelector<HTMLElement>(".hero img");
      const preview = root.querySelector<HTMLElement>(".preview");
      const card = root.querySelector<HTMLElement>(".preview__card");
      // Scoped to the first frame: the selector matches every project's pair,
      // and only the first one's are staggered in as the preview arrives.
      const firstFrame = root.querySelector<HTMLElement>(".cycle__frame");
      const labels = firstFrame
        ? gsap.utils.toArray<HTMLElement>(
            firstFrame.querySelectorAll(
              ".preview__eyebrow, .preview__hint, .preview__plus",
            ),
          )
        : [];
      const sideColumns = gsap.utils.toArray<HTMLElement>(".col");
      if (!expand || !collage || !hero || !heroImg || !preview) return;

      /**
       * What the hero has to be multiplied by to cover the section.
       *
       * Measured against the section's own box, not window.innerWidth. The
       * site reserves the scrollbar gutter (see `html` in globals.css), so the
       * window is some 15px wider than anything laid out inside it — and since
       * the hero's own width is in vw, which does include that gutter, taking
       * the ratio against the window leaves the hero a few pixels short of the
       * right edge at every breakpoint. The section is what the reader sees
       * covered, so the section is what it is measured against.
       */
      const endScale = () => {
        const width = hero.offsetWidth;
        const height = hero.offsetHeight;
        if (!width || !height) return 1;
        // The 1.002 is a rounding guard, not a design choice. offsetWidth is
        // an integer while the scaled box is fractional, so the exact ratio can
        // land the hero a third of a pixel inside the section and leave a
        // hairline of page showing down one edge. Two parts in a thousand is
        // three pixels of overscan at this size — under the hero's own crop,
        // and invisible — and it cannot round short.
        return (
          Math.max(
            expand.offsetWidth / width,
            expand.offsetHeight / height,
          ) * 1.002
        );
      };

      const scrollLength = () =>
        window.innerWidth < BREAK_TABLET
          ? EXPAND_SCROLL.narrow
          : EXPAND_SCROLL.wide;


      const frames = gsap.utils.toArray<HTMLElement>(".cycle__frame");
      const steps = Math.max(frames.length - 1, 0);

      /** Screenfuls: the expansion, then one more for each further project. */
      const total = () => scrollLength() + steps * CYCLE_SCROLL_EACH;

      /**
       * The expansion's share of the whole timeline.
       *
       * Both phases live on one timeline under one pin, so the ratios the
       * expansion is written in — fade the columns at 0.55, bring the preview
       * in at 0.8 — have to be scaled into the slice it actually occupies. `e`
       * is that slice, and every position and duration below it is multiplied
       * by it, which leaves the phase's own proportions exactly as designed.
       */
      const e = () => scrollLength() / total();
      const share = e();

      const tl = gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: {
          trigger: expand,
          start: "top top",
          end: () => `+=${total()}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            collage.style.willChange = "transform";
            heroImg.style.willChange = "transform";
          },
          // Dropped the moment the move is over in either direction: a layer
          // kept promoted for the rest of the page costs memory for nothing.
          onLeave: () => {
            collage.style.willChange = "";
            heroImg.style.willChange = "";
          },
          onLeaveBack: () => {
            collage.style.willChange = "";
            heroImg.style.willChange = "";
          },
        },
      });

      // ── Phase one: the expansion ──────────────────────────────────────
      tl.fromTo(collage, { scale: 1 }, { scale: endScale, duration: share }, 0)
        // A slow push inside the frame, against the scale outside it — which is
        // what stops the move reading as a CSS zoom and starts it reading as a
        // camera travelling forward.
        .fromTo(
          heroImg,
          { scale: 1.15 },
          { scale: 1, duration: share },
          0,
        )
        .to(hero, { borderRadius: 0, duration: 0.4 * share }, 0.6 * share)
        .to(preview, { autoAlpha: 1, duration: 0.2 * share }, 0.8 * share)
        .fromTo(
          card,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.2 * share },
          0.8 * share,
        )
        .fromTo(
          labels,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.15 * share, stagger: 0.06 * share },
          0.8 * share,
        );

      if (sideColumns.length) {
        // Mostly past the edges by now; this only kills stray corners.
        tl.to(
          sideColumns,
          { autoAlpha: 0, duration: 0.3 * share },
          0.55 * share,
        );
      }

      // ── Phase two: the cycle ──────────────────────────────────────────
      //
      // One wipe per project, ported from the stage this section replaced.
      // A single line sweeps up the frame: the incoming project is clipped to
      // below it and the outgoing to above it, so the two are never both whole
      // and never both absent — the line is the only edge on screen.
      //
      // The parallax is what sells it. The incoming background is translated
      // down by exactly the line's distance from the top, so its own top edge
      // IS the line and it arrives at rest the instant the line reaches the
      // top. The outgoing travels the same way at half speed, which reads as
      // the two lying at different depths rather than as one sliding over the
      // other.
      //
      // Foregrounds get no transform at all. They sit in their final position
      // from the first frame and are revealed and erased by the clip alone —
      // a card that also faded would be arriving twice.
      const CLIPPED = "inset(100% 0% 0% 0%)";
      const WHOLE = "inset(0% 0% 0% 0%)";
      const ERASED = "inset(0% 0% 100% 0%)";

      /** Outgoing backgrounds climb at half the line's speed. */
      const OUTGOING_PARALLAX = 0.5;

      frames.forEach((frame, index) => {
        if (index === 0) return;
        const span = (1 - share) / steps;
        const at = share + (index - 1) * span;

        const leaving = frames[index - 1];
        const leavingBg = leaving.querySelector<HTMLElement>(".cycle__bg");
        const arrivingBg = frame.querySelector<HTMLElement>(".cycle__bg");

        tl
          // Above the line, erased from the bottom up.
          .fromTo(
            leaving,
            { clipPath: WHOLE },
            { clipPath: ERASED, duration: span },
            at,
          )
          // Below the line, its top edge welded to it.
          .fromTo(
            frame,
            { clipPath: CLIPPED },
            { clipPath: WHOLE, duration: span },
            at,
          );

        if (arrivingBg) {
          tl.fromTo(
            arrivingBg,
            { y: () => expand.offsetHeight },
            { y: 0, duration: span },
            at,
          );
        }

        // The first project has no background of its own — the hero behind it
        // is already its photograph — so for that one hand-over it is the
        // collage that has to drift, or the parallax simply would not happen.
        const outgoing = leavingBg ?? collage;
        tl.to(
          outgoing,
          {
            y: () => -expand.offsetHeight * OUTGOING_PARALLAX,
            duration: span,
          },
          at,
        );
      });

    }, root);

    // Type and pictures both move the page's height, and a trigger measured
    // before they land is measured against the wrong document.
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} id="projects">
      <section className="expand-gallery" aria-label="Featured projects">
        <div className="collage">
          {COLLAGE_COLUMNS.slice(0, 2).map((column) => (
            <CollageColumn key={column.place} column={column} />
          ))}

          {/* The centre card, and the only one that survives the move — it is
              the first project's render, so the collage resolves into that
              project's slide rather than into a picture of its own. */}
          <figure className="hero">
            <Image
              src={EXPAND_HERO.src}
              alt={EXPAND_HERO.alt}
              fill
              // It ends up covering the viewport at roughly 2.8x, so it is
              // asked for at the size it finishes at, not the size it starts.
              sizes="100vw"
              loading="eager"
              fetchPriority="low"
              className="object-cover"
            />
          </figure>

          {COLLAGE_COLUMNS.slice(2).map((column) => (
            <CollageColumn key={column.place} column={column} />
          ))}
        </div>

        {/* The preview, and every project it cycles through, on one plane.
            The first carries no background of its own: the hero behind it is
            already that project's photograph at full bleed. */}
        <div className="preview">
          {FEATURED.map((project, index) => (
            <div
              key={project.title}
              className="cycle__frame"
              data-first={index === 0 ? "true" : undefined}
            >
              {index > 0 ? (
                <div className="cycle__bg">
                  <Image
                    src={project.background.src}
                    alt={project.background.alt}
                    fill
                    sizes="100vw"
                    loading="eager"
                    fetchPriority="low"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div aria-hidden className="cycle__scrim" />

              <span className="preview__eyebrow">[Featured projects]</span>
              <span className="preview__hint">[Keep Scrolling]</span>
              {index === 0 ? (
                <button
                  type="button"
                  className="preview__plus"
                  aria-hidden
                  tabIndex={-1}
                >
                  +
                </button>
              ) : null}

              <PreviewCard
                index={index + 1}
                total={FEATURED.length}
                project={project}
                className="preview__card"
                linked
              />
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}

function CollageColumn({
  column,
}: {
  column: (typeof COLLAGE_COLUMNS)[number];
}) {
  return (
    <div className={`col col--${column.place}`}>
      {column.cards.map((card) => (
        <figure
          key={card.src}
          className="col__card"
          style={{ "--card-ratio": card.ratio } as React.CSSProperties}
        >
          <Image
            src={card.src}
            alt=""
            fill
            sizes="20vw"
            loading="eager"
            fetchPriority="low"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  );
}

function PreviewCard({
  index,
  total,
  project,
  className,
  linked = false,
}: {
  index: number;
  total: number;
  project: (typeof FEATURED)[number];
  className: string;
  linked?: boolean;
}) {
  const body = (
    <>
      <span className="preview__index">
        {String(index).padStart(2, "0")} — {String(total).padStart(2, "0")}
      </span>
      <h2 className="preview__title">{project.title}</h2>
      <span className="preview__thumb">
        <Image
          src={project.thumb}
          alt=""
          fill
          sizes="436px"
          loading="eager"
          fetchPriority="low"
          className="object-cover"
        />
      </span>
      <span className="preview__body">{HOME_FEATURED_BODY}</span>
    </>
  );

  return linked && project.href ? (
    <Link href={project.href} className={`${className} is-link`}>
      {body}
    </Link>
  ) : (
    <article className={className}>{body}</article>
  );
}
