"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Site navigation and its full-screen menu.
 * Figma: "Nav Container" node 78:316 (closed) and "Nav" node 79:355 (open).
 *
 * The open state is its own fixed overlay carrying a second copy of the bar,
 * exactly as the Figma node does. That is what makes the menu usable once the
 * page has scrolled: the in-flow bar sits at the top of the hero and scrolls
 * away with it, so an overlay that reused it would open with no bar in sight.
 * Both bars share the same geometry, so the swap reads as the icon changing
 * rather than as a second element appearing.
 *
 * Opening runs a top-to-bottom wipe (see .menu-panel in globals.css). The
 * panel is mounted one frame before the reveal is armed, so the browser has a
 * clipped first style to transition away from; on close it stays mounted for
 * the length of the retract and only then leaves the DOM.
 */

/** Must match the clip-path transition on .menu-panel in globals.css. */
const MENU_REVEAL_MS = 700;

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "Architects", href: "#architects" },
  { label: "About us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Hamburger glyph, exported from Figma node 78:347. Path data is verbatim. */
function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="size-6"
    >
      <path
        d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Close glyph, exported from Figma node 80:451. Path data is verbatim. */
function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="size-6"
    >
      <path
        d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

const WORDMARK =
  "text-wordmark font-semibold whitespace-nowrap text-white transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const MENU_BUTTON =
  "group flex cursor-pointer items-center gap-3 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const MENU_DISC =
  "flex size-12 items-center justify-center rounded-full bg-white text-black transition group-hover:bg-white/90 group-active:scale-[0.98]";

const BAR = "flex w-full items-center justify-between gap-6 px-gutter py-4";

export function SiteNav() {
  // isMounted spans the panel's whole visible life, including the retract;
  // isRevealed is the wipe itself, armed a frame after the panel lands.
  const [isMounted, setIsMounted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const showreelRef = useRef<HTMLVideoElement>(null);
  const revealFrame = useRef(0);
  const unmountTimer = useRef(0);

  const openMenu = () => {
    window.clearTimeout(unmountTimer.current);
    cancelAnimationFrame(revealFrame.current);
    setIsMounted(true);
    // Two frames: the first commits the clipped starting style, the second
    // flips to the revealed one. Arming in the same frame as the mount would
    // leave the browser no start value and the wipe would be skipped.
    revealFrame.current = requestAnimationFrame(() => {
      revealFrame.current = requestAnimationFrame(() => setIsRevealed(true));
    });
  };

  const closeMenu = () => {
    cancelAnimationFrame(revealFrame.current);
    window.clearTimeout(unmountTimer.current);
    setIsRevealed(false);
    // Outlive the close by exactly one retract, then leave the DOM.
    unmountTimer.current = window.setTimeout(
      () => setIsMounted(false),
      MENU_REVEAL_MS,
    );
    openButtonRef.current?.focus();
  };

  useEffect(
    () => () => {
      cancelAnimationFrame(revealFrame.current);
      window.clearTimeout(unmountTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!isRevealed) return;
    closeButtonRef.current?.focus();
  }, [isRevealed]);

  useEffect(() => {
    const video = showreelRef.current;
    if (!video) return;

    // React can drop the muted attribute on the first client render, and an
    // unmuted autoplay is refused outright by every browser. Assert it on the
    // element itself; the file carries an audio track that must never sound.
    video.muted = true;

    // The showreel is decoration. Hold the poster frame instead of playing it
    // for anyone who has asked for less motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    // Autoplay can still be refused (power saving, per-site policy); the
    // poster stays up if so, which is why the rejection is safe to swallow.
    void video.play().catch(() => {});
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    // Lock the page behind the overlay for as long as it is on screen, the
    // retract included. The gutter left by the hidden scrollbar is paid back
    // as padding so the bar underneath does not shift sideways as it opens.
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, [isMounted]);

  return (
    <>
      <nav className={`relative ${BAR}`}>
        <Link href="/" className={WORDMARK}>
          kairos studio
        </Link>

        {/* Label and disc are one control: the two nodes Figma shows side by
            side, but a single target whose accessible name is "Menu". */}
        <button
          ref={openButtonRef}
          type="button"
          className={MENU_BUTTON}
          aria-expanded={isRevealed}
          aria-controls="site-menu"
          onClick={openMenu}
        >
          <span className="text-body font-medium whitespace-nowrap text-white">
            Menu
          </span>
          <span className={MENU_DISC}>
            <MenuIcon />
          </span>
        </button>
      </nav>

      {isMounted ? (
        <div
          id="site-menu"
          data-revealed={isRevealed}
          className="menu-panel fixed inset-0 z-50 bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* Showreel panel. 597/1440 of the frame, full height, half opacity.
              The element only exists while the menu is open, so the 7MB file is
              never fetched on a page load that never opens it. The poster is a
              frame of the footage itself, so the panel is filled from the first
              paint rather than sitting black while the video buffers. */}
          <div className="absolute inset-y-0 left-0 hidden w-[41.46%] md:block">
            <video
              ref={showreelRef}
              className="size-full object-cover opacity-50"
              src="/nav-video.mp4"
              poster="/images/nav-video-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
              tabIndex={-1}
            />
          </div>

          <div className={`absolute inset-x-0 top-0 ${BAR}`}>
            <Link href="/" className={WORDMARK} onClick={closeMenu}>
              kairos studio
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              className={MENU_BUTTON}
              onClick={closeMenu}
            >
              <span className="text-body font-medium whitespace-nowrap text-white">
                Menu
              </span>
              <span className={MENU_DISC}>
                <CloseIcon />
              </span>
            </button>
          </div>

          {/* The right column starts at the frame's midpoint plus 8px; the
              links, and "India" below them, share that edge. */}
          <nav className="absolute top-1/2 left-gutter flex w-[328px] max-w-[calc(100%-5rem)] -translate-y-1/2 flex-col items-start gap-6 md:left-[calc(50%+8px)]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="text-menu font-medium whitespace-nowrap text-white transition hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-hero-subtext absolute bottom-10 left-gutter text-meta font-medium md:left-[calc(50%+8px)]">
            India
          </p>

          <div className="text-hero-subtext absolute right-gutter bottom-10 flex w-[216px] flex-col items-end gap-3 text-right text-meta font-medium">
            <a
              href="tel:+919876543210"
              className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              +91 9876543210
            </a>
            <a
              href="mailto:mail@kairos.studio"
              className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              mail@kairos.studio
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
