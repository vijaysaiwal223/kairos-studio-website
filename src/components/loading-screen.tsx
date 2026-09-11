"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * The first-load screen.
 * Figma: "LOADING SCREEN-1" 197:1705, "-2" 199:1747, "-3" 199:1758.
 *
 * Three drawn states, and the plate moves between them in three parts: it
 * grows to the size the second board draws it at, holds there while the reel
 * shuffles and lands, then opens to fill the frame — which is the third board,
 * and is simply the homepage hero. So the loader does not sit in front of the
 * site and then vanish; it resolves into it, and the cross-fade at the end
 * lands on the same picture the hero is already showing.
 *
 * The hold is the part that makes it read. A plate that grows the whole way
 * never arrives anywhere: the shuffle has nothing still to happen inside, and
 * the opening has nothing to open from. Growing hard and then stopping dead
 * gives the screen a held middle — which is, after all, what the second board
 * is: one state, drawn at one size.
 *
 * The wordmark is measured off the plate's edge rather than animated
 * separately, so the picture is what carries the type outward, waits with it,
 * and finally pushes it off the edges of the frame. That is the relationship
 * the second board draws, and it means the two cannot drift apart. The count
 * and the rule are the clock beside all this, not the thing driving it.
 *
 * Inside the plate a reel of the studio's own renders shuffles past: each one
 * drops in from the top and pushes the one before it out of the bottom,
 * quickening as it goes, and the last of them clears to reveal the hero
 * underneath. The shuffle is the part that reads as loading; the count is the
 * clock beside it.
 *
 * Three conditions have to be met before the screen lets go, and they are
 * checked against each other rather than raced: the count has to reach 90, the
 * window has to have loaded, and the reel has to have played through. So the
 * screen can neither clear before the page behind it is ready, nor cut its own
 * shuffle short on a slow first paint — and if the stills never arrive it
 * gives up on them rather than holding the visitor.
 */

/** Shown once per tab. Ignored in development, so a refresh replays it. */
const SEEN_KEY = "kairos:loader-seen";

/** The drawn frame the geometry below is measured on. */
const FRAME = { width: 1440, height: 900 };

/**
 * The plate the second board draws: 650x400 of the 1440x900 frame.
 *
 * This is the size the plate holds at, not a size it passes through on the way
 * to somewhere else.
 */
const KEY = { plateW: 650 / FRAME.width, plateH: 400 / FRAME.height };

/**
 * The gap the second board leaves between the plate and the wordmark: the
 * plate spans 401..1051 and the halves end at 321 and begin at 1131, so each
 * half clears the picture by 80px. That is the whole rule for where the type
 * sits — it is measured off the plate's edge, not off a path of its own, so
 * the words are carried outward by the picture as it grows.
 */
const WORD_GAP = 80 / FRAME.width;

/** How long the count takes to run itself up to 90, and how far it gets. */
const RUN_UP = { to: 90, duration: 1.9 };

/**
 * How long the plate takes to grow to the drawn size, and how it gets there:
 * away fast and easing hard into the stop, so it arrives rather than merely
 * ceases. Everything between this and the opening is stillness.
 */
const GROW = { duration: 0.9, ease: "power3.out" };

/**
 * The stills the reel shuffles through, in the order they pass.
 *
 * The studio's own renders, on the same origin as the page. A loading screen
 * is the last place to put a third-party host: if the pictures are slow the
 * screen is slow, and if they are blocked the screen is empty.
 */
const REEL_FRAMES = [
  { src: "/images/design-01.png" },
  { src: "/images/design-02.png" },
  { src: "/images/design-03.png" },
  { src: "/images/design-04.png" },
  { src: "/images/design-05.png" },
];

/**
 * Where the reel wants to start on the count's clock: late enough that the
 * plate is worth looking into, early enough to be over well before it opens.
 */
const REEL_START = 0.34;

/**
 * When each still arrives, on the reel's own clock, with a cue on the end for
 * the last one's exit. The gaps shorten — 0.30, 0.26, 0.22, 0.19, 0.17 — so
 * the shuffle gathers pace and then stops, rather than ticking evenly and
 * being switched off.
 */
const REEL_CUES = [0, 0.3, 0.56, 0.78, 0.97, 1.14];

/** How long one still takes to travel the height of the plate. */
const REEL_SLIDE = 0.13;

/**
 * How long to wait for the stills before playing without them. Long enough to
 * cover a cold image optimiser on the first dev request; short enough that a
 * visitor on a bad connection is not made to sit through it.
 */
const REEL_PATIENCE = 3;

/** If `load` never fires, the screen still clears. */
const LOAD_PATIENCE = 6;

/**
 * Plate size as a fraction of the viewport, anywhere along its own move.
 *
 * One number covers all three parts: `spread` runs 0 -> 1 as it grows to the
 * drawn size, sits at 1 for the hold, and runs 1 -> 2 as it opens to the full
 * frame. The hold needs no case of its own — it is simply the stretch of time
 * where nothing moves the number.
 */
function plateScale(spread: number) {
  const grown = Math.min(spread, 1);
  const opened = Math.max(spread - 1, 0);
  return {
    x: KEY.plateW * grown + (1 - KEY.plateW) * opened,
    y: KEY.plateH * grown + (1 - KEY.plateH) * opened,
  };
}

/**
 * How far each half of the wordmark sits from the centre, in vw: the plate's
 * own half-width plus the clearance. The clearance eases in alongside the
 * growth, so at the start the halves are still together in the middle, as the
 * first board draws them; through the hold they stand off the drawn plate by
 * the 80px it specifies; and the opening pushes them off the edges of the
 * frame.
 */
function wordOffsetVw(spread: number) {
  return plateScale(spread).x * 50 + WORD_GAP * 100 * Math.min(spread, 1);
}

type LoadingScreenProps = {
  /** The hero image this resolves into. Pass the homepage's own first slide. */
  src: string;
};

export function LoadingScreen({ src }: LoadingScreenProps) {
  // Rendered on the server so the page is never visible underneath it. A
  // returning visitor's layout effect takes it away before the first paint, so
  // they get no flash of it either.
  const [isFinished, setIsFinished] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const plate = plateRef.current;
    if (!root || !count || !bar || !left || !right || !plate) return;

    // The flag stops the screen replaying every time a visitor comes back to
    // the homepage within a session. It survives a reload — it only clears
    // when the tab closes — which in development would mean seeing the screen
    // exactly once, so it is only honoured in a real build.
    const seen =
      process.env.NODE_ENV !== "development" &&
      (() => {
        try {
          return sessionStorage.getItem(SEEN_KEY) === "1";
        } catch {
          // Private modes can throw on access; treat that as "show it".
          return false;
        }
      })();

    if (seen) {
      setIsFinished(true);
      return;
    }

    // The page must not scroll underneath while it is covered.
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const release = () => {
      document.documentElement.style.overflow = previousOverflow;
    };

    const markSeen = () => {
      try {
        // Marked only once it has actually played through, so an early exit
        // does not cost the visitor the screen entirely.
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Storage refused; the screen simply plays again next time.
      }
    };

    // matchMedia rather than a one-off query, so a visitor who turns reduced
    // motion on mid-play has every tween reverted for them on the spot, and
    // the branch below is torn down with it.
    const media = gsap.matchMedia(root);

    media.add("(prefers-reduced-motion: reduce)", () => {
      release();
      markSeen();
      setIsFinished(true);
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const frames = frameRefs.current.filter(
        (frame): frame is HTMLDivElement => frame !== null,
      );

      // Park them above the plate in GSAP's own terms. The CSS already puts
      // them there, but a computed transform reads back in pixels, so GSAP
      // would see y: -900 with yPercent still 0 and a tween to yPercent: 0
      // would leave them stranded.
      gsap.set(frames, { y: 0, yPercent: -100, force3D: true });

      // The count is written every tick, so it goes through quickSetters
      // rather than gsap.set: same result, none of the per-call parsing.
      const setBarScale = gsap.quickSetter(bar, "scaleX") as (
        value: number,
      ) => void;
      const setPlateX = gsap.quickSetter(plate, "scaleX") as (
        value: number,
      ) => void;
      const setPlateY = gsap.quickSetter(plate, "scaleY") as (
        value: number,
      ) => void;
      const setPlateAlpha = gsap.quickSetter(plate, "opacity") as (
        value: number,
      ) => void;
      const setLeftX = gsap.quickSetter(left, "x", "vw") as (
        value: number,
      ) => void;
      const setRightX = gsap.quickSetter(right, "x", "vw") as (
        value: number,
      ) => void;

      // The clock, and the plate's own move. Two numbers rather than one,
      // because the plate stops and the count does not — but everything that
      // belongs to the picture is written from `spread` alone, so the plate,
      // the wordmark and the clearance between them still cannot drift apart.
      const progress = { value: 0 };
      const spread = { value: 0 };
      let shown = -1;

      const paint = () => {
        const p = progress.value;
        const t = p / 100;

        // Only touched when the number actually changes: at 60fps the count
        // repeats itself four times out of five, and every write is layout.
        const whole = Math.round(p);
        if (whole !== shown) {
          shown = whole;
          count.textContent = `${whole}%`;
        }

        // The boards draw the rule loosely; the intent is one that fills the
        // width of the frame as the count climbs, so it is written from t.
        setBarScale(t);

        const size = plateScale(spread.value);
        setPlateX(size.x);
        setPlateY(size.y);
        // Absent at the very start, as the first board draws it, and fully
        // there long before the plate reaches the size it holds at.
        setPlateAlpha(gsap.utils.clamp(0, 1, (spread.value - 0.05) / 0.2));

        const offset = wordOffsetVw(spread.value);
        setLeftX(-offset);
        setRightX(offset);
      };

      // --- the three conditions ------------------------------------------
      let countSettled = false;
      let pageSettled = document.readyState === "complete";
      let reelSettled = frames.length === 0;
      let closing = false;
      let reverted = false;

      const closeIfReady = () => {
        if (closing || reverted) return;
        if (!countSettled || !pageSettled || !reelSettled) return;
        closing = true;

        gsap
          .timeline({
            onUpdate: paint,
            onComplete: () => {
              release();
              markSeen();
              setIsFinished(true);
            },
          })
          // Carrying the count the rest of the way is what opens the plate to
          // the full frame — the third board — and carries the wordmark off
          // the edges. Slower than the run up to 90, because this is the part
          // worth watching.
          .to(progress, { value: 100, duration: 1.1, ease: "power2.inOut" }, 0)
          // The plate leaves the size it has been holding and takes the frame.
          .to(spread, { value: 2, duration: 1.1, ease: "power2.inOut" }, 0)
          .to(
            [count, bar],
            { autoAlpha: 0, duration: 0.35, ease: "power1.out" },
            "-=0.45",
          )
          // Cross-fade onto the real hero, which is the same picture at the
          // same size, so there is nothing to see in the hand-over.
          .to(
            root,
            { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" },
            "-=0.1",
          );
      };

      // --- the reel -------------------------------------------------------
      const reel = gsap.timeline({
        paused: true,
        defaults: { duration: REEL_SLIDE, ease: "power2.inOut", force3D: true },
        onComplete: () => {
          // Nothing moves these again; let the compositor drop the layers.
          gsap.set(frames, { willChange: "auto" });
          reelSettled = true;
          closeIfReady();
        },
      });

      frames.forEach((frame, index) => {
        reel
          .to(frame, { yPercent: 0 }, REEL_CUES[index])
          .to(frame, { yPercent: 100 }, REEL_CUES[index + 1]);
      });

      let stillsReady = false;
      let reelStarted = false;

      const startReel = () => {
        if (reelStarted || reverted || !stillsReady) return;
        reelStarted = true;
        reel.play(0);
      };

      // --- the count ------------------------------------------------------
      const master = gsap.timeline({
        onUpdate: paint,
        onComplete: () => {
          countSettled = true;
          closeIfReady();
        },
      });

      master
        .to(
          progress,
          { value: RUN_UP.to, duration: RUN_UP.duration, ease: "none" },
          0,
        )
        // Grow, and then nothing: the plate is done at 0.9s and the rest of
        // the run-up is the hold the reel shuffles and lands inside.
        .to(spread, { value: 1, duration: GROW.duration, ease: GROW.ease }, 0)
        .call(startReel, undefined, REEL_START);

      // Decoded, not merely fetched: a still that is still being decoded when
      // its cue arrives would slide through the plate as an empty box, which
      // is exactly the failure that looks like "the reel is broken".
      const stills = frames
        .map((frame) => frame.querySelector("img"))
        .filter((img): img is HTMLImageElement => img !== null);

      Promise.all(
        stills.map((img) =>
          img.decode().catch(() => {
            // One that will not decode is not worth holding the screen for.
          }),
        ),
      ).then(() => {
        stillsReady = true;
        // Past its cue already: start now rather than waiting for a cue that
        // has been and gone. The count simply holds at 90 for it.
        if (master.time() >= REEL_START) startReel();
      });

      // Give up on the stills rather than the visitor.
      const patience = gsap.delayedCall(REEL_PATIENCE, () => {
        if (reelStarted || reverted) return;
        reelSettled = true;
        closeIfReady();
      });

      // --- the page -------------------------------------------------------
      const onLoad = () => {
        if (pageSettled || reverted) return;
        pageSettled = true;
        closeIfReady();
      };

      let safetyNet: gsap.core.Tween | null = null;
      if (!pageSettled) {
        window.addEventListener("load", onLoad, { once: true });
        safetyNet = gsap.delayedCall(LOAD_PATIENCE, onLoad);
      }

      return () => {
        reverted = true;
        window.removeEventListener("load", onLoad);
        patience.kill();
        safetyNet?.kill();
      };
    });

    return () => {
      release();
      media.revert();
    };
  }, []);

  if (isFinished) return null;

  return (
    <div ref={rootRef} className="loader" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>

      {/* Full-bleed, scaled down by the count and opened back out by it, so
          the plate and the hero it becomes are the same box. Starts at nothing
          so there is no flash of it before the count has begun. */}
      <div
        ref={plateRef}
        aria-hidden
        className="loader-plate"
        style={{ transform: "scale(0, 0)", opacity: 0 }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover"
        />

        {/* The shuffle, stacked over the hero it gives way to, so a still that
            is missing costs a beat of the hero rather than a hole in the
            plate. Each one waits above the plate until its cue; the CSS parks
            it there rather than the timeline, so none can show before the
            first tick. Sized off the plate, not the viewport — the picture is
            never shown wider than that while the shuffle is running. */}
        {REEL_FRAMES.map((frame, index) => (
          <div
            key={frame.src}
            className="loader-frame"
            style={{ zIndex: index + 1 }}
            ref={(node) => {
              frameRefs.current[index] = node;
            }}
          >
            <Image
              src={frame.src}
              alt=""
              fill
              sizes="45vw"
              quality={60}
              loading="eager"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <p aria-hidden className="loader-wordmark">
        <span ref={leftRef}>Kai.ros</span>
        <span ref={rightRef}>studio</span>
      </p>

      <p ref={countRef} aria-hidden className="loader-count">
        0%
      </p>

      <div ref={barRef} aria-hidden className="loader-bar" />
    </div>
  );
}
