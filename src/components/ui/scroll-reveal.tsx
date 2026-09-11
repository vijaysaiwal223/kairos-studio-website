"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

import styles from "./scroll-reveal.module.css";

export type ScrollRevealProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
};

/**
 * React Bits' word reveal, adapted for this app's shared GSAP/Lenis runtime.
 * Each instance owns only its own tweens and ScrollTriggers; unmounting one
 * must not interrupt the hero, galleries, or any other animated section.
 */
export default function ScrollReveal({
  children,
  as: Element = "h2",
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  const content = useMemo(() => {
    if (typeof children !== "string") {
      return <span className={styles.word}>{children}</span>;
    }

    return children.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) return part;

      return (
        <span className={styles.word} key={`${part}-${index}`}>
          {part}
        </span>
      );
    });
  }, [children]);

  useIsomorphicLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);

    const scroller = scrollContainerRef?.current;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const words = Array.from(
          element.querySelectorAll<HTMLElement>(`.${styles.word}`),
        );
        const withScroller = scroller ? { scroller } : {};

        gsap.fromTo(
          element,
          {
            rotate: baseRotation,
            transformOrigin: "0% 50%",
          },
          {
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: rotationEnd,
              scrub: true,
              ...withScroller,
            },
          },
        );

        gsap.fromTo(
          words,
          {
            opacity: baseOpacity,
            ...(enableBlur
              ? { filter: `blur(${Math.max(0, blurStrength)}px)` }
              : {}),
          },
          {
            opacity: 1,
            ...(enableBlur ? { filter: "blur(0px)" } : {}),
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: wordAnimationEnd,
              scrub: true,
              ...withScroller,
            },
          },
        );
      });
    }, element);

    return () => {
      media.revert();
      context.revert();
    };
  }, [
    baseOpacity,
    baseRotation,
    blurStrength,
    enableBlur,
    rotationEnd,
    scrollContainerRef,
    wordAnimationEnd,
  ]);

  return (
    <Element
      ref={(node) => {
        containerRef.current = node;
      }}
      data-scroll-reveal
      className={`${styles.scrollReveal} ${containerClassName}`.trim()}
    >
      <span className={`${styles.text} ${textClassName}`.trim()}>
        {content}
      </span>
    </Element>
  );
}
