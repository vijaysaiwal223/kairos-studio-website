"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#what-we-do" },
  { label: "Projects", href: "/#project-gallery" },
  { label: "Contact", href: "/#contact" },
];

/** The full-width Figma header; below 900px its links fold into a menu. */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <nav ref={navRef} className="site-header-wide" data-open={open} aria-label="Main navigation">
      <Link href="/" className="site-header-brand" onClick={() => setOpen(false)}>
        <Image src="/home/hero/header-mark.png" width={28} height={28} alt="" />
        <span>kairos Studio</span>
      </Link>

      <div className="site-header-links">
        {NAV_LINKS.map((link) => (
          <Link key={link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>

      <Link className="site-header-contact" href="/#contact" onClick={() => setOpen(false)}>
        Discuss your project
      </Link>

      <button
        ref={buttonRef}
        type="button"
        className="site-header-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-header-mobile-links"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>

      <div id="site-header-mobile-links" className="site-header-mobile-links" hidden={!open}>
        {NAV_LINKS.map((link) => (
          <Link key={link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
