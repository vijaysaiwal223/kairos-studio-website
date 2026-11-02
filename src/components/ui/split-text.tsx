"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type HeadingTag = "h1" | "h2" | "h3";

type SplitTextProps = {
  tag: HeadingTag;
  id?: string;
  className?: string;
  children: ReactNode;
  trigger?: "load" | "view";
  splitType?: "words" | "chars" | "lines";
  delay?: number;
  duration?: number;
};

/** React Bits SplitText's masked rise, scoped to editorial headings. */
export function SplitText({
  tag: Tag,
  id,
  className = "",
  children,
  trigger = "view",
  splitType = "words",
  delay = 65,
  duration = 0.8,
}: SplitTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = true;
    let split: GSAPSplitText | undefined;
    let loaderObserver: MutationObserver | undefined;

    const createSplit = () => {
      if (!active || !element.isConnected) return;
      split = new GSAPSplitText(element, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        mask: splitType,
        aria: "auto",
        onSplit: (instance) => {
          const pieces = splitType === "chars" ? instance.chars : splitType === "lines" ? instance.lines : instance.words;
          if (!pieces.length) return;

          return gsap.fromTo(pieces,
            { opacity: 0, yPercent: 105 },
            {
              opacity: 1,
              yPercent: 0,
              duration,
              ease: "power3.out",
              stagger: { each: delay / 1000, from: "start" },
              scrollTrigger: trigger === "view" ? {
                trigger: element,
                start: "top 88%",
                once: true,
                fastScrollEnd: true,
              } : undefined,
            },
          );
        },
      });
    };

    const start = () => {
      if (trigger !== "load" || !document.querySelector(".loader")) {
        createSplit();
        return;
      }
      loaderObserver = new MutationObserver(() => {
        if (document.querySelector(".loader")) return;
        loaderObserver?.disconnect();
        createSplit();
      });
      loaderObserver.observe(document.body, { childList: true, subtree: true });
    };

    if (!document.fonts || document.fonts.status === "loaded") start();
    else void document.fonts.ready.then(start);

    return () => {
      active = false;
      loaderObserver?.disconnect();
      split?.revert();
    };
  }, { scope: ref, dependencies: [trigger, splitType, delay, duration], revertOnUpdate: true });

  return <Tag id={id} ref={ref} className={className}>{children}</Tag>;
}
