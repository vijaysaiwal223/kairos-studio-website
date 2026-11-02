"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/#project-gallery" },
  { label: "Architects", href: "/#projects" },
  { label: "About us", href: "/#about" },
];

const NAV_CORNERS = [
  { src: "/navigation/corner-top-left.svg", position: "top-0 left-0" },
  { src: "/navigation/corner-top-right.svg", position: "top-0 right-0" },
  { src: "/navigation/corner-bottom-left.svg", position: "bottom-0 left-0" },
  { src: "/navigation/corner-bottom-right.svg", position: "bottom-0 right-0" },
] as const;

function NavCorners() {
  return (
    <>
      {NAV_CORNERS.map((corner) => (
        <Image key={corner.src} src={corner.src} width={17} height={17} alt="" aria-hidden="true" className={"pointer-events-none absolute opacity-20 " + corner.position} />
      ))}
    </>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => {
    setClosing(true);
    if (timelineRef.current) {
      timelineRef.current.timeScale(1.35).reverse();
    } else {
      setOpen(false);
      setClosing(false);
      buttonRef.current?.focus();
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (!open) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const firstLink = panel.querySelector<HTMLElement>("a");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      firstLink?.focus();
      return;
    }

    const links = panel.querySelectorAll<HTMLElement>("[data-nav-link]");
    const secondary = panel.querySelectorAll<HTMLElement>("[data-nav-secondary]");
    const cta = panel.querySelector<HTMLElement>("[data-nav-cta]");

    gsap.set(panel, { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)", y: 14 });
    gsap.set([...links, ...secondary, cta].filter(Boolean), { autoAlpha: 0, y: 10 });
    gsap.set(overlay, {
      backgroundColor: "rgba(0, 0, 0, 0)",
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        firstLink?.focus({ preventScroll: true });
      },
      onReverseComplete: () => {
        setOpen(false);
        setClosing(false);
        buttonRef.current?.focus({ preventScroll: true });
      },
    });
    timelineRef.current = timeline;
    timeline
      .to(overlay, {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        duration: 0.42,
        ease: "power2.out",
      }, 0)
      .to(panel, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.55, ease: "power3.out" }, 0)
      .to(cta, { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out" }, 0.16)
      .to(secondary, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.035, ease: "power2.out" }, 0.26)
      .to(links, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" }, 0.36);

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      } else if (event.key === "Tab") {
        const focusable = menuRef.current?.querySelectorAll<HTMLElement>("a, button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const lastPanelLink = focusable[focusable.length - 1];
        const last = buttonRef.current;
        if (!last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          lastPanelLink.focus();
        } else if (!event.shiftKey && document.activeElement === lastPanelLink) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const expanded = open && !closing;

  return (
    <>
      <nav className={"site-header-wide fixed bottom-[40px] left-1/2 h-[56px] max-w-[calc(100vw-32px)] -translate-x-1/2 font-[family-name:var(--font-geist-mono)] text-white shadow-[0_12px_28px_rgb(0_0_0_/_22%)] backdrop-blur-[10px] transition-[width,background-color] duration-300 ease-linear motion-reduce:duration-0 [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-4 [&_:is(a,button):focus-visible]:outline-white max-[700px]:bottom-[16px] " + (expanded ? "w-[56px] bg-black/10 " : "w-[320px] bg-black/75 ") + (open ? "z-[110] " : "z-[90] ") + (footerVisible && !open ? "invisible pointer-events-none" : "")} aria-label="Main navigation">
        {!open && <span aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 left-0 h-px overflow-hidden motion-reduce:hidden">
          <span className="absolute inset-y-0 left-0 w-[34%] animate-[nav-line-pulse_3.4s_linear_infinite] bg-gradient-to-r from-transparent via-[#91ff9b]/80 to-transparent shadow-[0_0_8px_#91ff9b]" />
        </span>}
        <NavCorners />
        <Image src="/home/hero/header-mark.png" width={40} height={40} alt="" className={"absolute top-[8px] left-[16px] h-[40px] w-[40px] object-contain transition-opacity duration-150 ease-linear motion-reduce:duration-0 " + (expanded ? "pointer-events-none opacity-0" : "opacity-100")} />
        <Link href="/" tabIndex={open ? -1 : undefined} aria-hidden={open} className={"absolute top-[16px] left-1/2 -translate-x-1/2 text-[16px] leading-[24px] tracking-[1px] uppercase transition-opacity duration-150 ease-linear motion-reduce:duration-0 " + (expanded ? "pointer-events-none opacity-0" : "opacity-100")}>Home</Link>
        <button
          ref={buttonRef}
          type="button"
          className={"site-header-toggle absolute right-0 grid cursor-pointer place-items-center transition-[top,width,height] duration-300 ease-linear motion-reduce:duration-0 " + (expanded ? "top-0 h-[56px] w-[56px]" : "top-[4px] right-[4px] h-[48px] w-[48px]")}
          aria-label={expanded ? "Close menu" : "Open menu"}
          aria-expanded={expanded}
          aria-controls="site-header-menu"
          onClick={() => {
            if (open) closeMenu();
            else {
              setClosing(false);
              setOpen(true);
            }
          }}
        >
          <Image src="/navigation/menu.svg" width={18} height={16} alt="" className={"absolute transition-opacity duration-150 ease-linear motion-reduce:duration-0 " + (expanded ? "opacity-0" : "opacity-100")} />
          <Image src="/navigation/close.svg" width={19} height={19} alt="" className={"absolute transition-opacity duration-150 ease-linear motion-reduce:duration-0 " + (expanded ? "opacity-100" : "opacity-0")} />
        </button>
      </nav>

      {open && createPortal(
        <div ref={overlayRef} className="site-header-overlay fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/75 px-[24px] py-[40px] max-[700px]:px-[16px] max-[700px]:pt-[16px] max-[700px]:pb-[16px] [@media(max-height:600px)]:items-start" role="dialog" aria-modal="true" aria-label="Navigation menu" onPointerDown={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}>
          <div className="site-header-open flex w-[400px] max-w-full shrink-0 flex-col items-center pb-[72px]" ref={menuRef}>
            <nav ref={panelRef} id="site-header-menu" className="site-header-panel relative h-[432px] w-full shrink-0 bg-black font-[family-name:var(--font-geist)] text-white [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-4 [&_:is(a,button):focus-visible]:outline-white" aria-label="Main menu">
              <NavCorners />
              <div className="absolute top-[24px] left-[24px] flex flex-col gap-[8px] text-[24px] leading-[32px] tracking-[-0.02em]">
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} href={link.href} data-nav-link onClick={() => setOpen(false)} className="w-fit transition-opacity hover:opacity-60">
                    {link.label}
                  </Link>
                ))}
              </div>
              <span aria-hidden="true" className="absolute top-[200px] right-[24px] left-[24px] h-px bg-white/20" />
              <div data-nav-secondary className="absolute top-[224px] right-[24px] left-[24px] flex justify-between gap-[16px] text-[16px] leading-[24px] tracking-[-0.02em]">
                <div className="flex flex-col gap-[8px]">
                  <a href="mailto:hello@kairostudios.in" className="w-fit transition-opacity hover:opacity-60">Support</a>
                  <Link href="/terms-of-service" onClick={() => setOpen(false)} className="w-fit transition-opacity hover:opacity-60">Terms of use</Link>
                  <Link href="/privacy-policy" onClick={() => setOpen(false)} className="w-fit transition-opacity hover:opacity-60">Privacy policy</Link>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span>Instagram</span>
                  <span>Linkedin</span>
                </div>
              </div>
              <span aria-hidden="true" className="absolute top-[336px] right-[24px] left-[24px] h-px bg-white/20" />
              <Link href="/#contact" data-nav-cta onClick={() => setOpen(false)} className="absolute top-[360px] right-[24px] left-[24px] flex h-[48px] items-center justify-center bg-[#1a1a1a] font-[family-name:var(--font-geist-mono)] text-[16px] leading-[24px] tracking-[1px] uppercase transition-colors hover:bg-[#303030]">
                <NavCorners />
                Get in touch
              </Link>
            </nav>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
